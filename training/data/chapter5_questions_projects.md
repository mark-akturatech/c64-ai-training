# Screen-clearing and addressing-mode exercises

**Summary:** Exercises and design notes for clearing C64 screen memory ($0400 default), comparing non-indexed vs indirect/indexed implementations, repeating a typed line ten times (buffering + indexed access), and strategies to avoid immediate addressing. Searchable terms: $0400, screen memory, indirect indexed, zero page, absolute addressing, immediate addressing.

**Clear the screen without using indirect or indexed addressing**
Conceptual approaches (no code included):

- Self-modifying absolute-store loop
  - Place a STA instruction in code whose two operand bytes are modified at runtime to point at successive screen addresses. Execute the STA repeatedly to write the clear value to the changing absolute target.
  - Requires handling the low-byte wrap and adjusting the high-byte when the low byte rolls over (modify the high operand byte in code when needed).
  - Pros: compact relative to fully unrolled stores; avoids indexed addressing modes and indirect addressing.
  - Cons: more complex (self-modifying code), tricky carry handling, slightly slower due to code modification.

- Unrolled-line stores (absolute addressing only)
  - Treat the 40×25 screen as 25 fixed ranges. For each row generate 40 absolute STA instructions (or write 40-byte data blocks and use a routine to copy them into place).
  - Pros: simplest conceptually; uses only absolute addressing.
  - Cons: very large code size unless you compress with data copies; not elegant.

- Use KERNAL output per position (character output to screen)
  - Repeatedly call the character-output routine to write a space (or desired clear character) to each screen position by moving the cursor. This avoids indexed/indirect addressing in your code but uses KERNAL cursor positioning (JSR CHROUT with cursor moves).
  - Pros: simpler, uses existing system services.
  - Cons: slower; may rely on KERNAL behavior and cursor state.

Notes:
- The usual compact method on the 6502 is to keep a zero-page pointer and use indexed or indirect indexed addressing; avoiding those makes the implementation either longer (unrolled) or more complex (self-modifying).

**Clear the screen using indirect,indexed addressing — advantages**
How indirect/indexed helps (conceptual):
- Use a zero-page pointer to the screen base and an index register (X or Y) to walk the buffer: STA $0400,X or STA ($00),Y (with appropriate pointer setup).
- Advantages:
  - Far smaller, simpler loop: load value once and STA to (base + index) repeatedly while INC/X/Y increments the index.
  - Easier pointer arithmetic: no self-modifying code required to advance the target address; low/high bytes and carry handled naturally by the X/Y register or by (indirect),Y addressing.
  - Better readability and lower chance of bugs.
  - Typically faster per byte than self-modifying code because addressing is handled by CPU addressing mode hardware.

**Repeat a user-typed line ten times — addressing strategy**
Recommended addressing-mode strategy (design-level):

- Buffering user input
  - Reserve a zero-page buffer pointer and a zero-page length byte. Use zero-page,X or zero-page addressing for fast per-byte storage while collecting the line.
  - Read characters until RETURN; store each character at buffer start + index; increment index (X) or adjust pointer bytes.
  - Keep the line length in a separate zero-page byte so the printing routine knows how many characters to output.

- Repeating output ten times
  - Outer loop: repeat count (10) in a register (e.g., Y) or a zero-page counter.
  - Inner loop: use indexed addressing to read buffer bytes sequentially and output them (e.g., LDA buffer,X; JSR CHROUT or STA to screen with indexed absolute).
  - Use absolute or zero-page indexed addressing to copy the buffer to successive screen positions, or move the cursor between lines and CHROUT the characters.
  - Why indexed modes:
    - Zero-page,X and absolute,X are ideal for stepping through a contiguous buffer.
    - They avoid byte-by-byte pointer arithmetic in memory and simplify boundary checks using the stored length.

Notes:
- If you must avoid indexed modes, you can use self-modifying code to change the operand address for each byte or maintain a two-byte pointer and increment it in memory — but this is more complex and slower.

**Rewriting routines without immediate addressing — methods and trade-offs**
Techniques to avoid immediate addressing (i.e., avoid LDA #$nn, etc.):

- Store constants in memory
  - Place constants in zero-page or program-area memory and load them with LDA absolute or LDA zero-page.
  - Pros: constants become writable at runtime; easier to patch without changing code bytes.
  - Cons: slower (memory read vs immediate), uses extra memory, slightly larger code if you must reference the constant from multiple places (unless centralized).

- Use registers and transfers
  - Load a register once (possibly via indirect or computed means) and transfer it where needed (e.g., TAX/TSX/TAY, then use STX/STA (implied/indexed) depending on addressing constraints).
  - Pros/cons similar to storing in memory.

- Self-modifying code to insert immediates into later instruction operands
  - Write the immediate into the instruction bytes before executing — avoids LDA #imm but is still effectively immediate embedded in code.
  - Pros: keeps instruction stream compact; Cons: fragile, harder to read, not reentrant.

Is it hard?
- Not usually impossible, but avoiding immediates tends to complicate code, increase memory use, and reduce speed. Immediate addressing is available to speed loads of constants and is normally preferred for constants known at assemble time. Avoidance might be justified if you need to patch values at runtime or reduce relocatable code dependencies, but these are niche cases.

## Key Registers
- $0400-$07E7 - Screen memory (default C64 text screen, 1000 bytes)

## References
- "screen_manipulation_project_overview" — expands on screen clearing/manipulation projects
