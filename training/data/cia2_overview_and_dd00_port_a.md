# MOS 6526 (CIA #2) — Data Port A (DD00 / $56576)

**Summary:** Data Port A for MOS 6526 CIA #2 at $DD00 (decimal 56576) — provides Serial Bus signals (ATN, Data, Clock), RS-232 data output on the User Port, and VIC-II system memory bank select bits (bits 1-0, default = 11). Includes bit-level mapping for serial bus inputs/outputs and VIC bank control.

## Overview
Data Port A (CIA #2, register $DD00 / decimal 56576) is a general-purpose I/O port used on the C64 for IEC Serial Bus (Datasette/IEC peripherals) signal lines, RS-232 data output (via the user port), and selecting the VIC-II-visible system memory bank. Bit positions are numbered 7 (MSB) down to 0 (LSB).

Bit functions:
- Bit 7 — Serial Bus Data Input (IEC DATA, input from peripherals)
- Bit 6 — Serial Bus Clock Pulse Input (IEC CLK, input)
- Bit 5 — Serial Bus Data Output (IEC DATA, drive direction when used)
- Bit 4 — Serial Bus Clock Pulse Output (IEC CLK, drive direction when used)
- Bit 3 — Serial Bus ATN Signal Output (IEC ATN, host attention)
- Bit 2 — RS-232 Data Output (user port serial TX; driven by CIA bit)
- Bits 1-0 — VIC Chip System Memory Bank Select (2-bit value; default = 11b)

Notes:
- Bits 7 and 6 are described as inputs for the serial bus; bits 5–3 are outputs (data/clock/ATN) driven by the CIA. Hardware wiring and direction control determine actual bus behavior.
- VIC memory bank select (bits 1-0) changes which 16KB bank the VIC-II can see; the default (after reset) is binary 11 ($3).
- This register appears in the CIA #2 register block at $DD00-$DD0F (mirrored through $DD00-$DDFF depending on system mapping).

## Source Code
```text
DD00-DDFF  56576-56831           MOS 6526 Complex Interface Adapter (CIA) #2

DD00       56576                 Data Port A (Serial Bus, RS-232, VIC Memory Control)
                           Bit 7   Serial Bus Data Input
                           Bit 6   Serial Bus Clock Pulse Input
                           Bit 5   Serial Bus Data Output
                           Bit 4   Serial Bus Clock Pulse Output
                           Bit 3   Serial Bus ATN Signal Output
                           Bit 2   RS-232 Data Output (User Port)
                           Bit 1   VIC System Memory Bank Select (LSB)
                           Bit 0   VIC System Memory Bank Select (MSB)  (Default = 11b)
```

## Key Registers
- $DD00 - CIA 2 - Data Port A (IEC serial bus lines, RS-232 TX out, VIC memory bank select bits)
- $DD00-$DD0F - CIA 2 - 6526 register block (Data Port A is at $DD00)

## References
- "cia1_control_registers_dc0e_dc0f" — expands on CIA #1 control registers preceding CIA #2
- "cia2_dd01_port_b" — expands on CIA #2 Data Port B (user port / RS-232) bit definitions