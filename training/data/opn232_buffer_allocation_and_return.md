# KERNAL: OPN232 buffer allocation and finalization (GETTOP, RIBUF/ROBUF, M51AJB)

**Summary:** Describes the KERNAL OPN232 (RS-232 open) finalization step: after GETTOP returns, it allocates 256-byte input/output buffers by adjusting the top-of-memory pointer, sets RIBUF/ROBUF allocation flags (RIBUF+1 / ROBUF+1), stores buffer pointers into RIBUF/ROBUF, writes the BAUD start rate into M51AJB/M51AJB+1, and returns to the higher-level open routine with STATUS set.

**Behavior / Purpose**
This chunk documents the finalization portion of the OPN232 device-open sequence in the Commodore 64 KERNAL ROM:
- Called after GETTOP returns the current top-of-memory pointer.
- Tests whether input/output buffers need allocation and sets allocation flags by storing (buffer-pointer + 1) into RIBUF and/or ROBUF (noting the source uses the RIBUF+1 / ROBUF+1 convention).
- When allocating, reduces the top-of-memory pointer by 256 bytes per buffer (i.e., decrements the top pointer by $100) to reserve a 256-byte buffer region.
- Stores the resulting buffer pointers into the RIBUF and ROBUF variables so higher-level code can find the buffers.
- Stores the BAUD start rate (initial serial rate) into M51AJB and M51AJB+1 (two-byte location).
- Returns to the caller (the higher-level open routine) and sets the STATUS byte appropriately to indicate success or error.

**Operation details**
- Buffer size: 256 bytes per buffer reserved by decrementing the top-of-memory pointer by 256 ($100).
- Allocation flag convention: the routine writes (buffer address + 1) into the RIBUF/ROBUF variable to indicate an allocated buffer (as stated in the source).
- BAUD storage: BAUD start rate is saved into a two-byte location labeled M51AJB / M51AJB+1.
- Control flow: routine finishes by returning to the open routine; the STATUS byte reflects the result (success or failure).

## Source Code
```assembly
; OPN232 finalization routine
; Assumes GETTOP has been called to retrieve the current top-of-memory pointer

; Check if input buffer (RIBUF) needs allocation
LDA RIBUF
BNE CheckOutputBuffer  ; If RIBUF is non-zero, it is already allocated

; Allocate 256-byte input buffer
SEC
LDA MEMSIZ
SBC #$01
STA RIBUF
STA MEMSIZ
LDA MEMSIZ+1
SBC #$01
STA RIBUF+1
STA MEMSIZ+1

CheckOutputBuffer:
; Check if output buffer (ROBUF) needs allocation
LDA ROBUF
BNE StoreBaudRate  ; If ROBUF is non-zero, it is already allocated

; Allocate 256-byte output buffer
SEC
LDA MEMSIZ
SBC #$01
STA ROBUF
STA MEMSIZ
LDA MEMSIZ+1
SBC #$01
STA ROBUF+1
STA MEMSIZ+1

StoreBaudRate:
; Store the BAUD start rate into M51AJB/M51AJB+1
LDA BAUD_LOW
STA M51AJB
LDA BAUD_HIGH
STA M51AJB+1

; Return to the higher-level open routine with STATUS set
RTS
```

## Key Registers
- **RIBUF**: $00F7-$00F8 — Pointer to the Receiver Buffer base location.
- **ROBUF**: $00F9-$00FA — Pointer to the Transmitter Buffer base location.
- **M51AJB**: $0295-$0296 — RS-232 Non-Standard BPS (Time/2-100) USA.

## References
- "open_continued_and_opn232" — continuation of buffer allocation and RS-232 initialization
- Commodore 64 Programmer's Reference Guide, Chapter 5: Memory Map
- Commodore 64 KERNAL ROM Disassembly

## Labels
- RIBUF
- ROBUF
- M51AJB
