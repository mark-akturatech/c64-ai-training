# BASIC zero-page: CHARAC ($07), ENDCHR ($08), TRMPOS ($09)

**Summary:** Zero-page BASIC scanner variables at $0007-$0009: CHARAC ($07) holds ASCII search characters for the BASIC scanner (quotes, comma, colon, EOL); ENDCHR ($08) is a tokenization work byte (commonly 0 or 34); TRMPOS ($09) stores the logical cursor column before the last TAB/SPC (moved from $D3, range 0–79).

## Description
CHARAC ($07)
- Holds ASCII values of characters significant to the BASIC text scanner (e.g. quote (34), comma, colon, end-of-line). Used when scanning the input buffer at $0200 to detect statement separators and quoted strings.
- Also used as a general-purpose work byte by other BASIC routines that do not scan text.

ENDCHR ($08)
- Work byte used during tokenization of a BASIC statement. Typical values are 0 (no special terminator) or 34 (double-quote character).
- Employed to mark statement termination or to indicate the active quote character while scanning.

TRMPOS ($09)
- Stores the cursor column position before the last TAB or SPC operation. The value is copied here from $D3 (211 decimal) when TAB/SPC executes.
- Represents a logical-line column position (not physical screen line). A logical BASIC line can span up to two physical display lines, so TRMPOS ranges 0–79.
- Used to calculate the resulting cursor position after TAB or SPC behavior.

## Key Registers
- $0007-$0009 - BASIC zero page - CHARAC/ENDCHR/TRMPOS: ASCII search characters (scanner), tokenization work byte (0/34), logical cursor column before TAB/SPC (0–79; copied from $D3).

## References
- "adray2_int_to_float_vector" — expands on previous zero-page vector entries
- "verck_load_verify_and_count" — expands on next group: I/O and input-buffer indexing flags

## Labels
- CHARAC
- ENDCHR
- TRMPOS
