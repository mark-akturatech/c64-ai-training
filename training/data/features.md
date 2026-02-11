# CIA 6526 Complex Interface Adapter — Feature Summary

**Summary:** The MOS Technology 6526 Complex Interface Adapter (CIA) is an integrated circuit providing versatile I/O capabilities for 6502-based systems. Key features include two 8-bit bidirectional I/O ports, two independent 16-bit interval timers, a 24-hour BCD time-of-day (TOD) clock with programmable alarm, an 8-bit serial shift register, and compatibility with TTL/CMOS logic levels. Variants include the 6526 (1 MHz operation) and 6526A (2 MHz operation).

**Features**

- **I/O Ports:** Two 8-bit bidirectional ports (Port A and Port B), each with individual data direction registers allowing configuration of each line as input or output.
- **Timers:** Two independent 16-bit interval timers (Timer A and Timer B) capable of operating in one-shot or continuous modes; timers can be linked for extended timing intervals.
- **Time-of-Day Clock:** 24-hour BCD time-of-day clock with programmable alarm; registers for tenths of seconds, seconds, minutes, and hours.
- **Serial Shift Register:** 8-bit serial shift register supporting serial input and output; can be clocked by Timer A or an external source.
- **Interrupts:** Multiple interrupt sources including timer underflow, TOD alarm, serial port activity, and external signals; configurable interrupt control register.
- **Compatibility:** TTL load capability (2 TTL loads) and CMOS compatible I/O lines.
- **Variants:** 6526 operates at 1 MHz; 6526A operates at 2 MHz.

## Source Code

```text
Pin Configuration for 40-Pin DIP Package:

          +---\/---+
      VCC | 1     40| VDD
      PA0 | 2     39| CNT
      PA1 | 3     38| SP
      PA2 | 4     37| RS0
      PA3 | 5     36| RS1
      PA4 | 6     35| RS2
      PA5 | 7     34| RS3
      PA6 | 8     33| φ2
      PA7 | 9     32| R/W
      PB0 | 10    31| DB0
      PB1 | 11    30| DB1
      PB2 | 12    29| DB2
      PB3 | 13    28| DB3
      PB4 | 14    27| DB4
      PB5 | 15    26| DB5
      PB6 | 16    25| DB6
      PB7 | 17    24| DB7
     FLAG | 18    23| PC
      IRQ | 19    22| CS
      GND | 20    21| RESET
          +--------+
```

## Key Registers

- **Data Port Registers:**
  - **Port A Data Register (PADR):** Address 0x00
  - **Port B Data Register (PBDR):** Address 0x01
- **Data Direction Registers:**
  - **Port A Data Direction Register (PADDR):** Address 0x02
  - **Port B Data Direction Register (PBDDR):** Address 0x03
- **Timer Registers:**
  - **Timer A Low (TALO):** Address 0x04
  - **Timer A High (TAHI):** Address 0x05
  - **Timer B Low (TBLO):** Address 0x06
  - **Timer B High (TBHI):** Address 0x07
- **Time-of-Day Clock Registers:**
  - **TOD Tenths of Seconds (TOD10):** Address 0x08
  - **TOD Seconds (TODSEC):** Address 0x09
  - **TOD Minutes (TODMIN):** Address 0x0A
  - **TOD Hours (TODHR):** Address 0x0B
- **Serial Data Register:**
  - **Serial Data Register (SDR):** Address 0x0C
- **Interrupt Control Register:**
  - **Interrupt Control Register (ICR):** Address 0x0D
- **Control Registers:**
  - **Control Register A (CRA):** Address 0x0E
  - **Control Register B (CRB):** Address 0x0F

## References

- "description_and_chip_locations" — expands on what the CIA is and where it's used
- "pin_configuration_40pin_dip" — expands on I/O lines and control pins (pinout and signal descriptions)
- "register_map" — expands on the registers implementing timers, TOD clock, serial data register, and port control

## Labels
- PADR
- PBDR
- PADDR
- PBDDR
- TALO
- TAHI
- TBLO
- TBHI
- TOD10
- TODSEC
- TODMIN
- TODHR
- SDR
- ICR
- CRA
- CRB
