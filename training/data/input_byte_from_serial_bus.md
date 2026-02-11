# Read a byte from the IEC serial bus (ROM routine at $EE13)

**Summary:** IEC serial byte input routine using VIA timers and DRA polling; manipulates VIA1 ($DC00-$DC0F) timer B/CRB/ICR, reads VIA2 DRA ($DD00) for clock/data, uses zero page $A4 (receive byte) and $A5 (bit count/EOI), disables interrupts (SEI) and returns a received byte or sets error $02 on timeout.

## Description
This ROM routine (entry $EE13) reads one byte from the IEC serial bus by:

- Disabling interrupts (SEI) and initializing the bit counter in zero page $A5 (0 = expect EOI on timeout; otherwise 8).
- Driving the serial clock high (JSR $EE85) and sampling the serial clock/data status (JSR $EEA9) until the clock is confirmed high.
- Starting VIA1 timer B as a single-shot timeout: load high byte into $DC07 and CRB into $DC0F (single-shot start with $19). A short JSR sets serial data out high ($EE97).
- Polling VIA1 ICR ($DC0D) for timer A interrupt bit ($02) to detect a timer-A-based EOI/timeout condition. If timer A timed out and $A5 = 0 the routine sets EOI; if $A5 <> 0 it sets error $02 (read timeout) and jumps to the serial-status-setter at $EDB2.
- If no timer A timeout, the routine sets up to read 8 bits ($A5 := $08) and samples VIA2 DRA ($DD00) repeatedly, using a compare-read-compare pattern to avoid race conditions on line changes:
  - Wait for clock edge, use ASL to shift the sampled data bit into carry, then ROR $A4 to insert that bit into the receive byte.
  - The read loop repeats with a small busy-wait (compare $DD00 with itself and branch while changing) until $A5 decrements to zero.
- After collecting bits, it drives serial data out low (JSR $EEA0), checks the serial-status byte via BIT $90 for the EOI flag, and if EOI is set performs a bus-end sequence (JSR $EE06) to leave clock high then data high for 1 ms.
- Finally it loads the received byte from $A4, restores interrupts (CLI), clears carry (CLC) to indicate success, and RTS returns with the byte in A.
- The routine sets EOI by OR-ing $40 into the serial status (JSR $FE1C). Read timeout is signalled by loading $02 and jumping to $EDB2 to set serial status.

(EOI = end-of-information; DRA = VIA data register A)

## Source Code
```asm
.,EE13 78       SEI             disable the interrupts
.,EE14 A9 00    LDA #$00        set 0 bits to do, will flag EOI on timeour
.,EE16 85 A5    STA $A5         save the serial bus bit count
.,EE18 20 85 EE JSR $EE85       set the serial clock out high
.,EE1B 20 A9 EE JSR $EEA9       get the serial data status in Cb
.,EE1E 10 FB    BPL $EE1B       loop if the serial clock is low
.,EE20 A9 01    LDA #$01        set the timeout count high byte
.,EE22 8D 07 DC STA $DC07       save VIA 1 timer B high byte
.,EE25 A9 19    LDA #$19        load timer B, timer B single shot, start timer B
.,EE27 8D 0F DC STA $DC0F       save the VIA 1 CRB
.,EE2A 20 97 EE JSR $EE97       set the serial data out high
.,EE2D AD 0D DC LDA $DC0D       read VIA 1 ICR
.,EE30 AD 0D DC LDA $DC0D       read VIA 1 ICR
.,EE33 29 02    AND #$02        mask 0000 00x0, timer A interrupt
.,EE35 D0 07    BNE $EE3E       if timer A interrupt go ??
.,EE37 20 A9 EE JSR $EEA9       get the serial data status in Cb
.,EE3A 30 F4    BMI $EE30       loop if the serial clock is low
.,EE3C 10 18    BPL $EE56       else go set 8 bits to do, branch always
                                timer A timed out
.,EE3E A5 A5    LDA $A5         get the serial bus bit count
.,EE40 F0 05    BEQ $EE47       if not already EOI then go flag EOI
.,EE42 A9 02    LDA #$02        else error $02, read timeour
.,EE44 4C B2 ED JMP $EDB2       set the serial status and exit
.,EE47 20 A0 EE JSR $EEA0       set the serial data out low
.,EE4A 20 85 EE JSR $EE85       set the serial clock out high
.,EE4D A9 40    LDA #$40        set EOI
.,EE4F 20 1C FE JSR $FE1C       OR into the serial status byte
.,EE52 E6 A5    INC $A5         increment the serial bus bit count, do error on the next
                                timeout
.,EE54 D0 CA    BNE $EE20       go try again, branch always
.,EE56 A9 08    LDA #$08        set 8 bits to do
.,EE58 85 A5    STA $A5         save the serial bus bit count
.,EE5A AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EE5D CD 00 DD CMP $DD00       compare it with itself
.,EE60 D0 F8    BNE $EE5A       if changing go try again
.,EE62 0A       ASL             shift the serial data into the carry
.,EE63 10 F5    BPL $EE5A       loop while the serial clock is low
.,EE65 66 A4    ROR $A4         shift the data bit into the receive byte
.,EE67 AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EE6A CD 00 DD CMP $DD00       compare it with itself
.,EE6D D0 F8    BNE $EE67       if changing go try again
.,EE6F 0A       ASL             shift the serial data into the carry
.,EE70 30 F5    BMI $EE67       loop while the serial clock is high
.,EE72 C6 A5    DEC $A5         decrement the serial bus bit count
.,EE74 D0 E4    BNE $EE5A       loop if not all done
.,EE76 20 A0 EE JSR $EEA0       set the serial data out low
.,EE79 24 90    BIT $90         test the serial status byte
.,EE7B 50 03    BVC $EE80       if EOI not set skip the bus end sequence
.,EE7D 20 06 EE JSR $EE06       1ms delay, clock high then data high
.,EE80 A5 A4    LDA $A4         get the receive byte
.,EE82 58       CLI             enable the interrupts
.,EE83 18       CLC             flag ok
.,EE84 60       RTS             
```

## Key Registers
- $DC00-$DC0F - VIA 1 (timer B high $DC07, CRB $DC0F, ICR $DC0D read used)
- $DD00-$DD0F - VIA 2 (DRA $DD00 read used for serial clock/data sampling)
- $A4 - zero page - receive byte (accumulates bits)
- $A5 - zero page - serial bus bit count / EOI-on-timeout flag

## References
- "serial_device_detection_and_timeout" — expands on shared timeout and EOI handling logic using VIA timers
- "serial_pin_control_and_1ms_delay" — expands on routines that set clock/data and perform the 1 ms bus-end delay

## Labels
- $A4
- $A5
