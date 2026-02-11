# BEQ (Branch if Equal) — 6502

**Summary:** BEQ (opcode $F0) is a relative-addressing branch that tests the Zero flag (Z). If Z is set the processor adds cycles for a taken branch (+1) and an additional penalty if the branch target crosses a page boundary (+1), producing timing 2/3/4 cycles (not-taken/taken same-page/taken page-cross).

## Operation
BEQ checks the Zero flag; when set, it takes an 8-bit signed relative offset and adds it to the program counter (PC) to form the branch target. The offset is sign-extended (two's complement) and is relative to the address immediately following the branch operand (i.e., PC points to the next instruction when the offset is applied).

Timing behavior (standard NMOS 6502):
- If branch not taken: 2 cycles (no PC change beyond already-advanced PC).
- If branch taken and target is on the same 256-byte page: 3 cycles (1 extra cycle).
- If branch taken and target crosses a page boundary: 4 cycles (2 extra cycles).

Page crossing detection compares the high byte of the PC (the base address used for the relative calculation) to the high byte of the computed target. The common emulator pattern is:
- Ensure PC is the address after the branch operand (PC at next instruction).
- Compute target = PC + SIGNED(offset).
- If target high byte != PC high byte then add an extra cycle.

REL_ADDR semantics (explicit):
- offset = src (8-bit operand)
- signed_offset = (offset < $80) ? offset : offset - $100
- target = PC + signed_offset
- Compare (PC & $FF00) vs (target & $FF00) to detect page crossing.

The provided pseudocode increments the clock only when the branch is taken; therefore the caller/emulator must still account for the base 2 cycles for BEQ when not taken.

## Source Code
```asm
/* Pseudocode from source */
    /* BEQ */
    if (IF_ZERO()) {
        clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
        PC = REL_ADDR(PC, src);
    }
```

```text
Opcode / addressing    Opcode  Cycles (not taken / taken / page cross)
BEQ (relative)         $F0     2 / 3 / 4
```

```text
REL_ADDR(PC, src) example:
    offset = src          ; 8-bit operand fetched after opcode
    if offset < $80:
        signed = offset
    else:
        signed = offset - $100   ; sign-extend
    target = PC + signed    ; PC here = address after operand
```

## References
- "instruction_tables_beq" — expands on BEQ opcode and timing

## Mnemonics
- BEQ
