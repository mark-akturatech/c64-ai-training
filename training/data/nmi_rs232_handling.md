# NMI RS232 HANDLING (KERNAL)

**Summary:** NMI handler code that detects and services RS232 activity using KERNAL flag $02A1 and CIA port accesses ($DD00, $DD0D). Tests bits #%00000001, #%00010010, #%00000010, and #%00010000 to decide send/receive paths and dispatches to NMI RS232 IN ($FED6), OUT ($FF07), and byte-send ($EEBB) routines.

**Description**
This KERNAL NMI fragment inspects the KERNAL RS232 enable/flags word at $02A1 and routes NMI RS232 processing into send or receive handlers. Sequence summary:

- TYA / AND $02A1 / TAX — mask the A register with the KERNAL ENABL word ($02A1) and store the result in X for later tests.
- Test bit #%00000001 (AND #$01):
  - If set, follow the "sending" path:
    - Read CIA port at $DD00, clear the RS232 TX bit (AND #$FB), OR with NXTBIT ($00B5), and write back to $DD00 to drive the TX line bit for the next output bit.
    - Load $02A1 and write it into CIA ICR at $DD0D to update CIA interrupt control.
    - Use the earlier saved X (TXA/TAX sequence) to test receiver-related flags and either call the RS232 IN handler ($FED6) or RS232 OUT handler ($FF07).
    - JSR $EEBB is used to perform the RS232 send-byte action.
- If bit #%00000001 is clear, follow the "receive" tests:
  - Using the saved X, test bit #%00000010 (bit1) and bit #%00010000 (bit4) to determine whether to call the NMI RS232 IN handler ($FED6) or OUT handler ($FF07).
- At the end, the code restores saved registers and writes $02A1 back to the CIA ICR at $DD0D before RTI.

Notes on flags:
- $02A1 is a KERNAL variable holding the ENABL/RS232 flags used to select/send/receive actions.
- Bit masks used in tests:
  - #$01 — "sending" flag
  - #$02 — "receiving" flag (or waiting for receiver edge)
  - #$10 — alternate receiver-wait/test bit
  - #$12 — combined mask for bit1 or bit4 checks

**[Note: Source may contain an error — the inline comment labels $DD00 as "CIA#1 DRA", but $DD00 is the CIA base for CIA#2 on the C64; CIA#1 is at $DC00. The code itself uses $DD00/$DD0D which corresponds to CIA#2 registers (port A/ICR).]**

## Source Code
```asm
                                *** NMI RS232 HANDLING
.,FE72 98       TYA             Read CIA#2 interrupt control register
.,FE73 2D A1 02 AND $02A1       mask with ENABL, RS232 enable
.,FE76 AA       TAX             temp store in (X)
.,FE77 29 01    AND #$01        test if sending (%00000001)
.,FE79 F0 28    BEQ $FEA3       nope, jump to receive test
.,FE7B AD 00 DD LDA $DD00       load CIA#1 DRA
.,FE7E 29 FB    AND #$FB        mask bit2 (RS232 send)
.,FE80 05 B5    ORA $B5         NXTBIT, next bit to send
.,FE82 8D 00 DD STA $DD00       and write to port
.,FE85 AD A1 02 LDA $02A1
.,FE88 8D 0D DD STA $DD0D       write ENABL to CIA#2 I.C.R
.,FE8B 8A       TXA             get temp
.,FE8C 29 12    AND #$12        test if receiving (bit1), or waiting for receiver
                                edge (bit4) ($12 = %00010010)
.,FE8E F0 0D    BEQ $FE9D       nope, skip receiver routine
.,FE90 29 02    AND #$02        test if receiving
.,FE92 F0 06    BEQ $FE9A       nope
.,FE94 20 D6 FE JSR $FED6       jump to NMI RS232 in
.,FE97 4C 9D FE JMP $FE9D
.,FE9A 20 07 FF JSR $FF07       jump to NMI RS232 out
.,FE9D 20 BB EE JSR $EEBB       RS232 send byte
.,FEA0 4C B6 FE JMP $FEB6       goto exit
.,FEA3 8A       TXA             get temp
.,FEA4 29 02    AND #$02        test bit1
.,FEA6 F0 06    BEQ $FEAE       nope
.,FEA8 20 D6 FE JSR $FED6       NMI RS232 in???
.,FEAB 4C B6 FE JMP $FEB6       goto exit
.,FEAE 8A       TXA             set temp
.,FEAF 29 10    AND #$10        test bit4
.,FEB1 F0 03    BEQ $FEB6       nope, exit
.,FEB3 20 07 FF JSR $FF07       NMI RS232 out
.,FEB6 AD A1 02 LDA $02A1       ENABL
.,FEB9 8D 0D DD STA $DD0D       CIA#2 interrupt control register
.,FEBC 68       PLA             restore registers (Y),(X),(A)
.,FEBD A8       TAY
.,FEBE 68       PLA
.,FEBF AA       TAX
.,FEC0 68       PLA
.,FEC1 40       RTI             back from NMI

                                *** RS232 TIMING TABLE - NTSC
                                Timing table for RS232 NMI for use with NTSC machines. The
                                table contains 10 entries which correspond to one of the
                                fixed RS232 rates, starting with the lowest (50 baud) and
                                finishing with the highest (2400 baud). Since the clock
                                frequency is different between NTSC and PAL systems, there
                                is another table for PAL machines at $E4EC.
.:FEC2 C1 27                    50 baud
.:FEC4 60 09                    75 baud
.:FEC6 40 06                    110 baud
.:FEC8 30 04                    134.5 baud
.:FECA 20 03                    150 baud
.:FECC 18 03                    300 baud
.:FECE 0C 01                    600 baud
.:FED0 06 00                    1200 baud
.:FED2 03 00                    1800 baud
.:FED4 02 00                    2400 baud

                                *** RS232 TIMING TABLE - PAL
                                Timing table for RS232 NMI for use with PAL machines. The
                                table contains 10 entries which correspond to one of the
                                fixed RS232 rates, starting with the lowest (50 baud) and
                                finishing with the highest (2400 baud).
.:E4EC C1 27                    50 baud
.:E4EE 60 09                    75 baud
.:E4F0 40 06                    110 baud
.:E4F2 30 04                    134.5 baud
.:E4F4 20 03                    150 baud
.:E4F6 18 03                    300 baud
.:E4F8 0C 01                    600 baud
.:E4FA 06 00                    1200 baud
.:E4FC 03 00                    1800 baud
.:E4FE 02 00                    2400 baud
```

## Key Registers
- $DD00-$DD0F - CIA#2 - CIA registers (port A / DRA at $DD00, ICR at $DD0D)
- $02A1 - KERNAL - ENABL (KERNAL RS232 enable/flag word)
- $00B5 - Zero page - NXTBIT (next bit to send; used as OR source)

## References
- "nmi_rs232_in" — expands on NMI RS232 IN handler (sets timer and calls RS232 receive routine)
- "nmi_rs232_out" — expands on NMI RS232 OUT handler (sets up baud timers and counters)

## Labels
- ENABL
- NXTBIT
