# Metro2 File Viewer

A simple thing to inspect character-format Metro2 files.

## Overview

The Metro2 File Viewer is a lightweight tool for exploring character-based Metro2 files (not packed binary format) that are newline delimited. It has limited functionality and was built as a "vibe coding" exercise rather than a production-ready tool.

## Features

- Uploads and parses newline-delimited character-format Metro2 files
- Shows field information on hover
- Basic segment detection (Base, J1, J2, K1)
- Simple position tracking
- Responsive layout that works on most screens

## How to

1. `npm install`
2. `npm run dev`
3. Upload a .dat file
4. View the file content and field information

## Format Support

Only supports Metro2 character-format files that are newline delimited (not packed binary format). Basic support for:

- Header Record
- Base Segment
- J1/J2/K1 segments
- Trailer Record

## Limitations

- Only handles character format (not packed binary)
- Requires newline delimiters between records
- Limited error handling
- Testing/demo purposes only
