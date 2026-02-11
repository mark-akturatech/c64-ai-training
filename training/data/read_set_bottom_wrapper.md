# Wrapper at $FF9C: JMP $FE34 — read/set bottom of memory (carry semantics)

**Summary:** Small ROM wrapper at $FF9C that JMPs to $FE34 to read or set the bottom-of-RAM pointer; uses the 6502 carry flag to select operation (carry=1 -> read into X/Y, carry=0 -> store X/Y as new bottom).

**Description**
This ROM entry at address $FF9C is a single JMP that transfers control to the routine at $FE34, which implements reading or setting the bottom-of-RAM pointer. Calling convention:

- If the 6502 carry flag is set on entry, the routine loads the pointer-to-bottom-of-RAM into the X and Y registers (X/Y = pointer low/high).
- If the carry flag is clear on entry, the routine stores the current X and Y registers as the new bottom-of-RAM pointer, changing the system's bottom of memory.

This wrapper provides a fixed entry point ($FF9C) that simply branches to the real implementation at $FE34.

## Source Code
```asm
; Fully Commented Commodore 64 ROM Disassembly (English)
; Wrapper at $FF9C that JMPs to $FE34 to read or set the bottom of memory (carry semantics).

                                *** read/set the bottom of memory
                                this routine is used to read and set the bottom of RAM. When this routine is
                                called with the carry bit set the pointer to the bottom of RAM will be loaded
                                into XY. When this routine is called with the carry bit clear XY will be saved as
                                the bottom of memory pointer changing the bottom of memory.
.,FF9C 4C 34 FE JMP $FE34       read/set the bottom of memory

; Implementation of the routine at $FE34
; This routine reads or sets the bottom-of-RAM pointer based on the carry flag.

.,FE34 38       SEC             ; Set carry flag
.,FE35 A5 81    LDA $81         ; Load low byte of bottom-of-RAM pointer
.,FE37 A4 82    LDY $82         ; Load high byte of bottom-of-RAM pointer
.,FE39 B0 04    BCS $FE3F       ; If carry set, branch to store X/Y as new bottom
.,FE3B 86 81    STX $81         ; Store X register as low byte of new bottom-of-RAM pointer
.,FE3D 84 82    STY $82         ; Store Y register as high byte of new bottom-of-RAM pointer
.,FE3F 60       RTS             ; Return from subroutine
```

## References
- "read_set_bottom_of_memory" — expands on implementation at $FE34