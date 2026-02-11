# 6502 System Stack (Page $0100–$01FF)

**Summary:** The 6502 reserves memory page $0100–$01FF as the system stack page; it is used for return addresses, interrupt context, and temporary storage and is fixed in place (cannot be relocated). Access is via the 8-bit stack pointer (S) which indexes this page.

## Description
The second page of zero page memory — addresses $0100 through $01FF — is dedicated to the 6502 hardware stack. The stack holds return addresses, pushed processor status/ registers for interrupts and subroutine calls, and other temporary values used by PHA/PLA, PHP/PLP, JSR/RTS, BRK/RTI and related instructions.

Key behavior and mechanics:
- The stack page is fixed at $0100–$01FF and cannot be moved.
- The stack pointer (S) is an 8-bit CPU register that provides an offset into that page. Effective stack address = $0100 + S.
- The stack grows downward in memory (toward lower addresses).
- Push and pull behavior (short):
  - Push operations (e.g., PHA, PHP) store to $0100+S then decrement S (next free offset moves down).
  - Pull operations (e.g., PLA, PLP) increment S then load from $0100+S.

This chunk intentionally describes the page and access mechanics; see the "stack_pointer" reference for fuller details on S register initialization, exact instruction micro-behavior, and reset values.

## Key Registers
- $0100-$01FF - 6502 - System stack page (fixed); accessed via 8-bit stack pointer (S)

## References
- "stack_pointer" — expands on stack pointer register behavior and stack mechanics
