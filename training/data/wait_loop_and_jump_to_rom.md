# Synchronization loop and final transfer to ROM ($0003, $C194)

**Summary:** Small 6502 assembly sequence that writes #$E0 to zero page $0003, polls the flag at $0003 with LDA/BMI as a WAIT loop, and finally JMPs to ROM address $C194; searchable terms: $0003, $C194, LDA, STA, BMI, JMP, polling loop.

**Description**
This code implements a simple synchronization/wait loop:

- Store the immediate byte #$E0 into zero page location $0003.
- Repeatedly load $0003 and execute BMI WAIT to loop while the Negative flag is set (BMI branches when bit7=1).
- When the wait condition clears (value at $0003 has bit7 clear), execution continues with a JMP to absolute ROM address $C194 (final transfer of control to a ROM-based routine).

(Short note: BMI branches if the Negative flag is set — negative = bit7 = 1.)

## Source Code
```asm
        ; Write initial flag value
        LDA #$E0
        STA $03

WAIT:   LDA $03
        BMI WAIT        ; loop while negative (bit7) is set

        JMP $C194       ; transfer control to ROM routine at $C194
```

## Key Registers
- $0003 - Zero Page - synchronization flag polled by WAIT loop; initially written with #$E0
- $C194 - ROM (KERNAL) - final JMP destination for ROM-based routine

## References
- "build_jump_loader_code_in_buffer" — expands on uses of the loader/jump bytes prepared in the buffer
- "compute_header_checksum_and_verify" — expands on sequence that depends on a valid header/checksum before final jump