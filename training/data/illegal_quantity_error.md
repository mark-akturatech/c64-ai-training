# JMP $B248 — Illegal Quantity Error & Warm Start (ROM $B798)

**Summary:** Single-instruction jump at $B798 (JMP $B248) that transfers control to the illegal quantity error and warm start handler used by string functions (MID$, ASC) and the byte-expression evaluator when parameter or length checks fail.

**Description**
This ROM entry is a convergence point for parameter/length validation failures in BASIC string and byte-evaluation code. Instead of duplicating error handling, routines performing checks (for example, MID$ when indices/lengths are invalid, ASC on a null string, or the byte-parameter evaluator on malformed expressions) branch to $B798, which immediately JMPs to $B248. The target $B248 implements the illegal quantity error and initiates a warm start sequence (resetting BASIC state and returning control to the READY prompt).

The listing shown here is the single-location redirect; callers use branches that end up at $B798 so all illegal-quantity/warm-start logic is centralized at $B248.

## Source Code
```asm
; do illegal quantity error then warm start
.,B798 4C 48 B2 JMP $B248       do illegal quantity error then warm start
```

The handler at $B248 is responsible for displaying the "ILLEGAL QUANTITY" error message and initiating a warm start sequence. The error message text is stored in the BASIC ROM's error message table, and the routine at $B248 retrieves and outputs this message before performing a warm start.

The calling convention for routines branching to $B798 involves setting up the stack with the return address and ensuring that registers are preserved as needed. Upon branching to $B798, the JMP instruction to $B248 is executed, leading to the error handling and warm start sequence.

Surrounding code context includes branch instructions from the MID$, ASC, and byte-evaluator functions that direct control to $B798 upon detecting invalid parameters or conditions. These branches centralize error handling by funneling control to the common handler at $B248.

The address $B248 resides within the BASIC ROM section of the Commodore 64's memory map, specifically in the range $A000–$BFFF. This section contains the BASIC interpreter routines, including error handling and warm start procedures.

## References
- "asc_function" — expands on ASC branches here on null string
- "mid_string_function" — expands on MID$ branches here on invalid indices/lengths
- "byte_parameter_parsing_and_evaluation" — expands on byte-evaluator branches here on malformed byte expressions