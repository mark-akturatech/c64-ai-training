# PENTOMINOS (machine-language)

**Summary:** Machine-language implementation of the PENTOMINOS puzzle solver for PET/CBM, VIC-20/Commodore 64/PLUS/4, and B128; relocates to $156D with shape tables at $12FA (B128 variant is exceptional). Implements BASIC logic exactly, uses piece indexing 0–255, no indirect addressing, and no subroutines.

**Program overview**
This is a machine-language port of the PENTOMINOS puzzle solver that "visibly" draws each placement attempt on the screen while searching for solutions. The machine-language code was written to mirror the original BASIC program flow exactly, not to follow typical assembly best practices. Key behavioral points:

- The solving algorithm and control flow follow the BASIC program precisely.
- Each pentomino piece + rotation is reachable by a single-byte index in the range 0–255; the shape tables were reorganized so that the program can select a piece/rotation by indexing into those tables.
- The program displays attempts on-screen (visual feedback of placements).
- Implementation constraints: no indirect addressing and no JSR/RTS-style subroutines — all logic is inlined to match BASIC structure.

**Memory layout and relocation**
- Machine code is intended to be relocated to $156D in RAM on target machines (tables are placed at $12FA). This is the standard layout for the non-B128 builds.
- The B128 variant uses a different relocation/load procedure (boot/transfer files mentioned below); the standard $156D/$12FA layout does not apply to B128.
- Shape tables are grouped near $12FA for rapid indexed access (one-byte index per piece/rotation). Exact table formats and byte layouts are in the companion "pentominos_variables" chunk.

**Implementation details**
- No use of 6502 indirect addressing modes; all addressing is direct absolute or immediate to keep step-for-step parity with the BASIC source.
- No subroutines: code is unrolled/duplicated to replicate BASIC's linear control flow (this simplifies correspondence between BASIC lines and machine sequence).
- Pieces are indexed 0–255; the index encodes piece identity and rotation. The routine that maps index → shape is table-driven (see variables/tables chunk).
- The program set includes different builds for different machines: PET/CBM, VIC-20/C64/PLUS/4, and a special B128 boot/transfer pair.

**Variants and supplied files**
- PENTOMINOS INST — instructions listing (text)
- PENTOMINOS — BASIC source (all machines)
- PENTOMINOS PET — machine-language build for PET/CBM
- PENTOMINOS V64 — build for VIC-20, Commodore 64, PLUS/4
- PENTOMINOS B128 — boot for B128 system (special-case loading)
- +PENTO128 — machine-language program file for B128
- +XFER — transfer/loader sequence for B128

## Source Code
```text
; PENTOMINOS PET Assembly Listing
; -------------------------------
; This is a partial assembly listing for the PET/CBM variant of the PENTOMINOS machine-language program.
; The full listing is extensive and mirrors the BASIC program's logic exactly.

; Start of program
* = $156D

START:
    ; Clear screen
    JSR $E544

    ; Initialize variables
    LDA #$00
    STA $033C ; P (piece number)
    STA $033D ; W1 (board width)
    STA $033E ; W2 (board height)
    STA $033F ; P1 (number of pieces placed)
    ; ... (additional initialization code)

    ; Main solving loop
    ; ... (code implementing the solving algorithm)

    ; End of program
    RTS
```

```text
; Shape Table Byte Layouts
; ------------------------
; Each pentomino piece and its rotations are stored in a table starting at $12FA.
; The table is indexed by a single byte (0–255), where each index corresponds to a specific piece and rotation.

; Example entry for a single piece rotation:
; Byte 0: X offset of first square
; Byte 1: Y offset of first square
; Byte 2: X offset of second square
; Byte 3: Y offset of second square
; Byte 4: X offset of third square
; Byte 5: Y offset of third square
; Byte 6: X offset of fourth square
; Byte 7: Y offset of fourth square
; Byte 8: X offset of fifth square
; Byte 9: Y offset of fifth square
; Byte 10: End marker (e.g., $FF)

; The offsets are relative to the top-left corner of the piece's bounding box.
```

```text
; B128 Relocation/Load Address Details and +XFER Transfer Sequence
; ---------------------------------------------------------------
; The B128 variant uses a special boot and transfer sequence to load the machine-language program.

; +XFER Transfer Sequence:
; This sequence is responsible for loading the +PENTO128 program into memory at the correct location.

; Example of a simple loader:
* = $0400

    LDX #$00
LOAD_LOOP:
    LDA $1000,X
    STA $156D,X
    INX
    CPX #$FF
    BNE LOAD_LOOP

    ; Jump to the start of the program
    JMP $156D
```

```text
; Machine-Code Comments Mapping Assembly Offsets to BASIC Line Numbers
; --------------------------------------------------------------------
; The following addresses correspond to specific BASIC line numbers:

; $156D: Start, corresponds to BASIC line 1070
; $15A4: Clear screen, corresponds to BASIC line 1120
; $15A9: Clear variables, set up
; $15CC: Find space, corresponds to BASIC line 2010
; $1600: Get new piece, corresponds to BASIC line 2030
; $1609: Try piece, corresponds to BASIC line 2060
; $1686: Put piece in, corresponds to BASIC line 2120
; $16E0: Print "Solution", corresponds to BASIC line 2170
; $1701: Undraw piece, corresponds to BASIC line 2190
; $17AB: Rotate piece, corresponds to BASIC line 2260
; $17BC: Give up on piece, corresponds to BASIC line 2280
```

## Key Registers
- $156D - RAM - intended program load/entry address (machine-code relocation target for non-B128 builds)
- $12FA - RAM - start of shape tables / indexed piece/rotation data

## References
- "pentominos_variables" — expands on variables and tables used by PENTOMINOS (shape table formats, index encoding)
- "pentominos_program_map" — expands on routine addresses and program map (Start, Try piece, Put piece in, etc.)