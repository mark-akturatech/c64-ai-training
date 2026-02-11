# NMOS 6510 — Zeropage X Indexed-Indirect ((ZP,X)) cycles (ADC/STA/AND/CMP/EOR/LDA)

**Summary:** Cycle-by-cycle timing for the 6510/6502 Zeropage,X Indexed-Indirect addressing mode ((ZP,X)) used by ADC/STA/AND/CMP/EOR/LDA etc., showing opcode/operand/dummy reads, zero-page (ZP+X) access, low/high pointer fetch, and final data cycle. Also includes the complete RTS/stack cycle sequence and a simulation reference.

**Zeropage X Indexed-Indirect ((ZP,X)) cycle description**

The (ZP,X) addressing mode performs a zero-page lookup whose pointer is offset by X to form a 16-bit effective address. For memory-read instructions (LDA/ADC/AND/EOR/CMP etc.), this requires six bus cycles: opcode fetch, operand fetch (zero-page pointer), a dummy read from the computed zero-page location, reads of the low and high bytes of the effective address from zero page, and the final data read. For store instructions (STA), the final cycle is a write instead of a read.

- **Cycle 1:** Opcode fetch from PC (read).
- **Cycle 2:** Read operand (zero-page pointer) from PC+1.
- **Cycle 3:** Dummy read from zero page at (operand + X) & $FF (index added; this is an internal dummy/penalty cycle).
- **Cycle 4:** Read low byte of effective address from zero page at (operand + X) & $FF.
- **Cycle 5:** Read high byte of effective address from zero page at (operand + X + 1) & $FF (forms effective 16-bit address).
- **Cycle 6:** Final data cycle — read (for LDA/ADC/AND/EOR/CMP) or write (for STA).

Notes:
- Zero-page wrap-around applies to all zero-page pointer arithmetic ((operand + X) & $FF).
- The dummy read (cycle 3) is an internal bus read performed while the CPU calculates the pointer; it does not supply useful data for the instruction but is required for timing.
- The sequence above is the normal (non-RMW) variant; R-M-W instructions have different internal timing (see related references).

**RTS (Return from Subroutine) cycle description**

The RTS instruction retrieves the program counter (PC) from the stack and increments it to point to the instruction following the original JSR. This operation requires six cycles:

- **Cycle 1:** Fetch opcode (RTS) from PC.
- **Cycle 2:** Fetch next byte (unused) from PC+1.
- **Cycle 3:** Increment stack pointer (SP), dummy read from stack.
- **Cycle 4:** Read low byte of return address from stack at SP+1.
- **Cycle 5:** Read high byte of return address from stack at SP+2.
- **Cycle 6:** Increment PC to point to the instruction following the original JSR.

## Source Code

```text
Canonical (ZP,X) cycle table (memory-read instruction, 6 cycles):

Cycle  Address bus                    Data bus / action               R/W
1      PC                             Opcode fetch                    R
2      PC+1                           Operand (ZP pointer)            R
3      (operand + X) & $FF            Dummy read (zero-page)          R
4      (operand + X) & $FF            Read low byte of effective addr R
5      (operand + X + 1) & $FF        Read high byte of effective addr R
6      Effective 16-bit address       Final data read (or write for STA) R/W

(For STA, cycle 6 is a write instead of a read. All zero-page pointer math wraps at $FF.)
```

```text
RTS (Return from Subroutine) cycle table (6 cycles):

Cycle  Address bus                    Data bus / action               R/W
1      PC                             Opcode fetch (RTS)              R
2      PC+1                           Fetch next byte (unused)        R
3      SP                             Dummy read from stack           R
4      SP+1                           Read low byte of return address R
5      SP+2                           Read high byte of return address R
6      PC                             Increment PC to next instruction R
```

## References

- "zeropage_x_indexed_indirect_rmw_unintended" — expands on related R-M-W unintended variants and timing differences.

## Mnemonics
- ADC
- STA
- AND
- CMP
- EOR
- LDA
- RTS
