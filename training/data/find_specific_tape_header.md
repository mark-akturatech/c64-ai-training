# Find specific tape header (ROM $F7EA-$F80C)

**Summary:** Assembly routine at $F7EA calls the tape-header finder (JSR $F72C) and compares a requested filename (pointer at ($BB), length in $B7) byte-by-byte against the current tape header name (buffer via ($B2)), using zero-page indices $9E/$9F to walk the name and header bytes. On complete match the routine returns with the carry cleared (success); on mismatch it calls the header-finder again to advance to the next header.

## Description
This routine locates a specific tape header by repeatedly invoking the header-find routine at $F72C and then comparing the requested filename against the header name bytes stored in the tape header buffer.

Behavior step-by-step (literal behavior as implemented):

- JSR $F72C — find/position to the next tape header; header data is returned in the tape buffer pointed to by the zero-page pointer ($B2).
- If $F72C returned with carry set, the code branches to RTS (exit with error).
- Set $9F := $05 — initialize the tape-buffer index to 5 (header name offset).
- Set $9E := $00 — initialize the requested-name index to 0.
- Compare Y (0) to $B7 (requested filename length); if equal (length 0) branch to success (clear carry and return).
- Loop:
  - Load requested-name byte via LDA ($BB),Y where Y is the requested-name index.
  - Load Y from $9F (the tape-buffer index) and compare with the tape-header name byte using CMP ($B2),Y.
  - If bytes differ, call $F72C again to advance to the next header and repeat.
  - If bytes match, INC $9E (advance requested-name index) and INC $9F (advance tape-buffer index).
  - Load Y from $9E and loop back to compare the next byte until $9E wraps to zero; when it becomes zero the routine clears the carry (success) and returns.

Important implementation notes:
- ($BB) is used as an indirect pointer to the requested filename buffer; $B7 holds the requested filename length.
- ($B2) is the indirect pointer to the current tape header buffer (where the header name bytes are read starting at offset $05).
- Indices are maintained in zero page bytes $9E (requested-name index) and $9F (tape-buffer index).
- Success is indicated by clearing the carry (CLC) immediately prior to RTS; a set carry causes the routine to exit early (BCS $F80C). This contradicts the original summary wording that said the routine "sets carry (OK)"; the code clears carry on success.

**[Note: Source may contain an error in the original high-level description — the assembly shows CLC (carry clear) on successful match and uses BCS to exit on error (carry set).]**

## Source Code
```asm
.,F7EA 20 2C F7 JSR $F72C       find tape header, exit with header in buffer
.,F7ED B0 1D    BCS $F80C       just exit if error
.,F7EF A0 05    LDY #$05        index to name
.,F7F1 84 9F    STY $9F         save as tape buffer index
.,F7F3 A0 00    LDY #$00        clear Y
.,F7F5 84 9E    STY $9E         save as name buffer index
.,F7F7 C4 B7    CPY $B7         compare with file name length
.,F7F9 F0 10    BEQ $F80B       ok exit if match
.,F7FB B1 BB    LDA ($BB),Y     get file name byte
.,F7FD A4 9F    LDY $9F         get index to tape buffer
.,F7FF D1 B2    CMP ($B2),Y     compare with tape header name byte
.,F801 D0 E7    BNE $F7EA       if no match go get next header
.,F803 E6 9E    INC $9E         else increment name buffer index
.,F805 E6 9F    INC $9F         increment tape buffer index
.,F807 A4 9E    LDY $9E         get name buffer index
.,F809 D0 EC    BNE $F7F7       loop, branch always
.,F80B 18       CLC             flag ok
.,F80C 60       RTS
```

## Key Registers
- $009E - Zero page - requested filename index (increments per matched byte)
- $009F - Zero page - tape-header buffer index (starts at $05, increments per matched byte)
- $00B2 - Zero page - indirect pointer to tape header buffer (use as ($B2),Y)
- $00BB - Zero page - indirect pointer to requested filename buffer (use as ($BB),Y)
- $00B7 - Zero page - requested filename length

## References
- "get_tape_buffer_start_pointer" — expands on pointer-setup code used prior to header searches
- "bump_tape_pointer" — expands on advancing to the next header/buffer (called via $F72C)