# Semicircle in HI-RES Bitmap (C64 BASIC)

**Summary:** This program demonstrates how to draw a semicircle in the Commodore 64's high-resolution (HI-RES) bitmap mode using BASIC. It calculates the Y-coordinates for each X-coordinate across half the screen to plot the semicircle.

**Description**

**Algorithm Outline:**

1. **Calculate Y-Coordinates:**
   - For each X-coordinate from 0 to 160 (half the screen width), compute the upper (Y1) and lower (Y2) Y-values of the semicircle using the formula:
     - Y1 = 100 + SQR(160 * X - X * X)
     - Y2 = 100 - SQR(160 * X - X * X)

2. **Plot Vertical Columns:**
   - For each integer Y between Y1 and Y2, set the corresponding bit in the bitmap memory to draw the vertical column at that X-coordinate.

3. **Convert Pixel Coordinates to Bitmap Memory Address:**
   - Use the following calculations to determine the byte address and bit position within the byte:
     - CH = INT(X / 8)       ; Character column (8 pixels per character)
     - RO = INT(Y / 8)       ; Character row
     - LN = Y AND 7          ; Line within character (0 to 7)
     - BI = 7 - (X AND 7)    ; Bit index within byte (MSB on left)
     - BY = BASE + RO * 320 + 8 * CH + LN  ; Byte address in bitmap memory

4. **Update Bitmap Memory:**
   - Set the bit for the pixel at (X, Y) using:
     - POKE BY, PEEK(BY) OR (2 ^ BI)

**Looping Direction:**

- The original code contains a typographical error in the loop step at line 60: `FOR Y = Y1 TO Y2 STEP Y1 - Y2`. This is ambiguous. The corrected version loops from the lower Y-value to the upper Y-value: `FOR Y = INT(Y2) TO INT(Y1)`.

**Program Termination:**

- The program changes the color of the top-left screen cell to signal completion (line 125) and then enters an infinite loop to freeze the display (line 130). To exit, hold the RUN/STOP key and press RESTORE.

**Caveat:**

- The original code contains typographical errors. The corrected address calculations and bit manipulations provided above are standard formulas used for bitmap plotting on the C64.

## Source Code

```basic
50 FOR X = 0 TO 160 : REM Half the screen
55 Y1 = 100 + SQR(160 * X - X * X)
56 Y2 = 100 - SQR(160 * X - X * X)
60 FOR Y = INT(Y2) TO INT(Y1) : REM Iterate from lower to upper
70 CH = INT(X / 8)         : REM Character column (0 to 19)
80 RO = INT(Y / 8)         : REM Character row
85 LN = Y AND 7            : REM Line within character (0 to 7)
90 BY = BASE + RO * 320 + 8 * CH + LN
100 BI = 7 - (X AND 7)     : REM Bit index in byte
110 POKE BY, PEEK(BY) OR (2 ^ BI)
114 NEXT Y
115 NEXT X
```

*Note: Replace `BASE` with the chosen bitmap base address used in your program.*

## References

- "Commodore 64 Programmer's Reference Guide" – Section on programming graphics, including bitmap addressing and plotting techniques.
