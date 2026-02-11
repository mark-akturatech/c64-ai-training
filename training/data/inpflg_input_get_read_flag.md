# INPFLG ($11)

**Summary:** INPFLG at zero page $11 indicates which BASIC input keyword is executing (INPUT, GET, or READ) and controls prompting, echoing, delimiter handling, and selection of error messages; values: 0=INPUT, $40=GET, $98=READ.

## Description
INPFLG (zero page $11) is a one-byte flag used by the Commodore 64 BASIC interpreter to tell shared input-processing code which of the three input keywords is currently being executed. BASIC runs some common instructions for INPUT, GET, and READ, but behavior differs in specific areas; INPFLG lets the interpreter branch to or omit those differing behaviors.

Defined values:
- 0 = INPUT
- $40 (64 decimal) = GET
- $98 (152 decimal) = READ

Behavioral effects:
- INPUT: shows the "?" prompt, echoes typed characters to the screen, and waits for a whole line terminated by a carriage return.
- GET: gives no prompt, does not wait for a full line, and accepts a single character immediately.
- READ: parses data items from program data and treats delimiters per READ semantics (see below).

Delimiter handling differences:
- Colon (:) and comma (,) are considered valid data characters for GET (they can be returned as input), but for INPUT and READ they are treated as delimiters between data items.

Error reporting:
- Each command has its own set of error messages; INPFLG is used to select the appropriate BASIC error message when an input-related error occurs.

Operational note:
- The interpreter uses INPFLG to decide which conditional and branching sequences to execute while performing input operations so that common code can serve multiple keywords with keyword-specific behavior gated by this flag.

## Key Registers
- $0011 - Zero Page (BASIC) - INPFLG: indicates active input keyword; values 0=INPUT, $40=GET, $98=READ; affects prompt/echo/waiting behavior, delimiter handling, and error-message selection.

## References
- "subflg_subscript_and_fn_handling" — expands on previous parsing-related flag
- "tansgn_trig_and_comparison_flag" — expands on the next zero-page flag with dual trig/comparison roles

## Labels
- INPFLG
