# $D016 SCROLX — Horizontal Fine Scrolling and Control Register

**Summary:** $D016 (VIC-II) is the SCROLX horizontal fine-scroll and control register: bits 0-2 = fine horizontal scroll (0-7 dots), bit 3 = 38/40-column select, bit 4 = multicolor text/bitmap enable, bit 5 = video chip reset (video off). Default power-up value = 8.

## Description
$D016 is a multifunction control register in the VIC-II that primarily provides horizontal fine-scrolling and several global video control flags.

- Bits 0-2: Fine horizontal scroll offset in dot positions (0-7). Use values 1–7 to shift the displayed window smoothly 1–7 dots to the right (smooth transition between character columns). A value of 0 is no fine offset. This lets the display act as a 1–7 dot window over the larger character/bitmap data so horizontal motion can be smooth instead of coarse 8-dot character jumps.
- Bit 3: Select 38-column or 40-column text display (1 = 40 columns, 0 = 38 columns).
- Bit 4: Enable multicolor text or multicolor bitmap mode (1 = multicolor on, 0 = multicolor off). (See referenced chunk for interaction details with bitmap multicolor.)
- Bit 5: Video chip reset (0 = normal operation, 1 = video completely off).
- Bits 6-7: Unused.

Default after power-up: 8 ($08): video reset clear (normal), multicolor disabled, 40-column text selected, fine-scroll offset 0.

**[Note: Source may contain an error — original text incorrectly describes bits 0-2 as controlling vertical fine scrolling; they control horizontal fine scrolling in $D016.]**

## Source Code
```text
$D016        SCROLX       Horizontal Fine Scrolling and Control Register

                     0-2  Fine scroll display horizontally by X dot positions (0-7)
                     3    Select a 38-column or 40-column text display (1=40 columns,
                            0=38 columns)
                     4    Enable multicolor text or multicolor bitmap mode (1=multicolor on,
                            0=multicolor off)
                     5    Video chip reset (0=normal operations, 1=video completely off)
                     6-7  Unused

                          This is one of the two important multifunction control registers on
                          the VIC-II chip.  On power-up, it is set to a default value of 8,
                          which means that the VIC chip Reset line is set for a normal display,
                          Multicolor Mode is disabled, a 40-column text display is selected, and
                          no horizontal fine-scroll offset is used.
```

```basic
10 FOR I=1 TO 50:FOR J=0 TO 7
20 POKE 53270,(PEEK(53270)AND248) OR J:NEXT J,I
30 FOR I=1 TO 50:FOR J=7 TO 0 STEP-1
40 POKE 53270,(PEEK(53270)AND248) OR J:NEXT J,I
```

## Key Registers
- $D016 - VIC-II - Horizontal fine-scroll offset (bits 0-2), 38/40-col select (bit 3), multicolor enable (bit 4), video reset (bit 5)

## References
- "bitmap_multicolor_enable_note" — expands on Bit 4 interaction with bitmap multicolor mode
- "d011_vertical_fine_scrolling_bits0_2_and_demo" — expands on D011 and D016 as the two fine-scroll registers (vertical/horizontal)

## Labels
- SCROLX
