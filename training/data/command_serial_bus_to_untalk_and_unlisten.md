# Issue UNTALK/UNLISTEN on IEC serial bus (C64 ROM)

**Summary:** Disassembly of a Commodore 64 ROM routine that issues UNTALK ($5F) and UNLISTEN ($3F) on the IEC serial bus via CIA 2 Port A ($DD00). Sequence: disable IRQs (SEI), pull serial clock low, set ATN via $DD00, send control character, raise ATN, wait ~1ms, then set clock/data high and return.

## Description
This routine performs a controlled IEC bus operation to tell a device to stop talking (UNTALK) and stop listening (UNLISTEN). Key actions:
- Disable interrupts with SEI to prevent timing glitches during bus manipulation.
- Drive the serial clock line low (JSR $EE8E) before asserting ATN.
- Modify CIA 2 Port A ($DD00) to change ATN state (code uses ORA #$08 / STA $DD00; source comment: "set the serial ATN low").
- Load the control bytes for UNTALK ($5F) and UNLISTEN ($3F) and send them via a control-character transmit routine (JSR $ED11).
- Raise ATN (JSR $EDBE), wait a short fixed delay (~1 ms implemented via LDX/DEX loop), then set clock and data lines high (JSR $EE85 and JMP $EE97).

## Operation / Sequence
1. SEI — disable interrupts to keep timing deterministic.
2. JSR $EE8E — set the serial clock output low.
3. LDA $DD00 / ORA #$08 / STA $DD00 — alter CIA 2 Port A bits to assert ATN (source comment: mask xxxx1xxx).
4. LDA #$5F — prepare UNTALK command byte.
5. LDA #$3F — (next block) prepare UNLISTEN command byte.
6. JSR $ED11 — send the control character on the serial bus.
7. JSR $EDBE — set serial ATN high again.
8. Short delay loop (TXA, LDX #$0A, DEX/BNE, TAX) — approximately 1 ms timing.
9. JSR $EE85 — set serial clock output high.
10. JMP $EE97 — set serial data output high and return.

**[Note: Source may contain an error — the comment says "set the serial ATN low" while the code ORs with #$08 (sets the bit); this likely reflects active-low bus wiring or inverted output logic on the CIA port.]**

## Source Code
```asm
                                *** command serial bus to UNTALK
.,EDEF 78       SEI             disable the interrupts
.,EDF0 20 8E EE JSR $EE8E       set the serial clock out low
.,EDF3 AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EDF6 09 08    ORA #$08        mask xxxx 1xxx, set the serial ATN low
.,EDF8 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,EDFB A9 5F    LDA #$5F        set the UNTALK command
.:EDFD 2C       .BYTE $2C       makes next line BIT $3FA9

                                *** command serial bus to UNLISTEN
.,EDFE A9 3F    LDA #$3F        set the UNLISTEN command
.,EE00 20 11 ED JSR $ED11       send a control character
.,EE03 20 BE ED JSR $EDBE       set serial ATN high
                                1ms delay, clock high then data high
.,EE06 8A       TXA             save the device number
.,EE07 A2 0A    LDX #$0A        short delay
.,EE09 CA       DEX             decrement the count
.,EE0A D0 FD    BNE $EE09       loop if not all done
.,EE0C AA       TAX             restore the device number
.,EE0D 20 85 EE JSR $EE85       set the serial clock out high
.,EE10 4C 97 EE JMP $EE97       set the serial data out high and return
```

## Key Registers
- $DD00 - CIA 2 - Port A (serial port and video address; ATN/clock/data control)

## References
- "send_secondary_address_after_listen_and_talk_set_atn" — expands on deferred Tx and ATN control
- "serial_pin_control_and_1ms_delay" — expands on routines to set clock/data lines and the 1ms delay