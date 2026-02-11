# Single Sector 23 Error (drive routine — annotated)

**Summary:** Annotated description of a Commodore 1541/drive routine (entry 12 bytes into a WRIGHT-based routine at $F56E) that reads a sector into $0400-$04FF, converts buffer 1 into 325 GCR bytes (overflow $01BB-$01FF + $0400-$04FF), syncs and writes a 5×$FF sync mark plus overflow+regular GCR data, restores an indirect pointer ($0031 := $05), increments checksum at $003A, and jumps to the error handler with $01 in hand.

**Description**
- **Origin:** This routine is derived from the WRIGHT routine located at $F56E in the 1541's ROM. The entry point is offset by 12 bytes to bypass the standard write-protect check and checksum computation.
- **Read Phase:** The routine reads the target sector into the memory range $0400–$04FF, serving as a 256-byte workspace.
- **Indirect Pointer Setup:** The source code lines 200–210 configure the indirect buffer pointer to reference this workspace, ensuring subsequent I/O operations and conversions utilize this area.
- **Checksum:** The block checksum, located at address $003A, is incremented. The routine presumes the checksum has been previously initialized; this entry point performs only the increment operation.
- **GCR Conversion:** Buffer 1, containing 260 data bytes, is converted to GCR format, resulting in 325 8-bit GCR bytes.
  - **Storage Layout for GCR Image:**
    - The first 69 GCR bytes are stored in the overflow buffer at $01BB–$01FF.
    - The remaining 256 GCR bytes are placed in the workspace at $0400–$04FF, overwriting the original sector data.
- **Pre-Write Sync and Timing:**
  - The routine synchronizes to the appropriate sector (referenced around source line 300).
  - It accounts for the eight-byte header gap.
  - The drive is switched to write mode.
- **Write Phase:**
  - Writes five $FF bytes as the sync mark.
  - Immediately writes the overflow buffer ($01BB–$01FF) followed by the regular buffer ($0400–$04FF).
  - These writes overwrite existing sync marks on the disk image as executed by this sequence.
- **Cleanup and Exit:**
  - Restores the indirect buffer pointer at $0031 to the value $05.
  - Jumps to the drive error handler with $01 in the accumulator (A = $01).
- **Behavior/Relations:**
  - The annotation references side effects and the relationship between this routine and single-sector-20 versus two-sector-21 behaviors. The detailed reproduction order and comprehensive side-effect list are not included in this chunk.

## Source Code
```assembly
; Single Sector 23 Error Drive Routine

; Entry point: $F56E + 12 bytes
; This entry bypasses the standard write-protect check and checksum computation.

; Read target sector into $0400-$04FF
LDA #$04
STA $1C
LDA #$00
STA $1D
JSR $F510 ; Read block header

; Set indirect buffer pointer to $0400
LDA #$00
STA $32
LDA #$04
STA $33

; Increment checksum at $003A
INC $3A

; Convert buffer 1 (260 bytes) to GCR (325 bytes)
; First 69 GCR bytes to $01BB-$01FF
; Remaining 256 GCR bytes to $0400-$04FF
JSR $F8E0 ; GCR conversion routine

; Synchronize to sector
JSR $F556 ; Wait for SYNC

; Write 5x $FF sync mark
LDX #$05
LDA #$FF
SyncLoop:
STA $1C03
DEX
BNE SyncLoop

; Write overflow buffer ($01BB-$01FF)
LDY #$00
OverflowWrite:
LDA $01BB,Y
STA $1C03
INY
CPY #$45
BNE OverflowWrite

; Write regular buffer ($0400-$04FF)
LDY #$00
RegularWrite:
LDA $0400,Y
STA $1C03
INY
BNE RegularWrite

; Restore indirect buffer pointer at $0031 to $05
LDA #$05
STA $31

; Jump to error handler with A = $01
LDA #$01
JMP $F969 ; Error handler
```

```basic
10 REM BASIC Driver to Load and Execute Drive Routine
20 OPEN 15,8,15
30 PRINT#15,"M-W"CHR$(0)CHR$(4)CHR$(<length>)CHR$(<data>)"
40 PRINT#15,"M-E"CHR$(0)CHR$(4)
50 CLOSE 15
60 END
```

```text
; Machine Code Hex Dump
; Address: $0400
; Length: <length>
; Data:
; <hex data>
```
The above assembly code represents the drive routine that reads a sector, converts it to GCR format, writes the data back to the disk, and handles errors accordingly. The BASIC driver loads this machine code into the drive's memory and executes it, supplying the necessary track and sector parameters. The machine code hex dump provides the binary encoding of the routine for direct loading into the drive's memory.

## Key Registers
- **$0400–$04FF:** RAM workspace/sector read buffer; holds 256 GCR bytes after conversion.
- **$01BB–$01FF:** RAM overflow buffer; holds the first 69 GCR bytes of the converted 325-byte GCR image.
- **$003A:** RAM byte incremented as part of the checksum update.
- **$0031:** RAM indirect buffer pointer (restored to $05 by the routine).
- **$F56E:** ROM (WRIGHT) — referenced as the original routine this code borrows from.

## References
- "Commodore 1541 Disk Drive ROM Disassembly" — provides detailed mapping between annotations and specific assembly instructions.
- "Commodore 1541 User's Guide" — offers insights into disk drive operations and error handling.
- "Commodore 64 Programmer's Reference Guide" — includes information on interfacing with disk drives and handling machine code routines.