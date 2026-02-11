# ********* - Expression and single-term evaluation (EVAL, PIVAL), parentheses/syntax checks (PARCHK, CHKCLS, CHKOPN, CHKCOM), syntax error printing (SNERR), variable value retrieval (ISVAR), function dispatch (ISFUN), logical operators (OROP, ANDOP), comparison operations (DORE1), DIM (array dimensioning), variable lookup/creation (PTRGET, alphabetic name check, NOTFNS), and returning variable address (FINPTR). Explains parsing, dispatch, and variable descriptor creation.

**Summary:** Descriptions and entry points for BASIC expression parsing and single-term evaluation routines (EVAL $AE83), PI constant storage ($AEA8), parentheses and syntax checkers (PARCHK $AEF1, CHKCLS $AEF7, CHKOPN $AEFA, CHKCOM $AEFF), syntax error printing (SNERR $AF08), variable/value handling and function dispatch (ISVAR $AF2B, ISFUN $AFA7, function dispatch table $A502), logical/bitwise operators (OROP $AFE6, ANDOP $AFE9), comparison routine (DORE1 $B016), DIM handling (DIM $B018), variable lookup/creation (PTRGET $B08B, NOTFNS $B11D), and returning the found/created variable address (FINPTR $B185).

## Overview
This chunk documents the internal 6502 routines used by Commodore BASIC for parsing and evaluating single terms within expressions, performing parentheses/syntax checks, dispatching built‑in functions, handling logical and comparison operations, dimensioning arrays, and locating/creating variable descriptors. Addresses shown are the ROM entry points for each routine.

## Single-term evaluation (EVAL $AE83)
- Purpose: Reduce a single arithmetic term (part of an expression) from ASCII text to a five‑byte floating point number in the Floating Point Accumulator (FPA).
- Behavior:
  - If the term is a numeric constant: set the data‑type flag to "number", set the text pointer to the first ASCII numeric character, then jump to the ASCII→floating point conversion routine.
  - If the term is a variable: retrieve the variable's value (via ISVAR).
  - If the term is the PI character: load the five‑byte PI value into the FPA.
- Vectoring: This routine is vectored through RAM at 778 ($030A).

## PI value storage (PIVAL $AEA8)
- The constant PI is stored as a five‑byte floating point value at $AEA8 (label PIVAL). EVAL loads this into the FPA when the PI token is encountered.

## Parentheses and syntax checks (PARCHK $AEF1, CHKCLS $AEF7, CHKOPN $AEFA, CHKCOM $AEFF)
- PARCHK ($AEF1): Evaluate an expression inside parentheses. Calls syntax checkers for opening/closing parentheses and invokes FRMEVL/FRMEVAL (see $AD9E) for each parentheses level.
- CHKOPN ($AEFA): Verify and skip an opening parenthesis; error if not present.
- CHKCLS ($AEF7): Verify and skip a closing parenthesis; error if not present.
- CHKCOM ($AEFF): Check for and skip a comma; callable generically by loading the target character into A and jumping from SYNCHR to this routine. Missing comma produces a SYNTAX ERROR.

## Syntax error printing (SNERR $AF08)
- SNERR prints the "SYNTAX ERROR" message. Called by the syntax check routines when an expected character/token is absent or malformed.

## Variable and function handling (ISVAR $AF2B, ISFUN $AFA7)
- ISVAR ($AF2B): Retrieve the value of a variable referenced in an expression. Handles variable lookup and value loading into the FPA (or appropriate accumulator for integers).
- ISFUN ($AFA7): Dispatch and evaluate BASIC functions encountered in expressions (e.g., ASC("A")).
  - Uses the function dispatch table at 42242 ($A502) to obtain the target routine address, then branches to that routine to perform the function evaluation.

## Logical operators (OROP $AFE6, ANDOP $AFE9)
- OROP ($AFE6):
  - Prepares for logical OR by setting the Y register as a flag, then falls through into the AND routine to perform the actual operation.
- ANDOP ($AFE9):
  - Converts operands to two‑byte integer form and performs the logical operation (AND or OR, depending on entry).
  - Results encode boolean as: 0 = false, -1 = true.

## Comparisons (DORE1 $B016)
- DORE1 ($B016): Performs relational comparisons (>, <, =) for floating point numbers and for strings.
  - Results placed in the FPA (or result register) as 0 (false) or -1 (true).

## DIM / array dimensioning (DIM $B018)
- DIM ($B018): Handles DIM statements. For statements that list multiple arrays (DIM A(12),B(13),...), the routine creates arrays for each listed name.
- Behavior for undeclared array access: If an array element is referenced before a DIM statement, the array is automatically dimensioned to 10 (i.e., as if DIM A(10) were executed). Note: DIM A(10) allocates elements 0..10 (11 total)—the element 0 must be considered in size calculations.

## Variable lookup and creation (PTRGET $B08B, alphabetic name check $B113, NOTFNS $B11D, FINPTR $B185)
- PTRGET ($B08B): Search the variable area for a variable name; if not found, call NOTFNS to create one.
- Alphabetic name check ($B113): A routine checks that the A register contains an alphabetic ASCII character (valid variable names must start with a letter).
- NOTFNS ($B11D): Create a new BASIC variable descriptor:
  - Allocates a seven‑byte descriptor by moving the variable storage area up by seven bytes and then initializes the descriptor fields.
- FINPTR ($B185): Store and return the address of the variable that was found or created. The address is stored in the two‑byte pointer at decimal locations 71–72 ($47–$48).

## Interaction notes and cross-calls
- EVAL and PARCHK call/frame into FRMEVL/FRMEVAL routines (see $AD9E) to evaluate subexpressions and bracketed levels.
- ISFUN uses the function dispatch table at $A502 to resolve functions to implementation routines.
- Logical and comparison routines interoperate with the FPA and integer conversion routines as needed.

## References
- "program_execution_control_and_statements" — expands on FRMEVAL and how EVAL is invoked from statements (LET, IF, etc.)
- "arrays_integers_and_definition_handling" — expands on DIM/ARRAY handling and integer/subscript conversion routines used by expressions
