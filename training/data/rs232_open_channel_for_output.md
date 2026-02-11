# Open RS‑232 channel for output (RTS/CTS/DSR handshake) — C64 ROM

**Summary:** Opens the RS‑232 output channel using the KERNAL/6551 pseudo‑registers and VIA‑2 ($DD01) modem lines. Saves the output device number ($009A), checks handshake mode via $0294, polls VIA2 DRB ($DD01) for CTS/DSR, toggles RTS (bit mask $02), and sets the DSR‑not‑present status in $0297 when required. Returns with carry clear on success.

## Description
This routine implements the C64 KERNAL open-for-output sequence for an RS‑232 device using RTS/CTS and DSR handshake lines. Behavior summary (in execution order):

- Save the passed output device number into zero page $009A.
- Read the pseudo‑6551 command/handshake byte at $0294 and LSR it once to move the handshake bit into the carry.
  - If that handshake bit indicates the 3‑line interface path, branch to the 3‑line exit point (no further VIA polling).
- For the 2‑line interface path:
  - Prepare the RTS mask (#$02).
  - Test VIA‑2 Data Register B ($DD01) to inspect modem inputs; if DSR is absent, set the DSR‑not‑present status and exit.
  - If RTS is already asserted, exit (already ready).
  - Wait for Timer B interrupt masking to be cleared (poll $02A1 masked with #$02 — timer B IE bit) before toggling RTS — this avoids interfering with ongoing timed transmit operations.
  - Poll VIA‑2 DRB so long as CTS is high; then set RTS high by ORA #$02 and STA $DD01.
  - After asserting RTS, retest DRB: if CTS is high, exit immediately; otherwise loop while DSR is high, then treat DSR as not present.
- If DSR is considered not present, store $40 into the RS‑232 status byte at $0297.
- On normal/ok completion, clear the carry and RTS with RTS return (carry clear indicates success).

Return convention:
- Carry clear on success.
- The routine sets the DSR‑not‑present bit ($40) in $0297 when the DSR input is detected as not present.

Notes on signals and masks used by the code:
- RTS is represented by bit mask #$02 written into VIA‑2 DRB ($DD01).
- DSR/CTS are read from VIA‑2 DRB ($DD01) via BIT/BIT-like tests (code polls $DD01 and branches based on the tested bits).
- The routine polls $02A1 (RS‑232 interrupt enable byte) and masks #$02 to avoid toggling RTS while Timer B interrupt is enabled.

## Source Code
```asm
.; Open RS-232 channel for output (RTS/CTS/DSR handshake)
.; Saves the output device number, checks handshake mode, tests VIA2 DRB ($DD01),
.; waits for CTS/DSR as needed, toggles RTS in VIA2 DRB, and sets DSR-not-present.
.; Returns with carry clear to indicate success.

.,EFE1  85 9A        STA $009A         ; save the output device number
.,EFE3  AD 94 02     LDA $0294         ; read the pseudo 6551 command / handshake byte
.,EFE6  4A           LSR               ; shift handshake bit into carry
.,EFE7  90 29        BCC $F012         ; if handshake bit = 0 -> 3-line interface path (branch to success)
.,EFE9  A9 02        LDA #$02          ; mask $02: RTS bit mask
.,EFEB  2C 01 DD     BIT $DD01         ; test VIA2 DRB (RS-232 port inputs)
.,EFEE  10 1D        BPL $F00D         ; if DSR = 0 -> set DSR not present and exit
.,EFF0  D0 20        BNE $F012         ; if RTS = 1 -> exit (already asserted)
.,EFF2  AD A1 02     LDA $02A1         ; get the RS-232 interrupt enable byte
.,EFF5  29 02        AND #$02          ; mask with #$02 (timer B interrupt bit)
.,EFF7  D0 F9        BNE $EFF2         ; loop while the timer B interrupt is enabled
.,EFF9  2C 01 DD     BIT $DD01         ; test VIA2 DRB (RS-232 port)
.,EFFC  70 FB        BVS $EFF9         ; loop while CTS high
.,EFFE  AD 01 DD     LDA $DD01         ; read VIA2 DRB (RS-232 port)
.,F001  09 02        ORA #$02          ; set RTS bit in accumulator
.,F003  8D 01 DD     STA $DD01         ; write back to VIA2 DRB (assert RTS)
.,F006  2C 01 DD     BIT $DD01         ; test VIA2 DRB (RS-232 port)
.,F009  70 07        BVS $F012         ; if CTS high -> exit success
.,F00B  30 F9        BMI $F006         ; loop while DSR high
.; set no DSR and exit
.,F00D  A9 40        LDA #$40          ; set DSR-not-present flag
.,F00F  8D 97 02     STA $0297         ; save RS-232 status register
.,F012  18           CLC               ; flag OK (clear carry)
.,F013  60           RTS               ; return
```

## Key Registers
- $009A - KERNAL variable - saved output device number
- $0294 - KERNAL pseudo 6551 command/handshake byte (handshake mode bit inspected)
- $0297 - RS‑232 status register (DSR-not-present flag $40 is written here)
- $02A1 - KERNAL RS‑232 interrupt enable byte (Timer B interrupt mask tested with #$02)
- $DD00-$DD0F - VIA‑2 (6526 VIA) - RS‑232 port and control (Data Register B at $DD01 is used for modem inputs and RTS control)

## References
- "rs232_set_dsr_cts_not_present" — expands on setting the DSR/CTS-not-present bits used here
- "rs232_send_byte_to_tx_buffer" — expands on queuing transmit bytes into the Tx buffer after opening