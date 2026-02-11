# PETSCII codes 177–225 (HEX B1–E1) — screen, BASIC tokens, and 6502 mappings

**Summary:** Table mapping PETSCII byte values DEC 177–225 (HEX B1–E1) to screen glyph names, BASIC keyword/function tokens (SGN, INT, ABS, FRE, POS, etc.), and corresponding 6502 instruction mnemonics with addressing modes (LDA/LDX/LDY, TSX, CLV, CPY/CMP/DEC/INY/DEX/CPX/SBC, etc.).

## PETSCII 177–225 mapping
This chunk documents the PETSCII byte values DEC 177–225 (HEX B1–E1). Columns are:
- DECIMAL / HEX: numeric code values.
- ASCII: printable ASCII character where applicable (many are graphics/alternate glyphs).
- SCREEN: internal screen-glyph identifiers used in this table (r1, rA, rSpace, rPi, etc.) for the displayed PETSCII symbol.
- BASIC: tokenized BASIC keyword or function name mapped to that single-byte token (e.g., SGN(, INT(, ABS(), PEEK(, STR$(), etc.). Blank entries mean no BASIC token listed.
- 6502: 6502 opcode (mnemonic) and addressing mode that this byte-value is documented to correspond with in this mapping (e.g., LDA zp,X ; CPY #imm ; CMP abs,X ; DEC abs,X). Blank entries mean no 6502 mapping listed.
- The final DECIMAL column repeats the decimal code (preserved from source).

Note: "~" and similar glyph markers in ASCII indicate graphical/alternate PETSCII glyphs rather than standard ASCII letters. The table below is the reference data (verbatim mapping rows).

## Source Code
```text
DECIMAL HEX  ASCII       SCREEN     BASIC     6502      DECIMAL

 177    B1   ~           r1         >         LDA(zp),Y  177
 178    B2   ~           r2         =                    178
 179    B3   ~           r3         <                    179
 180    B4   ~           r4         SGN(      LDY zp,X   180
 181    B5   ~           r5         INT(      LDA zp,X   181
 182    B6   ~           r6         ABS(      LDX zp,Y   182
 183    B7   ~           r7         USR(                 183
 184    B8   ~           r8         FRE(      CLV        184
 185    B9   ~           r9         POS(      LDA abs,Y  185
 186    BA   ~,~         r:         SQR(      TSX        186
 187    BB   ~           r;         RND(                 187
 188    BC   ~           r<         LOG(      LDY abs,X  188
 189    BD   ~           r=         EXP(      LDA abs,X  189
 190    BE   ~           r>         COS(      LDX abs,Y  190
 191    BF   ~           r?         SIN(                 191
 192    C0   ~           r~         TAN(      CPY #imm   192
 193    C1   ~,A         r~,rA      ATN(      CMP(zp,X)  193
 194    C2   ~,B         r~,rB      PEEK(                194
 195    C3   ~,C         r~,rC      LEN(                 195
 196    C4   ~,D         r~,rD      STR$(     CPY zp     196
 197    C5   ~,E         r~,rE      VAL(      CMP zp     197
 198    C6   ~,F         r~,rF      ASC(      DEC zp     198
 199    C7   ~,G         r~,rG      CHR$(                199
 200    C8   ~,H         r~,rH      LEFT$(    INY        200
 201    C9   ~,I         r~,rI      RIGHT$(   CMP #imm   201
 202    CA   ~,J         r~,rJ      MID$(     DEX        202
 203    CB   ~,K         r~,rK      GO                   203
 204    CC   ~,L         r~,rL      CONCAT    CPY abs    204
 205    CD   ~,M         r~,rM      DOPEN     CMP abs    205
 206    CE   ~,N         r~,rN      DCLOSE    DEC abs    206
 207    CF   ~,O         r~,rO      RECORD               207
 208    D0   ~,P         r~,rP      HEADER    BNE rel    208
 209    D1   ~,Q         r~,rQ      COLLECT   CMP(zp),Y  209
 210    D2   ~,R         r~,rR      BACKUP               210
 211    D3   ~,S         r~,rS      COPY                 211
 212    D4   ~,T         r~,rT      APPEND               212
 213    D5   ~,U         r~,rU      DSAVE     CMP zp,X   213
 214    D6   ~,V         r~,rV      DLOAD     DEC zp,X   214
 215    D7   ~,W         r~,rW      CATALOG              215
 216    D8   ~,X         r~,rX      RENAME    CLD        216
 217    D9   ~,Y         r~,rY      SCRATCH   CMP abs,Y  217
 218    DA   ~,Z         r~,rZ      DIRECTORY            218
 219    DB   ~           r~                              219
 220    DC   ~           r~                              220
 221    DD   ~           r~                   CMP abs,X  221
 222    DE   pi,~        rPi,r~               DEC abs,X  222
 223    DF   ~,~         r~,r~                           223
 224    E0   space       rSpace               CPX #imm   224
 225    E1   ~           r~                   SBC(zp,X)  225
```

## References
- "petscii_table_codes_128_176" — covers PETSCII codes 128–176 (previous block)
- "petscii_table_codes_226_255" — continues PETSCII codes 226–255 (following block)
