# Commodore PLUS/4 Overview

**Summary:** The Commodore Plus/4 utilizes the 7501 CPU, compatible with the 6502 instruction set, and features an expanded BASIC 3.5. It has a unique memory layout with screen memory and BASIC RAM positioned differently from the Commodore 64. Video and sound functionalities are managed by the TED (7360) chip, differing from the C64's hardware. The system includes a built-in machine-language monitor (TEDMON) with assembling and disassembling capabilities. Advanced memory configurations employ bank-switching mechanisms to manage ROM and RAM access.

**Overview**

- **CPU:** 7501 or 8501 microprocessor, instruction set compatible with the 6502.
- **BASIC:** BASIC 3.5, significantly expanded from earlier Commodore models, offering over 75 commands.
- **Memory Layout:**
  - Screen memory and BASIC RAM are relocated compared to the C64, necessitating adjustments for programs assuming C64 addresses.
  - The system supports bank-switching to manage ROM and RAM access, allowing for a true 64K of RAM usage.
- **Video/Sound:**
  - Managed by the TED (7360) chip, which integrates video, sound, DRAM refresh, interval timers, and keyboard input handling.
  - Graphics capabilities include a resolution of 320×200 pixels with 121 colors (16 primary colors with 8 luminance levels, plus black).
  - Sound features two channels: one square wave and a second channel capable of either a square wave or white noise.
- **Built-in Monitor:** TEDMON provides machine-language monitoring with assembling and disassembling capabilities, facilitating on-machine development and debugging.
- **Programmer Implications:**
  - Existing C64 machine-language routines that reference absolute screen or BASIC RAM addresses require relocation or adjustment.
  - The expanded BASIC and different I/O mapping may alter interactions between BASIC and machine code, such as memory reserved for BASIC, screen, and system vectors.
  - Advanced memory configurations necessitate understanding the Plus/4's bank-switching architecture to prevent conflicts with ROM and I/O.

**Memory Map**

The Plus/4's memory is organized as follows:

- **$0000–$07FF:** Zero Page and System RAM
- **$0800–$0BFF:** Color RAM
- **$0C00–$0FFF:** Video RAM
- **$1000–$7FFF:** BASIC RAM (program and variables)
- **$8000–$BFFF:** BASIC ROM
- **$C000–$FFFF:** Kernal ROM and I/O Registers

Bank-switching allows for dynamic mapping of ROM and RAM, enabling full utilization of the 64K RAM. ([historybit.it](https://www.historybit.it/wp-content/uploads/2024/03/Commodore-Plus-4-Service-Manual.pdf?utm_source=openai))

**Video and Sound Hardware**

The TED (7360) chip integrates video and sound functionalities:

- **Graphics:**
  - Resolution: 320×200 pixels
  - Colors: 121 (16 primary colors with 8 luminance levels, plus black)
  - Supports text and graphics modes with hardware cursor, reverse display, and blinking characters.
- **Sound:**
  - Two channels:
    - Channel 1: Square wave
    - Channel 2: Square wave or white noise
  - Volume control with 16 levels.

The TED also handles DRAM refresh, interval timers, and keyboard input. ([historybit.it](https://www.historybit.it/wp-content/uploads/2024/03/Commodore-Plus-4-Service-Manual.pdf?utm_source=openai))

**Machine-Language Monitor (TEDMON)**

TEDMON provides the following commands:

- **A:** Assemble
- **D:** Disassemble
- **M:** Memory display
- **F:** Fill memory
- **H:** Hunt (search memory)
- **T:** Transfer (copy memory)
- **G:** Go (execute program)
- **X:** Exit to BASIC

To enter TEDMON, type `MONITOR` in BASIC. To exit, type `X`. ([retrocombs.com](https://retrocombs.com/plus4-encyclopedia?utm_source=openai))

**CPU Clock and Timing**

The 7501/8501 CPU operates at approximately 0.88 MHz when the raster beam is on the visible screen and approximately 1.77 MHz during the rest of the time. This results in an effective speed comparable to the VIC-20. ([boray.se](https://www.boray.se/commodore/plus4.html?utm_source=openai))

**Bank-Switching Mechanism**

The Plus/4 employs bank-switching to manage memory:

- ROM and RAM can be dynamically mapped in 16K sections.
- By software control through the TED, ROM can be banked out, and RAM banked in, allowing for a true 64K of RAM usage.
- This mechanism enables advanced memory configurations and efficient utilization of system resources. ([historybit.it](https://www.historybit.it/wp-content/uploads/2024/03/Commodore-Plus-4-Service-Manual.pdf?utm_source=openai))

## References

- ([historybit.it](https://www.historybit.it/wp-content/uploads/2024/03/Commodore-Plus-4-Service-Manual.pdf?utm_source=openai))
- ([retrocombs.com](https://retrocombs.com/plus4-encyclopedia?utm_source=openai))
- ([boray.se](https://www.boray.se/commodore/plus4.html?utm_source=openai))