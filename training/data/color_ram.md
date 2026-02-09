# Color RAM ($D800-$DBFF) — Screen color memory

**Summary:** Color RAM at $D800-$DBFF contains per-character screen color data for the VIC-II ($D800-$DBE7 holds 1000 bytes, bits 0-3 only). A small region $DBE8-$DBFF (24 bytes) is unused. Color RAM is separate from screen RAM and controls character colors.

## Description
Color RAM provides a 1:1 per-screen-cell color nibble (4 bits used: bits 0–3) that the VIC-II uses to determine the foreground color for each character cell. The usable color memory covers 1000 bytes aligned with the 40×25 text screen (stored at $D800–$DBE7). The remaining addresses at the end of the page ($DBE8–$DBFF) are unused (24 bytes).

Color RAM is mapped separately from screen RAM (text character codes); consult the screen memory mapping (see "default_screen_memory") for coordination between character codes and their corresponding color entries.

## Source Code
```text
$D800-$DBE7  Color Memory       Screen color data (1000 bytes, bits 0-3 only)
$DBE8-$DBFF  Unused             (24 bytes)
```

## Key Registers
- $D800-$DBFF - Color RAM - screen color memory (1000 bytes at $D800-$DBE7; $DBE8-$DBFF unused)

## References
- "default_screen_memory" — expands on screen RAM mapping and coordination with Color RAM