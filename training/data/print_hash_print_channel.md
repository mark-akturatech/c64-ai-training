# PRINT# (PRINTN, $AA80) — Perform PRINT#

**Summary:** PRINT# (Kernal vector PRINTN at $AA80, decimal 43648) calls the Kernal CMD routine to send text to the currently-open output device and then closes the output channel by calling the Kernal CLRCHN routine at $F333 (decimal 62259).

## Operation
The PRINT# entry (label PRINTN) implements the BASIC PRINT# statement semantics in the Kernal ROM: it invokes CMD to perform the actual output to the device, then invokes CLRCHN to close the output channel and tidy up (CLRCHN address: $F333 / 62259). This vector is a ROM routine entry point — it is not a hardware register.

## References
- "cmd_statement_output_channel" — expands on PRINT# calls CMD to perform the output  
- "print_statement" — expands on PRINT variants and formatting rules

## Labels
- PRINTN
