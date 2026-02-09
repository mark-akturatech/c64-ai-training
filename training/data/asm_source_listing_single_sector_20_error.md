# Single-Sector 20-Error Routine (assembly source listing)

**Summary:** Assembly source for a single-sector 20-error DOS/FDC write routine, using Kernal/DOS entry points ($F510, $F556, $F934, $FEOO, $F969). Header image is staged in RAM ($0024-$002C) and written via DOS buffer control ($1C00-$1C0C). Includes zone/sector calculations and a write-loop that transfers the prepared header to disk.

## Operation
This listing is the machine-code assembly that a BASIC program encodes via DATA statements. The routine:

- Sets origin (. = $0500) and calls DOS/FDC entry points to locate blocks and prepare for a write.
- Performs zone/sector arithmetic and comparisons to determine the correct block/zone and to create a new header if needed.
- Builds a 7-byte (staged) header image in RAM page $00 at $0024-$002C.
- Uses DOS/Kernal vectors ($F934, $F556) to find an image/block and to set write/transfer modes.
- Switches DOS into write mode by setting byte(s) in the $1C00-$1C0C buffer area and repeatedly writes the staged header image to disk using indexed transfers (reads from $0024,X and stores into DOS buffer registers).
- Restores read mode (JSR $FEOO) and returns control by jumping to $F969.

This document preserves the assembly listing as reference. Many tokens in the source appear to be from OCR or nonstandard notation; hex markers have been normalized to $ where obvious. See the Note below for ambiguous/possibly incorrect tokens left unchanged.

**[Note: Source may contain an error — several tokens appear corrupted (e.g. tt*$14, 4**00, «16). Asterisks were normalized to $ for hex constants; ambiguous labels like "tt" were left as in source.]**

## Source Code
```asm
.OPT P,02
* = $0500

JSR $F510
JSR $F556

LDY tt*$14
LDA $19
CMP tt*$12
BCC ZONE
DEY
DEY
CMP #$19
BCC ZONE
DEY
CMP #$1F
BCC ZONE
DEY
ZONE INC
CMP $18
BCC HEADER
BEQ HEADER
LDA 4$ $00
STA $19

HEADER  LDA
EOR $16
EOR $17
EOR $18
EOR $19
STA $1A

JSR $F934    ; tt IMAGE
JSR $F556    ; K
LDA #$FF
STA $1C03
LDA $1C0C
AND #$1F

; FIND HEADER BLOC
; FIND DATA BLOCK
; CREATE NEW HEADER
; FIND HEADER BLOC
; WRITE MODE

ORA #$C0
STA $1C0C
LDX #$00

WRITE  LDA $0024,X
WAIT1  BVC WAIT1
CLV
STA $1C01
INX
CPX tt*$08
BNE WRITE

WAIT2  BVC WAIT2

JSR $FEOO    ; READ MODE

LDA tt*$01
JMP $F969
```

## Key Registers
- $0024-$002C - RAM - staged header image (7 bytes) used as the sector data to write
- $0018-$001A - zero page/low RAM bytes referenced in comparisons and stored header fields (source uses $18-$1A)
- $1C00-$1C0C - RAM (DOS buffer/control area) - write-mode control bytes and buffer registers ($1C01, $1C03, $1C0C referenced)
- $F510 - ROM (DOS/Kernal) - DOS/FDC entry vector (used early in setup)
- $F556 - ROM (DOS/Kernal) - DOS/FDC routine (used multiple times)
- $F934 - ROM (DOS/Kernal) - DOS routine invoked to find image/block
- $FEOO - ROM (Kernal) - switch/read-mode routine (called to restore read mode)
- $F969 - ROM (Kernal) - final jump/return into DOS

## References
- "basic_driver_listing_single_sector_20_error" — BASIC program that contains the DATA bytes for this assembly
- "source_annotation_single_sector_20_error" — annotated explanation and timing limitations
- "overview_and_parameters_single_sector_20_error" — high-level description and parameters relevant to the routine