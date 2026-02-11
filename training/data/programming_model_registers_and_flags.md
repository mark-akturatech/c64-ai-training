# MACHINE — 6502 Programming Model: Processor Registers and Status Register (Figure A.1)

**Summary:** Describes the 6502/C64 processor registers: 8-bit Accumulator (A), 8-bit index registers (X, Y), 16-bit Program Counter (PC as PCH/PCL), 8-bit Stack Pointer format (leading '1' then S), and the Processor Status register P with bit order N V - B D I Z C and per-flag meanings.

## Programming Model
Concise descriptions of each CPU register (diagram and full bit meanings are in the Source Code section):

- Accumulator (A): 8-bit primary arithmetic/logic register used by most instructions.
- Index registers (X, Y): 8-bit registers used for indexing, addressing, and loop counters.
- Program Counter (PC): 16-bit register shown as PCH/PCL holding the next instruction address.
- Stack Pointer (S): 8-bit stack pointer shown with a leading '1' then S (stack page is $01xx on the 6502).
- Processor Status (P): 8-bit flags register with bit order N V - B D I Z C (Negative, Overflow, unused, Break, Decimal, IRQ Disable, Zero, Carry). See Source Code for the bit diagram and per-flag meanings.

## Source Code
```text
Programming Model
-----------------

                   7             0
                  +---------------+
                  |       A       |  ACCUMULATOR                  "A"
                  +---------------+

                   7             0
                  +---------------+
                  |       X       |  INDEX REGISTER               "X"
                  +---------------+

                   7             0
                  +---------------+
                  |       Y       |  INDEX REGISTER               "Y"
                  +---------------+

   15            8 7             0
  +---------------+---------------+
  |      PCH      |      PCL      |  PROGRAM COUNTER              "PC"
  +---------------+---------------+

                 8 7             0
                +-+---------------+
                |1|       S       |  STACK POINTER                "S"
                +-+---------------+

                   7 6 5 4 3 2 1 0
                  +---------------+
                  |N V   B D I Z C|  PROCESSOR STATUS REGISTER    "P"
                  +---------------+
                   | |   | | | | |
                   | |   | | | | |
                   | |   | | | | `---> CARRY         1 = TRUE
                   | |   | | | |
                   | |   | | | `-----> ZERO          1 = RESULT ZERO
                   | |   | | |
                   | |   | | `-------> IRQ DISABLE   1 = DISABLE
                   | |   | |
                   | |   | `---------> DECIMAL MODE  1 = TRUE
                   | |   |
                   | |   `-----------> BRK COMMAND
                   | |
                   | `---------------> OVERFLOW      1 = TRUE
                   |
                   `-----------------> NEGATIVE      1 = NEGATIVE

  Figure A.1
```

## References
- "instruction_mnemonics_reference" — instruction set behavior that depends on registers and flags (A, X, Y, PC, S, P)
