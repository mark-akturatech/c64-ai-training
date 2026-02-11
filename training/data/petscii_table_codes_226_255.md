# PETSCII codes DEC 226–255 (HEX E2–FF)

**Summary:** PETSCII / screen / BASIC token and 6502-opcode mapping for byte values $E2–$FF (DEC 226–255). Includes 6502 mnemonics present in this range (CPX, SBC, INC, INX, NOP, SED, BEQ), the pi glyph at $FF, and several unused/reserved PETSCII values.

**Mapping notes**

- **Columns:**
  - **DECIMAL (byte):** Decimal representation of the byte value.
  - **HEX:** Hexadecimal representation of the byte value.
  - **ASCII:** Character or glyph corresponding to the PETSCII code.
  - **SCREEN:** Character as it appears on the screen. An 'r' prefix indicates the reverse (inverse) video variant.
  - **BASIC:** Token used in tokenized BASIC programs.
  - **6502:** 6502 opcode mnemonic and addressing mode when the byte is interpreted as an instruction.

- **Comma-separated glyph entries:** Entries like "~,~" at $E9 and $FA indicate that the PETSCII code corresponds to multiple characters or glyphs, often due to differences between character sets or modes.

- **Unused/reserved PETSCII values:** Bytes in this range without a specified BASIC token or 6502 mnemonic are either reserved or unused in PETSCII.

## Source Code

```text
DECIMAL HEX  ASCII       SCREEN     BASIC     6502      DECIMAL

 226    E2   ~           r~                              226
 227    E3   ~           r~                              227
 228    E4   ~           r~                   CPX zp     228
 229    E5   ~           r~                   SBC zp     229
 230    E6   ~           r~                   INC zp     230
 231    E7   ~           r~                              231
 232    E8   ~           r~                   INX        232
 233    E9   ~,~         r~,r~                SBC #imm   233
 234    EA   ~           r~                   NOP        234
 235    EB   ~           r~                              235
 236    EC   ~           r~                   CPX abs    236
 237    ED   ~           r~                   SBC abs    237
 238    EE   ~           r~                   INC abs    238
 239    EF   ~           r~                              239
 240    F0   ~           r~                   BEQ rel    240
 241    F1   ~           r~                   SBC (zp),Y 241
 242    F2   ~           r~                              242
 243    F3   ~           r~                              243
 244    F4   ~           r~                              244
 245    F5   ~           r~                   SBC zp,X   245
 246    F6   ~           r~                   INC zp,X   246
 247    F7   ~           r~                              247
 248    F8   ~           r~                   SED        248
 249    F9   ~           r~                   SBC abs,Y  249
 250    FA   ~,~         r~,r~                           250
 251    FB   ~           r~                              251
 252    FC   ~           r~                              252
 253    FD   ~           r~                   SBC abs,X  253
 254    FE   ~           r~                   INC abs,X  254
 255    FF   pi,~        r~         pi                   255
```

## References

- "petscii_table_codes_177_225" — previous block covering PETSCII codes DEC 177–225 (HEX B1–E1)

## Mnemonics
- CPX
- SBC
- INC
- INX
- NOP
- SED
- BEQ
