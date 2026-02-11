# Shift FAC1 right (ROM $BCBB-$BCCB)

**Summary:** ROM routine at $BCBB shifts the FAC1 floating-point accumulator right by A times (byte/bit-wise). Touches zero-page FAC1 bytes $62 (mantissa low), $66 (sign), $68 (overflow), and calls subroutine $B9B0 to perform the variable-length right shifts.

## Operation
This routine performs an A-bit right shift of FAC1 (floating-point accumulator 1) by:
- Copying the shift count (A) into Y (TAY).
- Reading FAC1 sign byte at $66 and masking bit 7 (AND #$80).
- Shifting the low mantissa byte at $62 one bit right (LSR $62).
- OR'ing the masked sign into the shifted mantissa byte so the sign propagates into bit 7 (ORA $62), then saving it back to $62.
- Calling a variable-shift routine at $B9B0 which performs Y right-shifts on the full FAC1 mantissa (presumably shifting across multiple FAC1 bytes).
- After returning, storing Y into $68 (STY $68) — per source this clears the FAC1 overflow byte (the variable-shift routine leaves Y in the value needed to clear overflow).

Behavior notes preserved from source:
- The sign bit is isolated from $66 (mask #$80) and OR'd into the high bit of the shifted mantissa low byte to maintain sign-extension behavior during the first single-bit shift.
- The full multi-byte right-shift loop is implemented in the separate routine at $B9B0; this entry performs setup and cleanup only.

## Source Code
```asm
;                                *** shift FAC1 A times right
.,BCBB A8       TAY             copy shift count
.,BCBC A5 66    LDA $66         get FAC1 sign (b7)
.,BCBE 29 80    AND #$80        mask sign bit only (x000 0000)
.,BCC0 46 62    LSR $62         shift FAC1 mantissa 1
.,BCC2 05 62    ORA $62         OR sign in b7 FAC1 mantissa 1
.,BCC4 85 62    STA $62         save FAC1 mantissa 1
.,BCC6 20 B0 B9 JSR $B9B0       shift FAC1 Y times right
.,BCC9 84 68    STY $68         clear FAC1 overflow byte
.,BCCB 60       RTS
```

## Key Registers
- $0062 - RAM (zero page) - FAC1 mantissa byte 1 (low-order mantissa byte)
- $0066 - RAM (zero page) - FAC1 sign byte (bit 7 holds sign)
- $0068 - RAM (zero page) - FAC1 overflow byte (cleared by STY)
- $BCBB-$BCCB - ROM - Entry/exit of FAC1 right-shift routine (calls $B9B0)
- $B9B0 - ROM - Variable-shift routine used to perform Y right-shifts on FAC1 mantissa

## References
- "convert_fac1_floating_to_fixed" — expands on how this routine is invoked to align fixed integer conversion
- "int_fac1_truncate_fractional" — shows INT() usage where shifting is used for truncation purposes