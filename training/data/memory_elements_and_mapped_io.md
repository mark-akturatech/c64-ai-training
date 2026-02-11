# MACHINE — Memory Elements (RAM / ROM / IA)

**Summary:** Describes the three device types on the 6502/C64 memory bus: RAM (read/write), ROM (read-only routines/OS), and IA (memory-mapped interface adapters such as VIC, SID, CIA). Explains memory-mapped I/O, device decoding via address high/low parts, and gives the C64 example $D020 (decimal 53280) controlling the VIC-II border color.

**Memory Elements**
Three device categories appear on the address/data/control buses:

- **RAM** — Random Access Memory. Read/write program and data storage used by programs at run time.
- **ROM** — Read-Only Memory. Fixed code (BIOS/OS/ROM routines) that cannot be written at run time.
- **IA** — Interface Adapters (memory-mapped I/O). Not conventional memory but assigned address locations so CPU reads/writes interact with the device. IAs implement I/O, timers, interrupt control, video, sound, etc. Typical IA examples: PIA, VIA, CIA, VIC (video), SID (sound).

**Device presence and decoding:**
- Some addresses may be unused; some devices respond to more than one address (mirroring) and can appear in multiple locations.
- Address interpretation is commonly split: high-order portion selects the chip (device decoder), low-order portion selects a register/location within that chip. Example (C64): $D020 selects the VIC-II device region (high part ≈ $D0...), and the low part $20 selects the VIC-II register that sets the screen border color. ($D020 = decimal 53280.)
- This memory-mapped model lets CPU instructions that read/write memory operate on external devices without special bus protocols beyond the address decode.

**Use on the bus:**
- IA chips connect to the address bus like memory devices; their internal registers are mapped into the CPU address space so reads/writes act as I/O transactions.
- Decoding logic on the motherboard (or within chips) determines which device is active for a given address range.

## Source Code
```text
    +-----------------+ ADDRESS BUS
    |                 |-------------------------------------------------------
    |                 |      ->              ->              ->            ->
    |                 |-------------+ +-------------+ +-------------+ +-------  TO
    | 650x CPU        |             | |             | |             | |         OTHER
    |                 | MEMORY BUS  | |             | |             | |         CHIPS
    |                 |-------------|||-------------|||-------------|||-------
    |                 |  <->        |v|  <->        |v|  <->        |v|  <->
    |                 |-------+ +---| |-------+ +---| |-------+ +---| |-------
    +-----------------+       | |   | |       | |   | |       | |   | |
                              |^|   | |       |^|   | |       |^|   | |
                              |||   | |       |||   | |       |||   | |
                              |v|   | |       | |   | |       |v|   | |
                              | |   | |       | |   | |       | |   | |
                            +-----------+   +-----------+   +-----------+
                            |    RAM    |   |    ROM    |   |    IA     |
                            | (read and |   |(read only)|   | (special) |
                            |   write)  |   |           |   |           |
                            +-----------+   +-----------+   +-----------+
                                                       |||||||
                                                       ^^^^^^^
                                                       |||||||
                                                       vvvvvvv
                                                       |||||||
                                                     CONNECTIONS
                                                  TO "OUTSIDE WORLD"
    Figure 1.4
```

## Key Registers
- **$D000-$D02E** — VIC-II register block (video interface); includes $D020 (decimal 53280) — border color register.

## References
- "bus_overview_650x" — expands how devices are selected using the address bus  
- "microprocessor_registers" — expands how CPU registers are used to address or manipulate data in memory elements

## Labels
- D020
