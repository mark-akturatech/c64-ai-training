# Commodore 64 Hardware Overview — CPU, Memory, VIC‑II, SID, CIAs

**Summary:** High‑level breakdown of Commodore 64 subsystems: 6510 CPU (1.0225 MHz, 64K address space), 64K DRAM + 20K ROM with bank switching, VIC‑II video chip (video generation, DRAM refresh, 8.18 MHz dot clock), SID sound chip (3 voices, envelopes, waveforms, filter), and two 6526 CIAs (I/O, timers, serial/parallel). Searchable terms: 6510, bank switching, VIC‑II, 8.18 MHz, SID, 6526 CIA.

**Central Processing Unit (6510)**
The CPU is a MOS 6510 microprocessor implementing the 6502 instruction set. Key characteristics from the source:
- Clock: quoted as 1.0225 MHz (commonly treated as "1 MHz" for programming).
- Addressing range: 65,536 bytes (64K).
- Programs run on the 6510 and control peripheral chips by reading/writing their registers in the memory map.

**Memory and Bank Switching**
- Main RAM: 64K dynamic RAM (DRAM). The DRAM is the primary read/write memory for programs and data.
- ROM: 20K of system ROM contains BASIC and the operating system (KERNAL and character ROMs implied by ROM total).
- Bank switching: Because the CPU address space is limited to 64K while the system contains both RAM and ROM, bank switching is used to make different physical memory visible at the same logical addresses. Example from source: when BASIC is not needed, its ROM can be hidden and RAM substituted in that address range so the CPU can access additional RAM transparently.

**Video generation (6567 VIC‑II)**
- Video chip: 6567 VIC‑II (generates all C64 graphics modes).
- Responsibilities:
  - Generates video signal and graphic modes.
  - Refreshes the dynamic RAM during video generation (thus acting as DRAM refresh master).
  - Derives system timing from an 8.18 MHz dot clock.
- Practical programming note from source: most programs will interact with the VIC‑II for graphics output and must respect its memory windowing (VIC‑II sees one 16K bank at a time — see referenced material for bank selection details).

**Sound (SID)**
- Sound chip: SID (Sound Interface Device), specifically the MOS 6581 model.
- Capabilities described:
  - 3 independent voices.
  - Each voice has independent volume envelope control and selectable waveforms.
  - Built‑in filtering options applicable to internal signals or an external input.
- Frequency range: Each oscillator can generate frequencies from approximately 16 Hz to 4 kHz, covering 8 octaves. ([fr.wikipedia.org](https://fr.wikipedia.org/wiki/SID_%28microprocesseur%29?utm_source=openai))

**Input/Output (two 6526 CIAs)**
- Two 6526 Complex Interface Adapters (CIAs) handle I/O:
  - Serial communication (e.g., IEC bus) and parallel port functions.
  - Joystick inputs and the real‑time clock.
  - Each CIA contains a pair of independent 16‑bit timers.
- These chips are the primary interface for peripheral and timed I/O in typical programs.

**Programming focus**
- For most C64 programs the primary chips you will control are:
  - VIC‑II (graphics and DRAM refresh timing).
  - SID (sound generation).
  - CPU (6510) to write the registers of those chips at appropriate times.
- Understanding these chips and bank switching is sufficient to implement most system capabilities; the CIAs are used for I/O and timers.

## References
- "6510_architecture_and_registers" — expands on 6510 registers and stack  
- "graphics_memory_locations_and_vic_bank_selection" — expands on VIC‑II visible 16K bank selection and graphics memory locations  
- "color_memory" — expands on color RAM and how VIC‑II uses it
