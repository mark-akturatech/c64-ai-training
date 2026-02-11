# ASCII-to-colour lookup table ($E8DA-$E8E9)

**Summary:** 16-byte ASCII-to-colour lookup table located at $E8DA-$E8E9 mapping CHR$() indices 0–15 to Commodore 64 colour values; used by the set_colour (set_colour_code) routine which scans this table to set $0286.

## Table description
This ROM data block is a 16-byte lookup table (addresses $E8DA..$E8E9 inclusive). Each byte is a C64 colour value (byte) corresponding to a CHR$() code index (0–15). The set_colour routine reads an index and uses this table to determine the colour to write to $0286.

- Length: 16 bytes
- Address range: $E8DA–$E8E9
- Purpose: Map CHR$() codes (indices 0..15) to C64 colour bytes for the set_colour routine.

## Source Code
```text
$E8DA  $90  (144)  - black
$E8DB  $05    (5)  - white
$E8DC  $1C   (28)  - red
$E8DD  $9F  (159)  - cyan
$E8DE  $9C  (156)  - purple
$E8DF  $1E   (30)  - green
$E8E0  $1F   (31)  - blue
$E8E1  $9E  (158)  - yellow
$E8E2  $81  (129)  - orange
$E8E3  $95  (149)  - brown
$E8E4  $96  (150)  - light red
$E8E5  $97  (151)  - dark grey
$E8E6  $98  (152)  - medium grey
$E8E7  $99  (153)  - light green
$E8E8  $9A  (154)  - light blue
$E8E9  $9B  (155)  - light grey
```

## References
- "set_colour_code" — routine that scans this table and sets $0286

## Labels
- BLACK
- WHITE
- RED
- CYAN
- PURPLE
- GREEN
- BLUE
- YELLOW
- ORANGE
- BROWN
- LIGHT_RED
- DARK_GRAY
- GRAY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GRAY
