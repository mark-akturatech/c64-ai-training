# Kick Assembler .pseudocommand — defining mnemonic-style pseudo commands

**Summary:** .pseudocommand in Kick Assembler defines user commands that accept mnemonic-style arguments (e.g. #10, table,y, ($30),y). Example shows a mov pseudo command handling immediate, label, indexed and (indirect),y forms and expanding to LDA/STA mnemonics.

## Description
.pseudocommand creates a macro-like command whose arguments are parsed the same way mnemonics are (immediate "#", index ",x" / ",y", parentheses for indirection). The pseudo command body receives those argument tokens and emits the contained assembly lines with the arguments substituted verbatim.

Definition syntax (example):
.pseudocommand name arg1:arg2 {
  ; body may use arg1 and arg2 as if they were mnemonic operands
}

In the provided mov example the colon separates the source and target operands in the call (call-site uses the same colon). The mov body simply expands to an LDA of the first argument followed by STA of the second, so any valid addressing mode accepted by LDA/STA may be passed as arguments (immediate, absolute/label, indexed, indirect,y).

## Source Code
```asm
.pseudocommand mov src:tar {
    lda src
    sta tar
}

; Usage examples and resulting emitted mnemonics:

mov #10 : $1000
; emits:
; lda #10
; sta $1000

mov source : target
; emits:
; lda source
; sta target

mov source,x : target,y
; emits:
; lda source,x
; sta target,y

mov #20 : ($30),y
; emits:
; lda #20
; sta ($30),y
```

## References
- "macro_label_access_and_recursion" — expands on general macro behavior and label access (relevant to pseudo commands)
- "pseudocommand_adc_example_and_call_syntax" — more examples of pseudo command syntax and calling forms (including optional colon)
- "cmdvalue_getters_and_usage" — explains how pseudo command arguments are represented as CmdValue objects