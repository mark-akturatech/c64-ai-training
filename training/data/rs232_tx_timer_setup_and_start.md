# Initialize and start VIA 2 timer A for RS-232 transmit

**Summary:** 6502 assembly routine that programs CIA/VIA Timer A for RS-232 transmit timing by loading baud-rate-derived low/high bytes from ROM ($0299/$029A) into CIA2 timer A ($DD04/$DD05), enables the Timer A interrupt, prepares the next TX byte, and writes CRA ($DD0E) to start the timer.

## Operation
This routine configures and starts the serial transmit bit-timing timer for the machine's second I/O chip (labelled "VIA 2" in the source). Steps performed, in order:
- Save the current control register A (CRA) from CIA2 ($DD0E) so it can be restored later or used as a base value.
- Load the baud-rate-derived timer low byte from ROM location $0299 and store it to CIA2 Timer A low ($DD04).
- Load the baud-rate-derived timer high byte from ROM location $029A and store it to CIA2 Timer A high ($DD05).
- Prepare to enable the Timer A interrupt by loading A with #$81 and calling the ICR setup routine (JSR $EF3B). The value $81 (1000 0001b) uses the CIA ICR's "set" mechanism (bit7 = set-flag) to enable the Timer A interrupt bit.
- Call the routine that sets up the next RS-232 transmit byte (JSR $EF06).
- Load A with #$11 and store it to CRA ($DD0E) to load and start Timer A (the source comments: "load timer A, start timer A").
- Return (RTS).

**[Note: Source may contain an error — the code and C64 address range imply this is CIA 2 ($DD00-$DD0F, 6526 chip used in the C64), but the text calls it "VIA 2".]**

## Source Code
```asm
.,F030 8D 0E DD STA $DD0E       save VIA 2 CRA
.,F033 AD 99 02 LDA $0299       get the baud rate bit time low byte
.,F036 8D 04 DD STA $DD04       save VIA 2 timer A low byte
.,F039 AD 9A 02 LDA $029A       get the baud rate bit time high byte
.,F03C 8D 05 DD STA $DD05       save VIA 2 timer A high byte
.,F03F A9 81    LDA #$81        enable timer A interrupt
.,F041 20 3B EF JSR $EF3B       set VIA 2 ICR from A
.,F044 20 06 EF JSR $EF06       setup next RS232 Tx byte
.,F047 A9 11    LDA #$11        load timer A, start timer A
.,F049 8D 0E DD STA $DD0E       save VIA 2 CRA
.,F04C 60       RTS             
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Timer and control registers (includes Timer A low/high at $DD04/$DD05 and CRA at $DD0E)
- $0299-$029A - ROM data - RS-232/6551 pseudo-registers: baud-rate-derived timer bit-time low/high bytes

## References
- "rs232_get_byte_from_rx_buffer" — expands on RS232 status & buffer layout (receiving side)
- "rs232_input_highlevel_handshake_and_interrupt_control" — expands on higher-level serial input/handshake handling and ICR management