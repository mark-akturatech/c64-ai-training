# RS-232 Receive the Next Bit (NMI) — $FED6

**Summary:** NMI subroutine at $FED6 invoked by the NMI RS-232 handler to sample the next RS-232 data bit and then call the timer-reload routine that schedules the next bit-period interrupt. Terms: $FED6, NMI, RS-232, timer reload, baud-rate table.

**Description**
This routine is the per-bit input handler for the RS-232 receive logic. When a bit period elapses, the NMI RS-232 handler transfers control here to:

- Read (sample) the next serial data bit from the RS-232 input.
- Call a subsequent subroutine to reload the hardware timer that will generate the next NMI after one bit period.

The entry address is $FED6 (decimal 65238). The timer reload values used by the called routine are derived from a baud-rate table (see referenced "rs232_baud_rate_tables_ntsc"). The NMI origin and higher-level RS-232 state machine are covered by the "nmi_rs232_handler" reference.

## Source Code
```assembly
FED6   AD 01 DD   LDA $DD01       ; Load CIA#2 Port A data register
FED9   29 01      AND #$01        ; Mask to isolate bit 0 (RS-232 input)
FEDB   85 A7      STA $A7         ; Store the sampled bit in zero-page location $A7
FEDD   20 1A FF   JSR $FF1A       ; Jump to timer-reload subroutine
FEE0   60         RTS             ; Return from subroutine
```

## Key Registers
- **$DD01**: CIA#2 Port A Data Register
- **$A7**: Zero-page location storing the sampled RS-232 bit

## References
- "nmi_rs232_handler" — invoked from the NMI RS-232 handler when a bit period occurs
- "rs232_baud_rate_tables_ntsc" — baud-rate table and how timer reload values are derived