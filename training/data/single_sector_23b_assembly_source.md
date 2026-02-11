# 23B.PAL — Single-Sector 23 (duplicate variant) assembly driver

**Summary:** Assembly/BASIC wrapper for a 1541 single-sector "23B" write driver that converts sector data to GCR (JSR $F73F), locates the disk header (JSR $F510), waits out the header gap, enables WRITE mode ($1C03 / $1C0C), writes sync marks and streams GCR bytes from the overflow ($0100,Y) and sector ($0400,Y) buffers to the drive via $1C01, then re-enables READ (JSR $FE00) and returns to DOS (JMP $F969) with zero-page $31 set.

**Description**
This program is the assembled machine-code driver and BASIC launcher for the "23B.PAL" single-sector write variant. Sequence:

- BASIC opens the output file and issues SYS to start the machine-code at $A000.
- Assembler prologue sets options and origin (assembled at $0500).
- Prepares DOS return/parameter in zero-page $31 (written with LDA/STA).
- JSR $F73F — call the DOS/driver routine that converts sector data into GCR encoding.
- JSR $F510 — call the routine that searches for the sector header/sync on the drive.
- Wait out the header gap with a short X-counted loop (branch on V flag).
- Enable write mode by writing $FF to $1C03 and setting control bits in $1C0C.
- Write sync marks by a short X-counted loop writing $FF to $1C01 and waiting for clear (BVC/CLV loop).
- Stream overflow buffer at $0100,Y to the drive: for Y descending from $BB (decimal 187), wait for device ready (BVC/CLV) then STA $1C01, INY and loop until wrapped.
- Stream sector buffer at $0400,Y similarly.
- Final wait loop, then JSR $FE00 to re-enable read, set zero-page $31 for DOS, and JMP $F969 to return to DOS.

Labels in the source:
- WAITGAP — loop that waits out the header gap.
- WRITESYNC — loop that writes post-header sync marks.
- OVERFLOW / BUFFER — loops that stream bytes from the overflow and sector buffers.
- WAIT1 / WAIT2 / WAIT3 — device-wait loops using BVC / CLV semantics.

Preserves original addresses and control flow used by 1541 DOS and drive hardware ($1C01, $1C03, $1C0C). BASIC lines are the launcher and assembler-save directives are present.

## Source Code
```basic
100  REM  23B.PAL
110  REM
120  OPEN2,8,2,"SO:23B.B,P,W"
130  REM
140  SYS40960
150  ;
```

```asm
        .OPT P,02
        *= $0500

        LDA #$04
        STA $0031

        JSR $F73F      ; CONVERT TO GCR
        JSR $F510      ; FIND HEADER #

        LDX #$05
WAITGAP BVC WAITGAP     ; WAIT OUT GAP
        CLV
        DEX
        BNE WAITGAP

        LDA #$FF       ; ENABLE WRITE
        STA $1C03
        LDA $1C0C
        AND #$1F
        ORA #$C0
        STA $1C0C

        LDA #$FF
        LDX #$05
WRITESYNC BVC WRITESYNC
        CLV
        DEX
        BNE WRITESYNC

        LDY #$BB
OVERFLOW LDA $0100,Y    ; WRITE OUT OVERFLOW BUFFER
WAIT1   BVC WAIT1
        CLV
        STA $1C01
        INY
        BNE OVERFLOW

BUFFER  LDA $0400,Y     ; WRITE OUT BUFFER
WAIT2   BVC WAIT2
        CLV
        STA $1C01
        INY
        BNE BUFFER

WAIT3   BVC WAIT3

        JSR $FE00      ; ENABLE READ

        LDA #$05
        STA $0031
        LDA #$01
        JMP $F969
```

## Key Registers
- $1C00-$1C0F - 1541 drive I/O/control registers (includes $1C01 data write, $1C03 write-enable, $1C0C control)
- $0100-$01FF - RAM - overflow buffer ($0100,Y is streamed to drive)
- $0400-$04FF - RAM - sector buffer ($0400,Y is streamed to drive)
- $0031 - Zero Page - DOS return/parameter (set before and after write)

## References
- "duplicate_single_sector_23_annotation" — notes about 23B variant leaving checksum intact
- "full_track_23m_assembly_source" — related full-track assembly driver that uses similar WRITE/READ sequencing