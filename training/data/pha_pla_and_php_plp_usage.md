# PHA/PLA and PHP/PLP — 6502 stack operations (C64)

**Summary:** PHA/PLA and PHP/PLP are 6502 stack instructions (push/pull A and processor status SR). Stack lives on page $01 ($0100-$01FF); in BASIC the stack pointer (SP) typically starts around $FA (first push → $01FA). Each PHA/PHP pushes one byte and decrements SP; each PLA/PLP pulls one byte and increments SP.

## Stack layout and BASIC notes
- The 6502 stack occupies $0100-$01FF (stack grows downward).
- In the Commodore BASIC environment the stack pointer usually starts near $FA; the first byte pushed will be stored at $01FA.
- BASIC signals "OUT OF MEMORY" if the stack pointer is driven below about $40 (i.e., using more than ~160 stack locations).
- Many programs can safely use the stack for temporary storage given the available space in BASIC.

## PHA and PLA (push/pull accumulator A)
- PHA stores the current A register value onto the stack at address $0100 + SP, then decrements SP by one.
- PLA increments SP by one, then pulls the byte from $0100 + SP into A.
- Example: if A = #$05 and SP = $F3:
  - PHA → memory[$01F3] = #$05; SP becomes $F2.
  - Later, PLA → SP becomes $F3; A ← memory[$01F3] (#$05).
- Use cases: temporarily save A when you must load A for another operation (printing, indexing, etc.) without clobbering other registers.

## PHP and PLP (push/pull processor status)
- PHP pushes the processor status register (SR) onto the stack (one byte) and decrements SP.
- PLP pulls one byte from the stack into SR and increments SP.
- Typical use: save condition flags now and restore them later to defer action based on a test (e.g., save end-of-file condition, handle current record, then restore flags to decide closing/summary actions).
- Both PHP and PLP operate on a single stack byte (affect SP by one).

## Other stack considerations
- PHA and PHP each place exactly one byte on the stack; PLA and PLP each remove exactly one byte.
- The source notes there are other 6502 instructions that push or pull multiple bytes (e.g., JSR/RTS, BRK pushes/pops return addresses and status), but those are not expanded here.

## Key Registers
- $0100-$01FF - 6502 - Stack page (grows downward); SP points to low byte within this page

## References
- "stack_overview" — general stack behavior and best practices

## Mnemonics
- PHA
- PLA
- PHP
- PLP
