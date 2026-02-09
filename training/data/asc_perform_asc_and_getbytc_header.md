# ASC ($B78B)

**Summary:** ASC at $B78B loads the first character of a string into the Y register (if the string is not null) and then calls the POS integer-to-floating-point conversion routine to convert that one-byte integer in Y to a floating-point value. The GETBYTC header appears at $B79B.

## Description
- Entry: label ASC at $B78B.
- Operation: If the target string is non-empty, ASC obtains the string's first character and places it into the 6502 Y register (Y = 6502 index register). It then transfers control to the integer-to-floating-point conversion code used by POS to produce a floating-point representation of that one-byte integer in Y.
- End of this range: header label GETBYTC at $B79B (next routine).
- Related string handling and descriptor details are referenced by getspa_allocate_string_space (see References).

## References
- "len_perform_len" — expands on related simple string functions returning numeric values
- "getspa_allocate_string_space" — expands on string memory and descriptors referenced by ASC when accessing characters