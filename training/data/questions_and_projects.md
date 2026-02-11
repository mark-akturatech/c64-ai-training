# MACHINE — Exercises: accept chars; ORA #$80; AND #$FE

**Summary:** Exercises for keyboard input handling on 6502/C64: extend input to accept numeric and alphabetic characters, accept alphabetic-only and set high bit with ORA #$80 (sets bit 7), and accept numeric-only and clear the low bit with AND #$FE (clears bit 0). Terms: ASCII, ORA #$80, AND #$FE, keyboard filtering.

## Exercises
- Allow both numeric and alphabetic characters, but nothing else.
  - Modify the input routine so it accepts only characters in the numeric and alphabetic ranges (ASCII ranges for digits and letters).
  - Stop or ignore any other characters.

- Accept alphabetic characters only; as each ASCII character is received, perform ORA #$80 and then print it.
  - ORA #$80 sets the high bit (bit 7) of the character byte. Observe and answer: How has the character been changed?

- Accept numeric digits only; as each ASCII character is received, perform AND #$FE and then print it.
  - AND #$FE clears the lowest bit (bit 0) of the character byte. Observe and answer: What happens to the numbers? Can you see why?

## References
- "numeric_key_waiting_subroutine_project" — expands on Base project to modify for accepting more characters  
- "logical_ora_and_examples" — expands on Use ORA #$80 in one exercise  
- "logical_and_and_examples" — expands on Use AND #$FE in one exercise
