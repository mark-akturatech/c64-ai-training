# 6502 — signals, pin summary and family variants (final footer extract)

**Summary:** Pin/signal names and short descriptions (SYNC, S.O., R/W, RDY, IRQ, NMI, RES, BE, VBP, HALT), chip supply and buses (VCC/VSS, Φ0…2, A0…A15, D0…D7) and a compact 65xx-family variant table including W65C02S / 6502C / 6510 / 65816 references.

## Pin and signal definitions
This chunk lists the external signal names used on 6502-family devices and short meanings for each, suitable for quick reference and searches for terms like SYNC, HALT, S.O., RDY, R/W, BE, VBP.

- A0…A15 — address bus (16-bit on standard 6502)
- D0…D7 — data bus (8-bit)
- VCC — supply voltage
- VSS — logical ground
- Φ0…Φ2 — clock phases
- BE — bus enable
- R/W — read/write (active low on write)
- RDY — ready (bidirectional)
- S.O. — set overflow (active low or I/O interface depending on revision)
- SYNC — goes high on opcode fetch phase (not present on all variants)
- IRQ — interrupt request (active low)
- NMI — non-maskable interrupt (active low)
- RES — reset (active low)
- VBP — vector pull
- N.C. — no connection
- HALT — halt input (active low) — present on some CMOS variants (see notes)

Notes:
- W65C02S (Western Design Center 2022) is cited as a reference for the WDC CMOS variant.
- The 6502C (C014806) (CMOS, Atari 2nd gen) lists HALT and omits SYNC; specifically the source notes: "No SYNC output, HALT input, R/W on pin 36."
- S.O. meaning varies by revision: original 6502 used S.O. (set overflow) active low; later devices may describe it as future I/O interface.

## 6502 family variants (compact)
Short, searchable list of 65xx family members and the brief feature/comments provided in the source:

- 6502 — NMOS, 16-bit address bus, 8-bit data bus
- 6502A — accelerated version of 6502
- 6502C — accelerated version of 6502, additional halt pin, CMOS
- 65C02 — WDC version, additional instructions and address modes, up to 14 MHz
- 6503 / 6505 / 6506 — 12-bit address bus (4 KiB)
- 6504 — 13-bit address bus (8 KiB), no NMI
- 6507 — 13-bit address bus (8 KiB), no interrupt lines
- 6509 — 20-bit address bus (1 MiB) by bankswitching
- 6510 — like 6502 with additional 6-bit I/O port (used in C64)
- 6511 — integrated microcontroller with I/O-port, serial interface, and RAM (Rockwell)
- 65F11 — like 6511, integrated FORTH interpreter
- 7501 — like 6502, HMOS
- 8500 — like 6510, CMOS
- 8502 — like 6510 with switchable 2 MHz option, 7-bit I/O port
- 65816 (65C816) — 16-bit registers/ALU, 24-bit address bus (16 MiB), up to 14 MHz (Western Design Center)
- 65802 (65C802) — like 65816, pin compatible to 6502, 64 KiB address bus, up to 16 MHz

## Credits and external resources
- Based on: W65C02S 8–bit Microprocessor Datasheet. The Western Design Center, Inc., 2022.
- Presented by mass:werk (source document footer).
- External links referenced in source: 6502.org, visual6502.org, Western Design Center site, Virtual 6502 emulator/assembler/disassembler suite.

## Source Code
```text
                D0 … D7   data bus
                BE        bus enable
                R/W       read/write (low on write)
                RDY       ready (bidirectional)
                S.O.      set overflow (active low)
                SYNC      sync (goes high on opcode fetch phase)
                IRQ       interrupt request (active low)
                NMI       non maskable interrupt (active low)
                RES       reset (active low)
                                                                        6502 Instruction Set
                VBP        vector pull
                N.C.       no connection
           Based on: W65C02S 8–bit Microprocessor Datasheet. The Western Design Center, Inc., 2022.
          • 6502C (C014806) “SALLY” (CMOS, Atari 2nd gen. 8-bit computers)
                VCC         supply voltage
                VSS         logical ground
                Φ0…2        clock
                A0 … A15    address bus
                D0 … D7     data bus
                R/W         read/write (low on write)
                RDY         ready
                                                                          6502 Instruction Set
                 S.O.        set overflow (future I/O interface)
                 HALT        halt input (active low)
                 IRQ         interrupt request (active low)
                 NMI         non maskable interrupt (active low)
                 RES         reset (active low)
                 N.C.        no connection
            Notes: No SYNC output, HALT input, R/W on pin 36.
          The 65xx-Family:
            Type               Features, Comments
            6502               NMOS, 16 bit address bus, 8 bit data bus
            6502A              accelerated version of 6502
            6502C              accelerated version of 6502, additional halt pin, CMOS
            65C02              WDC version, additional instructions and address modes, up to 14MHz
            6503, 6505, 6506   12 bit address bus [4 KiB]
            6504               13 bit address bus [8 KiB], no NMI
            6507               13 bit address bus [8 KiB], no interrupt lines
            6509               20 bit address bus [1 MiB] by bankswitching
            6510               as 6502 with additional 6 bit I/O-port
            6511               integrated micro controler with I/O-port, serial interface, and RAM (Rockwell)
            65F11              as 6511, integrated FORTH interpreter
            7501               as 6502, HMOS
            8500               as 6510, CMOS
            8502               as 6510 with switchable 2 MHz option, 7 bit I/O-port
            65816 (65C816)     16 bit registers and ALU, 24 bit address bus [16 MiB], up to 14 MHz (Western Design Center)
            65802 (65C802)     as 65816, pin compatible to 6502, 64 KiB address bus, up to 16 MHz
          Site Notes
          For a simple overview of the instruction set in near-text format, see see here.
          Disclaimer
          Errors excepted. The information is provided for free and AS IS, therefore without any warranty;
          without even the implied warranty of merchantability or fitness for a particular purpose.
          See also the “Virtual 6502” suite of online-programs
                                                                     6502 Instruction Set
          >> Virtual 6502 (6502/6510 emulator)
          >> 6502 Assembler
          >> 6502 Disassembler
          External Links
          >> 6502.org — the 6502 microprocessor resource
          >> visual6502.org — visual transistor-level simulation of the 6502 CPU
          >> The Western Design Center, Inc. — designers of the 6502 (still thriving)
          Presented by mass:werk.
file:///home/mark/Documents/6502 Instruction Set.html                                                      73/73
```

## References
- "external_links_and_tools" — tools and further reading (Virtual 6502, emulators, assemblers, disassemblers)