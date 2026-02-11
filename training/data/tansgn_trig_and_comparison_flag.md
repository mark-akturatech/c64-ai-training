# TANSGN ($12)

**Summary:** Stores the sign/outcome flag at zero-page $0012 (TANSGN). Used by SIN/TAN routines to record sign (positive/negative) and by BASIC string/numeric comparison routines to indicate A>B (1), A==B (2), A<B (4); composite values combine these bits (e.g., >=, <=).

**Description**
This zero-page location (labelled TANSGN, $12) serves two purposes in Commodore BASIC:

- **Trigonometric sign flag:** Used to record the sign (positive or negative) of a value returned by the SIN or TAN functions. The value stored is:
  - 0 for positive results
  - 255 for negative results

- **Comparison outcome indicator:** Used by the string and numeric comparison routines to encode the result of comparing variable A to variable B:
  - 1 = A > B
  - 2 = A == B
  - 4 = A < B

Composite values are formed by bitwise OR of these indicators to represent multi-operator comparisons:
  - >= (A >= B) => 1 | 2 = 3
  - <= (A <= B) => 2 | 4 = 6
  - <> (A != B) => 1 | 4 = 5

The location is written by comparison and trig code and read by callers that need to branch or decide based on sign or comparison result.

## Key Registers
- $0012 - BASIC (zero page) - TANSGN: sign flag for SIN/TAN; comparison outcome bits (1=A>B, 2=A==B, 4=A<B; composites represent combined operators)

## References
- "inpflg_input_get_read_flag" — expands on preceding input/command flag context  
- "channl_current_io_channel" — expands on next entry controlling BASIC I/O destination behavior

## Labels
- TANSGN
