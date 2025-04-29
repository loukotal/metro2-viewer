import { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  baseFields,
  Field,
  headerFields,
  j1Fields,
  j2Fields,
  k1Fields,
  trailerFields,
} from "./fields";

// Define proper types
type RecordType = "base" | "header" | "trailer";
type SegmentType = "J1" | "J2" | "K1" | "";

type ParsedRecord = {
  lineNumber: number;
  content: string;
  type: RecordType;
  segment: SegmentType;
  startPos: number;
  length: number;
  baseContent: string;
  segmentContent: string;
};

type ParsedField = Field & {
  value: string;
  startPos: number;
  endPos: number;
  type: "base" | "segment";
  recordType: RecordType;
  segment: SegmentType;
};

type ProcessedRecord = ParsedRecord & {
  fields: ParsedField[];
};

const Metro2FileViewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [records, setRecords] = useState<ProcessedRecord[]>([]);
  const [hoveredField, setHoveredField] = useState<ParsedField | null>(null);
  const [selectedFieldName, setSelectedFieldName] = useState<string | null>(null); // Added state for selected field name
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  console.log(records.filter((r) => r.segment === "K1"));

  // Set up virtualizer
  const virtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => contentRef.current,
    estimateSize: () => 20, // estimated height per row
    overscan: 100, // number of items to render before/after visible area
  });

  // Add CSS for styling
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .metro2-line {
        position: relative;
      }
      
      .metro2-field {
        display: inline-block;
        transition: background-color 0.15s ease;
      }
      
      .segment-j1 {
        border-left: 3px solid #4f46e5;
      }
      
      .segment-j2 {
        border-left: 3px solid #ec4899;
      }
      
      .segment-k1 {
        border-left: 3px solid #10b981;
      }
      
      .info-panel {
        min-height: 300px;
        display: flex;
        flex-direction: column;
      }
      
      .field-info-content {
        min-height: 200px;
      }

      .highlighted-field {
        background-color: rgba(144, 238, 144, 0.5); /* Light green highlight */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Parse a record from a line
  const parseRecord = (
    line: string,
    index: number,
    lines: string[],
  ): ParsedRecord => {
    let recordType: RecordType = "base";
    let segment: SegmentType = "";

    if (line.startsWith("0426")) {
      if (line.includes("HEADER")) {
        recordType = "header";
      } else if (line.includes("TRAILER")) {
        recordType = "trailer";
      } else {
        // Check for segments
        if (line.length > 426) {
          const afterBaseSegment = line.substring(426);

          if (afterBaseSegment.startsWith("J1")) {
            segment = "J1";
          } else if (afterBaseSegment.startsWith("K1")) {
            segment = "K1";
          } else if (afterBaseSegment.startsWith("J2")) {
            segment = "J2";
          }
        }
      }
    }

    return {
      lineNumber: index,
      content: line,
      type: recordType,
      segment: segment,
      startPos: index === 0 ? 0 : lines.slice(0, index).join("\n").length + 1,
      length: line.length,
      baseContent: line.substring(0, Math.min(426, line.length)),
      segmentContent: segment ? line.substring(426) : "",
    };
  };

  // Process a record and split it into fields with meta information
  const parseRecordFields = (record: ParsedRecord): ParsedField[] => {
    const fieldsArray: ParsedField[] = [];
    const fieldsDefinition =
      record.type === "header"
        ? headerFields
        : record.type === "trailer"
          ? trailerFields
          : baseFields;

    // Process base/header fields
    fieldsDefinition.forEach((field) => {
      const startIdx = field.position[0] - 1;
      const endIdx = Math.min(field.position[1], record.content.length);

      if (startIdx < record.content.length) {
        const value = record.content.substring(startIdx, endIdx);

        fieldsArray.push({
          ...field,
          value,
          startPos: startIdx,
          endPos: endIdx - 1,
          type: "base",
          recordType: record.type,
          segment: "",
        });
      }
    });

    // Process segment fields if any
    if (record.segment) {
      let segmentFields: Field[] | undefined;

      if (record.segment === "J1") {
        segmentFields = j1Fields;
      } else if (record.segment === "J2") {
        segmentFields = j2Fields;
      } else if (record.segment === "K1") {
        segmentFields = k1Fields;
      }

      if (segmentFields) {
        segmentFields.forEach((field) => {
          const startIdx = field.position[0] - 1;
          const endIdx = Math.min(
            field.position[1],
            record.segmentContent.length,
          );

          if (startIdx < record.segmentContent.length) {
            const value = record.segmentContent.substring(startIdx, endIdx);

            fieldsArray.push({
              ...field,
              value,
              startPos: startIdx + 426,
              endPos: endIdx + 426 - 1,
              type: "segment",
              recordType: record.type,
              segment: record.segment,
            });
          }
        });
      }
    }

    return fieldsArray;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    setIsLoading(true);

    // Use a worker or chunked processing for large files
    const processFileInChunks = async (file: File) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        if (!e.target?.result) return;
        const content = e.target.result.toString();
        setFileContent(content);

        // Split the file content into records
        const lines = content
          .split("\n")
          .filter((line) => line.trim().length > 0);

        // Process in batches to avoid blocking the UI
        const batchSize = 500;
        const totalBatches = Math.ceil(lines.length / batchSize);
        const processedRecords: ProcessedRecord[] = [];

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          // Allow UI to update between batches
          if (batchIndex > 0) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }

          const batchStart = batchIndex * batchSize;
          const batchEnd = Math.min(batchStart + batchSize, lines.length);
          const batchLines = lines.slice(batchStart, batchEnd);

          // Process this batch
          for (let i = 0; i < batchLines.length; i++) {
            const lineIndex = batchStart + i;
            const record = parseRecord(batchLines[i], lineIndex, lines);
            const fields = parseRecordFields(record);

            processedRecords.push({
              ...record,
              fields,
            });
          }

          // Update records as we go to show progress
          setRecords([...processedRecords]);
        }

        setIsLoading(false);
      };

      reader.onerror = () => {
        console.error("Error reading file");
        setIsLoading(false);
      };

      reader.readAsText(file);
    };

    processFileInChunks(file);
  };

  const handleFieldHover = (field: ParsedField) => {
    setHoveredField(field);
  };

  // Handle clicking on a field to highlight it across base segments
  const handleFieldClick = (field: ParsedField) => {
    if (field.recordType === "base") {
      setSelectedFieldName((prev) => (prev === field.name ? null : field.name));
    } else {
      // Optionally clear selection if a non-base field is clicked
      // setSelectedFieldName(null); 
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Sync scroll position of the right panel
    if (contentRef.current && infoCardRef.current) {
      const rightPanel = infoCardRef.current.closest(".overflow-auto");
      if (rightPanel && e.currentTarget === contentRef.current) {
        rightPanel.scrollTop = e.currentTarget.scrollTop;
      }
    }
  };

  // Render a single field with appropriate styling
  const renderField = (field: ParsedField, recordIndex: number) => {
    const isHighlighted =
      selectedFieldName !== null &&
      field.recordType === "base" &&
      field.name === selectedFieldName;

    return (
      <span
        key={`${recordIndex}-${field.startPos}-${field.endPos}`}
        className={`metro2-field hover:bg-[rgba(59,130,246,0.2)] cursor-pointer ${
          isHighlighted ? "highlighted-field" : ""
        }`}
        onMouseEnter={() => handleFieldHover(field)}
        onClick={() => handleFieldClick(field)} // Added onClick handler
        data-field-name={field.name}
        data-segment={field.segment || ""}
      >
        {field.value}
      </span>
    );
  };

  // Memoize record rendering
  const renderRecord = useMemo(() => {
    return (record: ProcessedRecord, index: number) => {
      // Sort fields by position
      const sortedFields = [...record.fields].sort(
        (a, b) => a.startPos - b.startPos,
      );

      return (
        <div
          className={`metro2-line ${record.segment ? `segment-${record.segment.toLowerCase()}` : ""}`}
          data-record-index={index}
          data-record-type={record.type}
          data-segment={record.segment || ""}
          style={{
            backgroundColor:
              record.type === "header"
                ? "rgba(59, 130, 246, 0.05)"
                : "transparent",
            paddingLeft: record.segment ? "2px" : "0",
            height: "20px",
            lineHeight: "20px",
          }}
        >
          {sortedFields.map((field) => renderField(field, index))}
        </div>
      );
    };
  }, [hoveredField, selectedFieldName]); // Re-memoize when hoveredField or selectedFieldName changes

  return (
    <div>
      <div className="mb-4 flex items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".dat"
          className="p-2 border rounded"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="ml-4 text-sm text-blue-600 flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing file... ({records.length.toLocaleString()} records
            processed)
          </div>
        )}
        {!isLoading && records.length > 0 && (
          <div className="ml-4 text-sm text-gray-600">
            Found {records.length.toLocaleString()} record
            {records.length !== 1 ? "s" : ""}:
            {records.filter((r) => r.type === "header").length} header,
            {records
              .filter((r) => r.type === "base")
              .length.toLocaleString()}{" "}
            base
            {records.some((r) => r.segment) && (
              <span className="ml-2">
                (including segments:
                {records.some((r) => r.segment === "J1") &&
                  ` J1 (${records.filter((r) => r.segment === "J1").length})`}
                {records.some((r) => r.segment === "J2") &&
                  ` J2 (${records.filter((r) => r.segment === "J2").length})`}
                {records.some((r) => r.segment === "K1") &&
                  ` K1 (${records.filter((r) => r.segment === "K1").length})`}
                )
              </span>
            )}
          </div>
        )}
      </div>

      {file && (
        <>
          <div className="top-0 sticky bg-white z-1 max-w-3xl">
            <div className="mb-4 px-10 m-4 border-blue-600 border-2 shadow-sm py-4">
              <h2 className="font-bold text-lg">Field Information</h2>
              <div
                className="overflow-auto flex-grow field-info-content top-0 sticky"
                ref={infoCardRef}
                onScroll={handleScroll}
              >
                <div className="h-full">
                  {hoveredField ? (
                    <div className="top-0 sticky">
                      <div className="grid grid-cols-2">
                        <div className="text-md font-medium mt-2">
                          Field Name:
                        </div>
                        <div className="text-md font-medium">
                          {hoveredField.name}
                        </div>
                        <div className="font-medium">Record Type:</div>
                        <div className="capitalize">
                          {hoveredField.recordType}
                          {hoveredField.segment && (
                            <span className="ml-2 text-blue-600">
                              (Segment: {hoveredField.segment})
                            </span>
                          )}
                        </div>

                        <div className="font-medium">Value:</div>
                        <div className="font-mono bg-gray-100 p-1 rounded break-all">
                          {hoveredField.value?.trim() || "(empty)"}
                        </div>

                        <div className="font-medium">Format:</div>
                        <div>
                          {hoveredField.format === "N"
                            ? "Numeric"
                            : hoveredField.format === "AN"
                              ? "Alphanumeric"
                              : hoveredField.format === "B"
                                ? "Binary"
                                : hoveredField.format === "P"
                                  ? "Packed"
                                  : hoveredField.format}
                        </div>

                        <div className="font-medium">Length:</div>
                        <div>
                          {hoveredField.length} character
                          {hoveredField.length !== 1 ? "s" : ""}
                        </div>

                        <div className="font-medium">Required:</div>
                        <div>
                          {hoveredField.required === "Y"
                            ? "Yes"
                            : hoveredField.required === "N"
                              ? "No"
                              : hoveredField.required === "A"
                                ? "Applicable"
                                : "Conditional"}
                        </div>

                        <div className="font-medium">Character Position:</div>
                        <div>
                          {hoveredField.segment &&
                          hoveredField.type === "segment" ? (
                            <span>
                              {hoveredField.position[0]} -{" "}
                              {hoveredField.position[1]}
                              <span className="text-gray-500 ml-1">
                                (in segment)
                              </span>
                            </span>
                          ) : (
                            <span>
                              {hoveredField.position[0]} -{" "}
                              {hoveredField.position[1]}
                            </span>
                          )}
                        </div>

                        <div className="font-medium">File Position:</div>
                        <div>
                          {hoveredField.startPos + 1} -{" "}
                          {hoveredField.endPos + 1}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">
                      Hover over content on the left to see field information
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="h-full flex flex-col overflow-x-auto">
              <CardHeader className="py-3">
                <CardTitle>Raw File Content</CardTitle>
              </CardHeader>
              <CardContent
                className="overflow-auto flex-grow h-[700px]"
                ref={contentRef}
                onMouseLeave={() => setHoveredField(null)}
                onScroll={handleScroll}
              >
                <div className={`h-[${virtualizer.getTotalSize()}px] relative`}>
                  <pre
                    className="font-mono text-sm relative"
                    style={{ height: `${records.length * 20}px` }}
                  >
                    {virtualizer.getVirtualItems().map((virtualRow: any) => (
                      <div
                        key={virtualRow.index}
                        data-index={virtualRow.index}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {renderRecord(
                          records[virtualRow.index],
                          virtualRow.index,
                        )}
                      </div>
                    ))}
                  </pre>
                </div>
              </CardContent>
            </div>
          </div>
        </>
      )}

      {!file && (
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">
            Upload a .dat file to view Metro2 information
          </p>
        </div>
      )}
    </div>
  );
};

export default Metro2FileViewer;
