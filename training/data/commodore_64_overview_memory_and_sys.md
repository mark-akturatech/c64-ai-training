# Commodore 64 — Machine Overview (6510, zero page, $0400, $C000-$CFFF, SYS)

**Summary:** 6510 CPU with processor-port bank switching ($0000/$0001), VIC/VIC-20-like zero page layout, BASIC start and screen RAM at $0400, and an unused RAM bank at $C000-$CFFF useful for staging machine code; SYS supports preloading A/X/Y registers.

## Architecture and compatibility with VIC-20
The C64 uses a MOS 6510 CPU (6510 = 6502 core + integrated I/O port). Its zero page organization is nearly identical to the VIC-20, so many VIC-20 machine-language conventions and utilities (zero-page variable placement, entry points, etc.) map directly to the C64.

The 6510 exposes two low-address lines used as a processor port at addresses $0000 and $0001; these are used to control memory bank switching (selecting ROM/RAM, I/O, Kernal, BASIC, and cartridge visibility).

BASIC on the C64 is the same dialect as the VIC-20 (no built-in disk commands). There is no built-in machine-language monitor, so a monitor must be loaded separately. The SYS command (as on VIC) can be used to jump to machine code entry points and supports preloading of A, X, and Y registers.

## Memory layout notes relevant to machine-code development
- BASIC and system vectors occupy consistent locations on the C64 (BASIC start is consistent between machines). The default screen RAM location is $0400 (hex) unless explicitly moved by software.
- The address range $C000-$CFFF is a block of RAM not used by the system in typical configurations and is commonly used to stage machine-language programs, loaders, or temporary data. Because BASIC and the Kernal/ROM can be banked out via $0000/$0001, it is common for large applications to swap out BASIC entirely to free more RAM for machine-code-only programs (word processors, spreadsheets, etc.).
- Writing entirely in machine language is often desirable on the C64 for performance and RAM usage reasons; the 6510 bank-switching port makes it practical to remove ROM images from the address space to reclaim RAM.

## Key Registers
- $0000-$0001 - 6510 - Processor port / bank-switching control (selects RAM/ROM/I/O visibility)
- $0400 - Memory - Default screen RAM start (BASIC screen memory)
- $C000-$CFFF - Memory - Unused RAM bank commonly used for staging machine code

## References
- "vic20_overview_zero_page_and_sys_features" — expands on shared features with VIC-20 and SYS preloading functionality
