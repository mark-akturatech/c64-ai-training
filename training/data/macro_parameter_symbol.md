# Assembler '?' symbol — macro parameter and label

**Summary:** The '?' symbol in assembler macro syntax precedes a number to specify which macro parameter to substitute (e.g. ?1, ?2) and may also be used as a label in the source listings.

## Explanation
'?' immediately followed by a decimal digit selects that parameter from the macro parameter list (parameter placeholder). The same '?' token may also be used as an identifier/label in source listings (for example, when the assembler prints or references local labels in expanded macros).

(Used in assembler macro syntax; '?' before a digit indicates a parameter index.)

## References
- "macro_and_byte_order_directives" — expands on Macro start/end (MAC/MND) and related syntax  
- "assembler_porting_and_translation_advice" — expands on how macro syntax may differ across assemblers