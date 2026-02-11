# OPEN (KERNAL) — $FFC0

**Summary:** KERNAL OPEN entry at $FFC0 implements file opening using parameters in zero page (LA $B8, SA $B9, FA $BA, FNADR $BB, FNLEN $B7), checks LAT/FAT/SAT tables ($0259-$0276), enforces LDTND $98 (max 10), and dispatches device-specific handling (keyboard/screen return, serial/RS232 handled by other routines).

## Description
This routine (vectored OPEN entry $FFC0) expects the file parameters already set in zero page before entry:
- LA in $B8 (logical file number)
- SA in $B9 (secondary address)
- FA in $BA (device number)
- FNADR in $BB (filename pointer)
- FNLEN in $B7 (filename length)

Flow summary:
- If LA ($B8) == 0, branch to I/O error #6 (JMP $F70A).
- Calls find_file (JSR $F30F) with X = LA to detect an existing file. If found, jumps to I/O error #2 (JMP $F6FE).
- Loads LDTND ($98) and compares to #$0A (10). If >= 10, jumps to I/O error #1 (JMP $F6FB). Otherwise increments LDTND.
- Stores LA into the LAT table at $0259,X; stores SA (after ORA #$60) into $B9 and into the SAT table at $026D,X; stores FA into the FAT table at $0263,X.
- Device dispatch:
  - If SA == 0, or device number == $03 (screen), return (no further device action).
  - If device >= 3 (serial bus), JSR send_sa ($F3D5) to send the secondary address (and filename for serial devices). The called routine sets flags used immediately after (BCC to end if OK).
  - Special-case compare to #$02 leads to opening RS232 via JMP $F409.
- Several device-specific checks and JSRs follow (calls to other KERNAL routines for validation and device protocols). Routine returns via RTS at $F3D4.

Behavioral notes preserved from code:
- Tables for active files (LAT/FAT/SAT) are updated by index X = old LDTND (post-increment behaviour respected by code order).
- send_sa and open RS232 are handled in separate routines (see References).
- The routine uses standard 6502 flow-control and memory writes: JSR/STA/INC/CPX/BEQ/BCC/BNE/ORA.

**[Note: Source may contain an error — the inline comment labels device compare CMP #$02 as "TAPE" while the code jumps to the RS232 open handler (JMP $F409).]**

## Source Code
```asm
.,F34A A6 B8    LDX $B8         LA, current logical number
.,F34C D0 03    BNE $F351
.,F34E 4C 0A F7 JMP $F70A       I/O error #6, not input file
.,F351 20 0F F3 JSR $F30F       find file (X)
.,F354 D0 03    BNE $F359
.,F356 4C FE F6 JMP $F6FE       I/O error #2, file exists
.,F359 A6 98    LDX $98         LDTND, number of open files
.,F35B E0 0A    CPX #$0A        more than ten
.,F35D 90 03    BCC $F362       nope
.,F35F 4C FB F6 JMP $F6FB       I/O error #1, too many files
.,F362 E6 98    INC $98         increment LDTND
.,F364 A5 B8    LDA $B8         LA
.,F366 9D 59 02 STA $0259,X     store in LAT, table of active file numbers
.,F369 A5 B9    LDA $B9         SA
.,F36B 09 60    ORA #$60        fix
.,F36D 85 B9    STA $B9         store in SA
.,F36F 9D 6D 02 STA $026D,X     store in SAT, table of active secondary addresses
.,F372 A5 BA    LDA $BA         FA
.,F374 9D 63 02 STA $0263,X     store in FAT, table of active device numbers
.,F377 F0 5A    BEQ $F3D3       keyboard, end
.,F379 C9 03    CMP #$03        screen
.,F37B F0 56    BEQ $F3D3       yep, end
.,F37D 90 05    BCC $F384       less than 3, not serial bus
.,F37F 20 D5 F3 JSR $F3D5       send SA
.,F382 90 4F    BCC $F3D3       end
.,F384 C9 02    CMP #$02        TAPE
.,F386 D0 03    BNE $F38B       I/O error #5, device not present
.,F388 4C 09 F4 JMP $F409       open RS232 file

.,F38B 20 D0 F7 JSR $F7D0
.,F38E B0 03    BCS $F393
.,F390 4C 13 F7 JMP $F713
.,F393 A5 B9    LDA $B9
.,F395 29 0F    AND #$0F
.,F397 D0 1F    BNE $F3B8
.,F399 20 17 F8 JSR $F817
.,F39C B0 36    BCS $F3D4
.,F39E 20 AF F5 JSR $F5AF
.,F3A1 A5 B7    LDA $B7
.,F3A3 F0 0A    BEQ $F3AF
.,F3A5 20 EA F7 JSR $F7EA
.,F3A8 90 18    BCC $F3C2
.,F3AA F0 28    BEQ $F3D4
.,F3AC 4C 04 F7 JMP $F704
.,F3AF 20 2C F7 JSR $F72C
.,F3B2 F0 20    BEQ $F3D4
.,F3B4 90 0C    BCC $F3C2
.,F3B6 B0 F4    BCS $F3AC
.,F3B8 20 38 F8 JSR $F838
.,F3BB B0 17    BCS $F3D4
.,F3BD A9 04    LDA #$04
.,F3BF 20 6A F7 JSR $F76A
.,F3C2 A9 BF    LDA #$BF
.,F3C4 A4 B9    LDY $B9
.,F3C6 C0 60    CPY #$60
.,F3C8 F0 07    BEQ $F3D1
.,F3CA A0 00    LDY #$00
.,F3CC A9 02    LDA #$02
.,F3CE 91 B2    STA ($B2),Y
.,F3D0 98       TYA
.,F3D1 85 A6    STA $A6
.,F3D3 18       CLC
.,F3D4 60       RTS
```

## Key Registers
- $FFC0 - KERNAL vector - OPEN entry point
- $B8 - zero page - LA (logical file number)
- $B9 - zero page - SA (secondary address)
- $BA - zero page - FA (device number)
- $BB - zero page - FNADR (filename pointer)
- $B7 - zero page - FNLEN (filename length)
- $98 - zero page - LDTND (count of open files)
- $0259-$0262 - LAT (table of active logical file numbers; indexed by file slot X)
- $0263-$026C - FAT (table of active device numbers; indexed by file slot X)
- $026D-$0276 - SAT (table of active secondary addresses; indexed by file slot X)

## References
- "find_file" — checks if file already exists (called at $F30F)
- "send_sa" — sends secondary address and filename for serial devices (called at $F3D5)
- "open_rs232" — RS232-specific open handler (JMP target $F409)

## Labels
- OPEN
- LA
- SA
- FA
- FNADR
- FNLEN
- LDTND
- LAT
