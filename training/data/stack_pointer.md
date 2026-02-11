# 6502 Stack Pointer (S) and Stack Page ($0100–$01FF)

**Summary:** The 6502 Stack Pointer (S) is an 8-bit CPU register holding the least-significant byte of the next free stack location; the hardware stack is fixed to page 1 at $0100–$01FF, starts at $01FF and grows downward. Push operations decrement S, pop operations increment S, and the CPU provides no hardware overflow detection.

## Stack Pointer (S)
The 6502 stack occupies the fixed memory page $0100–$01FF (page 1). The Stack Pointer (S) is an 8-bit internal register that contains the low byte of the address of the next free byte on the stack; because the stack is fixed to page 1, S alone addresses the stack (effective address = $0100 + S).

Behavioral details:
- Stack limits: $0100 (low) through $01FF (high). The stack starts logically at $01FF and grows downward as values are pushed.
- S semantics: S holds the least-significant byte of the next free stack location. The stack cannot be relocated to another page.
- Push: when a byte is pushed, the processor decrements S then writes to $0100 + S.
- Pop: when a byte is popped, the processor reads from $0100 + S then increments S.
- Overflow/underflow: the 6502 does not detect stack overflow or underflow; it is the programmer's responsibility to avoid excessive stack use and to ensure S remains within $00–$FF mapped to $0100–$01FF.

## Key Registers
- $0100-$01FF - System - Stack page (fixed system stack memory, page 1; stack starts at $01FF and grows downward)
- S - 6502 CPU - Stack Pointer (8-bit register; holds low byte of next free stack address)

## References
- "stack_page" — expands on fixed stack location on page 1 ($0100–$01FF)

## Labels
- S
