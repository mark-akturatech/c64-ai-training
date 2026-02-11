# GETFNM ($B3E1) — Check DEF and FN syntax

**Summary:** Routine at $B3E1 in the BASIC ROM that validates DEF ... FN syntax: ensures the FN token follows the DEF keyword and that the dependent variable name is a valid floating-point variable; calls the variable find-or-create routine to obtain a pointer to the variable's storage (used later by FN evaluation).

**Description**
GETFNM is the BASIC interpreter routine responsible for parsing and validating the dependent-variable portion of a user-defined function statement (DEF FN...). It performs two checks:
- Ensures the FN token appears in the correct position after the DEF keyword (syntax validation).
- Confirms the dependent-variable identifier is a valid floating-point variable name (identifier/type validation).

After validation, GETFNM invokes the interpreter routine that finds or creates a variable entry and returns a pointer to that variable's address (the location where the function's value will be stored). That pointer and the variable descriptor established by GETFNM are used by the function-evaluation machinery (e.g., FNDOER) when the function is later evaluated.

**[Note: Source text contains "FN follow SEG" which appears to be an OCR/typo error; intended meaning is that FN must follow the DEF keyword.]**

## Source Code
```assembly
; GETFNM: Check DEF and FN syntax
; Address: $B3E1

GETFNM:
    LDA #$A5        ; Load FN token value
    JSR SYNCHK      ; Check for FN token, else syntax error
    ORA #$80        ; Set function bit on
    STA SUBFLG      ; Store in SUBFLG
    JSR PTRGT2      ; Get pointer to function or create anew
    STA DEFPNT      ; Store pointer low byte
    STY DEFPNT+1    ; Store pointer high byte
    JMP CHKNUM      ; Ensure it's not a string and return
```
*Note: This assembly listing is based on the disassembly provided in the Commodore 64 ROM Disassembly.*

## Key Registers
- **SUBFLG ($10):** Stores the function bit set on the first character of the function name.
- **DEFPNT ($4E/$4F):** Pointer to the function's variable storage.

## References
- "def_define_function_statement_handling" — expands on validating the syntax and dependent variable referenced by DEF
- "fndoer_fn_evaluation" — expands on how GETFNM helps set up variable descriptors used during function evaluation

## Labels
- GETFNM
- SUBFLG
- DEFPNT
