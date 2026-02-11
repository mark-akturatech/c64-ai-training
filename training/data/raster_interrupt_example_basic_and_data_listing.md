# Three-Zone Split-Screen (BASIC + Machine Code at $C000)

**Summary:** Example C64 BASIC program that POKEs machine code and configuration tables into $C000 (49152) and uses an IRQ-based raster split (VIC-II $D000-$D02E) to create three screen zones (high‑res bitmap, text, multicolor bitmap). Tables (DATA) include scan-line mappings, background color and VIC-II control/memory values; these can be modified at runtime via POKE.

## Description
This chunk is a complete BASIC listing (lines 5–150) plus embedded machine code and configuration DATA stored at 49152–49276. The program:
- POKEs machine code (an IRQ handler and setup routine) into $C000–$C116 (decimal 49152–49278) and executes it via SYS 12*4096 (SYS 49152).
- Sets up three vertical zones on the screen:
  - Top: high-resolution bitmap area
  - Middle: ordinary text area
  - Bottom: multicolor bitmap area
- Uses a table-driven raster IRQ handler (machine code in the DATA block) and several small configuration tables (scan-line table, background color table, VIC-II control register values, memory control values).
- The BASIC main loop draws a wavy pattern by computing Y = INT(H + 20*SIN(X/10 + C)) and POKEing bitmap bytes accordingly; different H/C/W settings produce the different visual zones.
- Runtime modification: you can change the visible effect at run time by POKEing new values into the memory locations where the tables are stored (for example the background color table at the listed DATA address). The program explicitly notes that POKEing table values while running will immediately change the displayed result.

Important implementation notes preserved from the original listing:
- The machine code is loaded at decimal address 49152 ($C000) and is invoked with SYS 49152.
- Configuration tables follow the code; the DATA comments label sections as SCAN LINES, BACKGROUND COLOR, CONTROL REG. 1, CONTROL REG. 2, and MEMORY CONTROL RUN.
- BASIC constructs used: array BI(I) for bit masks, screen/color RAM POKEs to prepare the three zones, and a subroutine (GOSUB 150) that computes the bitmap byte address (BY) and ORs the precomputed mask into bitmap memory.

This chunk intentionally preserves the raw BASIC listing and DATA statements in the Source Code section for retrieval and exact reproduction.

## Source Code
```basic
5 FOR I=0 TO 7:BI(I)=2^I:NEXT
10 FOR I=49152 TO 49278:READ A:POKE I,A:NEXT:SYS12*4096
20 PRINT CHR$(147):FOR I=0 TO 8:PRINT:NEXT
30 PRINT"THE TOP AREA IS HIGH-RES BIT MAP MODE"
40 PRINT:PRINT"THE MIDDLE AREA IS ORDINARY TEXT "
50 PRINT:PRINT"THE BOTTOM AREA IS MULTI-COLOR BIT MAP"
60 FORG=1384 TO 1423:POKE G,6:NEXT
70 FORG=1024 TO 1383:POKEG,114:POKE G+640,234:NEXT
80 A$="":FOR I=1 TO 128:A$=A$+"@":NEXT:FOR I=32 TO 63 STEP 2
90 POKE 648,I:PRINT CHR$(19)CHR$(153);A$;A$;A$;A$:NEXT:POKE 648,4
100 BASE=2*4096:BK=49267
110 H=40:C=0:FORX=0TO319:GOSUB150:NEXT
120 H=160:C=0:FORX=0TO319STEP2:GOSUB150:NEXT:C=40
125 FORX=1TO319STEP2:GOSUB150:NEXT
130 C=80:FOR X=0 TO 319 STEP2:W=0:GOSUB150:W=1:GOSUB150:NEXT
140 GOTO 140
150 Y=INT(H+20*SIN(X/10+C)):BY=BASE+40*(Y AND 248)+(Y AND 7)+(X AND 504)
160 POKE BY,PEEK(BY) OR (BI(ABS(7-(XAND7)-W))):RETURN
49152 DATA 120, 169, 127, 141, 13, 220
49158 DATA 169, 1, 141, 26, 208, 169
49164 DATA 3, 133, 251, 173, 112, 192
49170 DATA 141, 18, 208, 169, 24, 141
49176 DATA 17, 208, 173, 20, 3, 141
49182 DATA 110, 192, 173, 21, 3, 141
49188 DATA 111, 192, 169, 50, 141, 20
49194 DATA 3, 169, 192, 141, 21, 3
49200 DATA 88, 96, 173, 25, 208, 141
49206 DATA 25, 208, 41, 1, 240, 43
49212 DATA 190, 251, 16, 4, 169, 2
49218 DATA 133, 251, 166, 251, 189, 115
49224 DATA 192, 141, 33, 208, 189, 118
49230 DATA 192, 141, 17, 208, 189, 121
49236 DATA 192, 141, 22, 208, 189, 124
49242 DATA 192, 141, 24, 208, 189, 112
49248 DATA 192, 141, 18, 208, 138, 240
49254 DATA 6, 104, 168, 104, 170, 104
49260 DATA 64, 76, 49, 234
49264 DATA 49, 170, 129 :REM SCAN LINES
49267 DATA 0, 6, 0:REM BACKGROUND COLOR
49270 DATA 59, 27,59:REM CONTROL REG. 1
49273 DATA 24, 8, 8:REM CONTROL REG. 2
49276 DATA 24, 20, 24:REM MEMORY CONTROLRUN
```

## Key Registers
- $D000-$D02E - VIC-II - raster and control registers (includes Control Register 1 $D011, Control Register 2 $D016, Memory Control $D018, border/background registers), used by the machine-code IRQ handler and the control tables in the DATA block
- $D020-$D021 - VIC-II - border color and background color registers (referenced by the BACKGROUND COLOR table stored at DATA address 49267)
- $DC00-$DC0F - CIA 1 - CIA registers including Interrupt Control (the machine code writes to CIA1 registers at $DC0D as part of IRQ setup/acknowledgement)

## References
- "data_table_mapping_and_examples" — expands which DATA items correspond to scan lines and register values
- "preserving_jiffy_clock_and_vectors" — expands how to preserve original IRQ behavior when using the example