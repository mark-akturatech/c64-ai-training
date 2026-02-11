# LDA (Load Accumulator) — immediate and absolute encoding (6510 / 6502)

**Summary:** Shows 6510/6502 assembler mnemonic LDA, immediate mode (LDA #$05 → token $A9), absolute mode (LDA $102E → token $AD), and how multi-byte operands are encoded low-byte first; mentions BRK as an end/return to a monitor (64MON).

## LDA (Load the accumulator)
LDA is the three-letter assembler mnemonic that means "load the accumulator with...". The assembler converts mnemonics+operands into machine tokens (opcodes) and operand bytes.

- Immediate mode: a leading "#" before the operand indicates an immediate value (the value itself is encoded as the operand). Immediate LDA uses token $A9.
- Absolute mode: no "#" — the operand is a 16-bit memory address. Absolute LDA uses token $AD.
- Byte limits: a single byte can hold values 0..$FF (0..255). A 16-bit address does not fit in one byte and is therefore encoded as two bytes.
- Endianness: 6502/6510 encodes 16-bit addresses little-endian (low byte first, then high byte). So LDA $102E is encoded as the opcode token followed by $2E then $10.
- BRK: the BRK instruction can be used as a program terminator/return to a monitor; placing BRK at the end of a machine-language routine assembled/loaded with 64MON will return execution to 64MON when BRK is reached.

## Source Code
```asm
; Immediate example: load accumulator with literal $05
LDA #$05        ; assembled bytes: $A9 $05

; Absolute example: load accumulator with value at address $102E
LDA $102E       ; assembled bytes: $AD $2E $10

; Token summary (as shown above)
; $A9 = LDA (immediate)
; $AD = LDA (absolute)
```

## References
- "hex_notation_and_64mon_examples" — expands on Hex tokens and values used in instruction encoding
- "writing_machine_language_and_assemblers" — expands on Using 64MON to assemble and observe tokens/bytes
- "writing_your_first_program_example" — expands on Using these instructions in a simple program example

## Mnemonics
- LDA
