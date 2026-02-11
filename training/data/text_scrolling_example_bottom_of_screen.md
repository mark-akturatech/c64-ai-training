# Scrolling text onto the bottom of the screen (page130.prg)

**Summary:** Demonstrates VIC-II fine-scroll animation by manipulating low 3 bits of $D011 (53265) for vertical (bottom) scrolling and $D016 (53270) for horizontal scrolling; shows 24-row mode entry, clearing the screen, setting Y-scroll to 7, and a BASIC loop to animate text.

## Description
- Vertical (bottom) scroll: step the low-order 3 bits of $D011 (decimal 53265) through 0–7 while depositing new character data on the bottom-most text line; repeating the sequence produces a smooth vertical in from the bottom.
- Horizontal (left/right) scroll: step the low-order 3 bits of $D016 (decimal 53270) through 0–7 while writing a new column into column 0; repeating produces smooth horizontal entrance from the left. (Fine-scroll = per-pixel sub-character scrolling.)
- Reversing the step direction (e.g., step -1) reverses the motion.
- 24-row mode: clear bit 3 of $D011 via POKE 53265, PEEK(53265) AND 247 (247 = 0xF7) to enter 24-row text mode.
- To set an initial vertical fine-scroll position of 7, clear the low 3 bits with AND 248 then add 7: POKE 53265,(PEEK(53265) AND 248)+7 (248 = 0xF8).
- The example uses CHR$(147) to clear the screen, moves the cursor to the bottom, sets initial scroll, prints text, then decrements the fine-scroll with delays to animate the text moving up onto the screen.

## Source Code
```basic
start tok64 page130.prg
  10 poke53265,peek(53265)and247        :rem go into 24 row mode
  20 printchr$(147)                     :rem clear the screen
  30 forx=1to24:printchr$(17);:next     :rem move the cursor to the bottom
  40 poke53265,(peek(53265)and248)+7:print :rem position for 1st scroll
  50 print"     hello";
  60 forp=6to0step-1
  70 poke53265,(peek(53265)and248)+p
  80 forx=1to50:next                    :rem delay loop
  90 next:goto40
stop tok64
```

## Key Registers
- $D011 - VIC-II - Vertical fine-scroll (low 3 bits) and row-mode control (bit cleared to enter 24-row mode)
- $D016 - VIC-II - Horizontal fine-scroll (low 3 bits)

## References
- "scrolling_registers_and_poking_values" — expands on manipulating scroll bits to animate text

## Labels
- $D011
- $D016
