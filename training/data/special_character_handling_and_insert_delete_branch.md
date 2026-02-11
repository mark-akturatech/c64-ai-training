# Final special-character handling — ROM disassembly ($E7CE-$E7FC)

**Summary:** C64 KERNAL code that sets colour, masks the character high bit (AND #$7F), maps $FF→$5E, distinguishes printable (≥ $20) vs control ranges, dispatches to insert/shift/quote/quote-exit or CR handling, and enters the insert/delete processing path when appropriate; uses zero-page flags/variables $D4 (quote flag), $D5 (screen line length), ($D1),Y (current screen line), and $D3 (cursor column).

## Description
This fragment is the final dispatch stage for character output in the C64 ROM. Sequence:

- JSR $E8CB: set the colour code (prepares attribute/color state).
- JMP $EC44: go check for special character codes (short circuit to common handling).
- AND #$7F: clear bit 7 (makes characters canonical 0x00–0x7F).
- CMP #$7F / BNE: detect if the original byte was $FF (because masking $FF yields $7F). If so, LDA #$5E sets the character to $5E (caret '^') — this preserves the historical mapping of $FF to printable '^'.
- CMP #$20 / BCC: test if masked character is less than SPACE (control range). If ≥ SPACE, JMP $E691 to the uppercase/graphic insertion path (character originally $80–$9F now canonical $00–$1F at insertion site).
- CMP #$0D / BNE: if not CR (0x0D), continue into control-character dispatch.
- JMP $E891: branch to carriage-return handling when character is CR.
- LDX $D4 / BNE $E82D: load quote-flag ($D4). If non-zero, branch to quote-mode handling.
- CMP #$14 / BNE: compare with the INSERT/DELETE code (0x14). If not insert/delete, branch elsewhere.
- LDY $D5: load current screen line length (Y = length).
- LDA ($D1),Y: fetch the character at the current screen line at index Y (uses zero-page pointer at $D1).
- CMP #$20 / BNE: if that character is not SPACE, continue (no free-space optimization).
- CPY $D3 / BNE: compare current column (Y) with cursor column ($D3). If not equal, branch to open space on the line (insert handling).

Zero-page variables used here (KERNAL conventions):
- $D4 — quote flag (non-zero = quote mode)
- $D5 — current screen line length (index)
- ($D1),Y — pointer to current screen line; Y indexes into line
- $D3 — cursor column index

This code therefore implements final normalization of incoming bytes, maps special-case $FF, separates printable insertion from control handling (CR), honors quote-mode, and routes insert/delete into the branch that will shift characters or clear the last char on the line depending on column and contents.

## Source Code
```asm
.,E7CE 20 CB E8 JSR $E8CB       ; set the colour code
.,E7D1 4C 44 EC JMP $EC44       ; go check for special character codes
.,E7D4 29 7F    AND #$7F        ; mask 0xxx xxxx, clear b7
.,E7D6 C9 7F    CMP #$7F        ; was it $FF before the mask
.,E7D8 D0 02    BNE $E7DC       ; branch if not
.,E7DA A9 5E    LDA #$5E        ; else make it $5E
.,E7DC C9 20    CMP #$20        ; compare the character with [SPACE]
.,E7DE 90 03    BCC $E7E3       ; if < [SPACE] go ??
.,E7E0 4C 91 E6 JMP $E691       ; insert uppercase/graphic character and return
                                ; character was $80 to $9F and is now $00 to $1F
.,E7E3 C9 0D    CMP #$0D        ; compare with [CR]
.,E7E5 D0 03    BNE $E7EA       ; if not [CR] continue
.,E7E7 4C 91 E8 JMP $E891       ; else output [CR] and return
                                ; was not [CR]
.,E7EA A6 D4    LDX $D4         ; get the cursor quote flag, $xx = quote, $00 = no quote
.,E7EC D0 3F    BNE $E82D       ; branch if quote mode
.,E7EE C9 14    CMP #$14        ; compare with [INSERT DELETE]
.,E7F0 D0 37    BNE $E829       ; if not [INSERT DELETE] go ??
.,E7F2 A4 D5    LDY $D5         ; get current screen line length
.,E7F4 B1 D1    LDA ($D1),Y     ; get character from current screen line
.,E7F6 C9 20    CMP #$20        ; compare the character with [SPACE]
.,E7F8 D0 04    BNE $E7FE       ; if not [SPACE] continue
.,E7FA C4 D3    CPY $D3         ; compare the current column with the cursor column
.,E7FC D0 07    BNE $E805       ; if not cursor column go open up space on line
```

## Key Registers
- (omitted) — this chunk uses zero-page KERNAL variables ($D1, $D3, $D4, $D5) not hardware I/O registers; no VIC/SID/CIA addresses are referenced.

## References
- "output_character_unshifted_and_control_dispatch" — continues handling for characters and decides where to route them
- "insert_delete_close_line_and_clear_last_char" — expands on branches here when detecting insert/delete in non-quote mode