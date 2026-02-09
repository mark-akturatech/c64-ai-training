# CLEAR (CLR) — BASIC command

**Summary:** CLR (CLEAR) closes all I/O via the KERNAL CLALL routine ($F32F), resets BASIC pointer variables by copying zero-page pointers ($0037-$0038 -> $0033-$0034; $0031-$0032 -> $002D-$002E and $002F-$0030), calls RESTORE (reset DATA pointer), and clears the stack. Variable storage is made unusable by pointer changes but not overwritten.

## Behavior
CLR performs these steps in order:
- Calls the KERNAL CLALL routine (decimal 62255, $F32F) to close all open I/O files.
- Eliminates string variables by copying the "end of memory" pointer at $0037-$0038 (zero-page addresses 55-56) into the "bottom of strings" pointer at $0033-$0034 (zero-page 51-52). This effectively discards string storage without erasing it.
- Copies the pointer to the end of BASIC program text at $0031-$0032 (zero-page 49-50) to both:
  - $002D-$002E (zero-page 45-46) — start of non-array variables
  - $002F-$0030 (zero-page 47-48) — start of array variables
  This makes existing variable storage unreachable (not erased).
- Calls RESTORE to set the DATA pointer back to the beginning of DATA statements.
- Clears the stack.
Notes:
- The contents of string and variable storage areas remain in RAM but are made unusable by pointer adjustment.
- The operation is pointer-based; no mass zeroing of memory is performed.

## Source Code
```text
42590         $A65E          CLEAR
Perform CLR

The CLR command closes all I/O files with the Kernal CLALL routine
(62255, $F32F).  It eliminates string variables by copying the end of
memory pointer at 55-56 ($37-$38) to the bottom of strings pointer at
51-52 ($33-$34).  It also copies the pointer to the end of BASIC
program text at 49-50 ($31-$32) to the pointer to the start of
nonarray variables at 45-46 ($2D-$2E) and the start of array variables
at 47-48 ($2F-$30).  This makes these variables unusable (although the
contents of these areas are not actually erased).  RESTORE is called
to set the data pointer back to the beginning, and the stack is
cleared.
```

```text
Zero-page pointer mapping (addresses shown as zero-page index and absolute):

- $33-$34  (zero-page 51-52)  : Bottom of strings pointer
- $37-$38  (zero-page 55-56)  : End of memory pointer (end of strings)
- $31-$32  (zero-page 49-50)  : Pointer to end of BASIC program text
- $2D-$2E  (zero-page 45-46)  : Start of non-array variables (set from $31-$32)
- $2F-$30  (zero-page 47-48)  : Start of array variables     (set from $31-$32)
KERNAL:
- CLALL    : $F32F (decimal 62255) - close all files
```

## Key Registers
- $002D-$002E - Zero-page - Start of non-array variables (set to end-of-program pointer on CLEAR)
- $002F-$0030 - Zero-page - Start of array variables (set to end-of-program pointer on CLEAR)
- $0031-$0032 - Zero-page - Pointer to end of BASIC program text
- $0033-$0034 - Zero-page - Bottom-of-strings pointer
- $0037-$0038 - Zero-page - End-of-memory (end-of-strings) pointer
- $F32F       - KERNAL ROM - CLALL routine (close all I/O files)

## References
- "scrtch_new" — expands on SCRTCH/NEW flows into CLR to complete clearing
- "runc_reset_text_pointer" — details when the text pointer may be reset after CLEAR