# Decide write parameters and device-transfer setup (KERNAL, $FA8D-$FABE)

**Summary:** Handles the BVS (overflow) branch, tests zero-page counters $B5/$B6 and write flags in $A7 (LSR), uses $BD to choose a 4-bit mask or alternate limits, stores the computed write-count into $AA (or sets #$40/#$80), calls JSR $FB8E to prepare device transfer and initializes $AB; several branches return to the central exit ($FEBC) on abort conditions.

## Flow and behavior
- Entry at $FA8D: BVS $FAC0 — if the overflow flag is set execution jumps to $FAC0 (alternate path).
- $FA8F: BNE $FAA9 — if the prior zero flag is clear, branch ahead to the path that sets $AA directly (see $FAA9 onward).
- $FA91–$FA97: Load and test zero-page counters $B5 and $B6; if either is non-zero the routine branches back to the main abort/exit path ($FA8A).
- $FA99–$FA9B: Load $A7 and LSR it once — this inspects a write-flag bit by shifting $A7 right (affects Carry and Zero).
- $FA9C–$FAA3: Load $BD and run a small decision sequence that differentiates between two limit modes (one path applies a low-nibble mask, the other uses a larger fixed limit). The code tests $BD with BMI/BCC/BCS (branches depend on sign/carry state).
- $FAA5–$FAA7: In the masked path $BD selects, the code ANDs #$0F and stores the low nibble into $AA.
- $FAA9–$FAAB: DEC $AA; BNE $FA8A — decrement $AA and, if non-zero, branch back to exit/abort.
- $FAAD–$FAAF: Alternative path sets $AA = #$40 (when earlier tests take this branch).
- $FAB1: JSR $FB8E — call to prepare the device transfer (device setup routine).
- $FAB4–$FAB6: Clear $AB (store #$00 into $AB). Immediately afterward a BEQ $FA8A at $FAB8 uses the zero flag to possibly abort (this BEQ is testing the result of the JSR/other flags).
- $FABA–$FABE: Other alternative sets $AA = #$80 and further branches may return to $FA8A (abort/exit) depending on flags.

Behavioral summary: the code establishes how many bytes/units to write (value placed in $AA) by masking $BD or selecting fixed limits (#$40 or #$80), uses $A7 (after LSR) to inspect write flags, ensures counters $B5/$B6 are zero before proceeding, calls a device-setup subroutine at $FB8E, initializes $AB, and either continues to directory-entry processing or returns to the central abort/exit path ($FEBC / $FA8A) depending on tests.

## Source Code
```asm
.,FA8D 70 31    BVS $FAC0
.,FA8F D0 18    BNE $FAA9
.,FA91 A5 B5    LDA $B5
.,FA93 D0 F5    BNE $FA8A
.,FA95 A5 B6    LDA $B6
.,FA97 D0 F1    BNE $FA8A
.,FA99 A5 A7    LDA $A7
.,FA9B 4A       LSR
.,FA9C A5 BD    LDA $BD
.,FA9E 30 03    BMI $FAA3
.,FAA0 90 18    BCC $FABA
.,FAA2 18       CLC
.,FAA3 B0 15    BCS $FABA
.,FAA5 29 0F    AND #$0F
.,FAA7 85 AA    STA $AA
.,FAA9 C6 AA    DEC $AA
.,FAAB D0 DD    BNE $FA8A
.,FAAD A9 40    LDA #$40
.,FAAF 85 AA    STA $AA
.,FAB1 20 8E FB JSR $FB8E
.,FAB4 A9 00    LDA #$00
.,FAB6 85 AB    STA $AB
.,FAB8 F0 D0    BEQ $FA8A
.,FABA A9 80    LDA #$80
.,FABC 85 AA    STA $AA
.,FABE D0 CA    BNE $FA8A
```

## Key Registers
- $B5 - Zero Page - counter tested (must be zero to proceed)
- $B6 - Zero Page - counter tested (must be zero to proceed)
- $A7 - Zero Page - shifted (LSR) to examine write flags
- $BD - Zero Page - selector used to decide mask vs fixed-limit behavior
- $AA - Zero Page - computed write/count parameter (masked nibble or #$40/#$80)
- $AB - Zero Page - initialized to #$00 after device setup

## References
- "initial_device_setup_and_flag_tests" — follow-up branch when BIT $AA / BPL tested earlier redirects here
- "store_name_bytes_into_directory_buffer_and_update_counters" — continues after write parameters are decided and bytes are copied into the directory buffer

## Labels
- B5
- B6
- A7
- BD
- AA
- AB
