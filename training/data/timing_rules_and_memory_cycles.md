# 6502 / C64 Timing Rules and Cycle Penalties

**Summary:** Rules of thumb for 6502 / Commodore timing: interrupts (~+10%), loop multiplicative counting, clock/memory cycle ~1 microsecond, instruction timing ≈ number of memory cycles fetched (minimum two), branch timing (taken 3 cycles, not taken 2), and page-cross penalties for indexed accesses and branches; special-case exceptions: shifts/rotates, INC/DEC, JSR/RTS.

## Timing rules
- Interrupts: If interrupts (IRQ/NMI) are enabled and routines can run, add roughly 10% to measured running time as a crude estimate of their effect.
- Loops: Count each instruction execution. An instruction inside a loop executed N times contributes N × (instruction time) to total time.
- Clock / memory cycle: Typical Commodore machines have a memory cycle ≈ 1 microsecond (1 μs); the exact value varies by model and region.
- Memory-cycle rule: For most instructions, execution time is determined by the number of memory cycles required to fetch the opcode and any operand bytes — count those cycles to estimate execution time.
- Minimum latency: No instruction executes in less than two cycles.
- Branches: Branch instructions differ by whether the branch is taken:
  - Branch not taken: 2 cycles
  - Branch taken: 3 cycles
  - Additional penalty: If a taken branch crosses a page boundary, add one extra cycle (example in source: branch from $0FE4 to $1023).
- Page-cross penalty: For indexed addressing modes (e.g., LDA $24E7,Y), if index addition crosses a page boundary (low byte overflows past $FF), add one extra cycle; the source example notes an extra cycle if Y ≥ $19 for that address (0x24E7 + 0x19 crosses from $24FF → $2500).
- Exceptions: Some instructions take longer than the simple memory-cycle count suggests — notably shift/rotate instructions (ASL, LSR, ROL, ROR), INC/DEC, and subroutine calls/returns (JSR/RTS).

## Examples
- LDA #$0D — two memory cycles total to fetch the instruction and immediate operand (therefore two cycles execution).
- LDA $0500,X — commonly quoted as four memory cycles: three cycles to fetch the instruction and operand bytes, plus one cycle to fetch the data from the addressed memory (page 5 in example).
- Indexed page-cross example: LDA $24E7,Y will incur an extra cycle if Y causes the effective address low byte to overflow ($E7 + Y > $FF), which is when Y ≥ $19 (0x19).

## Detailed timing
- For precise timing beyond these heuristics, consult instruction timing tables (cycle counts per addressing mode) — detailed tables give exact cycle counts including taken/untaken branch and page-cross penalties.

## References
- "timing_example_and_cycle_counting" — worked example expanding on counting cycles and applying these rules.

## Mnemonics
- LDA
- JSR
- RTS
- ASL
- LSR
- ROL
- ROR
- INC
- DEC
- BCC
- BCS
- BEQ
- BNE
- BMI
- BPL
- BVC
- BVS
