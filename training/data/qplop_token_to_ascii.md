# QPLOP — LIST token-to-ASCII printer (ROM $A717; vector $0306)

**Summary:** QPLOP is the BASIC LIST routine component that converts one-byte program tokens back into their ASCII keyword text for LIST output. The ROM entry is at $A717 (decimal 42775) and the routine is vectored through RAM at $0306 (decimal 774), allowing user detours so added commands can be listed.

**Description**
QPLOP is the token-to-ASCII printer used by the built-in BASIC LIST routine. When the BASIC program is stored in tokenized form (keywords stored as single-byte tokens), LIST calls this routine to expand tokens back to their ASCII keyword spellings for human-readable output.

Key points:
- QPLOP handles conversion of one-byte BASIC keyword tokens into their ASCII text equivalents.
- The active code is vectored through a RAM pointer at $0306 (decimal 774). By changing the word at $0306 you can detour LIST’s token-printing to a custom routine, enabling newly added or patched BASIC keywords to be printed correctly.
- The canonical ROM implementation resides at $A717 (decimal 42775), but programs can replace the vector to intercept token printing.

## Source Code
```text
; QPLOP routine at $A717
A717  20 1A A7  JSR $A71A      ; Jump to subroutine at $A71A
A71A  48        PHA            ; Push accumulator onto stack
A71B  98        TYA            ; Transfer Y to A
A71C  48        PHA            ; Push A onto stack
A71D  A0 00     LDY #$00       ; Load Y with 0
A71F  B1 22     LDA ($22),Y    ; Load A with byte pointed to by $22
A721  29 7F     AND #$7F       ; Mask out high bit
A723  C9 80     CMP #$80       ; Compare with $80
A725  90 0A     BCC $A731      ; Branch if less than $80
A727  20 2D A7  JSR $A72D      ; Jump to subroutine at $A72D
A72A  4C 3A A7  JMP $A73A      ; Jump to $A73A
A72D  38        SEC            ; Set carry flag
A72E  E9 80     SBC #$80       ; Subtract $80
A730  60        RTS            ; Return from subroutine
A731  20 3D A7  JSR $A73D      ; Jump to subroutine at $A73D
A734  68        PLA            ; Pull A from stack
A735  A8        TAY            ; Transfer A to Y
A736  68        PLA            ; Pull A from stack
A737  4C 1D A7  JMP $A71D      ; Jump to $A71D
A73A  68        PLA            ; Pull A from stack
A73B  A8        TAY            ; Transfer A to Y
A73C  60        RTS            ; Return from subroutine
A73D  20 2D A7  JSR $A72D      ; Jump to subroutine at $A72D
A740  20 3A A7  JSR $A73A      ; Jump to subroutine at $A73A
A743  60        RTS            ; Return from subroutine
```

```text
; Token-to-ASCII mapping table
; Token values range from $80 to $CB (128 to 203 decimal)
; Each token corresponds to a BASIC keyword
; Example entries:
; $80 - "END"
; $81 - "FOR"
; $82 - "NEXT"
; $83 - "DATA"
; $84 - "INPUT#"
; $85 - "INPUT"
; $86 - "DIM"
; $87 - "READ"
; $88 - "LET"
; $89 - "GOTO"
; $8A - "RUN"
; $8B - "IF"
; $8C - "RESTORE"
; $8D - "GOSUB"
; $8E - "RETURN"
; $8F - "REM"
; $90 - "STOP"
; $91 - "ON"
; $92 - "WAIT"
; $93 - "LOAD"
; $94 - "SAVE"
; $95 - "VERIFY"
; $96 - "DEF"
; $97 - "POKE"
; $98 - "PRINT#"
; $99 - "PRINT"
; $9A - "CONT"
; $9B - "LIST"
; $9C - "CLR"
; $9D - "CMD"
; $9E - "SYS"
; $9F - "OPEN"
; $A0 - "CLOSE"
; $A1 - "GET"
; $A2 - "NEW"
; $A3 - "TAB("
; $A4 - "TO"
; $A5 - "FN"
; $A6 - "SPC("
; $A7 - "THEN"
; $A8 - "NOT"
; $A9 - "STEP"
; $AA - "+"
; $AB - "-"
; $AC - "*"
; $AD - "/"
; $AE - "^"
; $AF - "AND"
; $B0 - "OR"
; $B1 - ">"
; $B2 - "="
; $B3 - "<"
; $B4 - "SGN"
; $B5 - "INT"
; $B6 - "ABS"
; $B7 - "USR"
; $B8 - "FRE"
; $B9 - "POS"
; $BA - "SQR"
; $BB - "RND"
; $BC - "LOG"
; $BD - "EXP"
; $BE - "COS"
; $BF - "SIN"
; $C0 - "TAN"
; $C1 - "ATN"
; $C2 - "PEEK"
; $C3 - "LEN"
; $C4 - "STR$"
; $C5 - "VAL"
; $C6 - "ASC"
; $C7 - "CHR$"
; $C8 - "LEFT$"
; $C9 - "RIGHT$"
; $CA - "MID$"
; $CB - "GO"
```

```text
; Example detour/patch code to change $0306 to point to a custom token-printer
; and restore it

; Custom token-printer routine at $C000
C000  20 00 00  JSR $0000      ; Custom processing (replace with actual code)
C003  4C 1D A7  JMP $A71D      ; Jump back to original QPLOP routine

; Code to patch the vector at $0306
; Save original vector
LDA $0306
STA $C010
LDA $0307
STA $C011

; Point vector to custom routine
LDA #$00
STA $0306
LDA #$C0
STA $0307

; ... (execute code that uses the custom token-printer)

; Restore original vector
LDA $C010
STA $0306
LDA $C011
STA $0307
```

## Key Registers
- $0306 - RAM vector - pointer to BASIC token-to-ASCII printer (QPLOP). Update this vector to detour LIST token printing to custom code.

## References
- "list_listing_and_token_printing" — expands on QPLOP as the token-to-ASCII component of LIST

## Labels
- QPLOP
