# Z-80 Microprocessor Cartridge (Commodore 64)

**Summary:** Z-80 microprocessor cartridge for the Commodore 64 provides a removable Z-80 CPU and the CP/M operating system (on a supplied diskette) so the C64 can run Z-80/CP/M software; CP/M uses part of main memory, limits program size and native screen editing, but offers portability to other Z-80/CP/M systems and requires no internal installation.

## Overview
The Z-80 cartridge adds a Z-80 microprocessor interface to the Commodore 64 via the rear expansion port, allowing execution of software written for CP/M and Z-80 systems. The cartridge is external (plugs into the back of the C64) so no internal board installation or wiring is required. A diskette containing the Commodore CP/M operating system is supplied with the cartridge.

The Commodore 64’s peripherals are described as “intelligent” in that typical peripherals (Datassette, disk drives, printers, modems) do not consume the computer’s RAM when in use; the Z-80/CP/M environment is different because CP/M itself occupies part of the available RAM.

## Tradeoffs of running CP/M on the C64
- Disadvantages:
  - CP/M uses part of the memory normally available to Commodore 64 programs, so CP/M programs must be shorter than native C64 programs.
  - The Commodore 64’s native screen editing capabilities are not available under CP/M (no native C64 screen editor).
- Advantages:
  - Access to a large library of existing CP/M/Z-80 software.
  - Programs developed under CP/M on the cartridge are portable to other computers that implement CP/M with a Z-80 card.
  - External cartridge installation avoids the risks and effort of installing an internal Z-80 card.

## Using the Commodore CP/M cartridge
- The cartridge provides the Z-80 environment; the Commodore CP/M operating system is supplied on diskette (included).
- Because the cartridge plugs into the expansion port, no internal modification of the C64 is required (avoids disturbing internal circuitry).

## References
- "expansion_port_signal_descriptions" — expands on physical cartridge interfaces and expansion port signals  
- "running_commodore_cpm_steps" — expands on how to start the CP/M operating system from the supplied cartridge/diskette
