# PETSCII mapping: codes DEC 79–127 (HEX 4F–7F)

**Summary:** PETSCII table for DEC 79–127 (HEX $4F–$7F) showing ASCII characters, VIC/Screen variants, BASIC token mappings, and coincident 6502 opcode mnemonics (examples: JMP, PHA, ADC variants, RTS, SEI, CLI). Useful for machine-code in PETSCII areas, token parsing, and character/byte-level cross-referencing.

## Overview
This chunk documents the PETSCII / Superchart mapping for decimal codes 79–127 (hex 4F–7F). Columns indicate:
- ASCII: printable character and alternate case when applicable.
- SCREEN: how the character appears in the C64 screen font / graphics mode variants (uppercase/graphics mapping).
- BASIC: how the character or token appears in BASIC listings or editor (tokenized keywords shown where applicable).
- 6502: common 6502 instruction mnemonics that share the same byte value as the PETSCII code (including typical addressing modes shown in the source). These are opcode coincidences — useful when interpreting PETSCII-filled memory as code or vice versa.

The table preserves case/graphics variants and shows where BASIC tokens overlap character codes. The 6502 column lists representative instructions/addressing modes whose opcode byte equals the PETSCII code (not an exhaustive opcode map).

## Source Code
```text
MACHINE - PETSCII / Superchart mapping for codes DEC 79–127 (HEX 4F–7F). Shows uppercase/lowercase letters with screen mode variants, BASIC token mappings and many associated 6502 instructions (JMP, PHA, ADC/ADC variants, RTS, SEI/CLI, etc.).

                                                                        :218:

DECIMAL HEX  ASCII       SCREEN     BASIC     6502      DECIMAL

  79    4F   O,o         ~,O        O                     79
  80    50   P,p         ~,P        P         BVC rel     80
  81    51   Q,q         ~,Q        Q         EOR(zp),Y   81
  82    52   R,r         ~,R        R                     82
  83    53   S,s         ~,S        S                     83
  84    54   T,t         ~,T        T                     84
  85    55   U,u         ~,U        U         EOR zp,X    85
  86    56   V,v         ~,V        V         LSR zp,X    86
  87    57   W,w         ~,W        W                     87
  88    58   X,x         ~,X        X         CLI         88
  89    59   Y,y         ~,Y        Y         EOR abs,Y   89
  90    5A   Z,z         ~,Z        Z                     90
  91    5B   [           ~          [                     91
  92    5C   sterling    ~          sterling              92
  93    5D   ]           ~          ]         EOR abs,X   93
  94    5E   up arrow    pi,~       up arrow  LSR abs,X   94
  95    5F   left arrow  ~,~        left arrow            95
  96    60   ~           space                RTS         96
  97    61   ~,A         ~                    ADC(zp,X)   97
  98    62   ~,B         ~                                98
  99    63   ~,C         ~                                99
 100    64   ~,D         ~                               100
 101    65   ~,E         ~                    ADC zp     101
 102    66   ~,F         ~                    ROR zp     102
 103    67   ~,G         ~                               103
 104    68   ~,H         ~                    PLA        104
 105    69   ~,I         ~,~                  ADC #imm   105
 106    6A   ~,J         ~                    ROR A      106
 107    6B   ~,K         ~                               107
 108    6C   ~,L         ~                    JMP(ind)   108
 109    6D   ~,M         ~                    ADC abs    109
 110    6E   ~,N         ~                    ROR abs    110
 111    6F   ~,O         ~                               111
 112    70   ~,P         ~                    BVS rel    112
 113    71   ~,Q         ~                    ADC(zp),Y  113
 114    72   ~,R         ~                               114
 115    73   ~,S         ~                               115
 116    74   ~,T         ~                               116
 117    75   ~,U         ~                    ADC zp,X   117
 118    76   ~,V         ~                    ROR zp,X   118
 119    77   ~,W         ~                               119
 120    78   ~,X         ~                    SEI        120
 121    79   ~,Y         ~                    ADC abs,Y  121
 122    7A   ~,Z         ~,~                             122
 123    7B   ~           ~                               123
 124    7C   ~           ~                               124
 125    7D   ~           ~                    ADC abs,X  125
 126    7E   pi,~        ~                    ROR abs,X  126
 127    7F   ~,~         ~                               127

---
Additional information can be found by searching:
- "petscii_table_codes_30_78" which expands on previous block covering codes 30–78
- "petscii_table_codes_128_176" which expands on continues with extended PETSCII codes 128–176
```

## References
- "petscii_table_codes_30_78" — previous PETSCII block covering codes 30–78
- "petscii_table_codes_128_176" — continuation covering extended PETSCII codes 128–176

## Mnemonics
- BVC
- EOR
- LSR
- CLI
- RTS
- ADC
- ROR
- PLA
- JMP
- BVS
- SEI
