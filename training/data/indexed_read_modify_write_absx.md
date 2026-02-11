# NMOS 6510 — Absolute,X Read-Modify-Write (RMW) timing and dummy-fetch behavior

**Summary:** Describes the per-cycle sequence for Absolute,X (abs,X) indexed read-modify-write (R-M-W) instructions on the NMOS 6510 / 6502: opcode & address fetches, the dummy fetch from the target address before the high byte is corrected on a page-cross, the unmodified data write-back, and the final write of modified data. Searchable terms: abs,X, R-M-W, dummy fetch, unmodified write-back, ASL/DEC/INC/LSR/ROL/ROR, illegal ops (DCP/ISC/SLO/SRE/RRA/RLA).

## Behavior and timing summary
For Absolute,X (abs,X) RMW addressing (and matching illegal/unintended opcodes that use the same timing), the CPU performs these high-level steps:

- Cycle 1: Opcode fetch (from PC). Read.
- Cycle 2: Fetch absolute address low byte (AAL). Read.
- Cycle 3: Fetch absolute address high byte (AAH). Read.
- Cycle 4: Dummy read from address computed using the original high byte and (AAL + X) — i.e., <AAH, AAL+X> — this occurs before the CPU corrects the high byte if AAL+X crossed a page boundary. This is the "dummy fetch" that sees the wrong page when a page-cross occurs. Read.
- Cycle 5: Read the old data from the (corrected) effective address (AA + X). Read.
- Cycle 6: Write back the unmodified old data to the effective address (unmodified data write-back). Write.
- Cycle 7: Write the new (modified) data to the effective address. Write.

Key semantics to preserve:
- The dummy fetch (cycle 4) happens before the high-byte correction on a page-cross; it accesses <AAH, AAL+X> (original high byte). Software observing bus values can see this spurious read from the wrong page.
- The CPU writes back the unmodified data (cycle 6) before writing the modified result (cycle 7). That means a memory device sees an intermediate write of the original value during RMW.
- These cycles and semantics apply to official RMW instructions (ASL, LSR, ROL, ROR, INC, DEC on abs,X) and to several illegal/unintended opcodes that share the same timing.

## Source Code
```text
Per-cycle sequence (abs,X R-M-W, page-cross case shown):

Cycle | Address Bus           | Data/Description                                | R/W
1     | PC                    | Opcode fetch                                    | R
2     | PC + 1                | Absolute Address Low (AAL)                      | R
3     | PC + 2                | Absolute Address High (AAH)                     | R
4 (*1)| <AAH, AAL + X>        | Dummy fetch: byte at target address before the high byte was corrected | R
5     | AA + X                | Old Data (effective address after high-byte correction) | R
6 (*2)| AA + X                | Old Data (written back unmodified)              | W
7     | AA + X                | New Data (final modified value)                 | W

(*1) Dummy fetch from target address before the high byte was incremented/corrected on page-cross.
(*2) Unmodified data is written back to the target address prior to final write.

Simulation Link:
http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=22&d=a0d0db10eaeaeaeaeaeaeaeaeaeaeaea1280

Examples / related R-M-W forms (Zero Page,X examples listed in source):
ASL zp,X
RRA zp,X
DCP zp,X
SLO zp,X
DEC zp,X
SRE zp,X
INC zp,X
ISC zp,X
LSR zp,X
RLA zp,X

Additional info: search for "unintended_addressing_modes_absolute_x_rmw" (discusses unintended/illegal abs,X R-M-W opcodes using same timing)
```

## References
- (none)

## Mnemonics
- ASL
- LSR
- ROL
- ROR
- INC
- DEC
- DCP
- ISC
- SLO
- SRE
- RRA
- RLA
