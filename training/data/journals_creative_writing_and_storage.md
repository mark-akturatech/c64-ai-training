# COMMODORE 64 - JOURNALS AND CREATIVE WRITING

**Summary:** Describes an upcoming Commodore 64 word processing package with document save/load capabilities to a 1541 Disk Drive or Datassette (tape recorder) and output to VIC-PRINTER or a graphics PLOTTER. Mentions integration points with business-oriented word processing/spreadsheet functionality and printer/plotter support.

**Overview**

A Commodore 64 word processing system is announced that aims to match or exceed features of higher-priced commercial word processors. The package is described as supporting persistent storage and document output:

- **Storage targets:**
  - **1541 Disk Drive:** Standard C64 5¼" floppy disk storage (saves/loads documents to disk).
  - **Datassette:** Tape-based storage recorder for sequential save/load.

- **Output targets:**
  - **VIC-PRINTER:** Commodore-compatible serial/parallel printer for text output.
  - **PLOTTER:** Graphics-capable device for printing plotted text/graphics.

The entry is brief and marketing-oriented; it confirms that documents created in the word processor can be saved to either disk or tape and printed on either a VIC-PRINTER or a plotter device.

**Features and Capabilities**

The word processing package offers the following features:

- **Editing Commands:**
  - Cursor movement (up, down, left, right).
  - Insert and delete characters or lines.
  - Block operations (copy, move, delete).
  - Search and replace functionality.

- **Formatting Options:**
  - Adjustable margins (left, right, top, bottom).
  - Word-wrap to automatically move words to the next line.
  - Support for different fonts and character styles (bold, underline, italics).

- **Additional Features:**
  - Spell checking.
  - Thesaurus integration.
  - Mail merge capabilities.
  - Support for tables and columns.

**File Format and On-Disk Layout**

Documents are saved in a proprietary format that includes:

- A header containing metadata (e.g., document title, author, creation date).
- The main body of text with embedded formatting codes.
- A footer with additional information (e.g., word count, checksum).

On the 1541 Disk Drive, each document is stored as a sequential file in the directory. The file name reflects the document title, and the file type is typically labeled as "SEQ" (sequential).

**Save/Load Commands**

To save a document to the 1541 Disk Drive:

1. Open a file for writing:
2. Print the document contents to the file:
3. Close the file:

To load a document from the 1541 Disk Drive:

1. Open the file for reading:
2. Read the document contents:
3. Close the file:

For the Datassette, the process involves using the `SAVE` and `LOAD` commands with the appropriate file name.

**Printer Control Sequences**

The VIC-PRINTER and compatible devices use specific control codes for formatting:

- **Bold Text:** `CHR$(27) + "E"` to enable, `CHR$(27) + "F"` to disable.
- **Underline:** `CHR$(27) + "-" + "1"` to enable, `CHR$(27) + "-" + "0"` to disable.
- **Italic:** `CHR$(27) + "4"` to enable, `CHR$(27) + "5"` to disable.
- **Graphics Mode:** `CHR$(27) + "G"` to enter, `CHR$(27) + "H"` to exit.

For plotters, control sequences vary by model but generally include commands to move the pen, draw lines, and select colors. Refer to the specific plotter's manual for detailed instructions.

**Compatibility and System Requirements**

- **Memory Usage:** Requires a minimum of 64 KB RAM.
- **Disk Operating System (DOS):** Compatible with Commodore DOS versions used in the 1541 Disk Drive.
- **Printer Drivers:** Supports VIC-PRINTER and compatible printers.
- **Plotter Support:** Compatible with Commodore plotters and those supporting standard control codes.

**Examples**

**Opening a Document:**

To open a document named "LETTER" from the disk:


**Saving a Document:**

To save a document named "REPORT" to the disk:


**Printing a Document:**

To print a document with bold text:

## Source Code

   ```
   OPEN 1,8,2,"DOCUMENT,S,W"
   ```

   ```
   PRINT#1, "Document text..."
   ```

   ```
   CLOSE 1
   ```

   ```
   OPEN 1,8,2,"DOCUMENT,S,R"
   ```

   ```
   INPUT#1, A$
   ```

   ```
   CLOSE 1
   ```

```
OPEN 1,8,2,"LETTER,S,R"
INPUT#1, A$
CLOSE 1
```

```
OPEN 1,8,2,"REPORT,S,W"
PRINT#1, "Report text..."
CLOSE 1
```

```
OPEN 4,4
PRINT#4, CHR$(27) + "E" + "Bold text" + CHR$(27) + "F"
CLOSE 4
```



## References

- "business_spreadsheet_wordprocessing" — expands on business-oriented word processing and spreadsheet functionality
- "printing_support_printers_plotters" — expands on printer and plotter options for document output