# Test STOP Key for Break in Program ($A82C)

**Summary:** Entry point at $A82C (decimal 43052) that checks the STOP key and calls the Kernal STOP routine; if the key is pressed, the Kernal STOP command at $F6ED (decimal 63213) is executed to break program execution.

## Details
This routine (labelled/Test point $A82C) invokes the Kernal STOP processing. Its purpose is to detect a pressed STOP key and, when detected, transfer control to the Kernal STOP command at $F6ED (decimal 63213) so that program execution is broken.

- Address: $A82C (43052)
- Action: Calls Kernal STOP routine; on STOP-key detection, the STOP command at $F6ED is executed to produce a BREAK.

## References
- "newstt_set_up_next_statement" — expands on NEWSTT checks for the STOP key before advancing
- "end_statement_behavior" — expands on END printing a BREAK message if a STOP break occurred