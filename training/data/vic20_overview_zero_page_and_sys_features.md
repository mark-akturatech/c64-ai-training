# VIC-20 overview

**Summary:** VIC-20 design summary covering built-in color/graphics/sound, changed memory/zero-page layout, BASIC compatibility with Upgrade ROM, and the SYS preloader feature (POKE 780/781/782 — $030C/$030D/$030E; optional status at 783 — $030F).

**Design and features**
- The VIC-20 was a new-design Commodore machine with color, graphics, and sound integrated into the system hardware rather than added externally.
- The memory architecture was reorganized compared with PET/CBM models; zero-page and workspace locations were shifted significantly.
- BASIC on the VIC-20 is essentially the Upgrade ROM variant: it retains all Upgrade ROM functions, lacks special disk commands, and may exhibit slower garbage collection. BASIC was not trimmed of features; a few new screen-editing conveniences were added (for example, automatic key repeat).
- No built-in machine-language monitor is provided — a monitor must be loaded from external storage.

**SYS command and preloading registers**
- The VIC-20’s BASIC SYS command supports a convenient preloading mechanism: values can be POKEd into three RAM locations before invoking SYS to preset the 6502 registers A, X, and Y on entry to the machine-code routine.
- Decimal and hex addresses:
  - POKE 780 → A on entry (decimal 780 = $030C)
  - POKE 781 → X on entry (decimal 781 = $030D)
  - POKE 782 → Y on entry (decimal 782 = $030E)
- A fourth location (decimal 783 = $030F) can be used to set the processor status byte on entry, but this is dangerous: setting the status blindly can enable decimal mode or disable interrupts unintentionally. Use the status preload only with precise control over flag bits.

**Machine-language programming caveats**
- Machine-language development on the VIC-20 is complicated by memory-configuration-dependent workspace and screen locations: the start-of-BASIC and screen memory addresses change depending on how much RAM is present (no expansion, 3K expansion, 8K+ expansion).
- Because these addresses vary with cartridge/expansion configuration, machine-code projects must either detect/adjust for the installed memory or require a fixed memory configuration.

**Memory configurations and addresses**
The VIC-20's memory layout varies depending on the amount of RAM installed. Below are the start addresses for BASIC and screen memory across different configurations:

| Memory Configuration | Start of BASIC | Screen Memory |
|----------------------|----------------|---------------|
| Unexpanded           | $1000 (4096)   | $1E00 (7680)  |
| +3K Expansion        | $0400 (1024)   | $1E00 (7680)  |
| +8K Expansion        | $1200 (4608)   | $1000 (4096)  |
| +16K Expansion       | $1200 (4608)   | $1000 (4096)  |
| +24K Expansion       | $1200 (4608)   | $1000 (4096)  |

In unexpanded and 3K expanded configurations, screen memory is located after BASIC. With 8K or more expansion, screen memory is positioned before BASIC. This arrangement allows for contiguous BASIC memory in expanded systems. ([techtinkering.com](https://techtinkering.com/articles/changing-screen-dimensions-on-the-commodore-vic-20/?utm_source=openai))

**Practical use of the SYS preloader**
The SYS command in VIC-20 BASIC allows for preloading the 6502 registers A, X, and Y by POKEing values into specific memory locations before invoking SYS. This feature is useful for passing parameters to machine language routines.

**Example: Setting Cursor Position**

To set the cursor position using a system routine:


In this example:
- The X register (POKE 781) sets the column.
- The Y register (POKE 782) sets the row.
- The A register (POKE 780) is not used in this routine.

**Caution with Status Register (POKE 783):**

While it's possible to preload the status register (POKE 783), doing so can inadvertently enable decimal mode or disable interrupts. It's recommended to use this feature only when you have precise control over the flag bits. ([c64-wiki.com](https://www.c64-wiki.com/wiki/SYS?utm_source=openai))

## Source Code

```basic
POKE 780, 0   : REM Set A register (not used here)
POKE 781, 10  : REM Set X register (column)
POKE 782, 5   : REM Set Y register (row)
SYS 58640     : REM Call system routine to position cursor
```


## Key Registers
- $030C-$030F - System RAM (BASIC workspace) - Preload locations used by SYS: A ($030C / dec 780), X ($030D / dec 781), Y ($030E / dec 782), Processor Status ($030F / dec 783, use with caution)

## References
- "commodore_64_overview_memory_and_SYS" — expands on similarities and differences with the C64 memory/SYS behavior