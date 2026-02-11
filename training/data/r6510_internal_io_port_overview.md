# $0001 — R6510 Processor Port (I/O Port, $01)

**Summary:** R6510 processor port at $0001 controls memory banking signals LORAM/HIRAM/CHAREN and cassette lines (data out, switch sense, motor). Use this register to swap BASIC/Kernal/Character ROMs and I/O into the CPU address space (memory banking).

## Description
This single-byte R6510 port determines which ROM/RAM and I/O blocks the CPU sees by driving the processor address space decode lines. The port’s primary role is memory banking: selecting whether the ranges $A000-$BFFF (BASIC ROM), $D000-$DFFF (character ROM vs I/O), and $E000-$FFFF (Kernal ROM) map to ROM or to underlying RAM. The C64 contains 64K RAM plus three ROMs (8K BASIC at $A000, 4K Character ROM typically in the $D000 area, 8K Kernal at $E000) and I/O chips (VIC-II, SID, CIAs). Because all cannot be mapped simultaneously into 64K, the $0001 port selects which are visible.

Bits 3–5 control the datasette interface (data out, switch sense, motor control). Bits 6–7 are unused. The port’s data-direction register at $0000 (see referenced chunk) must be set appropriately to read the cassette switch (bit 4) or to drive motor/data-out bits.

## Source Code
```text
Register $0001 (decimal 1) — R6510 Processor Port (I/O port)

Bit 0: LORAM   - Selects ROM or RAM at $A000-$BFFF (40960 decimal)
               1 = BASIC ROM visible, 0 = RAM visible

Bit 1: HIRAM   - Selects ROM or RAM at $E000-$FFFF (57344 decimal)
               1 = Kernal ROM visible, 0 = RAM visible

Bit 2: CHAREN  - Selects character ROM or I/O devices at $D000-$DFFF
               1 = I/O devices visible, 0 = Character ROM visible

Bit 3: Cassette Data Output line (output)

Bit 4: Cassette Switch Sense (input)
               Reads 0 if button pressed, 1 if not pressed

Bit 5: Cassette Motor Control (output)
               1 = motor on, 0 = motor off

Bits 6-7: Not connected / no defined function
```

## Key Registers
- $0001 - R6510 - Processor port: LORAM (bit0), HIRAM (bit1), CHAREN (bit2), cassette data out (bit3), cassette switch sense (bit4), cassette motor control (bit5); bits 6-7 unused

## References
- "d6510_data_direction_register_at_0" — expands on Data direction required for reading cassette switch and controlling port bits
- "loram_hiram_and_moving_rom_to_ram_examples" — detailed behavior of LORAM/HIRAM and examples of copying ROM to RAM and switching
- "charen_bit_and_reading_character_rom_into_ram" — details of CHAREN and how to read the character ROM into RAM
- "cartridges_game_exrom_and_memory_configurations" — how cartridge GAME/EXROM lines interact with these port signals to change memory mapping
- "datasette_control_bits_and_motor_interlock" — details of cassette-related bits (bits 3–5) and motor/interlock behavior

## Labels
- R6510
- LORAM
- HIRAM
- CHAREN
