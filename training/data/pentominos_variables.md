# MACHINE - PENTOMINOS Program Variables and Utility Note

**Summary:** This document details the memory addresses utilized by the PENTOMINOS machine-language program for the Commodore 64, including variable storage, program relocation specifics, and references to disassembly utilities.

**Program Overview**

The PENTOMINOS machine-language (ML) program is loaded into memory by a BASIC loader, which relocates the ML code to start at address $156D and its associated tables to begin at $12FA. Notably, the B-128 variant does not perform this relocation. The following addresses pertain to RAM locations used for program state management, including piece indices, board dimensions, placement logs, piece rotation and position arrays, and board/tables.

**Variables and Purpose**

- **$033C**: Piece number (corresponds to BASIC variable P).
- **$033D-$033E**: Board size variables W1 and W2 (two-byte value).
- **$033F**: P1, number of pieces placed so far.
- **$0340-$034B**: U(..), log of pieces placed (array).
- **$034C-$0357**: T(..), rotation of each piece (array).
- **$0358-$035C**: X(..), X-location of each piece (array).
- **$035D-$0361**: Y(..), Y-location of each piece (array).
- **$0362-$0370**: Tables used to place a piece (table data).
- **$037F-$039C**: Board "edge" table (table data).
- **$039D-$03D8**: B(..), the board data (array representing board cells).

**Relocation Note:**

- Relocated ML start: $156D.
- Relocated tables start: $12FA.
- Exception: The B-128 version does not relocate the machine-language program.

**Utilities:**

- **WFDis**: A 6502 disassembler utility cited as useful for disassembly tasks.

## Source Code

```assembly
; BASIC Loader for PENTOMINOS
; This loader relocates the machine-language program to $156D
; and its associated tables to $12FA.

10 SYS 4096

; Assembly code starts at $1000
*=$1000

; Relocation routine
; Copies ML code to $156D and tables to $12FA

LDX #$00
LDA #$15
STA $FB
LDA #$6D
STA $FC
LDA #$12
STA $FD
LDA #$FA
STA $FE

; Copy ML code
ML_COPY:
  LDA $1000,X
  STA ($FB),Y
  INY
  BNE ML_COPY
  INC $FC
  INC $FE
  DEX
  BNE ML_COPY

; Jump to relocated ML code
JMP $156D
```

## Key Registers

- **$033C**: RAM - Piece number (BASIC variable P).
- **$033D-$033E**: RAM - W1/W2 board size.
- **$033F**: RAM - P1, pieces placed count.
- **$0340-$034B**: RAM - U(..), log of pieces placed.
- **$034C-$0357**: RAM - T(..), piece rotations.
- **$0358-$035C**: RAM - X(..), piece X locations.
- **$035D-$0361**: RAM - Y(..), piece Y locations.
- **$0362-$0370**: RAM - Tables to place a piece.
- **$037F-$039C**: RAM - Board edge table.
- **$039D-$03D8**: RAM - B(..), the board representation.
- **$12FA**: RAM - Relocated tables start (per loader).
- **$156D**: RAM - Relocated machine-language start (per loader).

## References

- "pentominos_program_map" — expands on program entry points that manipulate these variables.

## Labels
- W1
- W2
- P1
- U
- T
- X
- Y
- B
