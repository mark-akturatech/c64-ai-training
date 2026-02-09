# BUF — BASIC Line Editor Input Buffer ($0200-$0258)

**Summary:** Describes the BASIC/Kernal working-storage BUF at $0200-$0258 (512–600), the 89-byte BASIC line editor/input buffer used by immediate-mode input, INPUT/GET, and BASIC tokenization; explains why INPUT/GET are illegal in immediate mode and notes the last eight bytes commonly available to programs.

## BUF ($0200-$0258)
This working-storage area (addresses $0200–$0258; decimal 512–600) is allocated by the BASIC/Kernal for the line-editor input buffer used by immediate-mode typing and by the BASIC INPUT and GET statements.

- When a line is typed in immediate mode the characters are stored here. BASIC scans the string and converts it into tokenized BASIC program format; the line is then either executed (immediate-mode statement without a line number) or stored (if it begins with a line number).
- INPUT and GET use the same buffer to receive data from the user. Because immediate-mode entry also requires the same buffer, INPUT and GET cannot be used from immediate mode — they would conflict for the same working storage.
- The buffer length is 89 bytes. The screen editor permits up to 80 characters in a program line; one extra byte is used for a zero terminator. The remaining final eight bytes of the 89-byte buffer are ordinarily unused and therefore often available to programmers for temporary storage.
- The text notes a historical carry-over: the VIC reportedly allows a line length up to 88 characters (source text). 

**[Note: Source may contain an imprecise historical aside about the VIC's exact maximum line length.]**

## Source Code
```text
512-600   $0200-$0258   BUF
BASIC Line Editor Input Buffer

Buffer length: 89 bytes (600 - 512 + 1 = 89)
Screen editor max: 80 characters (+1 zero terminator)
Last 8 bytes: typically unused / available to programmer
```

## Key Registers
- $0200-$0258 - BASIC/Kernal - BUF (BASIC Line Editor Input Buffer, 89 bytes; used by immediate-mode input and INPUT/GET)

## References
- "microprocessor_stack_overview_and_basic_usage" — expands on stack usage by BASIC and Kernal  
- "i_o_tables_lat_fat_sat_and_clall" — tables for open files, devices, and secondary addresses