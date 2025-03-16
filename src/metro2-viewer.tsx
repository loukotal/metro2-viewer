import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [_, setFileContent] = useState("");
  const [records, setRecords] = useState<ProcessedRecord[]>([]);
  const [hoveredField, setHoveredField] = useState<ParsedField | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);

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
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const content = e.target.result.toString();
      setFileContent(content);

      // Split the file content into records
      const lines = content
        .split("\n")
        .filter((line) => line.trim().length > 0);

      // Determine record types based on content
      const parsedRecords = lines.map((line, index) =>
        parseRecord(line, index, lines),
      );

      // Process records to include field definitions
      const processedRecords = parsedRecords.map((record) => {
        const fields = parseRecordFields(record);
        return {
          ...record,
          fields,
        };
      });

      setRecords(processedRecords);
    };
    reader.readAsText(file);
  };

  const handleFieldHover = (field: ParsedField) => {
    setHoveredField(field);
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
    return (
      <span
        key={`${recordIndex}-${field.startPos}-${field.endPos}`}
        className="metro2-field hover:bg-[rgba(59,130,246,0.2)] cursor-pointer"
        onMouseEnter={() => handleFieldHover(field)}
        data-field-name={field.name}
        data-segment={field.segment || ""}
      >
        {field.value}
      </span>
    );
  };

  // Render a record with all its fields
  const renderRecord = (record: ProcessedRecord, index: number) => {
    // Sort fields by position
    const sortedFields = [...record.fields].sort(
      (a, b) => a.startPos - b.startPos,
    );

    return (
      <div
        key={index}
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
        }}
      >
        {sortedFields.map((field) => renderField(field, index))}
        {index < records.length - 1 && "\n"}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4 flex items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".dat"
          className="p-2 border rounded"
        />
        {records.length > 0 && (
          <div className="ml-4 text-sm text-gray-600">
            Found {records.length} record{records.length !== 1 ? "s" : ""}:
            {records.filter((r) => r.type === "header").length} header,
            {records.filter((r) => r.type === "base").length} base
            {records.some((r) => r.segment) && (
              <span className="ml-2">
                (including segments:
                {records.some((r) => r.segment === "J1") && " J1"}
                {records.some((r) => r.segment === "J2") && " J2"}
                {records.some((r) => r.segment === "K1") && " K1"})
              </span>
            )}
          </div>
        )}
      </div>

      {file && (
        <>
          <div className="top-0 sticky bg-white z-1 max-w-2xl">
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
                      <h3 className="text-md font-bold mb-2">
                        {hoveredField.name}
                      </h3>
                      <div className="grid grid-cols-2">
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
          <div className="grid grid-cols-1 h-full">
            {/* Left panel - Raw file content */}
            <Card className="h-full flex flex-col">
              <CardHeader className="py-3">
                <CardTitle>Raw File Content</CardTitle>
              </CardHeader>
              <CardContent
                className="overflow-auto flex-grow"
                ref={contentRef}
                onMouseLeave={() => setHoveredField(null)}
                onScroll={handleScroll}
              >
                <div className="content-wrapper">
                  <pre className="font-mono text-sm">
                    {records.map((record, index) =>
                      renderRecord(record, index),
                    )}
                  </pre>
                </div>
              </CardContent>
            </Card>
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
