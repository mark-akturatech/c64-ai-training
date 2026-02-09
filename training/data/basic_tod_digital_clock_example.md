# BASIC example: CIA Time-of-Day (TOD) clock using PEEK/POKE 56328-56331

**Summary:** A C64 BASIC digital clock that reads and sets the CIA TOD registers at decimal 56328–56331 (CIA1 $DC08–$DC0B) using PEEK/POKE, displays hour/minute/second/tenths on screen, and formats the display (colon characters, background color).

## Description
This BASIC program:

- Reads the CIA1 Time‑Of‑Day (TOD) registers (BCD-encoded) at decimal addresses 56328–56331 and displays tenths, seconds, minutes and hours on the screen.
- Prompts the user to set hour, minute and second; writes the BCD values back to the corresponding TOD registers with POKE, and resets tenths to 0 after setting seconds.
- Uses simple BCD nibble extraction: mask the upper nibble with $F0 (decimal 240) and divide by 16 to get the tens digit, mask the lower nibble with $0F (decimal 15) to get the units digit. ASCII digit characters are created by adding 48.
- Places ASCII colon (58) characters into screen RAM positions to format the display; briefly changes background color via POKE 53281 (VIC-II background color register $D021) while clearing the screen.

Caveats:
- TOD registers in the CIA are BCD-coded: seconds and minutes upper nibble is 0–5 (tens), lower nibble 0–9 (units); hours follow 12/24-hour encoding in the upper nibble (tens) and bit 7 is AM/PM for 12-hour mode on some systems.
- The program writes the hour to the hours TOD register and resets tenths with POKE 56328,0 so the tenths digit starts at zero after setting time.

**[Note: Source may contain an error — line 20 in the original listing used AND 16 where AND 240 ($F0) is required to extract the upper BCD nibble; the code below uses the corrected mask.]**

## Source Code
```basic
10 PRINT CHR$(147):GOSUB 200
20 H=PEEK(56331):POKE 1238,(H AND 240)/16+48:POKE 1239,(H AND 15)+48
30 M=PEEK(56330):POKE 1241,(M AND 240)/16+48:POKE 1242,(M AND 15)+48
40 S=PEEK(56329):POKE 1244,(S AND 240)/16+48:POKE 1245,(S AND 15)+48
50 T=PEEK(56328)AND15:POKE 1247,T+48:GOTO 20

200 INPUT"WHAT IS THE HOUR";H$:IF H$="" THEN 200
210 H=0:IF LEN(H$)>1 THEN H=16
220 HH=VAL(RIGHT$(H$,1)):H=H+HH:POKE56331,H

230 INPUT "WHAT IS THE MINUTE";M$:IF M$=""THEN 200
240 M=0:IF LEN(M$)>1 THEN M=16*VAL(LEFT$(M$,1))
250 MM=VAL(RIGHT$(M$,1)):M=M+MM:POKE56330,M

260 INPUT "WHAT IS THE SECOND";S$:IF S$=""THEN 200
270 S=0:IF LEN(S$)>1 THEN S=16*VAL(LEFT$(S$,1))
280 SS=VAL(RIGHT$(S$,1)):S=S+SS:POKE56329,S:POKE56328,0

290 POKE 53281,1:PRINT CHR$(147):POKE 53281,6
300 POKE 1240,58:POKE 1243,58:POKE 1246,58:GOTO 20
```

## Key Registers
- $DC08-$DC0B - CIA 1 - Time‑Of‑Day (TOD) registers: tenths, seconds, minutes, hours (BCD)

## References
- "time_of_day_clock_tod_description_and_usage" — TOD read/write details and BCD format