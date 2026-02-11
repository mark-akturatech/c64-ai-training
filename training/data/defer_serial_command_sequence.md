# Defer a serial command (ROM routine)

**Summary:** Sequence from C64 ROM to defer a serial-bus command: saves the deferred character to $95, disables interrupts (SEI), manipulates serial data/clock via JSRs ($EE97, $EE85, $EE8E, $EEB3), compares a read byte to #$3F, and reads/writes CIA‑2 Port A ($DD00) to set ATN low. Uses CIA‑2 DRA ($DD00) to control ATN/data/clock lines and inserts ~1 ms delay before transmission.

## Description
This ROM routine implements the "defer a command" behavior for the C64 serial bus. Key actions in order:

- STA $95 — store the byte to be deferred in zero page $95 (used as the deferred serial character).
- SEI — disable IRQs to avoid interrupting the critical timing while lines are reconfigured.
- JSR $EE97 — set the serial data line high (routine in ROM that releases/sets data output).
- CMP #$3F — compare the previously-read status byte against #$3F; branch if not equal. The source comments note this branch will always be taken because a prior PCR read is ANDed with $DF, making equality to $3F impossible. [Note below about possible source error.]
- JSR $EE85 — set the serial clock line high.
- LDA $DD00 / ORA #$08 / STA $DD00 — read CIA‑2 Port A (DRA), OR in bitmask #$08 to pull ATN low, and write it back (this manipulates the ATN/data/clock outputs).
  - If execution reaches this point, the comment states serial clock is low and serial data has been released so the write's only effect may be to delay the first byte.
- SEI — ensure interrupts remain disabled before the final line toggles.
- JSR $EE8E — set the serial clock line low.
- JSR $EE97 — set the serial data line high again.
- JSR $EEB3 — 1 ms delay routine to postpone the byte transmission.

Behavioral notes:
- $95 is used as the deferred-character storage; related flags/bytes ($94, $A3) and the broader deferred-control logic are implemented elsewhere in ROM (see referenced chunks).
- The routine manipulates CIA‑2 Port A bits to assert ATN (bit masked with #$08) while toggling data/clock lines via dedicated JSRs into small ROM helper routines.
- The sequence inserts a roughly 1 ms delay to defer transmission; precise timing depends on the delay routine at $EEB3.

**[Note: Source may contain an error — the comment claiming the CMP #$3F branch "will always be taken" is suspicious: it asserts that a prior PCR read is ANDed with $DF so the value cannot be $3F. Verify upstream code path that sets/reads the PCR/status byte if exact behavior is required.]**

## Source Code
```asm
.,ED21 85 95    STA $95         ; save as serial deferred character
.,ED23 78       SEI             ; disable the interrupts
.,ED24 20 97 EE JSR $EE97       ; set the serial data out high
.,ED27 C9 3F    CMP #$3F        ; compare read byte with $3F
.,ED29 D0 03    BNE $ED2E       ; branch if not $3F (comment: branch will always be taken)
.,ED2B 20 85 EE JSR $EE85       ; set the serial clock out high
.,ED2E AD 00 DD LDA $DD00       ; read CIA‑2 DRA (serial port and video address)
.,ED31 09 08    ORA #$08        ; mask xxxx1xxx, set serial ATN low (bit $08)
.,ED33 8D 00 DD STA $DD00       ; save CIA‑2 DRA (set ATN/data/clock)
; if the code drops through to here the serial clock is low and the serial data has been
; released so the following code will have no effect apart from delaying the first byte
; set the serial clk/data, wait and Tx byte on the serial bus
.,ED36 78       SEI             ; disable the interrupts
.,ED37 20 8E EE JSR $EE8E       ; set the serial clock out low
.,ED3A 20 97 EE JSR $EE97       ; set the serial data out high
.,ED3D 20 B3 EE JSR $EEB3       ; 1ms delay
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Port A (DRA) and related CIA‑2 registers; DRA ($DD00) is used to control ATN/data/clock lines in this routine.

## References
- "serial_bus_commands_and_send_control_character" — expands on deferred characters and flags ($95, $94, $A3) set/checked when sending control characters
- "serial_tx_byte_routine" — covers the Tx byte routine used after deferring to transmit the deferred byte