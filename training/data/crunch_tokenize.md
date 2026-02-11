# CRUNCH ($A579) — Tokenize BASIC line in input buffer

**Summary:** CRUNCH (at $A579 / 42361) scans a BASIC program line placed in the input buffer at $200 and replaces BASIC keywords and valid abbreviations (outside quoted strings) with their one-byte token equivalents. The routine is vectored through RAM at $304 so the tokenizing behavior can be overridden or extended.

## Description
CRUNCH is the tokenizer used when a BASIC program line is entered into the text buffer (address $200, decimal 512). It scans the line character-by-character and:

- Detects BASIC keywords and their allowed abbreviations.
- Replaces those keywords/abbreviations with the one-byte token values used by the BASIC interpreter.
- Skips replacement for text within quotation marks (quoted strings are left intact).
- Is reached via a vector stored at $304 (decimal 772), allowing the tokenizing entry point to be changed in RAM so new or altered commands can be added without modifying ROM.

This routine is invoked on lines entered through the normal input flow; related handlers exist for special input paths (see References).

## References
- "inlin_input_line" — expands on operation for lines placed into the input buffer by INLIN  
- "linkprg_relink_tokenized_lines" — expands on how LINKPRG updates link addresses after CRUNCH and insertion

## Labels
- CRUNCH
