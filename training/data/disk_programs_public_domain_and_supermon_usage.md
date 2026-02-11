# SUPERMON programs — builders and usage notes

**Summary:** Notes on Supermon monitor builders for PET, VIC-20, and Commodore 64; guidance for running the builder, removing the builder from RAM, locating the built monitor via TOM (top-of-memory) and returning to the monitor with SYS. Mentions specific Supermon variants (SUPERMON1/2/4/V/64) and that Supermon2/4 extend the built-in MLM.

**Usage and behaviour**
- Supermon distributions on disk are monitor generators: running the builder constructs a complete monitor in RAM (typically placed near the top of memory).
- Available variants:
  - SUPERMON1 — for original ROM PET computers
  - SUPERMON2 — for upgrade ROM PET/CBM computers (extension to built-in MLM)
  - SUPERMON4 — for 4.0 PET/CBM computers (extension to built-in MLM)
  - SUPERMON.V — for VIC-20 computers
  - SUPERMON64 — for Commodore 64 computers
  - SUPERMON INST — instructions in BASIC
- Typical workflow:
  1. Run the builder program.
  2. After the monitor is built, return to BASIC (the builder commonly provides a `.X` command after RUN to return to BASIC).
  3. Remove the builder program from memory (use NEW) so you do not keep two copies.
  4. Use SYS to re-enter the built monitor when desired:
     - On VIC-20 and Commodore 64: `SYS 8`
     - On CBM/PET computers (except original ROM units): `SYS 4`
     - On original ROM PETs: `SYS 1024`
- Finding the monitor entry point: check the TOM pointer (top-of-memory pointer) to determine where the monitor was placed.
- The monitor may disassemble itself (useful for inspection).
- Once placed in RAM, the monitor remains resident and you may load BASIC programs or other software; the monitor persists until power is removed.

**Note:** The SYS command used to return to the monitor varies depending on the Supermon version and machine type. Ensure you use the correct SYS number for your specific Supermon build and machine.

## References
- "disk_user_guide_program_list" — expands on the list of disk programs
- "supermon64_overview" — expands on SUPERMON64 in the program list
