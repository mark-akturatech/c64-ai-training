# Zero Page $0007-$000F — BASIC tokenizer and state bytes

**Summary:** Zero page bytes $0007-$000F are used by Commodore 64 BASIC's tokenizer and runtime for search/input buffers, column counting (SPC/TAB), LOAD/VERIFY mode, token/array counters (DIM), expression and numeric type flags, and quotation mode during tokenization/listing.

## Zero Page $0007-$000F (BASIC tokenizer / state)
These single-byte zero-page locations are small state and temporary buffers used by the BASIC interpreter during tokenization, listing, parsing expressions, and input/search operations. They are reused by multiple routines (search, input parsing, tokenization, DIM processing), so contents are volatile and should not be assumed preserved across BASIC calls.

- $0007 — Byte Buffer  
  Search byte, input digit, or operand low byte (used as a low-order temporary during tokenization/parsing).

- $0008 — Byte Buffer  
  Search byte, tokenization byte, or operand high byte (high-order temporary paired with $0007 for word operands).

- $0009 — Column Counter  
  Current column during SPC() and TAB(), used when computing spacing for output and when listing tokenized program lines.

- $000A — LOAD/VERIFY Switch  
  Flag indicating load vs. verify mode for cassette/disk load operations (affects how bytes are processed during LOAD/VERIFY routines).

- $000B — Token / Array Counter  
  Holds current token value or array-dimension count during DIM and tokenization routines.

- $000C — Array Switch  
  DIM operation indicator / auxiliary array-processing flag.

- $000D — Expression Type  
  Expression result type flag: numerical ($00) or string ($FF). Used by the expression evaluator to select conversion/handling paths.

- $000E — Numerical Type  
  Numeric subtype flag: floating point (0) or integer (1). Guides number formatting, storage, and numeric arithmetic paths.

- $000F — Quotation Mode  
  Mode indicator used during tokenization/listing to track whether the parser is inside a quoted string (quotation mode on/off).

Notes:
- These addresses are part of the zero page workspace; routines often treat them as scratch registers and reuse them for multiple purposes.
- Values are single bytes; where paired (e.g., $0007/$0008) they form word operands in little-endian (low/high) order.

## Source Code
```text
$0007   Byte Buffer             Search byte, input digit, operand low byte
$0008   Byte Buffer             Search byte, tokenization byte, operand high byte
$0009   Column Counter          Current column during SPC() and TAB()
$000A   LOAD/VERIFY             Switch for load vs. verify operations
$000B   Token/Array             Current token or array dimension count
$000C   Array Switch            DIM operation indicator
$000D   Expression Type         Numerical ($00) or string ($FF)
$000E   Numerical Type          Floating point (0) or integer (1)
$000F   Quotation Mode          Mode indicator during tokenization/listing
```

## Key Registers
- $0007-$000F - Zero Page - BASIC tokenizer/search/input buffers, column counter, LOAD/VERIFY switch, DIM/token counters, expression and numeric type flags, quotation mode

## References
- "tokenizer_and_executor_vectors" — expands on tokenizer/executor vectors (covers $0304-$0309)