# COMMODORE 64 — Audio/Video and Serial I/O connector pinouts

**Summary:** Pin mappings for the Commodore 64 6-pin Audio/Video and 6-pin Serial I/O connectors, listing signal names: LUMINANCE, VIDEO OUT, AUDIO IN/OUT, CHROMINANCE, /SERIAL SRQ IN, SERIAL ATN, SERIAL CLK, SERIAL DATA, /RESET, and GND.

## Audio/Video connector
Pin mapping for the C64 audio/video DIN connector. Signals provided: luminance (luma), chrominance (chroma), composite/video out, audio out/in, and ground.

## Serial I/O connector
Pin mapping for the C64 serial (IEC) 6-pin connector. Signals provided: serial bus lines (ATN, CLK, DATA), serial request (/SERIAL SRQ IN), active-low /RESET, and ground.

## Source Code
```text
Audio/Video                        Serial I/O
   Pin            Type                Pin            Type
+-------+----------------------+   +-------+----------------------+
|   1   |  LUMINANCE           |   |   1   |  /SERIAL SRQ IN      |
|   2   |  GND                 |   |   2   |  GND                 |
|   3   |  AUDIO OUT           |   |   3   |  SERIAL ATN OUT      |
|   4   |  VIDEO OUT           |   |   4   |  SERIAL CLK IN/OUT   |
|   5   |  AUDIO IN            |   |   5   |  SERIAL DATA IN/OUT  |
|   6   |  CHROMINANCE         |   |   6   |  /RESET              |
+-------+----------------------+   +-------+----------------------+
```

Connector illustrations (simplified):
```text
Audio/Video                      Serial I/O
      ++ ++                           ++ ++
     / +-+ \                         / +-+ \
    /       \                       /5     1\
   +         +                     +  O   O  +
   |    6    |                     |    6    |
   |3O  O  O1|                     |    O    |
   |         |                     |         |
   +  O   O  +                     +  O   O  +
    \5  O  4/                       \4  O  2/
     \  2  /                         \  3  /
      +---+                           +---+
```

## References
- "cartridge_expansion_slot_pinout" — cartridge slot pinout (nearby appendix)
- "cassette_connector_pinout" — cassette connector pinout (other peripheral connector)