# CIA 6526 Complex Interface Adapter — Overview

**Summary:** MOS 6526 (CIA) is a 65XX-bus compatible peripheral providing flexible timing and I/O (timers, parallel I/O, serial TOD/alarms) used in the C64 at $DC00-$DCFF and $DD00-$DDFF; CIA 1 ($DC00-$DCFF, 56320-56575) is the IRQ source, CIA 2 ($DD00-$DDFF, 56576-56831) is the NMI source.

## Description
The 6526 Complex Interface Adapter (CIA) is a MOS/Commodore peripheral chip for 65XX systems that supplies programmable timers, parallel I/O ports, a time-of-day clock with alarm, serial shift register facilities, and interrupt generation. It is used as a system I/O/timer controller in several Commodore products.

In the Commodore 64:
- Two CIA chips are present and memory-mapped in I/O space.
  - CIA 1 is mapped at $DC00-$DCFF (decimal 56320–56575) and is the primary IRQ source.
  - CIA 2 is mapped at $DD00-$DDFF (decimal 56576–56831) and is the NMI source.
- Both CIAs present the same register set (mirrored across their 256-byte pages in the C64 memory map).

Other systems using the 6526 include the C128, SX-64, and 1570/1571/1581 disk drives (as a peripheral controller).

## Key Registers
- $DC00-$DCFF - CIA 1 - 6526 CIA register block (C64 IRQ source; programmable timers, I/O, TOD/alarm)
- $DD00-$DDFF - CIA 2 - 6526 CIA register block (C64 NMI source; programmable timers, I/O, TOD/alarm)

## References
- "features" — hardware features and variants (6526 vs 6526A)
- "pin_configuration_40pin_dip" — physical pinout and signal names
- "register_map" — CIA register address ranges and detailed register map ($DC00/$DD00)