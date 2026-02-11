# Kernal Version Identifier Byte ($FF80 / 65408)

**Summary:** Kernal version identifier byte located at $FF80 (decimal 65408) in the Kernal ROM; values observed: $AA (170) for the very first Kernal, $00 (0) for later common Kernal releases, and $64 (100) for the PET 64 which allows software (e.g., the Commodore 64 logo) to detect and adjust for the PET 64.

## Description
This single byte at $FF80 (the last byte before the Kernal jump table) is used to identify the installed Kernal version. Known values:
- $AA (170) — earliest released Kernal version.
- $00 (0) — later/common Kernal version used in most C64 systems.
- $64 (100) — identifier used by the PET 64 (integrated monochrome unit). Software, including the Commodore 64 logo routine, reads this byte to detect a PET 64 and adjust display output accordingly.

No additional bit-field or multi-byte structure—it's a standalone identifier byte stored in the Kernal ROM.

## Source Code
```text
Address (dec)  Address (hex)  Description
65408          $FF80          Kernal Version Identifier Byte

Observed values:
$AA = 170   -> first Kernal version
$00 = 0     -> later/common Kernal version
$64 = 100   -> PET 64 identifier (used by C64 logo for detection)
```

## Key Registers
- $FF80 - KERNAL ROM - Kernal version identifier byte

## References
- "kernal_version_byte" — description and observed values for $FF80