# OLDTXT ($003D-$003E)

**Summary:** OLDTXT at $003D-$003E (decimal 61–62) is a two-byte little-endian pointer to the text of the BASIC statement currently being executed; it stores the value of TXTPTR (122 / $7A) at each new statement. END, STOP and BREAK save TXTPTR here and CONT restores it; CONT fails if OLDTXT is zeroed by LOAD, program edits, or error routines.

## Description
OLDTXT is a two-byte pointer (low byte at $003D, high byte at $003E) in the BASIC workspace that contains the address (not the line number) of the text of the BASIC statement currently being executed. Each time execution begins a new BASIC line, the current value of TXTPTR (decimal 122, $7A) — the runtime pointer into BASIC text — is copied into OLDTXT.

Behavioral notes:
- Saved by END, STOP, and the STOP-key BREAK routines so CONT can resume scanning at the saved location.
- CONT restores OLDTXT back into TXTPTR to continue execution. If $003E (high byte) is zeroed (for example by LOAD, program modification, or certain error handlers), CONT will not be able to continue.
- Stored as a standard 16-bit little-endian address (low byte then high byte).

(See also CURLIN for line-number tracking and DATPTR for pointers into DATA items.)

## Key Registers
- $003D-$003E - BASIC - OLDTXT: two-byte little-endian pointer to the start of the currently executing BASIC statement text (low=$003D, high=$003E)

## References
- "curlin_current_basic_line_number" — expands on how CURLIN and OLDTXT together identify current statement and its line number  
- "datptr_pointer_to_current_data_item_and_sample_program" — contrasts DATPTR (points into BASIC text area for DATA items) with OLDTXT (points to executing statement text)

## Labels
- OLDTXT
