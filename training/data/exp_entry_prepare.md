# EXP() entry sequence — ROM $BFED-$BFFD (convert AY, rounding, jump to $E000)

**Summary:** Disassembly of the Commodore 64 KERNAL/ROM entry sequence for EXP() at $BFED–$BFFD. Loads the 1/LOG(2) pointer ($BF in A/Y), calls the convert-AY routine ($BA28) to compute FAC1*(AY), applies rounding using the FAC1 rounding byte at $0070 with ADC #$50, optionally calls the round-FAC1 routine ($BC23), then JMPs to the EXP kernel continuation at $E000.

## Description
This small ROM fragment prepares FAC1 and then transfers control to the main EXP() kernel:

- $BFED-$BFF0: Load pointer bytes (A and Y set to #$BF) that select the 1/LOG(2) constant/table pointer used by the EXP implementation.
- $BFF1: JSR $BA28 — calls the convert-AY routine (comment: "do convert AY, FAC1*(AY)"). This routine converts the AY operand and multiplies FAC1 by AY (FAC1*(AY)); details live in the convert routine at $BA28.
- $BFF4: LDA $70 — fetch the FAC1 rounding byte from zero page $0070.
- $BFF6: ADC #$50 — add $50 (i.e., add 0x50/0x100) to the rounding byte to implement rounding bias.
- $BFF8: BCC $BFFD — if the add did NOT generate a carry, skip rounding (no change to FAC1).
- $BFFA: JSR $BC23 — if carry set, call the round-FAC1 routine unconditionally (round FAC1).
- $BFFD: JMP $E000 — continue with the EXP kernel/series evaluation and overflow handling at $E000.

Notes:
- The code uses zero page byte $0070 as the FAC1 rounding control byte.
- The ADC #$50 step implements the rounding bias (the source comments it as "+$50/$100").
- Calls to $BA28 and $BC23 are to ROM routines; their full behavior is in their respective disassemblies.

## Source Code
```asm
.,BFED A9 BF    LDA #$BF        set 1.443 pointer low byte
.,BFEF A0 BF    LDY #$BF        set 1.443 pointer high byte
.,BFF1 20 28 BA JSR $BA28       do convert AY, FCA1*(AY)
.,BFF4 A5 70    LDA $70         get FAC1 rounding byte
.,BFF6 69 50    ADC #$50        +$50/$100
.,BFF8 90 03    BCC $BFFD       skip rounding if no carry
.,BFFA 20 23 BC JSR $BC23       round FAC1 (no check)
.,BFFD 4C 00 E0 JMP $E000       continue EXP()
```

## Key Registers
- $BFED-$BFFD - KERNAL/ROM - EXP() entry/prepare sequence (load 1/LOG(2) pointer, convert AY, rounding, JMP to kernel)
- $BA28 - KERNAL/ROM - convert-AY routine (perform convert AY, FAC1*(AY))
- $BC23 - KERNAL/ROM - round FAC1 routine
- $E000 - KERNAL/ROM - EXP kernel continuation and overflow/series handling
- $0070 - Zero Page - FAC1 rounding byte (read by LDA $70 and used by ADC #$50)

## References
- "exp_constants_series_table" — expands on loads of the 1/LOG(2) pointer and series coefficient table usage
- "exp_kernel_continuation_and_overflow_handling" — continues the EXP computation at $E000 (series evaluation and overflow handling)