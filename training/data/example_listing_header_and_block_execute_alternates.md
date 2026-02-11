# Direct-access example header — buffer $0600-$06FF, block-read/write/execute, PRINT#15 B-E formats

**Summary:** Header for a BASIC example demonstrating a direct-access channel using buffer $0600-$06FF (buffer number 1), with block-read (track 1, sector 0), a single-byte write to $0600, block-write, and a block-execute (B-E) sent via PRINT#15 to device 15. Includes two alternate PRINT#15 B-E formats.

**Line-by-line summary**
- **Line 150** — Open a direct-access channel specifying buffer number 1 (memory $0600-$06FF). This establishes the drive channel for subsequent block operations using the 256-byte buffer at $0600.
- **Line 160** — Block-read of track 1, sector 0 into the buffer ($0600-$06FF).
- **Line 190** — Write a single byte ($60) to RAM address $0600 (first byte of the buffer).
- **Line 200** — Block-write: write the buffer ($0600-$06FF) back to track 1, sector 0.
- **Line 210** — No operation for function (commented as "Just to keep us honest").
- **Line 220** — Block-execute (B-E) of track 1, sector 0 using the buffer ($0600-$06FF); the listing shows two alternate PRINT#15 formats used to send the B-E command to device 15.

Notes:
- Buffer range $0600-$06FF is a 256-byte region (buffer number 1 in this example).
- The header is a program listing summary; the exact BASIC statements for OPEN, block-read, block-write, and the precise argument syntax beyond the shown PRINT#15 strings are not present in the header text.

## Source Code
```basic
150 OPEN 2,8,2,"#1" : REM Open direct-access channel with buffer #1 ($0600-$06FF)

160 PRINT#15,"B-R";2;0;1;0 : REM Block-read track 1, sector 0 into buffer

190 POKE 1536,96 : REM Write byte $60 (RTS) to $0600

200 PRINT#15,"B-W";2;0;1;0 : REM Block-write buffer back to track 1, sector 0

210 REM Just to keep us honest

220 PRINT#15,"B-E";2;0;1;0 : REM Block-execute track 1, sector 0
```

## Key Registers
- **$0600-$06FF**: Buffer area for direct-access operations.
- **$0600**: First byte of the buffer, modified in line 190.

## References
- "direct_access_entomology_intro_and_block_read_overview" — expands on context; begins the Direct-Access Entomology discussion that follows this example header
- "block_read_demo_program" — expands on the B-R demo program referenced by the header (demonstration code)