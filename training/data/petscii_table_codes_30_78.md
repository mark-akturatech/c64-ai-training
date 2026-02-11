# MACHINE - PETSCII / Superchart mapping for codes DEC 30–78 (HEX 1E–4E)

**Summary:** PETSCII / Superchart mapping for character codes DEC 30–78 (HEX 1E–4E) showing ASCII, screen glyph variations, BASIC token displays, and corresponding 6502 opcodes (mnemonics such as JSR, AND, BIT, ROL, PLP, RTI, EOR, LSR, JMP, PHA, SEC, CLI, BMI). Useful for PETSCII, character rendering and correlating character codes to BASIC tokens and 6502 instruction bytes.

## Mapping description
This chunk lists PETSCII / Superchart entries for decimal codes 30–78 (hex 1E–4E). Columns are:

- Decimal: code number in decimal (first column).
- Hex: code in hexadecimal.
- ASCII: nominal ASCII character or representation.
- SCREEN: glyph as displayed on the C64 screen (character ROM variation).
- BASIC: how the character appears or acts in Commodore BASIC (token display), when applicable.
- 6502: 6502 opcode mnemonic and addressing mode corresponding to that PETSCII code value (when that byte value encodes an instruction in machine-code context).
- Final Decimal column: mirrors the initial decimal (present in source).

Notes:
- Several rows have blank BASIC or 6502 columns where the code is not a BASIC token or not used as an opcode mapping in the provided table.
- The 6502 column gives the instruction mnemonic and addressing mode (e.g., "AND (zp,X)" means the opcode value corresponds to AND with (zeropage,X) addressing).
- Screen glyphs differ from ASCII in several cases (e.g., uppercase/lowercase variations, graphic symbols).
- This is a straight mapping/reference table; no implementation code is included here.

## Source Code
```text
DECIMAL HEX  ASCII       SCREEN     BASIC     6502      DECIMAL

  30    1E   green       up arrow             ASL abs,X   30
  31    1F   blue        left arrow                       31
  32    20   space       space      space     JSR abs     32
  33    21   !           !          !         AND (zp,X)  33
  34    22   "           "          "                     34
  35    23   #           #          #                     35
  36    24   $           $          $         BIT zp      36
  37    25   %           %          %         AND zp      37
  38    26   &           &          &         ROL zp      38
  39    27   '           '          '                     39
  40    28   (           (          (         PLP         40
  41    29   )           )          )         AND #imm    41
  42    2A   *           *          *         ROL A       42
  43    2B   +           +          +                     43
  44    2C   ,           ,          ,         BIT abs     44
  45    2D   -           -          -         AND abs     45
  46    2E   .           .          .         ROL abs     46
  47    2F   /           /          /                     47
  48    30   0           0          0         BMI rel     48
  49    31   1           1          1         AND(zp),Y   49
  50    32   2           2          2                     50
  51    33   3           3          3                     51
  52    34   4           4          4                     52
  53    35   5           5          5         AND zp,X    53
  54    36   6           6          6         ROL zp,X    54
  55    37   7           7          7                     55
  56    38   8           8          8         SEC         56
  57    39   9           9          9         AND abs,Y   57
  58    3A   :           :          :         CLI         58
  59    3B   ;           ;          ;                     59
  60    3C   <           <          <                     60
  61    3D   =           =          =         AND abs,X   61
  62    3E   >           >          >         ROL abs,X   62
  63    3F   ?           ?          ?                     63
  64    40   @           ~          @         RTI         64
  65    41   A,a         ~,A        A         EOR(zp,X)   65
  66    42   B,b         ~,B        B                     66
  67    43   C,c         ~,C        C                     67
  68    44   D,d         ~,D        D                     68
  69    45   E,e         ~,E        E         EOR zp      69
  70    46   F,f         ~,F        F         LSR zp      70
  71    47   G,g         ~,G        G                     71
  72    48   H,h         ~,H        H         PHA         72
  73    49   I,i         ~,I        I         EOR #imm    73
  74    4A   J,j         ~,J        J         LSR A       74
  75    4B   K,k         ~,K        K                     75
  76    4C   L,l         ~,L        L         JMP abs     76
  77    4D   M,m         ~,M        M         EOR abs     77
  78    4E   N,n         ~,N        N         LSR abs     78
```

## References
- "petscii_table_codes_0_29" — expands on previous block covering codes 0–29
- "petscii_table_codes_79_127" — continues the mapping for codes 79–127

## Mnemonics
- ASL
- JSR
- AND
- BIT
- ROL
- PLP
- BMI
- SEC
- CLI
- RTI
- EOR
- LSR
- PHA
- JMP
