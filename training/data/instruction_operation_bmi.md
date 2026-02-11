# BMI (Branch if Minus) — 6502 behavior, page crossing and cycles

**Summary:** BMI tests the Sign (Negative) flag (N) in the processor status and takes a signed 8-bit relative branch when set; branches may add cycles for being taken and for crossing a 256-byte page boundary. Terms: Sign flag, relative addressing, page crossing, PC, cycles.

## Description
BMI (Branch if Minus) is a 6502 conditional relative branch that tests the N (Sign) flag in the processor status (P). If N is set, the 8-bit signed operand is added to the address following the branch instruction (the PC value after the two‑byte branch instruction). Timing rules (standard 6502):

- Branch not taken: 2 clock cycles.
- Branch taken, target on same 256-byte page: 3 clock cycles (base 2 + 1).
- Branch taken, target on different page: 4 clock cycles (base 2 + 2).

The branch target is computed by sign-extending the 8-bit operand and adding it to PC + 2 (address of next instruction). A page crossing occurs when the high byte of the address after the branch (PC + 2) differs from the high byte of the computed target.

**[Note: Source may contain an error — the sample pseudocode compares PC high byte instead of the address after the branch (PC+2); the correct page-cross check must use the address following the branch operand.]**

## Implementation details
Step-by-step when executing BMI:
1. Check N flag (P & 0x80).
2. If N = 0, do not branch; consume 2 cycles and continue with PC unchanged (pointing to next instruction after branch).
3. If N = 1:
   - Read the 8-bit relative offset operand (signed).
   - Compute next = (PC + 2) & 0xFFFF (address after opcode and operand).
   - Compute target = (next + sign_extend(offset)) & 0xFFFF.
   - If (next & 0xFF00) != (target & 0xFF00) then an extra cycle is required for page crossing (add 2 cycles instead of 1).
   - Otherwise add a single extra cycle.
   - Set PC = target and continue.

Short parenthetical: sign_extend(offset) = treat operand as signed int8.

## Source Code
```text
/* BMI */
    if (IF_SIGN()) {
	clk += ((PC & 0xFF00) != (REL_ADDR(PC, src) & 0xFF00) ? 2 : 1);
	PC = REL_ADDR(PC, src);
    }
```

```asm
; Corrected pseudocode / reference implementation (6502 semantics)
; Assumes PC points at the branch opcode byte.
; read_mem(addr) returns the byte at addr; cycles is the running clock count.

if ((P & 0x80) == 0) {
    ; branch not taken
    cycles += 2;
    PC += 2;    ; advance past opcode+operand (emulator-specific PC handling)
} else {
    uint8_t offset = read_mem(PC + 1);
    uint16_t next = (PC + 2) & 0xFFFF;            ; address after branch instruction
    int8_t so = (int8_t)offset;                   ; sign-extend 8-bit offset
    uint16_t target = (next + so) & 0xFFFF;

    ; page-cross check must compare 'next' (PC after operand) to 'target'
    if ((next & 0xFF00) != (target & 0xFF00))
        cycles += 2;    ; branch taken + page crossed (total 4)
    else
        cycles += 1;    ; branch taken, same page (total 3)

    PC = target;
}
```

## References
- "instruction_tables_bmi" — opcode/timing tables and expanded BMI opcode information

## Mnemonics
- BMI
