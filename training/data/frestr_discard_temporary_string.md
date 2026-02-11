# ********* - FRESTR: Discard a temporary string

**Summary:** FRESTR ($B6A3) discards a temporary string by calling the routine that removes an entry from the temporary descriptor stack; if the descriptor is on the stack it returns pointers to the string and its length, otherwise if the string occupies the bottom of string text storage the bottom pointer is moved up to deallocate the string (freed space may be reclaimed by getspa_allocate_string_space).

## Description
FRESTR is the entry that discards a temporary string. Behavior:
- Calls the routine that clears an entry from the temporary descriptor stack (see fretms_remove_temp_descriptor).
- If the descriptor was on the temporary descriptor stack, the called routine sets pointers to the string and its length and FRESTR then exits.
- If the descriptor was not on the temporary stack and the string is located at the bottom of string text storage, FRESTR advances the bottom-of-text pointer to deallocate that string so the space can be reused.
- Freed space can later be allocated again by getspa_allocate_string_space.

## References
- "fretms_remove_temp_descriptor" — expands on routine called to remove an entry from the temporary descriptor stack
- "getspa_allocate_string_space" — expands on how freed space may be reclaimed for subsequent allocations

## Labels
- FRESTR
