# Zero-Page Mode

**Summary:** Zero page ($0000-$00FF) is a 6502/C64 addressing mode that uses a single-byte operand (e.g., LDA $90) to reference addresses in page 0; code is smaller and slightly faster and the area is heavily used for system variables and special addressing modes (indirect, indexed).

## Zero-Page Mode
A full 16-bit address (for example $0381) contains a high byte (the memory page, here $03) and a low byte (the offset, here $81). Page zero refers to all addresses $0000 through $00FF.

Zero-page addressing encodes only the low byte, so instead of LDA $0090 you can write LDA $90; the instruction is one byte shorter and executes marginally faster. Because of this space/time advantage, zero page is heavily used for frequently accessed data and system variables. It is a limited resource and often conserved in C64/VIC-20 programming.

Zero-page addressing, like absolute addressing, references a single location (one byte address). It is ideal for single values and small status variables; for addressing ranges or arrays you must use other modes (see zero-page indexed and indirect-indexed addressing in related material).

Example system variables mentioned in source text:
- BASIC system variable ST: $0090 on VIC-20 and C64 (PET/CBM used $0096).
- Keyboard/status flag: $00CB on VIC-20 and C64 (PET/CBM used $0097).

The zero page is also reserved for special addressing modes (for example, zero-page indirect/addressing variants discussed elsewhere), so free locations are scarce in real programs.

## Key Registers
- $0000-$00FF - Zero Page - fast, single-byte-addressed memory area used for frequently accessed variables and special addressing modes (examples on C64: BASIC ST at $0090; keyboard/status flag at $00CB).

## References
- "zero_page_indexed_addressing" — expands on zero-page indexed addressing and wrap behavior within zero page
- "basic_variable_table_and_types" — expands on BASIC/system variables stored in zero page and their meanings

## Labels
- ST
