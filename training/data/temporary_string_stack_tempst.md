# TEMPST ($19-$21) — Temporary string descriptor stack

**Summary:** TEMPST at zero-page $19-$21 is the temporary string descriptor stack used by BASIC to track unnamed strings (e.g. literal strings in PRINT). Each 3-byte descriptor stores the string length and its start/end displacements within BASIC string storage.

## Description
TEMPST is a zero-page area ($19-$21) used by BASIC to hold descriptors for temporary (unnamed) strings that have not been assigned to string variables. Common examples are literal strings in PRINT statements such as "HELLO".

Each descriptor is 3 bytes long and contains:
- the string length, and
- the starting and ending locations expressed as displacements within the BASIC string storage area.

Descriptors permit BASIC to reference and manage temporary string data without committing it to a named string variable. Pointer and management routines that push/pop or index these descriptors are referenced elsewhere (see related references).

## Key Registers
- $19-$21 - BASIC - Temporary string descriptor stack: 3-byte descriptors (length, start displacement, end displacement within BASIC string storage)

## References
- "temporary_string_stack_lastpt" — pointer to last descriptor used
- "index_and_resho_work_areas" — other nearby zero-page work areas used by BASIC

## Labels
- TEMPST
