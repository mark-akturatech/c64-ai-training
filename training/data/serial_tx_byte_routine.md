# Tx byte on IEC serial bus ($ED40)

**Summary:** ROM routine at $ED40 implements an IEC serial-bus byte transmit (SEI, EOI handshake, LSB-first 8-bit transmit) using VIA2 DRA ($DD00) reads for timing and line status; uses subroutines at $EE97/$EEA9/$EE85/$EE8E/$EEA0 to drive/read data and clock lines and handles device-not-present and timeout conditions.

**Description**
This ROM routine sends one byte on the C64 IEC serial bus. High-level flow:

- Disable interrupts (SEI) to ensure timed signalling.
- Drive serial DATA high (JSR $EE97), then sample the DATA line status (JSR $EEA9). If DATA is already high (BCS), the device is treated as not present and branches to a device-not-present handler.
- Drive the serial CLOCK line high (JSR $EE85).
- Test the EOI flag (BIT $A3) to determine whether an EOI handshake is required. If EOI is indicated the code performs the IEC EOI sequence:
  - Wait for DATA to go high (JSR $EEA9 / BCC loop).
  - Wait for DATA to go low (JSR $EEA9 / BCS loop).
  - Wait for DATA to go high again (JSR $EEA9 / BCC loop).
  - Pull CLOCK low within the required window (JSR $EE8E).
- Prepare to transmit 8 bits LSB-first: load #$08 into $A5 as a bit count.
- Bit loop:
  - Read VIA2 DRA ($DD00) repeatedly until two consecutive reads match (stability check).
  - ASL (0x0A) performed to shift serial data into the carry (as implemented in this ROM sequence; code uses ROR on the transmit byte later).
  - If a serial bus timeout is detected the code branches to a timeout handler.
  - Rotate the transmit byte right (ROR $95) so the LSB appears in Carry.
  - Depending on the bit in Carry, call the appropriate ROM helper to set DATA low or high (JSR $EEA0 or JSR $EE97).
  - Pulse CLOCK high (JSR $EE85), leave it high for a short interval (NOPs), then write back to VIA2 DRA:
    - Apply mask AND #$DF to ensure DATA bit is set/cleared as required.
    - ORA #$10 to set/clear the CLOCK bit as needed.
    - STA $DD00 to update VIA2 DRA.
  - DEC $A5; loop until all 8 bits transmitted.
- After transmitting 8 bits, the peripheral is expected to acknowledge the byte:
  - Set up Timer B in CIA #1 for a timeout:
    - LDA #$04; STA $DC07 (Timer B low byte)
    - LDA #$19; STA $DC0F (Timer B control: start timer, one-shot mode)
  - Poll the Timer B interrupt flag ($DC0D) to detect timeout:
    - LDA $DC0D; LDA $DC0D; AND #$02; BNE to timeout handler if set.
  - Poll the DATA line status (JSR $EEA9) to detect peripheral acknowledgment:
    - If DATA goes low (BCC loop), wait for it to return high (BCS loop).
  - Re-enable interrupts (CLI) and return (RTS).

Important implementation details preserved from the ROM:
- EOI handshake is explicitly implemented (wait high → low → high) before pulling CLOCK low to start data transfer when BIT $A3 indicates EOI.
- Bit transfer is LSB-first; ROR $95 is used to place the next bit into Carry for examination.
- VIA2 Port A ($DD00) is read and compared for a stable value before each timing-sensitive operation.
- The routine uses helper JSRs in ROM to abstract setting/clearing DATA and CLOCK lines: $EE97 (set DATA high), $EEA9 (read DATA status), $EE85 (set CLOCK high), $EE8E (set CLOCK low), $EEA0 (set DATA low).
- There are explicit handlers for "device not present" (branch at $ED47 to $EDAD) and "serial bus timeout" (branch at $ED6F to $EDB0).

## Source Code
