# NMOS 6510 — Addressing Mode Abbreviations & Mnemonic Conventions

**Summary:** Lists addressing-mode abbreviations used for the NMOS 6510 (AA, AAH, AAL, DO, etc.) and the document's mnemonic convention (headline lists of historical mnemonics, then one preferred variant). References assembler support mapping in an appendix.

## Addressing Mode Abbreviations
- AA — Absolute Address (full 16-bit address operand).
- AAH — Absolute Address High (high byte of a 16-bit absolute address).
- AAL — Absolute Address Low (low byte of a 16-bit absolute address).
- DO — Direct Offset (zero-page offset / direct-page offset shorthand).
- "and similar shorthand" — these abbreviations are used consistently throughout the document to denote operand byte parts and addressing-mode variants.

## Mnemonics
- Each opcode entry lists previously used mnemonics in its headline, followed by a single variant chosen by the author for the remainder of the text.
- A table in the appendix maps which mnemonics are supported by several popular assemblers.

## References
- "naming_conventions_and_symbols" — expands on registers and notation