# String comparison (BASIC)

**Summary:** String comparisons in Commodore BASIC use left-to-right character code comparison using the PET/CBM character set; relational operators (=, <>, <=, >=, <, >) compare characters by their PET/CBM code values, and comparisons produce an integer result (-1 or 0) usable in calculations.

## Description
- Comparison method: Strings are compared one character at a time, left-to-right. At each position the PET/CBM character code for the character in each string is examined.
- Code ordering: If character codes are equal, comparison continues; if they differ, the character with the lower PET/CBM code is considered lower in the ordering.
- Termination rule: The comparison stops when the end of either string is reached.
- Prefix rule: If one string is a prefix of the other (all compared characters equal and one string ends), the shorter string is considered less than the longer string.
- Blanks: Leading and trailing blanks (space characters) are significant and participate in comparisons.
- Result value: Every comparison yields an integer result (regardless of operand data types). The numeric result is -1 for true and 0 for false. This result may be used in arithmetic expressions but must not be used as a divisor (division by zero is illegal).

## References
- "screen_display_codes_table" — PET/CBM character code table (Appendix C)