# The Wicked SOV (Start‑Of‑Variables)

**Summary:** Explains the Start‑Of‑Variables (SOV) pointer and its interaction with BASIC SAVE/LOAD, variable allocation, and program editing; describes failure modes when SOV is corrupted (e.g., set into the cassette buffer) including overwrites, runaway SAVE, and destructive memory moves.

## SOV rules
1. Variables are written starting at the SOV (start‑of‑variables) pointer and grow upward from there.  
2. BASIC SAVE saves memory from start‑of‑BASIC up to (but not including) the SOV.  
3. A direct BASIC LOAD places a program into memory (relocating if needed) and sets SOV to the byte immediately following the last byte loaded.  
4. Editing or changing a BASIC program causes memory to be moved (up or down) from the edit point up to the SOV; the SOV is moved the same distance to preserve the variables area.

## Failure modes and examples
- SOV moved into cassette buffer after loading a machine language block:
  - Scenario: BASIC program exists; machine language data is loaded into the cassette buffer area; a subsequent LOAD leaves SOV pointing inside that cassette buffer.
  - Symptom: Variables begin to be allocated into the cassette buffer region and will grow upward, eventually overwriting the BASIC program text and producing gibberish when LIST is issued or causing the program to vanish.

- Runaway SAVE due to SOV below start‑of‑BASIC:
  - If SOV is set lower than start‑of‑BASIC, SAVE will copy memory from start‑of‑BASIC up to SOV and continue until the address space wraps around through $0000 back to SOV.
  - Symptom: A very small BASIC program may be saved as hundreds of disk blocks or many minutes of tape — the resulting saved file is useless and contains unrelated memory contents.

- Destructive editing when SOV is corrupted:
  - Deleting or inserting a character in BASIC triggers a memory move from the edit point up to SOV. If SOV is below the intended variable area (e.g., in I/O/cassette/ROM area), the move will continue into areas that cannot safely be shifted.
  - Effects: RAM area contents are shifted (may be harmless), then I/O chip regions are shifted (scrambles display/colors), then attempts to move ROM fail (ROM is immutable), and the move can wrap into zero page and overwrite system vectors and pointers — this typically destroys the running system before the routine can finish.

## Notes
- The text references "IA chips" being moved; this appears to be an OCR or source wording issue and likely refers to I/O (input/output) chip regions (e.g., VIC/CIAs/SID areas). **[Note: Source may contain an error — "IA chips" likely means "I/O chips".]**

## References
- "basic_memory_pointers_and_meanings" — expands on the role of SOV in SAVE and LOAD