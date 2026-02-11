# CIA #2 Control Registers — CI2CRA ($DD0E) & CI2CRB ($DD0F)

**Summary:** CI2CRA ($DD0E) and CI2CRB ($DD0F) on CIA #2 control Timer A/B start/stop, Timer output routing to Port B, pulse vs toggle output modes, one‑shot vs continuous operation, force-load strobes, timer input source selection, serial port direction, and Time‑Of‑Day (TOD) frequency/write select. CIA #2 differs from CIA #1 in that the FLAG line is wired to the User Port (usable for interrupt handshaking); the CIA occupies $DD00-$DD0F and its 16-register image is mirrored across $DD10-$DDFF (avoid using mirrored addresses). The expansion/reserved cartridge area $DE00-$DEFF is commonly used by cartridges (CP/M module, Simon's BASIC, etc.).

## CI2CRA — Control Register A (CI2CRA, $DD0E / decimal 56590)
CI2CRA controls Timer A operation and related I/O/serial/TOD selection for CIA #2. The register bits select:
- Start/stop Timer A
- Route Timer A output to Port B bit 6 (and select pulse vs toggle)
- One‑shot vs continuous run mode for Timer A
- Force load (latch transfer) of Timer A counter
- Timer A input source (CPU cycles or CNT pin on User Port)
- Serial port direction (Serial register at $DD0C: output vs input)
- TOD clock frequency selection (50 Hz vs 60 Hz on TOD pin)

Note: On CIA #2 the FLAG line is connected to the User Port (Pin B), allowing its interrupt capability to be used for handshaking from the User Port.

**[Note: Source may contain an error — the original text references "See locations 56334 and 56334"; likely intended to reference CIA #1 control register entry 56333 ($DC0D).]**

## CI2CRB — Control Register B (CI2CRB, $DD0F / decimal 56591)
CI2CRB controls Timer B operation and related I/O/TOD write selection for CIA #2. The register bits select:
- Start/stop Timer B
- Route Timer B output to Port B bit 7 (and select pulse vs toggle)
- One‑shot vs continuous run mode for Timer B
- Force load (latch transfer) of Timer B counter
- Timer B input mode (four options: count CPU cycles, count CNT pin, count Timer A underflows, count Timer A underflows gated by CNT)
- TOD write select: choosing whether writes update the alarm or the clock

## CIA #2 register image mirroring ($DD10-$DDFF)
The CIA decodes only 16 registers; the CPU-side 256-byte page assigned to the CIA ($DD00-$DDFF) contains 16-byte repeats of the same registers. Every 16‑byte block within $DD00-$DDFF is a mirror of $DD00-$DD0F. For program clarity and to avoid confusion, do not use the mirrored addresses — use the primary $DD00-$DD0F block.

## Reserved I/O expansion area ($DE00-$DEFF)
The $DE00-$DEFF page is reserved for I/O expansion and cartridge mapping on many C64 systems. Cartridges and expansion modules commonly use portions of this space (examples: CP/M module, Simon's BASIC). Consult cartridge-specific documentation before using addresses in this range.

## Source Code
```text
; CI2CRA and CI2CRB bit layouts (CIA #2 at $DD00-$DD0F; CI2CRA = $DD0E, CI2CRB = $DD0F)

56590   $DD0E   CI2CRA - Control Register A (Timer A)
  Bit 0: Start Timer A (1 = start, 0 = stop)
  Bit 1: Select Timer A output on Port B (1 = Timer A output appears on Bit 6 of Port B)
  Bit 2: Port B output mode for Timer A (1 = toggle Bit 6, 0 = pulse Bit 6 for one cycle)
  Bit 3: Timer A run mode (1 = one-shot, 0 = continuous)
  Bit 4: Force latched value to be loaded to Timer A counter (1 = force load strobe)
  Bit 5: Timer A input mode (1 = count microprocessor cycles, 0 = count signals on CNT pin of User Port)
  Bit 6: Serial Port mode (relates to Serial register at $DD0C) (1 = serial port output, 0 = serial port input)
  Bit 7: Time of Day clock frequency select (1 = TOD expects 50 Hz on TOD pin, 0 = 60 Hz)

56591   $DD0F   CI2CRB - Control Register B (Timer B)
  Bit 0: Start Timer B (1 = start, 0 = stop)
  Bit 1: Select Timer B output on Port B (1 = Timer B output appears on Bit 7 of Port B)
  Bit 2: Port B output mode for Timer B (1 = toggle Bit 7, 0 = pulse Bit 7 for one cycle)
  Bit 3: Timer B run mode (1 = one-shot, 0 = continuous)
  Bit 4: Force latched value to be loaded to Timer B counter (1 = force load strobe)
  Bits 5-6: Timer B input mode:
            00 = Timer B counts microprocessor cycles
            01 = Timer B counts signals on CNT pin (User Port pin 4)
            10 = Timer B counts each time Timer A underflows to 0
            11 = Timer B counts Timer A underflows only when CNT pulses are present (gated)
  Bit 7: TOD write select (0 = writing to TOD registers sets alarm, 1 = writing to TOD registers sets clock)

; CIA register mirroring note
Location range 56592-56831 ($DD10-$DDFF): every 16-byte block is a mirror of $DD00-$DD0F

; Reserved cartridge/expansion area (examples)
Location range 56832-57087 ($DE00-$DEFF): Reserved I/O expansion / cartridge mapping area (commonly used by CP/M module, Simon's BASIC, etc.)
```

## Key Registers
- $DD00-$DD0F - CIA-II - Control, timer, I/O and TOD registers (including CI2CRA $DD0E and CI2CRB $DD0F)

## References
- "cia2_data_direction_timers_tod_and_serial_port" — expands on timer and TOD register addresses
- "reserved_io_expansion_and_cartridge_usage" — expands on $DE00 expansion area and cartridge control

## Labels
- CI2CRA
- CI2CRB
