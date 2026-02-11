# CIA Time-of-Day (TOD) Registers ($DC08-$DC0B) and Serial Data Register CIASDR ($DC0C)

**Summary:** Describes CIA Time-of-Day registers TODTEN, TODSEC, TODMIN, TODHRS at $DC08-$DC0B (BCD digits, AM/PM flag) and the CIASDR serial-data register at $DC0C (bitwise serial I/O via User Port SP/CNT lines, MSB-first, uses Timer A as baud generator; Control Register A at $DC0E selects input/output).

**Time-of-Day (TOD) Registers**

The CIA provides a Time-of-Day clock held in four BCD registers (tenths, seconds, minutes, hours). Values are stored in BCD digits (separate low and high digit fields); the hours register contains an AM/PM flag (bit 7). These registers reflect the TOD clock state; software reads/writes the registers to obtain or set the clock value.

**TOD Latch and Read Sequencing:**

To ensure accurate reading of the TOD registers without carry errors:

- **Reading Sequence:**
  1. Read the **Hours** register ($DC0B). This action latches the current TOD value, freezing the registers for consistent reading.
  2. Read the **Minutes** register ($DC0A).
  3. Read the **Seconds** register ($DC09).
  4. Read the **Tenths of a Second** register ($DC08). Reading this register releases the latch, allowing the TOD clock to resume normal operation.

- **Writing Sequence:**
  1. Write to the **Tenths of a Second** register ($DC08).
  2. Write to the **Seconds** register ($DC09).
  3. Write to the **Minutes** register ($DC0A).
  4. Write to the **Hours** register ($DC0B). Writing to this register starts the TOD clock with the new values.

**Note:** The TOD clock operates on a 12-hour AM/PM format, with bit 7 of the Hours register indicating AM (0) or PM (1).

**CIASDR (Serial Data Port) — $DC0C**

The CIA serial port shifts bytes one bit at a time, most-significant bit (bit 7) first.

- **Input Mode:** Control Register A ($DC0E) selects input mode. A data bit is sampled from the SP line (User Port pin 5) whenever a signal arrives on the CNT line (User Port pin 4). After eight bits are received, the assembled byte is placed in the Serial Data Register, and an interrupt is generated to notify software to read it.

- **Output Mode:** Control Register A ($DC0E) selects output mode. Software writes a byte to the Serial Data Register, and transmission begins if Timer A is running in continuous mode. Timer A acts as the baud-rate generator; data is clocked at half the Timer A rate. An output transition is presented on CNT whenever a bit is sent. After eight bits are transmitted, an interrupt is generated to indicate the next byte may be written.

**Note:** On the C64, the CIA on-chip serial port is not used for the system's disk/serial bus; the C64 uses different serial hardware.

**Control Register A (CRA) — $DC0E**

Control Register A configures various aspects of the CIA's operation, including the serial port mode. The bit-field map is as follows:

- **Bit 7:** TOD Clock Frequency
  - 0: 60 Hz (NTSC)
  - 1: 50 Hz (PAL)

- **Bit 6:** Serial Port Direction
  - 0: Input mode
  - 1: Output mode

- **Bit 5:** Force Load
  - 0: No effect
  - 1: Load Timer A with latch value

- **Bit 4:** Start/Stop Control
  - 0: Stop Timer A
  - 1: Start Timer A

- **Bits 3-0:** Timer A Control Mode
  - 0000: Timer A counts system clock pulses
  - 0001: Timer A counts CNT pulses
  - 0010: Timer A counts system clock pulses, output to PB6
  - 0011: Timer A counts CNT pulses, output to PB6
  - 1000: Timer A counts system clock pulses, one-shot mode
  - 1001: Timer A counts CNT pulses, one-shot mode
  - 1010: Timer A counts system clock pulses, one-shot mode, output to PB6
  - 1011: Timer A counts CNT pulses, one-shot mode, output to PB6

**Note:** Bit 6 controls the serial port direction:
- **0:** Serial port operates in input mode.
- **1:** Serial port operates in output mode.

## Source Code

```text
56328         $DC08          TODTEN
Time of Day Clock Tenths of Seconds

Bits 0-3:  Time of Day tenths of second digit (BCD)
Bits 4-7:  Unused

56329         $DC09          TODSEC
Time of Day Clock Seconds

Bits 0-3:  Second digit of Time of Day seconds (BCD)
Bits 4-6:  First digit of Time of Day seconds (BCD)
Bit 7:  Unused

56330         $DC0A          TODMIN
Time of Day Clock Minutes

Bits 0-3:  Second digit of Time of Day minutes (BCD)
Bits 4-6:  First digit of Time of Day minutes (BCD)
Bit 7:  Unused

56331         $DC0B          TODHRS
Time of Day Clock Hours

Bits 0-3:  Second digit of Time of Day hours (BCD)
Bit 4:  First digit of Time of Day hours (BCD)
Bits 5-6:  Unused
Bit 7:  AM/PM Flag (1=PM, 0=AM)

56332         $DC0C          CIASDR
Serial Data Port

The CIA chip has an on-chip serial port, which allows you to send or
receive a byte of data one bit at a time, with the most significant
bit (Bit 7) being transferred first.  Control Register A at 56334
($DC0E) allows you to choose input or output modes.  In input mode, a
bit of data is read from the SP line (pin 5 of the User Port) whenever
a signal on the CNT line (pin 4) appears to let you know that it is
time for a read.  After eight bits are received this way, the data is
placed in the Serial Port Register, and an interrupt is generated to
let you know that the register should be read.

In output mode, you write data to the Serial Port Register, and it is
sent out over the SP line (pin 5 of the User Port), using Timer A for
the baud rate generator.  Whenever a byte of data is written to this
register, transmission will start as long as Timer A is running and in
continuous mode.  Data is sent at half the Timer A rate, and an output
will appear on the CNT line (pin 4 of the User Port) whenever a bit is
sent.  After all eight bits have been sent, an interrupt is generated
to indicate that it is time to load the next byte to send into the
Serial Register.
```

## Key Registers

- $DC08-$DC0B - CIA - Time-of-Day registers: TODTEN, TODSEC, TODMIN, TODHRS (BCD digits; TODHRS bit 7 = AM/PM)
- $DC0C - CIA - CIASDR Serial Data Register (bitwise MSB-first serial I/O via User Port SP/CNT)
- $DC0E - CIA - Control Register A (configures Timer A, serial port direction, and TOD clock frequency)

## References

- "time_of_day_clock_tod_description_and_usage" — expands on TOD BCD and latch behavior
- "ciacra_control_register_a" — expands on bit controlling serial port direction (Bit 6)

## Labels
- TODTEN
- TODSEC
- TODMIN
- TODHRS
- CIASDR
- CRA
