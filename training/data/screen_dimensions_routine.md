# KERNAL SCRORG routine ($E505) — returns screen geometry

**Summary:** KERNAL ROM routine SCRORG at $E505 returns screen geometry in registers X/Y (LDX #$28, LDY #$19 — 40×25). Used by the editor to obtain LLEN and NLINES constants.

## Description
SCRORG is a tiny KERNAL entry that returns compile-time editor constants for screen width and height. Calling it sets:
- X = $28 (hex) = 40 (columns, LLEN)
- Y = $19 (hex) = 25 (rows, NLINES)

Behavioral notes:
- Values are constants baked into the ROM (no hardware query); assumes standard 40×25 text screen.
- Routine has no side effects and simply returns with RTS.
- Typically used by the editor library to size buffers, wrap text, and compute cursor bounds.

## Source Code
```asm
.,E505 A2 28    LDX #$28        SCRORG LDX #LLEN
.,E507 A0 19    LDY #$19        LDY    #NLINES
.,E509 60       RTS             RTS
```

## References
- "editor_lib_intro_and_undef" — defines editor constants LLEN and NLINES used by SCRORG

## Labels
- SCRORG
