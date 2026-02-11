# Kick Assembler: .pseudocommand argument separator (colon) and v3.x compatibility

**Summary:** Pseudocommand arguments are separated by colon (:) and accept the same operand forms as mnemonics; in Kick Assembler v3.x arguments used semicolon (;) — use -pseudoc3x or the 3.x→4.x converter for old code. An optional leading colon (:) before a pseudocommand call forces calling the pseudocommand even when its name matches a CPU mnemonic (example shows a pseudocommand named "adc").

## Argument separation and compatibility
- In current Kick Assembler syntax, arguments to a pseudocommand are separated by colon (:) and each argument may be any operand you could give to a mnemonic (immediate, absolute, zero page, labels, expressions, etc.).
- Older Kick Assembler v3.x used semicolon (;) as the argument separator. To assemble legacy code:
  - Use the -pseudoc3x command-line option, or
  - Convert source with the provided 3.x → 4.x converter.
- The assembler distinguishes pseudocommands from mnemonics by name; if a pseudocommand shares a name with an existing mnemonic, a leading colon can be used to call the pseudocommand (see next section).

## Optional leading colon and naming collisions
- You may prefix a pseudocommand call with a colon (:) to force the assembler to treat it as a pseudocommand even if its identifier matches a CPU mnemonic. Without the leading colon, tokens that match mnemonics are parsed as instructions.
- This optional leading colon is useful when defining convenience pseudocommands that intentionally reuse mnemonic names.

## Example: .pseudocommand adc
- The following example defines a pseudocommand named adc that expands to a small sequence using LDA/ADC/STA and takes three arguments separated by colons.
- Example usage in the source shows a mnemonic-style call (no leading colon) and a forced pseudocommand call (leading colon).

## Source Code
```asm
.pseudocommand adc arg1 : arg2 : tar {
    lda arg1
    adc arg2
    sta tar
}

; mnemonic call — parsed as the standard ADC instruction (no leading colon)
adc #$10

; pseudocommand call — leading colon forces the pseudocommand,
; arguments separated by colon
:adc #$20 : $10 : $20
```

## References
- "pseudocommand_intro_and_simple_mov_examples" — Basic pseudo command definition and examples (mov)
- "cmdvalue_getters_and_usage" — CmdValue API used to inspect command arguments