# KERNAL: TALK/LISTEN and SEND DATA on IEC serial bus (vectors $FFB4 / $FFB1)

**Summary:** KERNAL entry points for TALK ($FFB4) and LISTEN ($FFB1) implement IEC serial-bus command sending and low-level bit output. Uses CIA port ($DD00), CIA1 timers ($DC07/$DC0F/$DC0D), KERNAL buffers/flags ($0095 BSOUR, $0094 C3PO), and helper routines (EE97/EEA9/EE85/EEA0/EEB3) to toggle CLK/DATA and poll bus state; error conditions set ST (#$80 device not present, #$03 write timeout).

## Description
This chunk documents the KERNAL code path that sends TALK / LISTEN (and related UNTALK / UNLISTEN) commands and the SEND DATA ON SERIAL BUS byte-output routine.

- Entry: Both TALK and LISTEN expect the target device number in A. TALK ORAs A with #$40, LISTEN ORAs A with #$20. UNTALK (#$3F) and UNLISTEN (#$5F) are handled by passing those values on entry.
- Command vs data: When sending a command byte the code drives ATN low via CIA port ($DD00) so the target interprets the byte as a command; after sending it restores ATN high.
- Buffered output: If a character is already buffered for output, the routine moves it into BSOUR ($0095). The C3PO flag at $0094 is tested (BIT $0094) to determine whether a buffered character exists and to control rotation/transfer into BSOUR.
- Interrupt handling: The routines use SEI/CLI around critical timing/bit operations to avoid IRQs disturbing serial timing.
- Helpers: Multiple helper subroutines are invoked (addresses in the $EExx range) to set the DATA and CLK lines and to read serial in-data. These helpers abstract the per-clock toggles and short delays required by the IEC physical layer.
- Bit-level send loop: SEND DATA rotates the byte right (ROR $0095) eight times, using the carry as the bit to drive onto DATA. For each bit the code:
  - Ensures bus port stable (waits for $DD00 unchanged),
  - ASL to test bit to send (or ROR followed by BCS),
  - Calls helpers to set DATA low/high and toggle CLK,
  - Waits small delays (NOPs / EEB3 delay).
- Post-byte handshake and timeout: After sending the 8 bits the routine programs CIA1 timer B (load $DC07 then start via $DC0F) and polls CIA1 ICR ($DC0D) for the timeout bit to detect write timeout. If the ACK/accept handshake from the device doesn't occur before the timer fires, ST is set to indicate write timeout (#$03). If initial bus activity is absent, ST is set to #$80 (device not present).
- Error reporting: Error paths set the status (ST) and relevant error flags (the listing references higher-level FE1C for status setting). Two specific conditions are shown in the code: no activity/device-not-present (sets ST=#$80) and write timeout (ST=#$03).
- Variables and temps: Zero-page locations $00A3, $00A5 are used as temporary storage/bit counters; $0095 holds BSOUR (buffered output byte); $0094 is C3PO character-in-serial-buffer flag.

Do not duplicate the assembly listing — see the Source Code section for the complete annotated disassembly used here.

## Source Code
```asm
                                *** TALK: SEND 'TALK' / 'LISTEN'
                                The KERNAL routine TALK ($ffb4) and LISTEN ($ffb1) are
                                vectored here. The routine sends the command 'TALK' or
                                'LISTEN' on the serial bus. On entry (A) must hold the
                                device number to which the command will be sent. The two
                                entry points differ only in that to TALK, (A) is ORed with
                                #$40, and to LISTEN, (A) is ORed with #$20. The UNTALK
                                (#$3f) and UNLISTEN (#$5f) are also sent via this routine,
                                but their values are set on entry. If there is a character
                                waiting to go out on the bus, then this is output.
                                Handshaking is performed, and ATN (attention) is set low
                                so that the byte is interpreted as a command. The routine
                                drops through to the next one to output the byte on the
                                serial bus. Note that on conclusion, ATN must be set high.
.,ED09 09 40    ORA #$40        set TALK flag
.:ED0B 2C       .BYTE $2C       bit $2009, mask ORA command
.,ED0C 09 20    ORA #$20        set LISTEN flag
.,ED0E 20 A4 F0 JSR $F0A4       check serial bus idle
.,ED11 48       PHA
.,ED12 24 94    BIT $94         C3PO, character in serial buffer
.,ED14 10 0A    BPL $ED20       nope
.,ED16 38       SEC             prepare for ROR
.,ED17 66 A3    ROR $A3         temp data area
.,ED19 20 40 ED JSR $ED40       send data to serial bus
.,ED1C 46 94    LSR $94         3CPO
.,ED1E 46 A3    LSR $A3
.,ED20 68       PLA
.,ED21 85 95    STA $95         BSOUR, buffered character for bus
.,ED23 78       SEI
.,ED24 20 97 EE JSR $EE97       set data 1, and clear serial bit count
.,ED27 C9 3F    CMP #$3F        UNTALK?
.,ED29 D0 03    BNE $ED2E       nope
.,ED2B 20 85 EE JSR $EE85       set CLK 1
.,ED2E AD 00 DD LDA $DD00       serial bus I/O port
.,ED31 09 08    ORA #$08        clear ATN, prepare for command
.,ED33 8D 00 DD STA $DD00       store
.,ED36 78       SEI             disable interrupts
.,ED37 20 8E EE JSR $EE8E       set CLK 1
.,ED3A 20 97 EE JSR $EE97       set data 1
.,ED3D 20 B3 EE JSR $EEB3       delay 1 ms

                                *** SEND DATA ON SERIAL BUS
                                The byte of data to be output on the serial bus must have
                                been previously stored in the serial buffer, BSOUR. An
                                initial test is made for bus activity, and if none is
                                detected then ST is set to #$80, ie. ?DEVICE NOT PRESENT.
                                The byte is output by rotating it right and sending the
                                state of the carry flag. This is done eight times until
                                the whole byte was sent. The CIA timer is set to 65 ms and
                                the bus is checked for 'data accepted'. If timeout occurs
                                before this happens then ST is set to #$03, ie. write
                                timeout.
.,ED40 78       SEI             disable interrupts
.,ED41 20 97 EE JSR $EE97       set data 1
.,ED44 20 A9 EE JSR $EEA9       get serial in and clock
.,ED47 B0 64    BCS $EDAD       no activity, device not present.
.,ED49 20 85 EE JSR $EE85       set CLK 1
.,ED4C 24 A3    BIT $A3         temp data area
.,ED4E 10 0A    BPL $ED5A
.,ED50 20 A9 EE JSR $EEA9       get serial in and clock
.,ED53 90 FB    BCC $ED50       wait for indata = 0
.,ED55 20 A9 EE JSR $EEA9       get serial in and clock
.,ED58 B0 FB    BCS $ED55       wait for indata = 1
.,ED5A 20 A9 EE JSR $EEA9       get serial in and clock
.,ED5D 90 FB    BCC $ED5A       wait for indata = 0
.,ED5F 20 8E EE JSR $EE8E       set CLK 0

.,ED62 A9 08    LDA #$08        output 8 bits
.,ED64 85 A5    STA $A5
.,ED66 AD 00 DD LDA $DD00
.,ED69 CD 00 DD CMP $DD00
.,ED6C D0 F8    BNE $ED66
.,ED6E 0A       ASL
.,ED6F 90 3F    BCC $EDB0
.,ED71 66 95    ROR $95         BSOUR, buffered character for bus
.,ED73 B0 05    BCS $ED7A       prepare to output 1
.,ED75 20 A0 EE JSR $EEA0       else, serial output 0
.,ED78 D0 03    BNE $ED7D
.,ED7A 20 97 EE JSR $EE97
.,ED7D 20 85 EE JSR $EE85
.,ED80 EA       NOP
.,ED81 EA       NOP
.,ED82 EA       NOP
.,ED83 EA       NOP
.,ED84 AD 00 DD LDA $DD00
.,ED87 29 DF    AND #$DF
.,ED89 09 10    ORA #$10
.,ED8B 8D 00 DD STA $DD00
.,ED8E C6 A5    DEC $A5         decrement bit counter
.,ED90 D0 D4    BNE $ED66       next bit till all 8 are done
.,ED92 A9 04    LDA #$04
.,ED94 8D 07 DC STA $DC07       CIA timer B, high byte
.,ED97 A9 19    LDA #$19
.,ED99 8D 0F DC STA $DC0F       set 1 shot, load and start CIA timer B
.,ED9C AD 0D DC LDA $DC0D       CIA ICR
.,ED9F AD 0D DC LDA $DC0D
.,EDA2 29 02    AND #$02        timeout
.,EDA4 D0 0A    BNE $EDB0       yep, flag write timeout
.,EDA6 20 A9 EE JSR $EEA9       get serial in and clock
.,EDA9 B0 F4    BCS $ED9F
.,EDAB 58       CLI             enable interrupts
.,EDAC 60       RTS
```

## Key Registers
- $FFB1 / $FFB4 - KERNAL vectors - LISTEN / TALK entry points
- $DD00 - CIA 2 ($DD00-$DD0F) - serial bus I/O port (ATN/CLK/DATA lines via CIA port A)
- $DC07 - CIA 1 ($DC00-$DC0F) - Timer B high byte (used to load 1-shot timeout)
- $DC0F - CIA 1 ($DC00-$DC0F) - Timer B control / start
- $DC0D - CIA 1 ($DC00-$DC0F) - ICR (Interrupt Control/Status) polled for timeout
- $0095 - BSOUR (KERNAL buffer) - buffered serial output byte
- $0094 - C3PO (KERNAL flag) - character-in-serial-buffer / status flag
- $00A3 - temp data area (zero page)
- $00A5 - bit counter/temp (zero page)

## References
- "send_data_serial_bus_continued_and_errors" — continues the send-data loop and error handling
- "acptr_receive_from_serial_bus" — ACPTR receive routine and complementary IEC receive handling

## Labels
- TALK
- LISTEN
- BSOUR
- C3PO
