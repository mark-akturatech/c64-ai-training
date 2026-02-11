# RS232 ROM: no-start-bit handler ($EF90-$EF94)

**Summary:** Checks zero-page $A7 (RS-232 received data bit) and branches to the RS-232 bit receive setup if the line is still idle, or jumps to the routine that flags a detected start bit and sets parity. Contains code at $EF90-$EF94 referenced by the RS-232 NMI processing path.

**Description**
This short ROM fragment is executed when the RS-232 receive path determines there is no valid start bit (entered from the NMI-driven receive processing). Operation:

- LDA $A7 — load the current RS-232 data-bit marker from zero page address $A7.
- BNE $EF7E — if the loaded value is non-zero (line still idle / bit = 1), branch to $EF7E to set up to receive the next RS-232 bit and return to the receive loop.
- JMP $E4D3 — if the loaded value is zero (start bit detected), jump to $E4D3 to flag the RS-232 start and initialize/set parity handling.

The routine therefore distinguishes "still idle" (branch to bit setup) from "start bit detected" (jump to start/ parity routine). This fragment is a decision point in the RS-232 receive NMI flow.

## Source Code
```asm
                                *** no RS232 start bit received
.,EF90 A5 A7    LDA $A7         get the RS232 received data bit
.,EF92 D0 EA    BNE $EF7E       if line is idle, go setup to receive an RS232 bit and return
.,EF94 4C D3 E4 JMP $E4D3       flag the RS232 start bit and set the parity
```

## References
- "rs232_rx_nmi_bit_processing" — expands on the NMI branch target when no valid start bit (related receive-bit processing and setup routines)