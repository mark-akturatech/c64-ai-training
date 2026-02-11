# Entering Assembled Bytes into RAM at $033C (MLM .M)

**Summary:** This guide details how to input machine language code directly into the Commodore 64's memory starting at address $033C using the Machine Language Monitor (MLM). It includes steps to display, edit, and verify memory contents, along with the exact byte sequence for a short 6502 program utilizing LDA, LDX, STA, STX, and BRK instructions.

**Procedure**

This section outlines the steps to map machine-code bytes to specific memory addresses and enter them using the MLM's memory display command.

- **Target Load Address:** $033C (Datasette buffer area).
- **Program Bytes:** The two-digit hexadecimal values representing machine opcodes and operands to be entered into memory.
- **Steps:**
  1. **Display Memory Contents:**
     - Enter the command `.M 033C 0348` to display memory from $033C to $0348. This will show two lines, each containing eight bytes.
  2. **Edit Memory:**
     - For each displayed line, overwrite the existing hex bytes with the program bytes.
     - After editing a line, press RETURN to commit the changes.
     - Ensure not to overwrite the trailing "xx" bytes, which represent memory outside the program's scope.
  3. **Verify Entries:**
     - After entering all lines, use the command `.M 033C 0348` again to confirm that the memory contents match the intended program bytes.

**Behavioral Notes:**

- The addresses displayed on the left are for reference; only the hex bytes are to be modified.
- Mnemonics and comments in assembly listings are for human readability and should not be entered into memory.

## Source Code

Below is the assembled listing with addresses and corresponding bytes for reference:

```asm
; Address   Bytes          Mnemonic
033C       AD 80 03       LDA $0380
033F       AE 81 03       LDX $0381
0342       8D 81 03       STA $0381
0345       8E 80 03       STX $0380
0348       00             BRK
```

Example of MLM memory display before editing (contents may vary):

```text
.:033C xx xx xx xx xx xx xx xx
.:0344 xx xx xx xx xx xx xx xx
```

Edit the two lines to match the program bytes (type over the hex bytes and press RETURN after each line):

```text
.:033C AD 80 03 AE 81 03 8D 81
.:0344 03 8E 80 03 00 xx xx xx
```

After committing both lines, verify the entries:

```text
.M 033C 0348
```

Expected display:

```text
.:033C AD 80 03 AE 81 03 8D 81
.:0344 03 8E 80 03 00 xx xx xx
```

## References

- "choosing_program_location" — Discusses selecting $033C (Datasette buffer) as the target area.
- "preparing_and_running_program" — Explains preparing data values and executing the program with `.G`.