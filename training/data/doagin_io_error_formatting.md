# DOAGIN ($AB4D) — Error message formatting routines used by GET, INPUT, and READ to prepare and print input-related error messages

**Summary:** KERNAL routine DOAGIN at $AB4D (decimal 43853) — formats and prepares input-related error messages used by the BASIC GET, INPUT, and READ statements. Searchable terms: $AB4D, DOAGIN, KERNAL, GET, INPUT, READ, error formatting.

**Description**
DOAGIN is the KERNAL routine responsible for assembling and printing error messages that arise from input operations (GET, INPUT, READ). It centralizes message formatting for input-related errors.

Key details:
- **Symbol:** DOAGIN
- **Address:** $AB4D (decimal 43853)
- **Purpose:** Formats and prints error messages for input operations

## Source Code
```assembly
AB4D  20 0C E1  JSR $E10C      ; Call CHROUT to output character
AB50  29 FF     AND #$FF       ; Mask character
AB52  60        RTS            ; Return from subroutine
```

## Key Registers
- **A (Accumulator):** Character to be printed
- **X, Y:** Preserved

## References
- "get_statement" — expands on DOAGIN formats error messages for GET
- "read_statement" — expands on READ and INPUT use the same error formatting helpers

## Labels
- DOAGIN
