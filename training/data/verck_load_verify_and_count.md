# VERCK ($0A) and COUNT ($0B) usage

**Summary:** Describes two BASIC zero-page variables: VERCK ($000A) — a LOAD/VERIFY flag passed to the Kernal LOAD routine and stored at $93; COUNT ($000B) — index into the BASIC input buffer at $0200 and also used to hold the number of array subscripts and, after tokenization, the tokenized line length.

## Details
VERCK
- Location: $000A (decimal 10).
- Purpose: Flag that selects LOAD (0) or VERIFY (1) for the single BASIC-to-Kernal LOAD routine.
- Behavior: BASIC sets the A register (.A) to 0 or 1 on entry; the value written into VERCK is passed to the Kernal LOAD routine, which stores it at location 147 (decimal) / $93 (hex).

COUNT
- Location: $000B (decimal 11).
- Primary purpose: Index into the Text Input Buffer at 512 (decimal) / $0200 (hex) used by the text-to-token conversion and line-linking routines.
- Final value after tokenization: When conversion of the input buffer text into tokenized program line(s) finishes, COUNT equals the length of the tokenized line.
- Secondary purpose: Used by routines that build or locate array elements to calculate the number of DIMensions requested and the storage needed for a new array, or to count the number of subscripts supplied when referencing an array element.

## Key Registers
- $000A - BASIC - VERCK: LOAD/VERIFY flag passed to Kernal LOAD (0 = LOAD, 1 = VERIFY); stored by Kernal at $0093 (decimal 147).
- $000B - BASIC - COUNT: Index into input buffer at $0200 (decimal 512); holds tokenized line length after conversion and number of array subscripts when handling arrays.

## References
- "input_scanning_chars_charac_endchr_trmpos" — input scanning variables used by tokenization
- "array_and_tokenization_flags_dimflg_valtyp_intflg_garbfl" — related flags used when locating/creating variables and classifying data

## Labels
- VERCK
- COUNT
