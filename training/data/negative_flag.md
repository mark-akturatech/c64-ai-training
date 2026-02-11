# 6502 Negative Flag (N)

**Summary:** The Negative flag (N) is bit 7 of the 6502 processor status register P; it is set when the most-significant bit (bit 7) of the last operation's 8-bit result is 1, indicating a negative value in two's-complement representation. Searches: 6502, status register P, N flag, bit 7, BMI/BPL.

## Behavior
- The N flag mirrors the MSB (bit 7) of the 8-bit result produced by an instruction: if result & 0x80 != 0 then N = 1, otherwise N = 0 (two's-complement sign bit).
- N is updated by most instructions that produce or load an 8-bit result (arithmetic, logical, loads, increments/decrements, shifts/rotates, comparisons, and certain transfers). It is not directly set/cleared by single-bit flag instructions (there is no explicit "SET N" / "CLR N" instruction); it can be restored indirectly via PLP/RTI which pull the whole status byte from the stack.
- Branches using N:
  - BMI — branch if N = 1 (negative)
  - BPL — branch if N = 0 (positive or zero)

## Affected instructions (summary)
- Arithmetic / logical: ADC, SBC, AND, EOR, ORA — N set from 8-bit result.
- Loads: LDA, LDX, LDY, PLA — N set from loaded value.
- Transfers that set flags: TAX, TAY, TXA, TYA, TSX — these set N from the transferred value. (TXS does NOT affect flags.)
- Increments / decrements: INC, INX, INY, DEC, DEX, DEY — N set from result.
- Shifts / rotates: ASL, LSR, ROL, ROR — N set from result's bit 7 (LSR always clears N because MSB becomes 0).
- Comparisons: CMP, CPX, CPY — N reflects the MSB of the internal subtraction (A - M), i.e., the high bit of the 8-bit result.
- BIT: sets N from bit 7 of the memory operand (not from accumulator).
- Stack/flag restore: PLP and RTI restore the N bit as part of the saved P byte.

## Implementation notes
- N reflects the low 8-bit result only; it does not encode full signed overflow (that's the V flag). For signed-overflow detection use V in combination with N.
- Decimal mode (ADC/SBC with D flag set) does not change the rule: N is taken from the final 8-bit result presented to the status logic.
- Status register bit layout (for reference): P bits 7..0 = N V - B D I Z C (N at bit 7).

## References
- "processor_status_register" — full layout and description of P (contains N bit)

## Mnemonics
- BMI
- BPL
- ADC
- SBC
- LDA
- TAX
- BIT
- PLP
