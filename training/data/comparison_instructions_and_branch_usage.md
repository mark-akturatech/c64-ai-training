# CMP / CPX / CPY — comparing bytes and branch tests

**Summary:** CMP/CPX/CPY compare a register (A, X, or Y) with a memory or immediate byte and set flags (Z/C/N); follow with branch instructions BEQ, BNE, BCS, BCC to act on the result. Examples show combining branches for "less than or equal" and an optimized single-branch variant.

## A Note on Comparison
One operand of a compare must be in a CPU register (A, X, or Y); the other must be a memory operand or an immediate. Use the instruction matching the register:
- CMP — compares A with memory/immediate
- CPX — compares X with memory/immediate
- CPY — compares Y with memory/immediate

Compares set the Zero (Z), Carry (C), and Negative (N) flags. After a compare you may use branch instructions:
- BEQ — branch if equal (Z = 1)
- BNE — branch if not equal (Z = 0)
- BCS — branch if carry set (register ≥ operand, unsigned)
- BCC — branch if carry clear (register < operand, unsigned)

You may combine branch tests after one compare. To test "Y ≤ 5" you can do:
- CPY #$05
- BEQ target   ; branches if Y == 5
- BCC target   ; branches if Y < 5

This can be optimized using the observation "x ≤ 5" is equivalent to "x < 6":
- CPY #$06
- BCC target   ; branches if Y < 6, i.e., Y ≤ 5

Use common-sense arithmetic reasoning to transform <= tests into a single unsigned < test when appropriate.

## Source Code
```asm
; Example 1: explicit <= test using two branches (from source)
    CPY #$05
    BEQ LessOrEqual   ; branch if Y == 5
    BCC LessOrEqual   ; branch if Y < 5
    ; fallthrough if Y > 5

; Example 2: optimized single-branch version
    CPY #$06
    BCC LessOrEqual   ; branch if Y < 6  (equivalent to Y <= 5)

; Quick examples for other registers
    LDA #$10
    CMP $0200       ; compare A with memory at $0200
    BEQ EqualsMem

    LD X,#$03
    CPX #$05
    BCC X_is_less

; Immediate and memory forms are accepted by CMP/CPX/CPY:
; CMP #imm    CMP addr
; CPX #imm    CPX addr
; CPY #imm    CPY addr
```

## References
- "flag_summary_and_status_register_overview" — expands on which flags compares affect (Z/C/N)
- "flags_introduction_and_z_flag" — expands on Z flag behavior in compares

## Mnemonics
- CMP
- CPX
- CPY
- BEQ
- BNE
- BCS
- BCC
