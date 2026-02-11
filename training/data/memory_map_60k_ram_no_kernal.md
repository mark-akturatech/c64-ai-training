# Commodore 64 — Fig. 7-4: 60K RAM Memory Map (No KERNAL ROM)

**Summary:** Diagram of the C64 memory layout when the KERNAL ROM is absent, showing address boundaries $0000, $8000, $C000, $D000, $E000, and the stacked regions (32K RAM, 16K RAM, 4K RAM, 4K I/O/CHAR area, 8K RAM). Mentions bank-switch control bits LORAM and HIRAM and the built-in character generator ROM overlap.

**Memory Map Explanation**

The Commodore 64 has a built-in character generator ROM that resides at addresses $D000–$DFFF. This ROM contains the standard character set used by the system. The memory map depicted in Fig. 7-4 illustrates the configuration when the KERNAL ROM is disabled, allowing access to 60K of RAM. The address space is divided as follows:

- **$0000–$7FFF (32K RAM):** Lower RAM area.
- **$8000–$BFFF (16K RAM):** Middle RAM area.
- **$C000–$CFFF (4K RAM):** Upper RAM area.
- **$D000–$DFFF (4K I/O/CHAR):** I/O registers and Character ROM.
- **$E000–$FFFF (8K RAM):** High RAM area.

In this configuration, the LORAM and HIRAM control bits, located in the processor port at address $0001, are set to 0, which disables the BASIC and KERNAL ROMs, respectively, and maps the corresponding areas to RAM. The CHAREN bit (bit 2 of $0001) controls the visibility of the Character ROM and I/O devices in the $D000–$DFFF range. Setting CHAREN to 0 maps the Character ROM into this range, while setting it to 1 maps the I/O devices.

## Source Code

```text
The Commodore 64 has a built-in character generator ROM located at addresses $D000–$DFFF.

$E000
$D000
$C000

8K RAM

LORAM = 0
HIRAM = 0
CHAREN = 0

4K I/O/CHAR

4K RAM

16K RAM

$8000

32K RAM

$0000

Fig. 7-4. 60K RAM memory map with no KERNAL ROM.
```

## Key Registers

- **$0001 (Processor Port):** Controls memory configuration.
  - **Bit 0 (LORAM):** 0 = Switch BASIC ROM out, 1 = Switch BASIC ROM in.
  - **Bit 1 (HIRAM):** 0 = Switch KERNAL ROM out, 1 = Switch KERNAL ROM in.
  - **Bit 2 (CHAREN):** 0 = Map Character ROM in, 1 = Map I/O devices in.

## References

- "memory_map_default_42k_ram" — covers the related alternate/default memory map (Fig. 7-5) and differences when KERNAL/BASIC ROMs are present.
- "character_generator_rom_and_bank_switching" — explains character-generator ROM placement, its overlap with $D000 I/O area, and the bank-switching details that affect the memory map.

## Labels
- PROCESSOR_PORT
- LORAM
- HIRAM
- CHAREN
