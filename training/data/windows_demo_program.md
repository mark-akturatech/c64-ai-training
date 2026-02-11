# C64 I/O Map — BASIC demo: multiple colored "windows" using extended background color mode

**Summary:** BASIC program demonstrating VIC-II extended background color mode, POKE/PEEK use, and window effects by writing PETSCII control codes and changing background registers ($D011 / 53265, $D020-$D024 / 53280-53284). Shows flashing, appearing and disappearing windows.

## Description
This BASIC listing creates three visible "windows" on the C64 screen by combining PETSCII control characters and direct POKE manipulation of VIC-II color registers. Key techniques shown:

- Enabling the VIC-II extended background color mode by setting bit 6 of $D011 (POKE 53265, PEEK(53265) OR 64).
- Setting border and background color registers directly with POKE to $D020-$D024 (53280–53284).
- Printing prebuilt PETSCII control strings (RO$) to position and clear areas of the screen.
- Using a small conversion subroutine (lines 300–320) to convert an ASCII A$ into a PETSCII string B$ for printing (conversion routine present in source).
- Creating flashing and appearance/disappearance effects by changing background color register values in timed loops (POKEs at lines 170–210).

The program constructs helper strings (RO$ for control sequences, OP$ for repeated printable characters) and repeatedly POKEs background color registers to produce flashes and changes in window appearance while leaving a main text area for commands.

Note: the program uses PETSCII control codes (CHR$ values) for clear-screen, positioning and other effects; these are used verbatim in the source listing.

## Source Code
```basic
5 DIM RO$(25):RO$(0)=CHR$(19):FOR I=1 TO 24:RO$(I)=RO$(I-1)+CHR$(17):NEXT
10 POKE 53265,PEEK(53265) OR 64
20 POKE 53280,0:POKE 53281,0:POKE 53282,1:POKE 53283,2:POKE 53284,13
25 OP$=CHR$(160):FOR I=1 TO 4:OP$=OP$:NEXT I:PRINT CHR$(147);RO$(3);
30 FOR I=1 TO 10:PRINT TAB(1);CHR$(18);"               ";TAB(23);OP$:NEXT
40 PRINT CHR$(146):PRINT:PRINT:FOR I=1 TO 4:PRINT OP$;OP$;OP$;OP$;OP$;:NEXT I
50 PRINT RO$(5);CHR$(5);CHR$(18);TAB(2);"A RED WINDOW"
60 PRINT CHR$(18);TAB(2);"COULD BE USED"
70 PRINT CHR$(18);TAB(2);"FOR ERROR"
80 PRINT CHR$(18);TAB(2);"MESSAGES"
100 A$="A GREEN WINDOW":GOSUB 300:PRINT RO$(5);CHR$(144);CHR$(18);TAB(24);B$
110 A$="COULD BE USED":GOSUB 300:PRINT TAB(24);CHR$(18);B$
120 A$="TO GIVE":GOSUB 300:PRINT TAB(24);CHR$(18);B$
130 A$="INSTRUCTIONS":GOSUB 300:PRINT TAB(24);CHR$(18);B$
140 PRINT CHR$(31);RO$(19);
150 A$="  WHILE THE MAIN WINDOW COULD BE USED":GOSUB 300:PRINT B$
160 A$="  FOR ACCEPTING COMMANDS.":GOSUB 300:PRINT B$
170 FOR I=1 TO 5000:NEXT I:POKE 53284,0
180 FOR I=1 TO 5:FOR J=1 TO 300:NEXT J:POKE 53282,15
190 FOR J=1 TO 300:NEXT J:POKE 53282,1
200 NEXT I:POKE 53283,-2*(PEEK(53283)=240):POKE 53284,-13*(PEEK(53284)=240)
210 GOTO 180
300 B$="":FOR I=1 TO LEN(A$):B=ASC(MID$(A$,I,1))
310 B=B+32:IF B<96 THEN B=B+96
320 B$=B$+CHR$(B):NEXT I:RETURN
```

## Key Registers
- $D011 ($D011 / decimal 53265) - VIC-II - control register (program sets bit 6 with OR 64 to enable extended background color mode per source)
- $D020-$D024 ($D020-$D024 / decimal 53280-53284) - VIC-II - border color ($D020) and background colors 0–3 ($D021-$D024), used here to color the windows and flashing effects

## References
- "extended_background_color_utilities" — conversion subroutine details and additional register POKE usage

## Labels
- D011
- D020
- D021
- D022
- D023
- D024
