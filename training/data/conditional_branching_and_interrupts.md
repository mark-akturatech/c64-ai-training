# 6502 Instruction Set — Branches, Jumps, Interrupts, and Addressing Modes

**Summary:** Overview of 6502 conditional branch instructions (BCC/BCS/BEQ/BMI/BNE/BPL/BVC/BVS) using relative addressing with signed 8-bit offsets, branch timing (2 bytes; 2 cycles not-taken, 3 cycles taken, +1 cycle if page crossed), JMP/JSR/RTS stack behavior, IRQ/NMI/BRK/RTI interrupt semantics, and Immediate/Absolute/Zero-page addressing formats.

## Branch instructions (relative addressing)
- Branch opcodes: BCC, BCS, BEQ, BMI, BNE, BPL, BVC, BVS.
- Addressing: relative, signed 8-bit offset stored as the single operand byte. Offset range: -128 .. +127 (branch target = PC + offset + 2 when taken; offset interpreted relative to address following branch instruction).
- Encoding/length: each branch instruction is 2 bytes (opcode + 8-bit offset).
- Timing:
  - If branch not taken: 2 cycles.
  - If branch taken: 3 cycles.
  - If branch taken and target is on a different page than the address following the branch: +1 cycle (total 4 cycles).
- Note: page crossing penalty applies only when the taken branch crosses a 256-byte page boundary.

## Jumps and subroutines
- JMP (absolute) — transfers PC to target address (uses absolute addressing).
- JSR (absolute) — calls subroutine:
  - JSR is a 3-byte instruction (opcode + 16-bit target in little-endian).
  - JSR pushes the return address (the address of the last byte of the JSR instruction, conventionally described as PC+2) onto the stack (high byte then low byte), then sets PC to the target.
- RTS — return from subroutine:
  - RTS pulls the two-byte return address from the stack (low then high), increments it by one, and resumes execution there.
- Push/pull ordering and return-address adjustment are critical for correct return-to-caller semantics.

## Interrupts, BRK and RTI
- Vectors (standard 6502 vectors):
  - NMI vector: $FFFA/$FFFB (low/high).
  - RESET vector: $FFFC/$FFFD.
  - IRQ/BRK vector: $FFFE/$FFFF.
- IRQ vs NMI:
  - IRQ is maskable by the Interrupt Disable flag (I) in the status register.
  - NMI is non-maskable (always taken when asserted).
- Entry sequence (IRQ and NMI):
  - CPU pushes PC high then PC low, pushes status register (SR) onto stack, sets the I flag (disable further IRQs), then loads PC from the appropriate vector.
  - The pushed SR reflects the processor status at entry; for IRQ the B flag in the pushed copy is cleared.
- BRK:
  - BRK is a software interrupt; it behaves similarly to NMI/IRQ but:
    - BRK pushes PC+2 (address after BRK and its implied padding) onto the stack.
    - The SR pushed onto the stack has the Break flag set in the pushed copy.
    - BRK vectors to the IRQ/BRK vector ($FFFE/$FFFF).
- RTI:
  - RTI (return from interrupt) pulls SR first, then PCL then PCH (restoring status register and program counter), resuming execution with the restored SR.
- Notes:
  - The processor sets the Interrupt Disable (I) flag on interrupt entry to prevent further IRQs during handler execution (standard behavior).
  - The Break (B) bit is a pushed-only flag to indicate BRK on the stacked copy of SR; the internal SR B bit semantics differ (B isn't a physical status bit stored in SR register reads).

## Stack and simple instruction notes
- Stack operations affect SP and memory (stack at $0100-$01FF on 6502):
  - PHA pushes accumulator to stack (involves A, SP, and memory cycles).
  - PHP pushes SR to stack.
  - Pulls (PLA, PLP) restore from stack and adjust flags/accumulator as specified.
- Single-register operations (examples from source): CLC (clear carry), ROL A (rotate accumulator left), TXA (transfer X to A), RTS (return from subroutine).
- Be aware that even seemingly simple instructions (e.g., PHA) involve multiple internal operations (SP decrement, memory write).

## Addressing modes (concise)
- Immediate addressing:
  - Syntax: operand preceded by # (e.g., LDA #$07).
  - Operand is a literal 8-bit value; instruction length = 2 bytes.
- Absolute addressing:
  - 16-bit address supplied in two bytes after opcode, little-endian (low byte first).
  - Instruction length = 3 bytes. Used by JMP and JSR to supply full 16-bit targets.
- Zero-page addressing:
  - Single-byte operand is treated as address $00xx (high byte implicitly $00).
  - Instruction length = 2 bytes (one byte shorter than absolute); typically executes faster by one cycle.

## Source Code
```asm
; Small mnemonic examples (from source)
; (these are reference opcode / operand examples)
CLC         ; clear the carry flag
ROL A       ; rotate accumulator left
TXA         ; transfer X to A
PHA         ; push accumulator to stack
RTS         ; return from subroutine

; Immediate addressing example (assembler and machine code)
; LDA #7   => A9 07
; in memory: A: 07

; Absolute addressing example
; LDA $3010  => AD 10 30    ; $3010 contains 34 -> A <- 34

; Zero-page addressing example
; LDA $80   => A5 80        ; loads from $0080
```

## References
- "jump_vectors_and_stack_operations" — expands on stack operations during IRQ/NMI/BRK/RTI
- "branch_addressing_modes" — expands on relative addressing details and page crossing penalties