# LINKPRG ($A533)

**Summary:** Relinks tokenized BASIC program lines by updating each line's two-byte next-line pointer (link address). Scans each line to the end-of-line byte (0) and adds an offset to the current statement address to produce the new link address; located at $A533 (decimal 42291).

**Description**

Each tokenized BASIC program line begins with a two-byte pointer to the address of the next line (the link address). LINKPRG walks program text line-by-line, scans to the end-of-line marker (a 0 byte), and computes a new two-byte link pointer by adding a supplied offset to the address of the current statement. This keeps the chain of link pointers valid after lines are inserted, removed, or moved.

Key points preserved from the original:

- Routine name and start address: LINKPRG at $A533 (42291).
- Input/output behavior (conceptual): reads each line, finds the 0 terminator, updates that line’s two-byte next-line pointer.
- Purpose: used when inserting or moving lines so link pointers remain correct.

The LINKPRG routine is essential for maintaining the integrity of the BASIC program's internal structure, especially after modifications that affect line addresses.
