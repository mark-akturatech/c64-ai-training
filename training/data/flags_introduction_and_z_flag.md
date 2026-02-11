# MACHINE — Flags (Z / zero-equals flag)

**Summary:** Describes 650x CPU status flags and how the Z (zero / equals) flag links instructions (CPX/CMP/COPY) across interrupts; includes which instructions set or do not affect Z and how BEQ/BNE test it.

## Flags
Flags are status bits in the 650x that record results of prior instructions so later instructions can test that result. Interrupt processing does not clear these flags; therefore an instruction that sets a flag (for example, a compare) can be tested by a later branch even if many interrupt-driven instructions have executed in between.

There are four commonly tested flags: Z, C, N, and V. Individual instructions either set, clear, or leave each flag unchanged — reference manuals list affected flags per opcode.

## Z Flag
- Purpose: Z is the "zero" flag (effectively an "equals" flag). It is set (1) when an operation produces a zero result or when a comparison finds equality; otherwise it is cleared (0).
- Instructions that affect Z:
  - Loads: LDA, LDX, LDY (loading #$00 sets Z; loading nonzero clears Z)
  - Increment/Decrement: INX, INY, INC, DEC
  - Arithmetic and logical operations: ADC, SBC, (and other arithmetic/logical ops that yield a zero result)
  - Compares: CMP, CPX, CPY (CP* sets Z if compared values are equal)
- Instructions that do NOT affect Z:
  - Stores: STA, STX, STY (stores never change flags)
  - Branches: BEQ, BNE, etc. (branches test flags but do not modify them)
- Branch behavior:
  - BEQ (branch if equal) branches when Z = 1.
  - BNE (branch if not equal) branches when Z = 0.
- Example usage pattern (from text): CPX #$06 sets Z if X==6; BNE tests Z and branches only if X != 6. This linking works across interrupts because the flag persists through interrupt processing.

## Source Code
```asm
; Example showing CPX/BNE linkage
    CPX #$06
    BNE $....
```

```asm
; Example showing load affecting Z, store not affecting Z
    LDA #$23    ; load 0x23 into A  -> Z = 0 (nonzero)
    LDX #$00    ; load 0x00 into X  -> Z = 1 (zero)
    STA $1234   ; store A to $1234   -> Z unchanged (remains 1)
    BEQ $....   ; branches because Z = 1
```

## References
- "chapter_overview_flags_logic_input" — chapter overview and logic input (flags context)
- "c_flag_description" — expands on the C flag and other testable flags
- "comparison_instructions_and_branch_usage" — expands on how CPX/CMP set Z for branches

## Mnemonics
- LDA
- LDX
- LDY
- INX
- INY
- INC
- DEC
- ADC
- SBC
- CMP
- CPX
- CPY
- STA
- STX
- STY
- BEQ
- BNE
