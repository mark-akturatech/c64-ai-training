# Autostart Cartridge Detection (ROM $FD02)

**Summary:** ROM routine at $FD02 tests bytes at $8004-$8008 (32772-32776) for an autostart cartridge signature (PETASCII 'CBM' with high bit set + the characters "80"); Zero flag set on match.

## Autostart detection routine
The KERNAL ROM checks the cartridge image for a 5-byte signature located at cartridge offsets that appear at memory $8004-$8008 (decimal 32772–32776). The check is performed by the routine beginning at $FD02 (decimal 64770). If the five bytes match the expected signature the processor Zero (Z) flag is set; if they do not match the Z flag is cleared.

The signature must occupy the 5th through 9th characters in the cartridge binary for the cartridge to be considered for automatic start on power-up. The signature described in the ROM is: the PETASCII values for "C", "B", "M" each with bit 7 set (+128), followed by the characters "8" and "0" (no high bit).

## Source Code
```text
ROM references:
  64770   $FD02    - Check for an Autostart Cartridge (routine entry)
  64784   $FD10    - Text for Autostart Cartridge Check

Cartridge signature (bytes found at $8004-$8008 = decimal 32772-32776):

  Offset   Address   Hex   Dec   PETASCII
  +4       $8004     $C3   195   'C' + 128
  +5       $8005     $C2   194   'B' + 128
  +6       $8006     $CD   205   'M' + 128
  +7       $8007     $38    56   '8'
  +8       $8008     $30    48   '0'

Signature byte sequence: $C3, $C2, $CD, $38, $30
(decimal: 195, 194, 205, 56, 48)
(Addresses: 32772, 32773, 32774, 32775, 32776)
```

## References
- "power_on_reset_routine" — expands how RESET/power-up uses this check to decide cartridge cold-start behavior