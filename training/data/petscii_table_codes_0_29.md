# PETSCII codes DEC 0–29 ($00–$1D) — mapping to ASCII, screen glyphs, BASIC tokens, and suggested 6502 mnemonics

**Summary:** PETSCII mapping for decimal 0–29 (hex 00–1D) showing ASCII equivalence, screen glyph/function names, Commodore BASIC token names (when applicable), and suggested 6502 single-byte opcode mnemonics found at the same numeric values.

## Description
This chunk lists the PETSCII codes 0 through 29 (hex 00–1D) and aligns each code with:
- an ASCII printable equivalent (when meaningful),
- the PETSCII screen glyph or control-function name,
- the BASIC token used by Commodore BASIC (where applicable),
- a suggested 6502 instruction mnemonic for the single-byte opcode with the same numeric value (when commonly noted).

Conventions and caveats:
- Hex values are given as two-digit hex (00–1D). (Parenthetical: hex shown without $ prefix.)
- BASIC token names are the tokenized BASIC keywords or text-mode functions associated with that PETSCII code.
- The 6502 mnemonics are suggested single-byte opcodes whose opcode value equals the PETSCII code; many low PETSCII codes overlap unused/undocumented or non-instruction values and are therefore blank.
- Control entries include terminal/editor functions such as BRK (end-line), BEL (bell), cursor movements, lock/unlock and screen colour markers.

## Source Code
```text
DECIMAL  HEX  ASCII        SCREEN      BASIC       6502
  0      00               @           end-line    BRK
  1      01               A,a                    ORA (zp,X)
  2      02               B,b
  3      03               C,c
  4      04               D,d
  5      05   white       E,e                    ORA zp
  6      06               F,f                    ASL zp
  7      07   bell        G,g
  8      08   lock        H,h                    PHP
  9      09   unlock      I,i                    ORA #imm
 10      0A               J,j                    ASL A
 11      0B               K,k
 12      0C               L,l
 13      0D   car ret     M,m                    ORA abs
 14      0E   text        N,n                    ASL abs
 15      0F   top         O,o
 16      10               P,p                    BPL rel
 17      11   cur down    Q,q                    ORA (zp),Y
 18      12   reverse     R,r
 19      13   cur home    S,s
 20      14   delete      T,t
 21      15   del line    U,u                    ORA zp,X
 22      16   ers begin   V,v                    ASL zp,X
 23      17               W,w
 24      18               X,x                    CLC
 25      19   scr up      Y,y                    ORA abs,Y
 26      1A               Z,z
 27      1B               [
 28      1C   red         sterling
 29      1D   cur right   ]                      ORA abs,X
```

## References
- "petscii_table_codes_30_78" — continuation and expansion of the PETSCII mapping for codes 30–78
