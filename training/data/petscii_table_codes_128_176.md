# MACHINE - PETSCII / Superchart mapping for codes DEC 128–176 (HEX 80–B0)

**Summary:** PETSCII / Superchart mapping table for DEC 128–176 (HEX $80–$B0), showing screen-mode glyphs, BASIC keyword/token mappings (END, FOR, NEXT, INPUT, RUN, SYS, etc.), and associated 6502 assembly mnemonics (STA, STY, TXA, TAY, LDA/LDX/LDY #imm/abs/zp, BCC/BCS, etc.). Useful for token decoding, screen rendering, and keyword-to-byte lookup (PETSCII upper range).

## Mapping Details
This chunk documents the PETSCII "upper" range (decimal 128–176 / hex $80–$B0) used by Commodore BASIC and screen modes (commonly called the Superchart). Columns in the source table are:

- Decimal — PETSCII code in decimal
- HEX — PETSCII code in hexadecimal
- ASCII — printable ASCII or symbol equivalent (where applicable)
- SCREEN — glyph names or screen-mode character (notation preserved)
- BASIC — BASIC keyword or token represented by that PETSCII code
- 6502 — common 6502 assembler mnemonic or addressing-mode alias associated in the Superchart (reference for assemblers / tokenizers)
- Decimal (rightmost) — duplicate of the left Decimal column as presented in the source (preserved for fidelity)

The table includes control/display glyph names (e.g., orange, clear, cur up), function keys (F1..F7 etc.), BASIC tokens (FOR, NEXT, DATA, INPUT#, INPUT, LET, GOSUB, RETURN, REM, STOP, ON, WAIT, LOAD, SAVE, VERIFY, POKE, PRINT#, PRINT, CONT, LIST, CLR, CMD, SYS, OPEN, CLOSE, GET, NEW, TAB(, TO, FN, SPC(), THEN, NOT, STEP, TAX, LDY/LDX/LDA imm/abs/zp forms, branch mnemonics (BCC/BCS) and stack/transfer mnemonics (TXA, TYA, TXS).

## Source Code
```text
DECIMAL HEX  ASCII       SCREEN     BASIC     6502      DECIMAL

 128    80               r@         END                  128
 129    81   orange      rA,a       FOR       STA(zp,X)  129
 130    82               rB,b       NEXT                 130
 131    83               rC,c       DATA                 131
 132    84               rD,d       INPUT#    STY zp     132
 133    85   F1          rE,e       INPUT     STA zp     133
 134    86   F3          rF,f       DIM       STX zp     134
 135    87   F5          rG,g       READ                 135
 136    88   F7          rH,h       LET       DEY        136
 137    89   F2          rI,i       GOTO                 137
 138    8A   F4          rJ,j       RUN       TXA        138
 139    8B   F6          rK,k       IF                   139
 140    8C   F8          rL,l       RESTORE   STY abs    140
 141    8D   car ret     rM,m       GOSUB     STA abs    141
 142    8E   graphic     rN,n       RETURN    STX abs    142
 143    8F   bottom      rO,o       REM                  143
 144    90   black       rP,p       STOP      BCC rel    144
 145    91   cur up      rQ,q       ON        STA(zp),Y  145
 146    92   rvx off     rR,r       WAIT                 146
 147    93   clear       rS,s       LOAD                 147
 148    94   insert      rT,t       SAVE      STY zp,X   148
 149    95   ins line/br rU,u       VERIFY    STA zp,X   149
 150    96   ers end/p   rV,v       DEF       STX zp,Y   150
 151    97   gray 1      rW,w       POKE                 151
 152    98   gray 2      rX,x       PRINT#    TYA        152
 153    99   scr down    rY,y       PRINT     STA abs,Y  153
 154    9A   lt blue     rZ,z       CONT      TXS        154
 155    9B   gray 3      r[         LIST                 155
 156    9C   purple      rSterling  CLR                  156
 157    9D   cur left    r]         CMD       STA abs,X  157
 158    9E   yellow      rUpArrow   SYS                  158
 159    9F   cyan        rLeftArrow OPEN                 159
 160    A0   space       rSpace     CLOSE     LDY #imm   160
 161    A1   ~           r!         GET       LDA(zp,X)  161
 162    A2   ~           r"         NEW       LDX #imm   162
 163    A3   ~           r#         TAB(                 163
 164    A4   ~           r$         TO        LDY zp     164
 165    A5   ~           r%         FN        LDA zp     165
 166    A6   ~           r&         SPC(      LDX zp     166
 167    A7   ~           r'         THEN                 167
 168    A8   ~           r(         NOT       TAY        168
 169    A9   ~,~         r)         STEP      LDA #imm   169
 170    AA   ~           r*         +         TAX        170
 171    AB   ~           r+         -                    171
 172    AC   ~           r,         *         LDY abs    172
 173    AD   ~           r-         /         LDA abs    173
 174    AE   ~           r.         UpArrow   LDX abs    174
 175    AF   ~           r/         AND                  175
 176    B0   ~           r0         OR        BCS rel    176
```

## References
- "petscii_table_codes_79_127" — expands on previous block covering codes 79–127
- "petscii_table_codes_177_225" — continues with PETSCII codes 177–225

## Labels
- ORANGE
- BLACK
- LIGHT_BLUE
- PURPLE
- YELLOW
- CYAN
