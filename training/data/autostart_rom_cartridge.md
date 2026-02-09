# Autostart ROM Cartridge at $8000 (32768)

**Summary:** Autostart cartridge area at $8000 with PETASCII autostart signature ($C3,$C2,$CD,$38,$30) at $8004-$8008 enables automatic boot from 8K/16K cartridges; vectors at $8000-$8001 (cold start) and $8002-$8003 (warm start/RESTORE) are used. Notes on alternative cartridge placements ($A000, $F000) and bank-switched cartridges (banking/bank-switch) included.

## Cartridge layout and behavior
- Autostart cartridges intended to occupy $8000 (32768) can be 8K ($8000-$9FFF) or 16K ($8000-$BFFF). On power-up the C64 checks for the PETASCII signature at $8004-$8008; if present, it jumps to the vector stored at $8000-$8001.
- Vectors:
  - $8000-$8001 — autostart (cold-start) vector (pointer to cartridge entry code).
  - $8002-$8003 — warm-start vector (used when RESTORE is pressed).
- Autostart signature (PETASCII inverse): bytes 195, 194, 205, 56, 48 (hex $C3, $C2, $CD, $38, $30) at $8004-$8008 representing "CBM80" (inverse letters CBM + digits 80).
- Cartridges may also be mapped to other ROM regions:
  - $A000-$BFFF — common cartridge slot to replace BASIC (40960 decimal = $A000).
  - $F000-$FFFF — sometimes cited as cartridge placement to affect the KERNAL area (61440 decimal = $F000). **[Note: Source may contain an error — the KERNAL ROM normally occupies $E000-$FFFF (8K); a cartridge at $F000 alone does not cover the full standard KERNAL range.]**
- Banked cartridges: A multi-bank cartridge can switch banks in and out of the visible 8K/16K window (e.g., two 16K banks in a 16K mapping or 32K of ROM banked into 16K of address space). Bank switching is implemented by hardware in the cartridge that changes which ROM bank is visible at the mapped addresses.

## Source Code
```text
Address (hex)   Address (dec)   Byte (hex)  Byte (dec)  ASCII/purpose
$8000           32768           --          --          Autostart vector (low byte stored here)
$8001           32769           --          --          Autostart vector (high byte stored here)
$8002           32770           --          --          Warm-start (RESTORE) vector low byte
$8003           32771           --          --          Warm-start (RESTORE) vector high byte
$8004           32772           $C3         195         PETASCII inverse 'C'
$8005           32773           $C2         194         PETASCII inverse 'B'
$8006           32774           $CD         205         PETASCII inverse 'M'
$8007           32775           $38         56          ASCII '8'
$8008           32776           $30         48          ASCII '0'
Example cartridge mappings:
- 8K cartridge at $8000-$9FFF (32768-40959)
- 16K cartridge at $8000-$BFFF (32768-49151)
- BASIC replacement: $A000-$BFFF (40960-49151)
- KERNAL replacement (source claim): $F000-$FFFF (61440-65535) — see note above
```

## Key Registers
- $8000-$8001 - Cartridge ROM vectors - autostart entry pointer (low/high)
- $8002-$8003 - Cartridge ROM vector - warm-start (RESTORE) pointer (low/high)
- $8004-$8008 - Cartridge autostart signature bytes ($C3,$C2,$CD,$38,$30) PETASCII "CBM80"
- $8000-$9FFF - Typical 8K autostart cartridge window
- $8000-$BFFF - Typical 16K cartridge window (if cartridge occupies 16K)
- $A000-$BFFF - Cartridge area that replaces BASIC (alternative cartridge slot)
- $F000-$FFFF - Cartridge area cited to affect KERNAL (source claim; see note)

## References
- "character_rom_image_vic_bank0" — expands on cartridge locations and VIC-II/CPU memory banking