# C64 BASIC digital clock — CIA Time-of-Day ($DC08-$DC0B)

**Summary:** Example BASIC program that reads and writes the CIA 1 Time-of-Day (TOD) registers ($DC08-$DC0B / decimal 56328–56331) with PEEK/POKE to display a running digital clock and allow the user to set hours, minutes, seconds and tenths.

## Description
This BASIC listing reads the CIA1 TOD bytes directly and formats them as BCD digits for on-screen display. The program:

- Reads TOD bytes with PEEK(56331) (hours), PEEK(56330) (minutes), PEEK(56329) (seconds), PEEK(56328) (tenths).
- Extracts BCD digits:
  - For minutes/seconds: tens = (value AND 240)/16, units = (value AND 15).
  - For hours: tens extracted as (value AND 16)/16 (hours tens is only the $10 bit in CIA TOD BCD), units = (value AND 15).
- Writes ASCII digits directly into screen memory addresses (POKE 1238–1247) and inserts colon characters via POKE 1240,1243,1246 = 58.
- Provides an input routine (GOSUB 200) to set H/M/S/T by assembling BCD values from user-entered strings and POKE-ing them to the TOD registers. The program writes tenths as 0 after setting the other fields.
- Uses a short screen/border color flicker (POKE 53281) and screen clear (CHR$(147)) for visual effect around the input routine.

Note: CIA TOD registers use BCD. Writing them and ensuring a consistent read may require the CIA latch/write behavior — see the referenced "cia_tod_write_mode_and_latch_behavior" for details on latching when reading/writing TOD bytes. (Latch = freeze/current snapshot of TOD bytes when reading.)

## Source Code
```basic
10 PRINT CHR$(147):GOSUB 200
20 H=PEEK(56331):POKE 1238,(H AND 16)/16+48:POKE 1239,(H AND 15)+48
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
- $DC08-$DC0B - CIA 1 - Time-of-Day registers (tenths $DC08 / 56328, seconds $DC09 / 56329, minutes $DC0A / 56330, hours $DC0B / 56331). These TOD bytes are BCD-encoded.

## References
- "cia_tod_write_mode_and_latch_behavior" — explains TOD latch and write behavior required for reliable reads/writes
- "dc08_dc0b_time_of_day_registers" — expands on addresses and bit meanings for the TOD registers used here