# CIA 1 Time-of-Day (TOD) Clock — $DC08-$DC0B

**Summary:** CIA 1 Time-of-Day clock registers at $DC08-$DC0B hold BCD-encoded tenths, seconds, minutes and hours plus an AM/PM flag (bit 7 of $DC0B). Registers are used to read and set the TOD clock (see CIACRB interaction for write/latch behavior).

## Time of Day Clock (CIA 1) Registers
The CIA 1 TOD is represented across four byte registers at $DC08-$DC0B. Values are stored in packed BCD across low and upper nibbles as shown; hours include an AM/PM flag in bit 7. Reads/writes to these registers supply the current TOD or are used to set the clock—(see "cia_tod_write_mode_and_latch_behavior" for how CIACRB/alarms and latch behavior affect writes).

- $DC08: Tenths of seconds (BCD, low nibble)
- $DC09: Seconds (BCD, low + upper nybble bits)
- $DC0A: Minutes (BCD, low + upper nybble bits)
- $DC0B: Hours (BCD, low + single-bit upper nibble for 10s of hours) and AM/PM flag

Usage notes:
- All numeric fields are BCD-encoded.
- AM/PM flag: bit 7 = 1 => PM, 0 => AM.
- The precise behavior of writes (timing, latching, alarm vs clock set) is covered in "cia_tod_write_mode_and_latch_behavior".

## Source Code
```text
$DC08        TODTEN       Time of Day Clock Tenths of Seconds

                     bits 0-3  Time of Day tenths of second digit (BCD)
                     bits 4-7  Unused

$DC09        TODSEC       Time of Day Clock Seconds

                     bits 0-3  Second digit of Time of Day seconds (BCD)
                     bits 4-6  First digit of Time of Day seconds (BCD)
                     bit  7    Unused

$DC0A        TODMIN       Time of Day Clock Minutes

                     bits 0-3  Second digit of Time of Day minutes (BCD)
                     bits 4-6  First digit of Time of Day minutes (BCD)
                     bit  7    Unused

$DC0B        TODHRS       Time of Day Clock Hours

                     bits 0-3  Second digit of Time of Day hours (BCD)
                     bit  4    First digit of Time of Day hours (BCD)
                     bits 5-6  Unused
                     bit  7    AM/PM Flag (1 = PM, 0 = AM)
```

## Key Registers
- $DC08-$DC0B - CIA 1 - Time of Day Clock (TOD) registers (tenths, seconds, minutes, hours + AM/PM)

## References
- "cia_tod_write_mode_and_latch_behavior" — how writes to TOD registers interact with CIACRB, alarm vs clock set, and latch behavior
- "basic_tod_clock_example" — BASIC examples showing reading/writing the TOD registers

## Labels
- TODTEN
- TODSEC
- TODMIN
- TODHRS
