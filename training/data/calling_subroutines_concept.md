# MACHINE — JSR and RTS (calling machine-language subroutines)

**Summary:** Explains 6502/C64 machine-language subroutine calls using JSR and RTS: how the program counter (PC) changes, the 3-byte length of JSR, example address behavior ($033C → JSR $1234 → return to $033F), and nesting of subroutines (analogous to BASIC GOSUB/RETURN).

## Subroutine mechanism
A machine-language subroutine is invoked with JSR (Jump to Subroutine) and terminated with RTS (Return from Subroutine). When the CPU executes JSR to a target address it transfers control to that address and begins executing instructions there. Execution continues until an RTS is encountered; at that point the processor resumes execution at the instruction immediately following the original JSR.

Important behavioral details preserved from the source:
- JSR is three bytes long (opcode + 16-bit address). The return point is the address of the instruction following those three bytes.
- Example from source: if a JSR $1234 is encoded at $033C, execution jumps to $1234. When the subroutine executes RTS, control returns to $033F (the next instruction after the 3-byte JSR at $033C).
- Subroutines may be nested: a subroutine can JSR to another subroutine, and that one can JSR to another, etc. (Deeper details of stack usage and return-address storage are referenced for later discussion in the source.)

Analogy: This mechanism corresponds to BASIC's GOSUB/RETURN (call and resume at the next statement).

## References
- "chapter2_overview_and_toc" — expands on chapter topics and context
- "prewritten_kernal_subroutines" — expands on calls to ROM 'kernal' subroutines described next

## Mnemonics
- JSR
- RTS
