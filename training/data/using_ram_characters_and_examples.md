# Using RAM character set on the Commodore 64 (POKE 53272,...)

**Summary:** Shows how to switch the VIC-II to use a character set copied into RAM (POKE 53272,(PEEK(53272) AND 240)+12), how to invert (reverse) a character by bitwise inversion (POKE I,255-PEEK(I)), and how to compute the RAM address for a character code when the character base is 12288 (each character = 8 bytes).

## Explanation
POKE 53272,(PEEK(53272) AND 240)+12 tells the VIC-II to use the character data located in RAM instead of the built-in ROM. If you copy the ROM character set into RAM at a 4KB-aligned location and then set this pointer, all displayed characters will come from those RAM locations.

Each character pattern is 8 bytes long. With a character-set base of 12288, the starting address for display code N is:
12288 + N * 8

To create a reversed (bitwise-inverted) character, invert each of its 8 bytes with 255 - original_value (i.e. bitwise NOT within 8 bits). Example loop in BASIC inverts the 8 bytes for a single character.

Tip: reversing a character is simply inverting its bit pattern (0->1, 1->0).

Note: the example in the source copied only the first 64 characters into RAM; therefore only display codes 0–63 will reflect custom RAM patterns in that example.

## Source Code
```basic
10 REM Switch VIC to use RAM character set
20 POKE 53272,(PEEK(53272) AND 240)+12

100 REM Invert character at RAM base 12288 (character code N = 0 here)
110 FOR I = 12288 TO 12288+7
120   POKE I, 255 - PEEK(I)
130 NEXT I
```

```text
Character start-address formula (base 12288):
  start_address = 12288 + display_code * 8

Example mappings (base = 12288):
  '@'  (display code 0)  -> 12288
  'A'  (display code 1)  -> 12296
  '!'  (display code 33) -> 12552
  '>'  (display code 62) -> 12784
```

## Key Registers
- $D018 - VIC-II - Character/memory control register (character-pointer bits; POKE 53272 modifies where VIC reads character data)

## References
- "creating_character_patterns_and_worksheet" — expands on creating custom character patterns in RAM

## Labels
- D018
