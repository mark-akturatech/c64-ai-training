# RESLST (41118-41373 / $A09E-$A19D) — list of BASIC reserved keywords (tokens 128..202)

**Summary:** RESLST at $A09E-$A19D is the ROM table of BASIC reserved keywords (stored ASCII with bit7 set on the last character). It is used by the tokenizer (CRUNCH) to convert keywords to single-byte tokens and by LIST/PRINT routines to convert tokens back to text; related tables: STMDSP ($A00C), OPTAB ($A080), FUNDSP ($A052).

## Description
- Purpose: RESLST is the canonical list of BASIC keywords used to compress source text into tokens when storing program lines, and to expand tokens back to ASCII when listing or printing program text.
- Storage format: Each keyword is stored as ASCII characters; the last character of each keyword has bit 7 set (i.e., 128 added to its ASCII code) to mark the end of the word.
- Tokenization: When a line is crunched (tokenized) the tokenizer consults this table and replaces matched keywords with their single-byte token values (example: the command PRINT is stored as token 153 ($99) rather than five ASCII bytes).
- LISTing: When the program is listed, this same table is scanned to convert tokens back into the printable ASCII keywords.
- Composition of the table (as described in ROM):
  1. Statements found in STMDSP (address 40972 / $A00C), in token-number order (tokens 128–162).
  2. Miscellaneous keywords that do not begin a statement (several entries shown below).
  3. Math operators found in OPTAB (address 41088 / $A080), in token-number order (tokens 170–179).
  4. Functions found in FUNDSP (address 41042 / $A052), in token-number order (tokens 182–202).
  5. The word GO (token 203 / $CB) — added so "GO TO" is a legal spaced keyword (compatibility with early PET BASIC).

**[Note: Source may contain an error — the Token # / hex column for the miscellaneous list shows an apparent mismatch for the first line (token # 162 paired with $A3). The original ROM/assembler listings should be consulted if precise token-number/hex mapping is required.]**

## Source Code
```text
RESLST region: 41118-41373   $A09E-$A19D

Description in ROM:
This table contains a complete list of the reserved BASIC keywords
(the combinations of ASCII text characters that cause BASIC to do
something).  The ASCII text characters of these words are stored in
token number order.  Bit #7 of the last letter of each word is set to
indicate the end of the word (the last letter has 128 added to its
true ASCII value).

When the BASIC program text is stored, this list of words is used to
reduce any keywords to a single-byte value called a token.  The
command PRINT, for example, is not stored in a program as five ASCII
bytes, but rather as the single token 153 ($99).

When the BASIC program is listed, this table is used to convert these
tokens back to ASCII text.  The entries in this table consist of the
following:

1.  The statements found in STMDSP at 40972 ($A00C), in the token
number order indicated (token numbers 128-162).

2.  Some miscellaneous keywords which never begin a BASIC statement:

Token #    Keyword
162 $A3    TAB(
164 $A4    TO
165 $A5    FN
166 $A6    SPC(
167 $A7    THEN
168 $A8    NOT
169 $A9    STEP

3.  The math operators found in OPTAB at 41088 ($A080), in the token
number order indicated (token numbers 170-179).

4.  The functions found in FUNDSP at 41042 ($A052), in the token
number order indicated (token numbers 182-202).

5.  The word GO (token number 203 ($CB)).  This word was added to the
table to make the statement GO TO legal, to afford some compatibility
with the very first PET BASIC, which allowed spaces within keywords.
```

## References
- "crunch_tokenize_line" — tokenizer/CRUNCH routine that consults RESLST when tokenizing input lines

## Labels
- RESLST
