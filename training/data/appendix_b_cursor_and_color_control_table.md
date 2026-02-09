# Commodore 64 Control & Color Key Mapping (Appendix B)

**Summary:** Mapping of printed control names ([CLR], [HOME], [UP], color names like [BLU]/[WHT], and bracketed [<n>] tokens) to Commodore 64 key combinations (SHIFT, CTRL, C=) and function keys F1–F8 (including shifted variants). Use when entering cursor and color control keys; [<n>] denotes the Commodore C= key plus the digit (C= 1, C= 2, ...).

## Control-to-Key Mapping
This packet provides the canonical keypress translations used on the Commodore keyboard for cursor controls, color selects, the [CLR]/[HOME] pair, and special bracketed numeric tokens [<n>] that map to C=+digit. Function keys F1–F8 and their shifted variants are included (some color tokens map to CTRL+digit).

Examples (for searchability): [BLU] -> CTRL 7, [CLR] -> SHIFT CLR/HOME, [UP] -> SHIFT CRSR UP/DOWN, [<1>] -> C= 1.

## Source Code
```text
Use the following table when entering cursor and color control keys:

When You                               When You
Read:         Press:                   Read:          Press:
[CLR]       SHIFT CLR/HOME             [<1>]           C= 1
[HOME]            CLR/HOME             [<2>]           C= 2
[UP]        SHIFT CRSR UP/DOWN         [<3>]           C= 3
[DOWN]            CRSR UP/DOWN         [<4>]           C= 4
[LEFT]      SHIFT CRSR LEFT/RIGHT      [<5>]           C= 5
[RIGHT]           CRSR LEFT/RIGHT      [<6>]           C= 6
[RVS]        CTRL 9                    [<7>]           C= 7
[OFF]        CTRL 0                    [<8>]           C= 8
[BLK]        CTRL 1                    [F1]               F1
[WHT]        CTRL 2                    [F2]         SHIFT F1
[RED]        CTRL 3                    [F3]               F3
[CYN]        CTRL 4                    [F4]         SHIFT F3
[PUR]        CTRL 5                    [F5]               F5
[GRN]        CTRL 6                    [F6]         SHIFT F5
[BLU]        CTRL 7                    [F7]               F7
[YEL]        CTRL 8                    [F8]         SHIFT F8
```

## Key Registers
(none)

## References
(none)