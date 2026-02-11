# MACHINE: Opcode values and assembled swap program

**Summary:** Lists 6502/C64 opcodes (LDA AD, LDX AE, LDY AC, BRK 00, STA 8D, STX 8E, STY 8C), shows the full assembled machine-code listing for a small swap program that exchanges bytes at $0380/$0381, and records the assembled program length (13 bytes).

## Opcode usage (brief)
This chunk supplies the opcode bytes used in the example and presents the final assembled machine-code for a program that:
- LDA $0380
- LDX $0381
- STA $0381
- STX $0380
- BRK

The left column in the listing is the object (machine) code bytes; the right column is the assembly/source code. "Assembly" is the translation of human-readable source into machine-code; "hand assembly" means that translation was performed manually using opcode tables.

**[Note: Source may contain an error — one occurrence lists AD 80 08 instead of AD 80 03 (byte for low address). The correct low byte for $0380 is 03; the assembled byte sequence below uses 03.]**

## Assembled program and length
- Final assembled byte sequence (correct): AD 80 03 AE 81 03 8D 81 03 8E 80 03 00
- Total length: 13 bytes (LDA 3 bytes, LDX 3 bytes, STA 3 bytes, STX 3 bytes, BRK 1 byte)
- The bytes must be placed into memory (monitor or loader) at a chosen start address; the example addresses are absolute ($0380/$0381 are the data locations referenced).

## Source Code
```text
; Opcode quick reference used in example
; LDA (absolute) - AD
; LDX (absolute) - AE
; LDY (absolute) - AC
; BRK           - 00
; STA (absolute) - 8D
; STX (absolute) - 8E
; STY (absolute) - 8C
```

```asm
; Left = object code bytes stored in memory
; Right = assembly/source (human-readable plan)

AD 80 03     LDA $0380
AE 81 03     LDX $0381
8D 81 03     STA $0381
8E 80 03     STX $0380
00           BRK
```

```text
; Single-line assembled program bytes (13 bytes)
AD 80 03 AE 81 03 8D 81 03 8E 80 03 00
```

## References
- "first_program_exchange_example" — expands on assembly source translated here  
- "entering_program_with_mlm" — explains methods to place these hex bytes into memory using a monitor

## Mnemonics
- LDA
- LDX
- LDY
- BRK
- STA
- STX
- STY
