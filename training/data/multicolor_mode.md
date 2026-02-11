# Multicolor Text Mode (C64)

**Summary:** Multicolor text mode on the VIC-II allows each text cell to display up to four colors by interpreting character bitmap bits as pairs. The color sources include:

- **Background Color 0** ($D021)
- **Background Color 1** ($D022)
- **Background Color 2** ($D023)
- **Character Color** (from color RAM)

This mode is enabled by setting bit 4 of the VIC-II Control Register 2 at $D016. A character is rendered in multicolor mode when its color RAM value is 8 or greater. Note that horizontal resolution is halved, resulting in characters that are 4x8 pixels.

**Description**

In multicolor text mode, the VIC-II interprets each pair of bits in the character bitmap to select one of four colors, effectively reducing the horizontal resolution by half. Each character cell becomes 4x8 pixels. The color sources are:

- **Bit-pair 00**: Background Color 0 ($D021)
- **Bit-pair 01**: Background Color 1 ($D022)
- **Bit-pair 10**: Background Color 2 ($D023)
- **Bit-pair 11**: Character Color (from color RAM)

To enable multicolor text mode, set bit 4 of the VIC-II Control Register 2 at $D016. This can be done with the following command:


To disable it, clear bit 4:


A character is displayed in multicolor mode if its color RAM value is 8 or greater. This allows for mixing standard and multicolor text cells on the same screen.

## Source Code

```basic
POKE 53270, PEEK(53270) OR 16
```

```basic
POKE 53270, PEEK(53270) AND 239
```


```text
Register reference:

$D016  - VIC-II Control Register 2 (bit 4 = multicolor mode enable)
$D021  - Background Color 0 (bit-pair 00)
$D022  - Background Color 1 (bit-pair 01)
$D023  - Background Color 2 (bit-pair 10)

Color RAM (per-character color selector):
- Contains a 4-bit value per character cell (0-15).
- If the value is 8 or greater, the cell is rendered in multicolor mode.
- The lower 3 bits provide the character color (used for bit-pair 11).
```

## Key Registers

- $D016 - VIC-II Control Register 2 (bit 4 enables multicolor mode)
- $D021 - Background Color 0
- $D022 - Background Color 1
- $D023 - Background Color 2

## References

- "Multicolor Character Mode" — details on character color selection and bit-pair mapping
- "Graphics Modes" — overview of VIC-II graphics modes and register settings