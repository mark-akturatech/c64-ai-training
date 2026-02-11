# Tape pulse classification and EOI handling (ROM F962–F988)

**Summary:** Disassembly of C64 ROM code at $F962–$F988 that checks the "byte received" flag ($9C), the EOI flag ($A3), and classifies a measured pulse/timing (accumulator holds the computed timing) into short/medium/long ranges by adding offsets (#$30, #$26, #$2C) to the min timing ($B0) and comparing with the max timing ($B1). Branch targets: store routine $FA60, EOI handler $FA10, and range handlers at $F993/$F997/$F98B.

## Description
- Entry conditions
  - The accumulator is expected to contain a computed timing/threshold value produced earlier (see "compute_shifted_timing_and_threshold_compare").
  - This block first tests whether a full byte has already been received by loading $9C into X and branching on zero/ non-zero.
- Byte-received check
  - LDX $9C; BEQ $F969
    - If $9C != 0 (X != 0) the code jumps to $FA60 (store the tape character) via JMP $FA60 at $F966.
- EOI (End Of Information) check
  - LDX $A3; BMI $F988
    - LDX sets the N flag from the loaded byte; BMI branches if bit7 of $A3 is set (signed negative), i.e. EOI indicator present. If BMI is taken control flows to $F988 which JMPs $FA10 (EOI handler).
- Pulse-length classification
  - After the EOI test the code sets X = 0 (LDX #$00) and performs a sequence of ADC/CMP pairs to classify the timing:
    - Add #$30 then add $B0; compare with $B1. If A >= $B1 branch to $F993.
    - If not, INX (sets X = 1), add #$26 then add $B0; compare with $B1. If A >= $B1 branch to $F997.
    - If still not, add #$2C then add $B0; compare with $B1. If A < $B1 branch to $F98B; otherwise fall through to $F988 (which JMPs $FA10).
  - Effectively three threshold checks are performed by offsetting the min timing ($B0) with the constants #$30, #$26, #$2C and comparing to the max timing ($B1). Branches transfer control to the appropriate handler for the detected range.
- Notes on flag/register usage
  - LDX is used to test flags because it updates Z and N; BEQ/BMI use those flags.
  - ADC/CMP operate on the accumulator — the accumulator must contain the base timing from earlier code for these comparisons to be meaningful (see referenced chunk).
- Control-flow targets from this snippet
  - $FA60 — store the tape character (entered if $9C != 0)
  - $FA10 — EOI handler (entered either via BMI on $A3 or via fall-through after final compare)
  - $F993, $F997, $F98B — handlers for the three pulse-length classifications

## Source Code
```asm
.,F962 A6 9C    LDX $9C         ; get byte received flag
.,F964 F0 03    BEQ $F969       ; if zero, continue; else branch to store
.,F966 4C 60 FA JMP $FA60       ; store the tape character
.,F969 A6 A3    LDX $A3         ; get EOI flag byte
.,F96B 30 1B    BMI $F988       ; if negative (bit7 set) -> EOI handler
.,F96D A2 00    LDX #$00
.,F96F 69 30    ADC #$30        ; add offset #$30
.,F971 65 B0    ADC $B0         ; add tape timing constant min byte
.,F973 C5 B1    CMP $B1         ; compare with tape timing constant max byte
.,F975 B0 1C    BCS $F993       ; if >= -> branch to handler
.,F977 E8       INX
.,F978 69 26    ADC #$26        ; add offset #$26
.,F97A 65 B0    ADC $B0         ; add min
.,F97C C5 B1    CMP $B1         ; compare max
.,F97E B0 17    BCS $F997       ; if >= -> branch to handler
.,F980 69 2C    ADC #$2C        ; add offset #$2C
.,F982 65 B0    ADC $B0         ; add min
.,F984 C5 B1    CMP $B1         ; compare max
.,F986 90 03    BCC $F98B       ; if < -> branch to handler
.,F988 4C 10 FA JMP $FA10       ; EOI / default handler
```

## References
- "compute_shifted_timing_and_threshold_compare" — expands how the computed timing in A is produced and how thresholds are prepared before this block
- "bit_count_handling_phase_toggle_and_timing_adjust" — expands what happens after a pulse is classified (bit counters, phase toggling, timing adjustments)
