# Check input cursor vs logical-line pointers (BASIC ROM)

**Summary:** Compares the saved input cursor row/column ($C9/$CA) to the current logical-line pointers (via $D6 and internal pointers set by $E6ED) to decide whether input came from screen or keyboard; saves cursor column ($D3) and branches inside-line (BCC $E63A) or beyond end-of-line (BCS $E65D). Contains zero-page register accesses and branch and subroutine flow.

## Behavior and flow
This code snippet performs these steps in sequence:

- LDA $C9 / BMI $E63A
  - Loads the saved input-cursor row from zero page $C9; if the value is negative (bit 7 set), the routine branches to $E63A (skip further comparisons).
- LDX $D6
  - Loads the current cursor row from zero page $D6.
- JSR $E6ED
  - Calls the routine at $E6ED which "find[s] and set[s] the pointers for the start of logical line" — this routine prepares the logical-line pointers used for the comparison.
- CPX $C9 / BNE $E63A
  - Compares the current cursor-row (X) with the saved input-cursor row in $C9; if unequal, branch to $E63A (treat input as not from the active logical line).
- LDA $CA / STA $D3
  - Loads the saved input-cursor column from $CA and stores it into $D3 (saving the column into the working variable).
- CMP $C8 / BCC $E63A
  - Compares the saved input column with the current end-of-line pointer in $C8; if less (cursor is within the logical line), branch to $E63A (handle as in-line input).
- BCS $E65D
  - Otherwise (cursor column is at or beyond end-of-line), branch to $E65D to handle input beyond end-of-line.

Branch targets:
- $E63A — path taken when the input cursor is invalid, negative, on a different row, or column is inside the line (handled as input-from-screen or similar).
- $E65D — path taken when the input cursor column is beyond the logical end-of-line (different handling required).

This sequence determines whether the input originated from the current screen line or from keyboard (logical) input by comparing pointer values and updates the working column variable accordingly.

## Source Code
```asm
.,E61B A5 C9    LDA $C9         get the input cursor row
.,E61D 30 1B    BMI $E63A       
.,E61F A6 D6    LDX $D6         get the cursor row
.,E621 20 ED E6 JSR $E6ED       find and set the pointers for the start of logical line
.,E624 E4 C9    CPX $C9         compare with input cursor row
.,E626 D0 12    BNE $E63A       
.,E628 A5 CA    LDA $CA         get the input cursor column
.,E62A 85 D3    STA $D3         save the cursor column
.,E62C C5 C8    CMP $C8         compare the cursor column with input [EOL] pointer
.,E62E 90 0A    BCC $E63A       if less, cursor is in line, go ??
.,E630 B0 2B    BCS $E65D       else the cursor is beyond the line end, branch always
```

## Key Registers
- $C9 - BASIC (zero page) - saved input cursor row
- $CA - BASIC (zero page) - saved input cursor column
- $C8 - BASIC (zero page) - input end-of-line pointer (column limit)
- $D6 - BASIC (zero page) - current cursor row
- $D3 - BASIC (zero page) - working/saved cursor column (written by this code)

## References
- "process_carriage_return_trim_spaces_prepare_input" — expands on actions called after trimming and preparing input
- "input_from_screen_or_keyboard_loop" — expands on the main input-from-screen handling path if relevant