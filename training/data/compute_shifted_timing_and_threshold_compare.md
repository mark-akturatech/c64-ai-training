# Tape Timing Scale & Threshold Compare (ROM $F953–$F960)

**Summary:** 6502 assembly at $F953–$F960 scales a measured two-byte timing value (($FFFF - T2C) >> 2) by shifting it right twice, stores the low byte in $B1, computes a threshold as $B0 + $3C, and branches to $F9AC if the measured (scaled) value is less than or equal to the threshold (short-pulse path). Searchable terms: $F953, $F960, $B0, $B1, ($FFFF - T2C) >> 2, BCS $F9AC.

**Overview**

This code performs a 16-bit right shift by 2 on the inverted T2C timer value and then compares the scaled result to a threshold derived from the "min" timing constant plus $3C. The routine expects the two-byte value to be present as: A = $FF - T2C_h and $B1 = $FF - T2C_l before the first LSR/ROR pair. After two shifts, the scaled low byte remains in $B1. The threshold is computed into A as LDA $B0; CLC; ADC #$3C; and then compared to $B1 with CMP; BCS $F9AC handles short pulses.

**Detailed Behavior**

- The 16-bit value being shifted is the bitwise inverse of the T2C timer ($FFFF - T2C). The code shifts this 16-bit value right twice (divide by 4) using two LSR (on A) / ROR (on $B1) sequences to propagate carries between high and low bytes.
- After the two shifts, $B1 contains the low byte of the scaled result (($FFFF - T2C) >> 2). The high byte in A is overwritten afterward.
- The threshold is computed as the "min" timing constant in zero page $B0 plus $3C (constant $3C added with CLC).
- CMP $B1 compares the computed threshold (in A) with the scaled measured value (in $B1). BCS $F9AC branches if threshold >= measured (i.e., measured is short or equal), transferring control to the short-pulse handler.
- Intermediate result: $B1 is left holding the scaled measurement low byte for subsequent use.

## Source Code

```asm
.,F953 4A       LSR             ; A = ($FF - T2C_h) >> 1
.,F954 66 B1    ROR $B1         ; $B1 = ($FF - T2C_l) >> 1
.,F956 4A       LSR             ; A = ($FF - T2C_h) >> 2
.,F957 66 B1    ROR $B1         ; $B1 = ($FF - T2C_l) >> 2
.,F959 A5 B0    LDA $B0         ; Load tape timing constant min byte
.,F95B 18       CLC             ; Clear carry for addition
.,F95C 69 3C    ADC #$3C        ; Add $3C to min byte
.,F95E C5 B1    CMP $B1         ; Compare with scaled measured value
.,F960 B0 4A    BCS $F9AC       ; Branch if min + $3C >= scaled value
```

## Key Registers

- **$B0**: Zero page; tape timing constant "min" byte.
- **$B1**: Zero page; temporary storage for scaled measured timing low byte (($FFFF - T2C) >> 2).

## References

- "cassette_pulse_types_and_loader_overview" — expands on uses the timing difference concept described in the overview.
- "pulse_classification_and_store_character_calls" — expands on continues to classify pulses as B/C/D and possibly store bytes.