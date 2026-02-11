# KEYLOG ($028F-$0290) — Vector to Keyboard Table Setup Routine

**Summary:** RAM vector at $028F-$0290 points to the KERNAL/OS routine that selects the keyboard matrix lookup table based on the SHIFT flag ($028D) and stores the chosen table address at $00F5; the interrupt-driven key-scan jumps through this vector, so replacing it lets you intercept keypresses (used by VICword/64word token-substitution routines and DATA token tables).

## Description
This RAM vector ($028F-$0290, decimal 655–656) contains the address of the OS routine that determines which keyboard matrix lookup table to use. The routine tests the SHIFT flag stored at $028D (decimal 653) and, depending on its value, writes the address of the appropriate key lookup table into $00F5 (decimal 245).

The interrupt-driven keyboard-scan routine obtains the table by jumping through the vector at $028F-$0290. Because the key-scan jumps through a RAM vector, you can change the 16-bit address stored there to point to your own routine. A custom routine can examine the keypress and SHIFT/Commodore-key state and act before the character is converted/printed by the system.

This interception point occurs after the key was pressed but before it is printed, making it suitable for preprocessors that substitute sequences (for example, replacing a single letter + SHIFT/Commodore with an entire BASIC keyword). The supplied example is an adaptation of Mark Niggemann’s VICword for the C64 (here called "64WORD"): a BASIC loader with DATA statements containing a machine-language routine and token tables that substitute BASIC keywords for A–Z when SHIFT or the Commodore key is held (except in quote mode).

## Source Code
```basic
100 IF PEEK(PEEK(56)*256)<>120THENPOKE56,PEEK(56)-1:CLR
110 HI=PEEK(56):BASE=HI*256
120 PRINTCHR$(147)"READING DATA"
130 FOR AD=0 TO 211:READ BY
140 POKE BASE+AD,BY:NEXT AD
150 :
200 REM RELOCATION ADJUSTMENTS
210 POKE BASE+26,HI:POKE BASE+81,HI
220 POKE BASE+123,HI:POKE BASE+133,HI
230 :
240 PRINT CHR$(147) TAB(15)"***64WORD***":PRINT
250 PRINT"TO TOGGLE THE PROGRAM ON/OFF:":PRINT:PRINT:PRINT "SYS";BASE;
260 PRINT CHR$(145);CHR$(145);
270 DATA 120,173,143,2,201,32
280 DATA 208,12,169,220,141,143
290 DATA 2,169,72,141,144,2
300 DATA 88,96,169,32,141,143
310 DATA 2,169,0,141,144,2
320 DATA 88,96,165,212,208,117
330 DATA 173,141,2,201,3,176
340 DATA 110,201,0,240,106,169
350 DATA 194,133,245,169,235,133
360 DATA 246,165,215,201,193,144
370 DATA 95,201,219,176,91,56
380 DATA 233,193,174,141,2,224
390 DATA 2,208,3,24,105,26
400 DATA 170,189,159,0,162,0
410 DATA 134,198,170,160,158,132
420 DATA 34,160,160,132,35,160
430 DATA 0,10,240,16,202,16
440 DATA 12,230,34,208,2,230
450 DATA 35,177,34,16,246,48
460 DATA 241,200,177,34,48,17
470 DATA 8,142,211,0,230,198
480 DATA 166,198,157,119,2,174
490 DATA 211,0,40,208,234,230
500 DATA 198,166,198,41,127,157
510 DATA 199,2,230,198,169,20
520 DATA 141,119,2,76,72,235
530 DATA 76,224,234
550 REM TOKENS FOR SHIFT KEY
570 DATA 153,175,199,135,161,129
580 DATA 141,164,133,137,134,147
590 DATA 202,181,159,151,163,201
600 DATA 196,139,192,149,150,155
610 DATA 191,138
630 REM TOKENS FOR COMMODORE KEY
650 DATA 152,165,198,131,128,130
660 DATA 142,169,132,145,140,148
670 DATA 195,187,160,194,166,200
680 DATA 197,167,186,157,165,184
690 DATA 190,158,0
```

```text
Commodore 64word: Keys into BASIC Commands

Key   SHIFT   Commodore
A     PRINT   PRINT#
B     AND     OR
C     CHR$    ASC
D     READ    DATA
E     GET     END
F     FOR     NEXT
G     GOSUB   RETURN
H     TO      STEP
I     INPUT   INPUT#
J     GOTO    ON
K     DIM     RESTORE
L     LOAD    SAVE
M     MID$    LEN
N     INT     RND
O     OPEN    CLOSE
P     POKE    PEEK
Q     TAB(    SPC(
R     RIGHT$  LEFT$
S     STR$    VAL
T     IF      THEN
U     TAN     SQR
V     VERIFY  CMD
W     DEF     FN
X     LIST    FRE
Y     SIN     COS
Z     RUN     SYS
```

## Key Registers
- $028F-$0290 - KERNAL/OS - RAM vector containing address of Keyboard Table Setup routine
- $028D - KERNAL/OS - SHFLAG (Shift flag tested by the table setup routine)
- $00F5 - KERNAL/OS - Pointer (address) where the chosen keyboard matrix lookup table is stored

## References
- "basic_merge_utility_program" — expands on example programs and machine language patching techniques
- "register_storage_area" — expands on using storage/vectors to pass control to or from patched routines

## Labels
- KEYLOG
- SHFLAG
