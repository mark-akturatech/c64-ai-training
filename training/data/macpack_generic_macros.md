# .MACPACK generic (ca65)

**Summary:** ca65 .MACPACK generic — predefined compact macros: add/sub (CLC/ADC, SEC/SBC), bge/blt/bgt/ble/bnz/bze branch macros, and use of .LOCAL for safe local labels.

**Description**
This .MACPACK provides compact, commonly useful assembler macros for arithmetic and conditional branching. Each macro takes a single parameter Arg (the branch target or operand) and expands to one or more 6502 instructions. The package is intended for concise source, not for providing long-branch plumbing (see macpack_longbranch for long-branch support).

Notable implementation details:
- add / sub wrap the carry setup (CLC/SEC) and use ADC/SBC so they perform add/sub without carry/borrow.
- Branch macros expand to a single branch instruction in most cases (bge -> BCS, blt -> BCC, bnz -> BNE, bze -> BEQ).
- bgt uses a local label via .LOCAL to implement "branch if greater-than" as a two-instruction sequence (BEQ L; BCS Arg; L:). The local label prevents collisions when the macro is used multiple times.
- ble expands to BEQ Arg followed by BCC Arg to implement "less-than or equal".
- Arg is the macro parameter and must be a valid branch target/operand in the calling scope.

## Source Code
```asm
        .macro  add     Arg     ; add without carry
                clc
                adc     Arg
        .endmacro

        .macro  sub     Arg     ; subtract without borrow
                sec
                sbc     Arg
        .endmacro

        .macro  bge     Arg     ; branch on greater-than or equal
                bcs     Arg
        .endmacro

        .macro  blt     Arg     ; branch on less-than
                bcc     Arg
        .endmacro

        .macro  bgt     Arg     ; branch on greater-than
                .local  L
                beq     L
                bcs     Arg
        L:
        .endmacro

        .macro  ble     Arg     ; branch on less-than or equal
                beq     Arg
                bcc     Arg
        .endmacro

        .macro  bnz     Arg     ; branch on not zero
                bne     Arg
        .endmacro

        .macro  bze     Arg     ; branch on zero
                beq     Arg
        .endmacro
```

## References
- "macpack_longbranch" — expands on another macpack providing long branches for conditional jumps
