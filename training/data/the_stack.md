# The 6510 Stack (C64)

**Summary:** Describes the 6510 CPU stack located at $0100–$01FF (page one), how the stack grows downward, the stack pointer (S) semantics, and the implied-mode stack operations PHA/PLA/PHP/PLP.

## The Stack
The 6510 provides a 256-byte hardware stack in page one of memory: addresses $0100–$01FF. The stack is organized "backwards" (grows downward): the highest address ($01FF) is the first available stack position and the lowest ($0100) is the last. The stack pointer register (S) always points to the next available location in the stack.

Push operation:
- A push (PHA, PHP, or a hardware return) stores the value at the address pointed to by S, then decrements S (moves S downward).

Pop operation:
- A pull/pop (PLA, PLP, or a hardware RTI/RTS) increments S (moves S upward), then reads the byte at the address pointed to by S into the target register.

Practical summary of behavior:
- S points to next free byte.
- After pushing: stored at [S], then S = S - 1.
- After pulling: S = S + 1, then value = [S].

Example usage in high-level terms: BASIC's GOSUB pushes a return address onto the stack so RETURN can pull it back; assembler uses PHA/PLA to save/restore the accumulator and PHP/PLP to save/restore the status register.

## Source Code
```asm
; Example sequence (conceptual)
; Assume S points to $FF (first free stack address)
PHA         ; push A: store A -> $01FF, then S becomes $FE
PLA         ; pull A: S becomes $FF, then load A <- $01FF

PHP         ; push Processor Status: store P -> $01FF, then S = S - 1
PLP         ; pull Processor Status: S = S + 1, then P <- $01FF
```

```text
Stack page (summary)
$01FF  <- first/next-free (stack grows downward)
...
$0100  <- last stack byte (lowest address in stack page)
```

## Key Registers
- $0100-$01FF - 6510 - Stack page (256 bytes; grows downward; S points to next free location)

## References
- "machine_code_and_registers_overview" — expands on Stack pointer (S) among internal registers
- "implied_mode_and_register_notation" — explains PHA/PLA/PHP/PLP as implied-mode instructions

## Mnemonics
- PHA
- PLA
- PHP
- PLP
