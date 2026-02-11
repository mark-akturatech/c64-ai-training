# MAIN (BASIC main loop) $A480-$A49B

**Summary:** MAIN at $A480–$A49B (42112–42139) is the Commodore 64 BASIC main input loop; it vectors through RAM at $0302 ($302) so it can be diverted, reads a line of input, detects whether the input begins with a line number, and either branches to the add/replace-line routine or to immediate-statement execution.

**Description**
This routine implements the BASIC prompt/input/dispatch loop:

- **Entry:** MAIN is located at $A480–$A49B (decimal 42112–42139).
- **Vectoring:** The code transfers control via the RAM vector stored at address $0302 (decimal 770). This allows the input loop to be intercepted or replaced by modifying that RAM vector.
- **Input:** It calls the input-line reader (see "inlin_input_line") to receive a line of text from the keyboard.
- **Line-number detection:** After receiving input, MAIN checks whether the line begins with a numeric line number.
  - If a line number is present, control branches to the add/replace-line subroutine that stores the line into the BASIC program (see "main1_add_replace_line").
  - If no line number is present, control branches to the immediate-statement executor that parses and runs the entered statements.
- **Behavior note:** The routine prints the READY prompt upstream (see "ready_prompt"), which then falls through to this loop.

## Source Code
```assembly
; MAIN: BASIC main input loop
; Address: $A480–$A49B

A480   4C 02 03   JMP ($0302)   ; Jump via vector at $0302
```

## References
- "ready_prompt" — READY prompt print sequence (falls through into MAIN)
- "main1_add_replace_line" — subroutine that adds or replaces a BASIC program line when a line number is present
- "inlin_input_line" — routine used to read a line of input from the keyboard
