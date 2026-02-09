# CIA #2 (MOS 6526) mapping $DD00-$DDFF

**Summary:** CIA 2 (MOS 6526) I/O registers at $DD00-$DD0F: Port A/B data ports and DDIRs, Timer A/B (low/high bytes), Time-of-Day clock (TOD), synchronous serial buffer, and interrupt/control registers (NMI/IRQ flags and masks). Reserved ranges $DE00-$DFFF for future I/O expansion.

**Register overview**
This chunk documents the CIA 2 register layout at $DD00-$DD0F and the reserved expansion ranges $DE00-$DFFF. Key functional blocks:

- $DD00 — Port A data register: used for the serial bus (ATN, data/clock inputs/outputs) and VIC memory control lines.
- $DD01 — Port B data register: exposes User Port and RS‑232 control/status lines (DTR, RTS, CTS, DSR, RI, etc.).
- $DD02/$DD03 — Data Direction Registers (DDRA, DDRB).
- $DD04-$DD07 — Timer A and Timer B low/high bytes.
- $DD08-$DD0B — Time‑Of‑Day clock bytes: 1/10 seconds, seconds, minutes, hours (+ AM/PM flag in bit 7).
- $DD0C — Synchronous Serial I/O Data Buffer.
- $DD0D — CIA Interrupt Control Register (read: NMI/IRQ flags; write: mask).
- $DD0E — CIA Control Register A: TOD frequency select, serial port I/O mode, Timer A count source/force load, Timer A run/output/start bits.
- $DD0F — CIA Control Register B: Alarm/TOD select, Timer B mode select, and Timer B control bits (mirrors Control A for Timer B).

DE00–DFFF are explicitly listed as reserved for future I/O expansion.

## Source Code
```text
DD00       56576                 Data Port A - serial bus/RS-232/VIC memory control
                            Bit 7    Serial Data Out (SDO)
                            Bit 6    Serial Clock Out (SCO)
                            Bit 5    ATN Output
                            Bit 4    Serial Data In (SDI)
                            Bit 3    Serial Clock In (SCI)
                            Bit 2    VIC Memory Control Line
                            Bit 1    VIC Memory Control Line
                            Bit 0    VIC Memory Control Line

DD01       56577                 Data Port B - user port / RS-232 lines
                            Bit 7    Data Set Ready (DSR)
                            Bit 6    Clear To Send (CTS)
                            Bit 5    Data Carrier Detect (DCD)
                            Bit 4    Ring Indicator (RI)
                            Bit 3    Data Terminal Ready (DTR)
                            Bit 2    Ready To Send (RTS)
                            Bit 1    Receive Data (RxD)
                            Bit 0    Transmit Data (TxD)

DD02       56578                 Data Direction Register - Port A
DD03       56579                 Data Direction Register - Port B

DD04       56580                 Timer A: Low-Byte
DD05       56581                 Timer A: High-Byte
DD06       56582                 Timer B: Low-Byte
DD07       56583                 Timer B: High-Byte

DD08       56584                 Time-of-Day Clock: 1/10 Seconds
DD09       56585                 Time-of-Day Clock: Seconds
DD0A       56586                 Time-of-Day Clock: Minutes
DD0B       56587                 Time-of-Day Clock: Hours + AM/PM Flag (Bit 7)

DD0C       56588                 Synchronous Serial I/O Data Buffer

DD0D       56589                 CIA Interrupt Control Register (Read: NMI/IRQ Flags; Write: Mask)
                            Bit 7    NMI Flag (1 = NMI Occurred) / Set-Clear Flag
                            Bit 4    FLAG1 NMI (User / RS-232 Received Data Input)
                            Bit 3    Serial Port Interrupt
                            Bit 1    Timer B Interrupt
                            Bit 0    Timer A Interrupt
                         (bits 6,5,2 not documented here)

DD0E       56590                 CIA Control Register A
                            Bit 7    Time-of-Day Clock Frequency: 1 = 50 Hz, 0 = 60 Hz
                            Bit 6    Serial Port I/O Mode Output (1 = Output, 0 = Input)
                            Bit 5    Timer A Counts: 1 = CNT Signals, 0 = System 02 Clock
                            Bit 4    Force Load Timer A: 1 = Load
                            Bit 3    Timer A Run Mode: 1 = One-Shot, 0 = Continuous
                            Bit 2    Timer A Output Mode to PB6: 1 = Toggle, 0 = Pulse
                            Bit 1    Timer A Output on PB6: 1 = Enabled, 0 = Disabled
                            Bit 0    Start/Stop Timer A: 1 = Start, 0 = Stop

DD0F       56591                 CIA Control Register B
                            Bit 7    Set Alarm / TOD-Clock: 1 = Alarm, 0 = Clock
                            Bit 6-5  Timer B Mode Select:
                                      00 = Count System 02 Clock Pulses
                                      01 = Count Positive CNT Transitions
                                      10 = Count Timer A Underflow Pulses
                                      11 = Count Timer A Underflows While CNT Positive
                            Bit 4-0  Same control bits as CIA Control Register A (for Timer B)

DE00-DEFF  56832-57087           Reserved for Future I/O Expansion
DF00-DFFF  57088-57343           Reserved for Future I/O Expansion
```

## Key Registers
- $DD00-$DD0F - CIA 2 (MOS 6526) - Port A (serial/VIC), Port B (User Port/RS-232), DDRA/DDRB, Timer A/B low+high, TOD clock, Serial buffer, Interrupt & Control registers (NMI/IRQ flags and masks)
- $DE00-$DEFF - Reserved - Future I/O expansion
- $DF00-$DFFF - Reserved - Future I/O expansion

## References
- "user_port_table" — expands on User-port lines and RS-232 signals described for Port B (external cross-reference)