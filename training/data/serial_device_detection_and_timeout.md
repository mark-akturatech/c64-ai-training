# Wait for serial data low using CIA1 timer B (approx 1 ms)

**Summary:** Waits up to ~1 ms using CIA1 timer B ($DC06/$DC07) to detect the serial data line being pulled low; reads CIA1 ICR ($DC0D) to check for timer-A timeout, calls a routine to sample serial data status, and sets error codes $80 (device not present) or $03 (serial bus timeout) as needed.

## Operation
This routine starts CIA1 timer B as a single-shot ~1 ms timeout and then polls the serial-data sense routine until the data line is read low or a timeout occurs.

Flow:
- Load $04 into A and store to $DC07 (CIA1 timer B high byte).
- Load $19 into A and store to $DC0F (CIA1 CRB) — this writes CRB to configure/start timer B in single-shot mode (comment: "timer B single shot, start timer B").
- Read CIA1 ICR ($DC0D) twice, then AND #$02 to test the timer-A interrupt bit; if that bit is set, treat as a serial-bus timeout and branch to the timeout handler.
- JSR $EEA9 to "get the serial data status in Cb" (sampling routine). If the sampled serial data is high (BCS), loop back to read ICR and keep waiting (up until the timer) — otherwise enable interrupts (CLI) and return (RTS).
- Error handling:
  - Device-not-present path loads $80 into A and proceeds to a sequence involving a .BYTE $2C (this corrupts the next opcode into a BIT $03A9 in the original listing).
  - Serial-bus timeout path loads $03 into A, JSR $FE1C to OR this into the serial status byte, CLI, then clears carry and branches (BCC) to $EE03 for further handling.

**[Note: Source may contain an error — the listing uses the term "VIA", but the addresses used ($DC07, $DC0F, $DC0D) are CIA1 (6526) registers on the C64.]**

## Source Code
```asm
                                received by pulling the serial data low. this should be done within one milisecond
.,ED92 A9 04    LDA #$04        wait for up to about 1ms
.,ED94 8D 07 DC STA $DC07       save VIA 1 timer B high byte
.,ED97 A9 19    LDA #$19        load timer B, timer B single shot, start timer B
.,ED99 8D 0F DC STA $DC0F       save VIA 1 CRB
.,ED9C AD 0D DC LDA $DC0D       read VIA 1 ICR
.,ED9F AD 0D DC LDA $DC0D       read VIA 1 ICR
.,EDA2 29 02    AND #$02        mask 0000 00x0, timer A interrupt
.,EDA4 D0 0A    BNE $EDB0       if timer A interrupt go do serial bus timeout
.,EDA6 20 A9 EE JSR $EEA9       get the serial data status in Cb
.,EDA9 B0 F4    BCS $ED9F       if the serial data is high go wait some more
.,EDAB 58       CLI             enable the interrupts
.,EDAC 60       RTS             
                                device not present
.,EDAD A9 80    LDA #$80        error $80, device not present
.:EDAF 2C       .BYTE $2C       makes next line BIT $03A9
                                timeout on serial bus
.,EDB0 A9 03    LDA #$03        error $03, read timeout, write timeout
.,EDB2 20 1C FE JSR $FE1C       OR into the serial status byte
.,EDB5 58       CLI             enable the interrupts
.,EDB6 18       CLC             clear for branch
.,EDB7 90 4A    BCC $EE03       ATN high, delay, clock high then data high, branch always
```

## Key Registers
- $DC00-$DC0F - CIA 1 (6526) - Timer A/TIMER B low/high, ICR (interrupt control/status), CRA/CRB control registers, TOD, serial port control (as used here: $DC07 Timer B high, $DC0F CRB, $DC0D ICR)

## References
- "serial_pin_control_and_1ms_delay" — expands on uses of CIA1 timer B and the 1 ms delay helper
- "input_byte_from_serial_bus" — related timeout and EOI handling code