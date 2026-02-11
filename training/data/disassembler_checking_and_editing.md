# MACHINE - Disassembler (.D)

**Summary:** Explains the monitor disassembler command `.D` (inverse-assembly) to translate memory bytes into mnemonics, how to run it (example `.D 033C`), how the listing is laid out (address, bytes, reconstructed source), cursor/page behavior, editing bytes directly in the listing, and re-assembling corrected lines with `.A`.

## Disassembler usage and listing format
The monitor provides an inverse-assembler: use `.D <addr>` to disassemble memory starting at the given hex address (example: `.D 033C`). The disassembler examines bytes in memory, decodes opcodes, and prints a listing where each line shows:
- left: address and the raw bytes making up the instruction
- right: the reconstructed source mnemonic/operands

The listing typically shows more memory than a single program needs; bytes beyond the program end are simply unused ("junk"). In the example source the program ends at $0341 — lines after that are unrelated data.

Cursor and paging behavior:
- The cursor is left flashing on the last printed line (not the blank line below). This allows typing the letter `D` and RETURN to page/continue disassembly from where it left off.
- To stop and avoid accidental paging, move the cursor down to a clean line before typing another command (use cursor keys).

## Editing and correcting disassembly output
Two ways to correct errors discovered in the disassembly:

1) Direct byte edit (in-place)
- Move cursor to the byte(s) on the left-hand side of the disassembly line, type over the hex digit(s), then press RETURN. The monitor replaces the byte(s) in memory immediately.
- Example: change A9 58 to A9 48 by placing the cursor on the `5`, typing `4`, and pressing RETURN; the byte becomes `48` and the instruction now disassembles as `LDA #$48`.

2) Re-assemble the line
- Use the assembler command `.A` at the appropriate address to re-enter the corrected source line; this re-generates the object bytes for that instruction.

Either method updates memory; re-disassemble to verify the change.

## Source Code
```text
.D 033C    ; example disassemble command

Sample disassembly excerpt (monitor output):

.,033C A9 58     LDA #$58

Notes:
- The example above shows address $033C, raw bytes "A9 58", and reconstructed source "LDA #$58".
- In the described correction the byte should be A9 48 (LDA #$48).
- Program end noted at $0341 in the example; lines beyond are junk.
```

## References
- "display_memory_and_object_bytes" — expands on disassembling the bytes you inspected
- "running_program_with_monitor" — expands on running the program after verifying with the disassembler
