# Kick Assembler — Number formats (Section 3.3)

**Summary:** Describes Kick Assembler numeric literal formats: decimal (no prefix), hexadecimal with $ (e.g. $2A), and binary with % (e.g. %101010). Notes that unresolved labels/unknown arguments during early passes are assumed to be 16-bit values.

## Number formats
Kick Assembler accepts the standard literal formats:

- Decimal: no prefix (e.g. lda #42)
- Hexadecimal: prefix $ (e.g. lda #$2a or lda #$FF)
- Binary: prefix % (e.g. lda #%101010)

If an expression contains an unknown value (for example an unresolved label) during the first assembly pass, the assembler will assume it is a 16-bit value for that pass.

For expanded numeric operators (byte/high/low operators > and <, bitwise operations, and other expression details) see the referenced "numeric_values_and_operators" material.

## Source Code
```text
Table 3.4. Number formats
Prefix    Format       Example
Decimal   (no prefix)  lda #42
$         Hexadecimal  lda #$2a, lda #$ff
%         Binary       lda #%101010
```

```asm
; Example usage
lda #42       ; decimal
lda #$2a      ; hexadecimal
lda #%101010  ; binary
```

## References
- "numeric_values_and_operators" — expands on numeric operators, byte/high/low operators (>,<) and bitwise operations in script expressions