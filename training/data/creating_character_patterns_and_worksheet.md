# Programmable Character Worksheet (8×8)

**Summary:** How to design custom 8×8 characters for the C64: use an 8×8 matrix where each column has a power-of-two value (128, 64, ..., 1), mark dots, sum marked column values per row to produce eight 0–255 decimal bytes, and place those bytes in a DATA statement (line 20). Hint: make vertical lines at least 2 bits wide to reduce CHROMA noise on TV.

## How it works
- The programmable character is an 8×8 pixel matrix. Each row becomes one byte (0–255).
- Column values are powers of two: leftmost column = 128 (2^7), next = 64 (2^6), ..., rightmost = 1 (2^0).
- To design a character:
  1. Place an X on the worksheet wherever you want a pixel/dot.
  2. For the first row, take the column values for every marked X and add them together; this gives a decimal value for that row (0–255).
  3. Repeat for all eight rows to get 8 numbers.
  4. Put those eight numbers into the program’s DATA statement (the source refers to line 20).
  5. RUN the program and press T to view the character; edit the DATA numbers and re-run until satisfied.
- Notes and checks:
  - Values must be within 0–255; if not, recheck the addition.
  - If you have fewer than 8 numbers, you missed a row.
  - Rows may be 0 (blank rows are valid).
  - For display on a TV, make vertical strokes at least 2 pixels (bits) wide to reduce CHROMA (color) noise/distortion.

## Source Code
```text
                            2 | | | | | | | | |
                              +-+-+-+-+-+-+-+-+
                            3 | | | | | | | | |
                              +-+-+-+-+-+-+-+-+
                            4 | | | | | | | | |
                              +-+-+-+-+-+-+-+-+
                            5 | | | | | | | | |
                              +-+-+-+-+-+-+-+-+
                            6 | | | | | | | | |
                              +-+-+-+-+-+-+-+-+
                            7 | | | | | | | | |
                              +-+-+-+-+-+-+-+-+

                 Figure 3-1. Programmable Character Worksheet.


  The Programmable Character Worksheet (Figure 3-1) will help you design
  your own characters. There is an 8 by 8 matrix on the sheet, with row
  numbers, and numbers at the top of each column. (if you view each row as
  a binary word, the numbers are the value of that bit position. Each is a
  power of 2. The leftmost bit is equal to 128 or 2 to the 7th power, the
  next is equal to 64 or 2 to the 6th, and so on, until you reach the
  rightmost bit (bit 0) which is equal to 1 or 2 to the 0 power.)
    Place an X on the matrix at every location where you want a dot to be
  in your character. When your character is ready you can create the DATA
  statement for your character.
    Begin with the first row. Wherever you placed an X, take the number at
  the top of the column (the power-of-2 number, as explained above) and
  write it down. When you have the numbers for every column of the first
  row, add them together. Write this number down, next to the row. This is
  the number that you will put into the DATA statement to draw this row.
    Do the same thing with all of the other rows (1-7). When you are
  finished you should have 8 numbers between 0 and 255. If any of your
  numbers are not within range, recheck your addition. The numbers must be
  in this range to be correct! If you have less than 8 numbers, you missed
  a row. It's OK if some are 0. The 0 rows are just as important as the
  other numbers.
    Replace the numbers in the DATA statement in line 20 with the numbers
  you just calculated, and RUN the program. Then type a T. Every time you
  type it, you'll see your own character!
    If you don't like the way the character turned out, just change the
  numbers in the DATA statement and re-RUN the program until you are happy
  with your character.
    That's all there is to it!

  +-----------------------------------------------------------------------+
  | HINT: For best results, always make any vertical lines in your        |
  | characters at least 2 dots (bits) wide. This helps prevent CHROMA     |
  | noise (color distortion) on your characters when they are displayed   |
  | on a TV screen.                                                       |
  +-----------------------------------------------------------------------+
```

## References
- "example_smiley_character_and_program" — sample DATA values and a complete example program showing a smiley character stored and displayed via DATA statements.