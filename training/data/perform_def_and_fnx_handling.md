# C64 BASIC ROM — DEF / FNx Handling (DEFINE / User-Function Evaluation and Storage)

**Summary:** Implements DEF/FNx parsing and evaluation in Commodore 64 BASIC ROM: checks FNx syntax, scans for parentheses and CHR$ tokens, sets FN/DEF flags ($0010), obtains variable and function addresses, validates numeric source types, prepares and pushes variable/execute pointers on the stack, calls DATA ($A8F8) to fetch constants, and stores the execute pointer and variable pointer into the user-defined function descriptor (addresses via $004E/$004F). Uses zero-page pointers $0047/$0048 for current variable address and $007A/$007B for BASIC execute pointer.

**Overview**

This disassembly chunk contains the core flow for handling DEF (define function) and FNx (function call/evaluation) processing in C64 BASIC ROM:

- **"Perform DEF" Path:** Verifies syntax, marks FNx/DEF, resolves a variable address, ensures the source is numeric, extracts the CHR$(A) constant via DATA, and writes the execute and variable pointers into the function descriptor.
- **"Check FNx Syntax" Helper:** Verifies FN token and looks up the function descriptor pointer.
- **"Evaluate FNx" Path:** Evaluates the expression inside parentheses for an FNx call, retrieves the function descriptor, stacks the function's variable bytes, packs FAC1 into the temporary (XY) location, swaps execute pointers, evaluates the argument expression, and finally writes the resolved execute/variable pointers back into the function descriptor.
- **Stack Usage:** The code pushes/pulls the current variable pointer and BASIC execute pointer to preserve/restore state around DATA and function setup.
- **Numeric-Type Checks:** Performed via $AD8D at several points; on failures, control transfers to syntax/type-error handlers (warm start).

**Important Zero-Page Pointers Used:**

- **$0047/$0048:** Current variable pointer (low/high)
- **$004E/$004F:** Temporary/function pointer storage (used as indirect pointer to function descriptor)
- **$007A/$007B:** BASIC execute pointer (low/high)
- **$0010:** FN/FNx flag / subscript flag storage

**Behavioral Notes:**

- The code expects CHR$(A) syntax in DEF assignment and uses the DATA routine ($A8F8) to fetch constants; missing parentheses or CHR$ yields a syntax error followed by warm start.
- The function descriptor at ($4E) is updated with the saved BASIC execute pointer and the variable pointer bytes in sequence.

**[Note: The PLA at .B460 pulls the next character after the CHR$(A) token, which was previously pushed onto the stack at .B3CE.]**
