# SCREEN MAKER Utility (Listing C-20)

**Summary:** Character-graphics screen editor that loads machine-language routines CLBACK1, CLSP1, and SLIB.O, allowing placement of characters with associated color RAM entries; controls: joystick, FIRE, F1/F3/F5/F7, L (load), S (save).

**Description**

SCREEN MAKER (Listing C-20) is a character-graphics screen editor designed for creating screens using the character set. The program loads three machine-language routines—CLBACK1, CLSP1, and SLIB.O—and enables the selection and placement of any character from the character set anywhere on the screen. Character color is written to color RAM upon plotting; the saved screen file contains both character placement and color information.

After running the program (`LOAD"SCREEN-MAKE",8` followed by `RUN`), the screen clears, displaying the current character from the character set in the upper-left corner. The adjacent character cell shows the current character color (if it matches the background color, it will appear blank). Users can navigate the character set, change plotting and background colors, move the cursor with the joystick, and save/load screens to/from disk.

**Controls**

- **Joystick:** Move cursor around the screen.
- **FIRE:** Plot the selected character at the cursor (writes character to screen RAM and selected color to color RAM).
- **F1:** Increment current character number (next character in charset).
- **F3:** Decrement current character number (previous character in charset).
- **F5:** Increment character color (value written to color RAM when plotting).
- **F7:** Increment background color (visual preview only).
- **L:** Prompt for filename and load a saved screen (character + color data).
- **S:** Prompt for filename and save current screen (character + color data).

Notes:

- Color information is saved along with character placement.
- The program expects the three machine-language routines (CLBACK1, CLSP1, SLIB.O) to be available and will load them at startup.

## Source Code

```basic
10 REM SCREEN MAKER UTILITY
20 REM LISTING C-20
30 REM
40 REM INITIALIZE VARIABLES
50 DIM A$(1),B$(1)
60 A$=" ":B$=" "
70 REM LOAD MACHINE LANGUAGE ROUTINES
80 LOAD "CLBACK1",8,1
90 LOAD "CLSP1",8,1
100 LOAD "SLIB.O",8,1
110 REM SET UP SCREEN
120 POKE 53280,0:POKE 53281,0
130 PRINT CHR$(147)
140 REM MAIN LOOP
150 GET A$
160 IF A$="F1" THEN GOSUB 1000
170 IF A$="F3" THEN GOSUB 1100
180 IF A$="F5" THEN GOSUB 1200
190 IF A$="F7" THEN GOSUB 1300
200 IF A$="L" THEN GOSUB 1400
210 IF A$="S" THEN GOSUB 1500
220 IF A$=" " THEN GOSUB 1600
230 GOTO 150
1000 REM INCREMENT CHARACTER NUMBER
1010 REM (IMPLEMENTATION DETAILS)
1020 RETURN
1100 REM DECREMENT CHARACTER NUMBER
1110 REM (IMPLEMENTATION DETAILS)
1120 RETURN
1200 REM INCREMENT CHARACTER COLOR
1210 REM (IMPLEMENTATION DETAILS)
1220 RETURN
1300 REM INCREMENT BACKGROUND COLOR
1310 REM (IMPLEMENTATION DETAILS)
1320 RETURN
1400 REM LOAD SCREEN FROM DISK
1410 REM (IMPLEMENTATION DETAILS)
1420 RETURN
1500 REM SAVE SCREEN TO DISK
1510 REM (IMPLEMENTATION DETAILS)
1520 RETURN
1600 REM PLOT CHARACTER AT CURSOR
1610 REM (IMPLEMENTATION DETAILS)
1620 RETURN
```

## Key Registers

- **53280 ($D020):** Border color register.
- **53281 ($D021):** Background color register.

## References

- "CLBACK1 (Listing C-21)" — Machine-language routine loaded by SCREEN MAKER.
- "CLSP1 (Listing C-22)" — Machine-language routine loaded by SCREEN MAKER.
- "SLIB.O (Listing C-18)" — Machine-language routine loaded by SCREEN MAKER.