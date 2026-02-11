# MACHINE - Stack basics (page 1: $0100-$01FF)

**Summary:** 6502 stack uses LIFO discipline in page 1 ($0100-$01FF); the Stack Pointer (SP) holds the offset so a push stores to $0100+SP then SP decrements. Leave the stack as you found it; in BASIC SP typically starts near $FA and values below $40 indicate trouble.

## Stack overview
The processor stack is page 1 ($0100-$01FF) and implements a last-in, first-out (LIFO) temporary store. The Stack Pointer (SP) contains an 8-bit offset; stack accesses are at address $0100 + SP.

- Push sequence (behavior described here): an item is written to $0100+SP, then the SP is decremented (the pointer moves "down" as the stack fills).
- Pull sequence: as items are removed, the SP is incremented (the pointer moves "up" as the stack empties).
- Example: if SP = $F8, the next byte pushed will be stored at $01F8; immediately after pushing the SP will become $F7. With SP = $F8, the next byte pulled will come from $01F9 (see diagram).

Operational rules and caveats:
- Always "leave these premises as clean as when you found them": if you push N items, ensure you pull N items before returning or branching away.
- The 650x hardware does not prevent stack overruns/underruns: SP wraps inside page 1. If SP underflows past $00 it wraps to $FF and continues; similarly pulling past $FF wraps into $00. The CPU will happily perform these wraps — it's the programmer's responsibility to avoid corrupting data.
- Typical BASIC environment: SP starts around $FA; sustained SP values below ~$40 are a strong indication of stack corruption or runaway pushes.

## Source Code
```text
    SP
    +----+              +------+
    | F8 |-------.      | USED | 01FF
    +----+       |      +------+
                 |      | USED | 01FE
                 |      +------+
                 |      | USED | 01FD
                 |      +------+
                 |      | USED | 01FC
                 |      +------+
                 |      | USED | 01FB
                 |      +------+
                 |      | USED | 01FA
                 |      +------+
                 |      | USED | 01F9
                 |      +------+
                 `----->| FREE | 01F8
                        +------+
    NEXT ITEM           |      |
    PUSHED WILL GO      :      :
    TO ADDRESS $01F8    .      .

    NEXT ITEM
    PULLED WILL COME
    FROM ADDRESS $01F9

    Figure 7.1
```

## Key Registers
- $0100-$01FF - Stack page (page 1) - LIFO stack memory used by 6502; SP holds 8-bit offset (push stores to $0100+SP then SP--, pulls reverse).

## References
- "pha_pla_and_php_plp_usage" — expands on PHA/PLA and PHP/PLP push/pop behaviour for A and processor status
- "jsr_rts_stack_return_behavior" — expands on JSR/RTS pushing return address and stack-return semantics