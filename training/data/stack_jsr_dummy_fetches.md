# NMOS 6510 — JSR (absolute) cycle behaviour

**Summary:** JSR (absolute) on the NMOS 6510/6502 takes 6 clock cycles: opcode fetch, two operand reads (low/high), two stack writes that push the return address (PC-1) high then low, and a final read from the target PC. Covers opcode/operand fetches, dummy/final reads, and the exact order of stack pushes (return address = PC of next instruction minus one).

**Cycle-by-cycle description**
JSR absolute is a 6-cycle instruction. The processor computes the effective (target) address from the two operand bytes fetched in cycles 2–3, pushes the return address (the address of the last byte of the JSR — i.e. the next-instruction PC minus one) onto the hardware stack (high byte first, then low byte), and finally performs a read at the newly set PC (a final dummy/read cycle).

Key behavioral points:
- The value pushed to the stack is (PC_after_operand_fetch − 1) — the address of the last byte of the JSR instruction. This is intentional because RTS pulls that word and increments it to return to the correct address.
- Push order: high byte first, then low byte.
- Stack writes use $0100 + S as the write address; each push writes at the current $0100+S and then the S register is decremented.
- The final cycle is a read from the new PC (the target address) — effectively a dummy/fetch cycle before execution continues at the target.

## Source Code
```text
6502 / 6510 JSR (absolute) — 6-cycle timing (NMOS)

Cycle | Address bus         | Data bus / value                    | R/W | Comment
------+---------------------+-------------------------------------+-----+-------------------------------------------------------
1     | PC                  | opcode ($20)                        | R   | Opcode fetch; PC -> PC+1
2     | PC (low operand)    | low byte of target (operand low)    | R   | Fetch operand low; PC -> PC+1  (*1)
3     | PC (high operand)   | high byte of target (operand high)  | R   | Fetch operand high; PC -> PC+1 (*2)
4     | $0100 + S           | PCH = high byte of (PC_after - 1)   | W   | Push return-address high; write then S <- S - 1
5     | $0100 + S           | PCL = low byte of (PC_after - 1)    | W   | Push return-address low; write then S <- S - 1
6     | target address      | byte at target (dummy/fetch)        | R   | Final read from new PC (enters target)     (*3)

Notes / footnotes:
(*1) operand low = memory[old PC + 1] — this is the low byte of the absolute target.
(*2) operand high = memory[old PC + 2] — high byte of the absolute target.
(*3) final read is from the target address (the processor performs a read at the new PC before executing).
```

## References
- "stack_rts_dummy_fetches" — expands on RTS stack behaviour and comparison of dummy fetches during stack operations

## Mnemonics
- JSR
