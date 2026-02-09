# MACHINE — Control Character Names and Categories

**Summary:** List of ASCII/PETSCII control characters (NUL through DEL) with short names and category tags: (CC) Communication Control, (FE) Format Effector, (IS) Information Separator. Useful for PETSCII/terminal handling, control-code classification, and protocol parsing.

## Control character categories
- (CC) Communication Control — codes historically used for link/protocol control (ENQ, ACK, NAK, SYN, etc.).
- (FE) Format Effector — codes affecting text layout or device format (HT, LF, CR, FF, BS, etc.).
- (IS) Information Separator — codes used to separate fields/records/groups (FS, GS, RS, US).

The table in Source Code lists the standard control-code mnemonics and brief descriptions; consult the PETSCII appendix for C64-specific glyph/encoding differences.

## Source Code
```text
   NUL  Null                             DLE  Data Link Escape (CC)
   SOH  Start of Heading (CC)            DC1  Device Control 1
   STX  Start of Text (CC)               DC2  Device Control 2
   ETX  End of Text (CC)                 DC3  Device Control 3
   EOT  End of Transmission (CC)         DC4  Device Control 4
   ENQ  Enquiry (CC)                     NAK  Negative Acknowledgement (CC)
   ACK  Acknowledge (CC)                 SYN  Synchronous Idle (CC)
   BEL  Bell                             ETB  End of Transmission Block (CC)
   BS   Backspace (FE)                   CAN  Cancel
   HT   Horizontal Tabulation (FE)       EM   End of Medium
   LF   Line Feed (FE)                   SUB  Substitute
   VT   Vertical Tabulation (FE)         ESC  Escape
   FF   Form Feed (FE)                   FS   File Separator (IS)
   CR   Carriage Return (FE)             GS   Group Separator (IS)
   SO   Shift Out                        RS   Record Separator (IS)
   SI   Shift In                         US   Unit Separator (IS)
                                         DEL  Delete
```

## References
- "appendix_d_petscii_table" — expands on control characters as they appear in the PETSCII table (C64-specific glyphs/encodings).