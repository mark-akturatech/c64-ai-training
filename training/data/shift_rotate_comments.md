# 6502 shift/rotate instructions — accumulator vs memory and flags

**Summary:** Describes 6502 shift/rotate instructions (LSR, ASL, ROL, ROR) behavior when applied to the A register versus memory, and how processor flags Z, N, and C are affected; clarifies the "logical" vs "arithmetic" terminology.

## Behavior
- Accumulator vs memory addressing: 6502 shift/rotate instructions can operate on the accumulator (implied addressing) or directly on memory (zero page/absolute). Assemblers and listings will often show the accumulator form explicitly (e.g., "LSR A") to distinguish it from a memory form (e.g., "LSR $1234").
- Flags when operating on memory: When a shift or rotate is performed on a memory location, the resulting memory byte determines the Z, N, and C flags:
  - Z is set if the resulting memory byte is zero.
  - N is set if the resulting memory byte has bit 7 = 1 (the high bit).
  - C captures the bit shifted out (standard carry behavior).
- Rotate/shift semantics: Bits move the same way regardless of whether an instruction is described as "logical" or "arithmetic." The logical/arithmetic distinction only refers to how signed values are interpreted:
  - "Logical" — interpretation that may discard sign (unsigned view).
  - "Arithmetic" — interpretation intended to preserve sign (signed view).
  (These are terminology differences; bit movement and flag effects follow the instruction definition.)

## References
- "right_shift_and_ror" — expands on effect on flags when shifting memory directly
- "left_shift_and_rol" — expands on ASL/ROL differences and memory operations

## Mnemonics
- LSR
- ASL
- ROL
- ROR
