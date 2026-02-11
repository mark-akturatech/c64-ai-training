# BASIC SAVE implementation (ROM)

**Summary:** Implements BASIC SAVE flow in C64 ROM: JSR $E1D4 parameter parsing, load start/end address bytes from zero page ($2D/$2E), set A to index ($2B) and JSR $FFD8 (KERNAL: save to device). Branches to BASIC I/O error handler on error (BCS $E0F9), otherwise RTS.

## Implementation details
This ROM fragment performs the SAVE operation requested by BASIC. Sequence:
- Call the shared parameter parser at $E1D4 to parse filename/device/addresses used by LOAD/SAVE.
- Load the start address low/high bytes from zero page BASIC variables $2D (low) and $2E (high) into X and Y respectively.
- Put the index byte for the start of program memory into A (literal #$2B).
- Call the KERNAL save routine at $FFD8 with A = index to start address, X/Y = end address low/high.
- On return, if the carry flag is set (BCS), branch to the BASIC I/O error handler at $E0F9; otherwise return (RTS).

Behavioral notes (from source):
- Parameter parsing is centralized in $E1D4 (shared with LOAD/VERIFY).
- The save call uses the KERNAL device write routine at $FFD8.
- Error handling uses the BASIC I/O error handler at $E0F9 when the KERNAL indicates an error via the carry flag.

## Source Code
```asm
                                *** perform SAVE
.,E156 20 D4 E1 JSR $E1D4       get parameters for LOAD/SAVE
.,E159 A6 2D    LDX $2D         get start of variables low byte
.,E15B A4 2E    LDY $2E         get start of variables high byte
.,E15D A9 2B    LDA #$2B        index to start of program memory
.,E15F 20 D8 FF JSR $FFD8       save RAM to device, A = index to start address, XY = end
                                address low/high
.,E162 B0 95    BCS $E0F9       if error go handle BASIC I/O error
.,E164 60       RTS             
```

## Key Registers
- $E1D4 - ROM routine - shared parameter parser for LOAD/SAVE
- $2D - Zero page - BASIC start address low byte (variable/index)
- $2E - Zero page - BASIC start address high byte (variable/index)
- $FFD8 - KERNAL - save/write RAM to device (called with A,index; X/Y = end address)
- $E0F9 - ROM routine - BASIC I/O error handler (branch target on BCS)
- $E156-$E164 - ROM - SAVE implementation code fragment (entry $E156)

## References
- "get_params_for_load_save" — parameter parsing for LOAD/SAVE (filename/device/addresses)
- "perform_verify_and_load" — LOAD/VERIFY share parameter parsing and KERNAL device calls