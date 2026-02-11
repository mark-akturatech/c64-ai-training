# NMOS 6510 — LAS / LAR undocumented opcode ($BB) — abs,Y

**Summary:** Undocumented NMOS 6510 opcode $BB (commonly called LAS or LAR) using absolute,Y addressing: it computes (memory_operand & SP), stores the result into A and X and writes it back to SP. Size 3 bytes, cycles 4 (+1 if page crossed), sets N and Z like a load.

## Description
LAS (aka LAR) is an undocumented instruction on NMOS 6510 (Commodore 64 family) with absolute,Y addressing. Operation:

- Read the memory operand at (abs_addr + Y).
- Compute result = memory_operand AND SP.
- Store result into A, X and SP.
- Set N and Z according to the result (like a load). Other flags are unchanged.

Properties:
- Opcode: $BB
- Addressing mode: absolute,Y
- Size: 3 bytes
- Cycles: 4 cycles (plus 1 if absolute address + Y crosses a page boundary)
- Flags affected: N and Z set based on the loaded value; other flags unchanged
- Behavior: A := result; X := result; SP := result

Caveats:
- This instruction manipulates the stack pointer (SP). Use only when you can guarantee interrupts and subroutine returns will not be disrupted (for example, in a main loop where the SP is known/restored).
- It is undocumented — semantics are implementation-defined and may not be reliable across different 6502-family variants or revisions.
- If you need to emulate LAS with documented opcodes, see the equivalent sequence below (larger and slower).

Example use-case (cycling an index within bounds 0..15):
- If memory at "mask" contains $0F, LAS mask,Y will force A,X,SP into 0..$0F range.
- Then DEX / TXS sequences can advance the stack pointer (used here as temporary index storage) without corrupting return addresses if you ensure SP is in a safe area between calls/interrupts.

## Source Code
```asm
; Opcode: $BB — LAS abs,Y (undocumented)
; Example: cycle an index within 0..15 using SP as temporary index storage
; Assume mask is one page filled with $0F and SP initially any value (e.g. $F7)

        LAS mask,y     ; A,X,SP := Mem(mask+Y) & SP   ; single undocumented opcode

        DEX            ; X = result - 1
        TXS            ; SP := X  (now SP is in 0..$0F)
        LDA table,x    ; use X as index into table

; If data is stored on the stack and no interrupt can occur, you could use PLA instead
; then adjust SP to a safe area (e.g. SWX #$11) to avoid corrupting other stack data.

; Equivalent sequence using only documented opcodes (slower):
; TSX      ; X := SP
; TXA      ; A := X (now A contains SP)
; AND abs,Y; A := A & Mem(abs+Y)
; TAX      ; X := A
; TXS      ; SP := X
;
; This yields A,X,SP := Mem(abs+Y) & original_SP
```

## References
- "tas_opcode_and_examples" — expands on TAS and LAS relationship and combined STA/TSX patterns that interact with SP

## Mnemonics
- LAS
- LAR
