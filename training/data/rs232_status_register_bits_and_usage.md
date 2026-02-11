# RS-232 Status Register (RSSTAT) — BASIC ST / KERNAL READST

**Summary:** RS-232 status register (RSSTAT) bit layout and usage: parity/framing errors, receiver overrun/empty, CTS/DSR missing, BREAK detected; accessed from BASIC via the ST variable or by the KERNAL READST routine; reading ST (or READST) clears the status word on exit, so copy ST to another variable (e.g., SR=ST) if you need it preserved.

## Description
This chunk documents the RS-232 status word (RSSTAT) bit-by-bit as presented in the source. The register reports parity and framing errors, receiver buffer conditions, control-line presence (CTS, DSR), and BREAK detection. The source uses the BASIC variable ST (and the KERNAL READST routine) to read the status.

Bit definitions (bit numbers 0 = least-significant):
- Bit 0 — PARITY ERROR bit
- Bit 1 — FRAMING ERROR bit
- Bit 2 — RECEIVER BUFFER OVERRUN bit
- Bit 3 — RECEIVER BUFFER-EMPTY (use to test after a GET#)
- Bit 4 — CTS SIGNAL MISSING bit
- Bit 5 — UNUSED bit
- Bit 6 — DSR SIGNAL MISSING bit
- Bit 7 — BREAK DETECTED bit

Notes and behavior:
- If a BIT = 0, then no error has been detected (the source states BIT=0 indicates "no error").
- The RS-232 status register is readable from BASIC using the built-in variable ST.
- Reading ST in BASIC, or reading the register via the KERNAL READST routine, will clear the RS-232 status word when the read action completes (i.e., when you exit the KERNAL routine / BASIC read).
- If you need to inspect the status multiple times, assign ST to another variable immediately after reading. Example shown in the source: SR=ST (this preserves the status value).
- The RS-232 status is read (and cleared) only when the RS-232 channel was the last external I/O used — i.e., the clearing behavior applies only if RS-232 was the most recent external I/O channel.

(The source references mapping of these status bits to physical user-port RS-232 lines elsewhere; see cross-references.)

## Source Code
```text
+-----------------------------------------------------------------------+
| [7] [6] [5] [4] [3] [2] [1] [0] (Machine Lang.-RSSTAT                 |
|  |   |   |   |   |   |   |   +- PARITY ERROR BIT                      |
|  |   |   |   |   |   |   +----- FRAMING ERROR BIT                     |
|  |   |   |   |   |   +--------- RECEIVER BUFFER OVERRUN BIT           |
|  |   |   |   |   +------------- RECEIVER BUFFER-EMPTY                 |
|  |   |   |   |                  (USE TO TEST AFTER A GET#)            |
|  |   |   |   +----------------- CTS SIGNAL MISSING BIT                |
|  |   |   +--------------------- UNUSED BIT                            |
|  |   +------------------------- DSR SIGNAL MISSING BIT                |
|  +----------------------------- BREAK DETECTED BIT                    |
|                                                                       |
+-----------------------------------------------------------------------+
                     Figure 6-3. RS-232 Status Register.
```

```basic
REM Preserve ST if you need multiple tests
SR = ST : REM ASSIGNS ST TO SR
```

## References
- "user_port_rs232_pin_assignments" — maps status bits to user-port hardware signals
- "sample_basic_program_pet_ascii" — example showing SR=ST and status bit testing
- "rs232_nonzero_page_control_and_fifos" — discusses the nonzero-page RSSTAT location and FIFO/control behavior

## Labels
- RSSTAT
- READST
- ST
