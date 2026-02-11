# Tape routine — block complete exit ($FC57-$FC68)

**Summary:** Handles cassette block completion in C64 ROM: decrements copies remaining (DEC $00BE), stops the motor via JSR $FCCA if done, sets tape write leader count ($00A7 = #$50), prepares leader-vector index (LDX #$08), disables interrupts (SEI) and sets the tape vector (JSR $FCBD) before branching back to restore registers/exit ($BNE $FC54). Contains mnemonics DEC, BNE, JSR, LDA/STA, LDX, SEI.

## Description
This ROM fragment finishes a cassette read/write block and prepares for the next phase (or exit). Behavior, in sequence:

- DEC $00BE — decrement the copies-remaining counter (zero-page variable $BE).
- BNE $FC5E — if $BE is non-zero, branch to continue processing remaining copies; otherwise continue to stop the motor.
- JSR $FCCA — call ROM routine to stop the cassette motor (stop motor when no copies remain).
- LDA #$50 / STA $00A7 — set the tape write leader count to #$50 and store it in zero-page variable $A7 (leader length for writing).
- LDX #$08 — set X to #$08 to select the write-tape leader vector index.
- SEI — disable interrupts prior to changing the tape vector/IRQ state.
- JSR $FCBD — call ROM routine to set the tape vector (install the write/read tape ISR vector).
- BNE $FC54 — branch back to $FC54 to restore registers and exit the interrupt context (the branch target restores state and exits).

This fragment is reached from the start-cycle code (JMP $FC57) to finish block processing; see the referenced chunk for the larger start-cycle/IRQ flow.

## Source Code
```asm
.,FC57 C6 BE    DEC $BE         decrement copies remaining to read/write
.,FC59 D0 03    BNE $FC5E       branch if more to do
.,FC5B 20 CA FC JSR $FCCA       stop the cassette motor
.,FC5E A9 50    LDA #$50        set tape write leader count
.,FC60 85 A7    STA $A7         save tape write leader count
.,FC62 A2 08    LDX #$08        set index for write tape leader vector
.,FC64 78       SEI             disable the interrupts
.,FC65 20 BD FC JSR $FCBD       set the tape vector
.,FC68 D0 EA    BNE $FC54       restore registers and exit interrupt, branch always
```

## Key Registers
- $00BE - Zero Page (ROM variable) - copies remaining (decremented for block completion)
- $00A7 - Zero Page (ROM variable) - tape write leader count (set to #$50)
- $FCCA - ROM routine address - stop cassette motor
- $FCBD - ROM routine address - set tape vector / install tape ISR

## References
- "tape_write_irq_header_and_first_start_cycle" — expands on the block-complete jump (JMP $FC57) from the start-cycle code and the broader IRQ/start-cycle flow