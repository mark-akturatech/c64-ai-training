# DIMFLG ($0C), VALTYP ($0D), INTFLG ($0E), GARBFL ($0F) — BASIC zero-page flags

**Summary:** Zero-page flags at $000C-$000F used by the BASIC interpreter for array handling (DIMFLG), data typing (VALTYP), numeric subtype (INTFLG), and LIST/garbage-collection/tokenization state (GARBFL). Keywords: $0C, $0D, $0E, $0F, zero page, DIMFLG, VALTYP, INTFLG, GARBFL, LIST, garbage collection, tokenization.

## Flags and behavior

- DIMFLG ($000C, decimal 12)
  - Used by routines that locate or build arrays.
  - Indicates whether a variable is part of an array, whether the array has already been DIMensioned, and whether a newly created array should assume default dimensions.
  - Set/checked during parsing and when creating or referencing array variables.

- VALTYP ($000D, decimal 13)
  - Indicates data type of the current value being operated on: string vs numeric.
  - 255 ($FF) = string; 0 = numeric.
  - Determination is made each time a variable is located or created; other routines read this flag to choose string vs numeric handling.

- INTFLG ($000E, decimal 14)
  - Further classifies numeric data indicated by VALTYP.
  - 128 ($80) = integer; 0 = floating-point.
  - Used by numeric-processing code paths to select integer vs floating-point algorithms.

- GARBFL ($000F, decimal 15)
  - Multi-use byte:
    - LIST routine: marks when the current character string is inside quotes so LIST prints the literal string rather than tokenizing it.
    - Garbage collection: indicates that a GC attempt has already been made before trying to add a new string; if set and memory is still insufficient, an OUT OF MEMORY error occurs.
    - Tokenization: used as a work byte when converting the BASIC input buffer (512 / $200) into linked, tokenized program lines.
  - Serves as a transient state/work flag across different interpreter subsystems.

## Source Code
```text
; BASIC zero-page flag map (decimal offset / hex address)
; Offset  Addr   Name     Description                Important values
; 12      $000C  DIMFLG   Array location/build flag  (in array, DIMensioned, default dims)
; 13      $000D  VALTYP   Data type flag             255 ($FF)=string, 0=numeric
; 14      $000E  INTFLG   Numeric subtype flag       128 ($80)=integer, 0=floating point
; 15      $000F  GARBFL   LIST/GC/tokenization flag  Used by LIST, GC, and tokenizer

; Notes:
; - VALTYP is set every time a variable is located/created so subsequent code paths
;   pick the correct string vs numeric routine.
; - INTFLG is only meaningful when VALTYP indicates numeric.
; - GARBFL is reused by multiple subsystems; its meaning is context-dependent.
; - BASIC input buffer referenced during tokenization: 512 ($0200).
```

## Key Registers
- $000C-$000F - BASIC (zero page) - interpreter flags: DIMFLG, VALTYP, INTFLG, GARBFL

## References
- "verck_load_verify_and_count" — expands on previous I/O/indexing flag context  
- "subflg_subscript_and_fn_handling" — expands on next flag used when parsing variable names and function calls

## Labels
- DIMFLG
- VALTYP
- INTFLG
- GARBFL
