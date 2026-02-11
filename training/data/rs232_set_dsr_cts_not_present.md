# RS-232: Set DSR/CTS "Signal Not Present" Handlers ($EF2E)

**Summary:** 6502 routines that set the RS-232 Data Set Ready (DSR) and Clear To Send (CTS) "signal not present" bits in the RS-232 status register at $0297 by loading specific masks into the accumulator and performing ORA/STA operations on $0297.

**Description**

These routines are responsible for indicating the absence of DSR and CTS signals by setting the corresponding bits in the RS-232 status register ($0297).

- **DSR mask:** #$40 (bit 6)
- **CTS mask:** #$10 (bit 4)

The DSR handler at $EF2E loads the DSR mask into the accumulator and sets the corresponding bit in $0297. The CTS handler at $EF31 performs a similar operation for the CTS signal.

## Source Code

```asm
; Set DSR signal not present
EF2E   A9 40      LDA #$40        ; Load DSR mask
EF30   0D 97 02   ORA $0297       ; OR with RS-232 status register
EF33   8D 97 02   STA $0297       ; Store back to RS-232 status register

; Set CTS signal not present
EF36   A9 10      LDA #$10        ; Load CTS mask
EF38   0D 97 02   ORA $0297       ; OR with RS-232 status register
EF3B   8D 97 02   STA $0297       ; Store back to RS-232 status register
```

## Key Registers

- **$0297 (RSSTAT):** RS-232 status register.
  - Bit 6 ($40): DSR signal missing.
  - Bit 4 ($10): CTS signal missing.

## References

- "rs232_setup_next_tx_byte" — sets these flags when DSR/CTS are not present during transmission setup.
- "rs232_open_channel_for_output" — manages DSR/CTS status when opening the RS-232 channel for output.

*Note: The previous ambiguity regarding the disassembly annotation (.BYTE $2C) has been resolved. The correct opcode sequence for setting the DSR and CTS "signal not present" bits is now provided.*

## Labels
- RSSTAT
