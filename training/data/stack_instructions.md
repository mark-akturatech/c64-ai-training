# 6502 Stack Instructions — TSX, TXS, PHA, PHP, PLA, PLP

**Summary:** 6502 stack instructions: TSX ($BA), TXS ($9A), PHA ($48), PHP ($08), PLA ($68), PLP ($28). Describes opcodes, byte sizes, flag effects (N,Z, none, All), cycle timings, and stack semantics (stack page $0100, S 8-bit, push/pop sequencing).

**Overview**
This chunk documents the 6502 implied-mode instructions that read or modify the processor stack (stack pointer S, push/pull of A and P, and transfers between S and X). The 6502 stack resides at page $01: addresses $0100–$01FF. The stack pointer (S) is an 8-bit register; the effective memory address for stack accesses is $0100 + S.

Push/pop sequencing (behavior):
- Push (PHA, PHP): write value to address $0100 + S, then decrement S (S = S - 1).
- Pull (PLA, PLP): increment S (S = S + 1), then read value from address $0100 + S.
- Transfer (TSX, TXS):
  - TSX: X := S; sets Negative (N) and Zero (Z) from the result.
  - TXS: S := X; does not affect flags.

Behavior summaries per instruction:
- TSX ($BA): Transfer stack pointer to X. Implied mode. 1 byte. 2 cycles. Sets Negative (N) and Zero (Z) based on X after transfer.
- TXS ($9A): Transfer X to stack pointer. Implied mode. 1 byte. 2 cycles. Does not affect flags.
- PHA ($48): Push accumulator onto the stack. Implied mode. 1 byte. 3 cycles. (No flags affected by the instruction itself.)
- PHP ($08): Push processor status onto the stack. Implied mode. 1 byte. 3 cycles. (Pushes the whole status byte; exact pushed-value conventions for the Break/unused bits are detailed below.)
- PLA ($68): Pull accumulator from the stack. Implied mode. 1 byte. 4 cycles. Sets N and Z based on the loaded accumulator.
- PLP ($28): Pull processor status from the stack. Implied mode. 1 byte. 4 cycles. Loads all status flags from the pulled byte.

Notes:
- All six instructions are 1 byte in size.
- The stack pointer S is an 8-bit register; stack operations wrap within $0100–$01FF.
- **PHP and the Status Register Format:**
  - When executing PHP, the processor pushes the status register onto the stack. In this operation:
    - Bit 4 (Break flag, B) is set to 1.
    - Bit 5 (Unused) is set to 1.
  - This means the value pushed onto the stack has both bits 4 and 5 set to 1, regardless of their actual state in the status register.
  - When the status register is pulled from the stack (via PLP or RTI), bits 4 and 5 are ignored and do not affect the actual status register. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

## Source Code
```text
6502 Stack Instructions table
Mnemonic  Description                                Mode     Opcode  Bytes  Cycles  Flags affected
TSX       Transfer stack pointer to X               Implied  $BA     1      2       N,Z
TXS       Transfer X to stack pointer               Implied  $9A     1      2       none
PHA       Push accumulator on stack                 Implied  $48     1      3       none
PHP       Push processor status on stack            Implied  $08     1      3       none
PLA       Pull accumulator from stack               Implied  $68     1      4       N,Z
PLP       Pull processor status from stack          Implied  $28     1      4       All
```

## References
- "subroutine_interrupt_instructions" — expands on stack usage by JSR/RTS/BRK/RTI

## Mnemonics
- TSX
- TXS
- PHA
- PHP
- PLA
- PLP
