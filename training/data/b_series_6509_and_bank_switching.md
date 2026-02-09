# B-series (B-128, B-256, CBM-128/256) — 6509 bank-switched overview

**Summary:** B-series CBM machines use the 6509 CPU with bank-switched memory, a different zero page layout, and a relocated cassette buffer (examples referencing $0330 must be moved); complex bank-switching requires transfer sequences and bootstraps and the built-in monitor adds .V and .@ commands.

## Overview
The B-128, B-256, CBM-128 and CBM-256 are 80‑column successors that replace the standard 6502 architecture with a 6509 and extensive bank-switched memory. The system zero page is significantly different from other PET/CBM models, affecting machine-language conventions and system-call locations.

## Memory and cassette buffer
- The cassette buffer used on earlier models at $0330 is no longer at that address; programs and examples using $0330 must be relocated.
- Available RAM for relocated cassette I/O and similar buffers is noted at $0400–$07FF in these machines (use these ranges for data/temporary buffers when porting code).
- Bank switching changes the visible memory map dynamically; code and data placement must account for which bank is active.

## Bank switching, transfer sequences, and bootstraps
- Bank switching on the 6509 is more complex than on earlier models and requires careful handling when accessing ROM (KERNAL/IO) vs. RAM banks.
- Large programs typically require a "transfer sequence" — a small program that arranges the 6509 bank registers so a given program bank can access the KERNAL or other banks as needed.
- Bootstraps are commonly used to initialize bank registers and establish the runtime environment before the main program executes.

## Built-in monitor and new commands
- A machine-language monitor is built into B-series machines.
- New monitor commands in this line include:
  - .V — switch banks
  - .@ — test disk status

## Source Code
(omitted — no code or register maps present in this chunk)

## Key Registers
(omitted — chunk describes memory addresses and bank-switching behavior, not specific device register mappings)

## References
- "appendix_c_memory_maps" — Bank-switching affects memory map and placement of code/data