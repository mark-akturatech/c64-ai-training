# ca65 — Input format: assembler syntax

**Summary:** Describes ca65 assembler syntax: labels identified by a trailing colon, symbol definitions using '=', comments after ';', BRK optional signature byte behavior, and the default 6502 mode (.P02). Lists supported CPU modes and their .Pxxx control commands.

## Assembler syntax
- One source line may contain:
  - A label (identified by a trailing colon), optionally followed by a mnemonic, macro, or control command, or
  - A symbol definition using the '=' token.
- Everything after a semicolon (;) is a comment and ignored.
- Symbol definitions use the form: Name = expression.
- The BRK instruction on 6502-derived targets accepts an optional signature byte; if omitted the assembler emits a single byte ($00).
- 6502 mode is the default. Mode selection control commands switch accepted mnemonics and (for some modes) illegal opcodes or extended instruction sets.

Supported CPU modes (control commands):
- .P02 — 6502 mode (default)
- .P02X — 6502X mode (6502 + a set of illegal instructions)
- .PDTV — 6502DTV mode
- .PSC02 — 65SC02 mode
- .PC02 — 65C02 mode
- .PWC02 — W65C02 mode
- .PCE02 — 65CE02 mode
- .P4510 — 4510 mode
- .P45GS02 — 45GS02 mode
- .P6280 — HuC6280 mode
- .PM740 — M740 mode
- .P816 — 65816 mode

## Source Code
```asm
; Examples of valid input lines
Label:                          ; A label and a comment
        lda     #$20            ; A 6502 instruction plus comment
L1:     ldx     #$20            ; Same with label
L2:     .byte   "Hello world"   ; Label plus control command
        mymac   $20             ; Macro expansion
        MySym = 3*L1            ; Symbol definition
MaSym   = Label                 ; Another symbol

; BRK optional signature byte examples (6502-derived platforms)
brk                     ; 1-byte:  $00
brk     $34             ; 2-bytes: $00 $34
brk     #$34            ; 2-bytes: $00 $34
```

## References
- "cpu_modes_and_features" — per-CPU mnemonic differences and features
- "number_format_and_conditional_assembly" — number constants and conditional assembly caveats

## Mnemonics
- BRK
