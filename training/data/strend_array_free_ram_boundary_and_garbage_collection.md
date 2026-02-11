# STREND ($31-$32) and FREETOP ($33-$34) — BASIC string/array storage pointers

**Summary:** STREND ($31-$32) is the zero-page pointer to the end of BASIC array storage (+1) and the start of free RAM; FREETOP ($33-$34) points to the current bottom of string text storage (strings grow downward). The FRE routine performs garbage collection and returns the difference between STREND and FREETOP.

## STREND ($31-$32)
STREND (zero-page $31-$32) holds the address one past the end of the BASIC array storage area — i.e., the first byte of free RAM available to BASIC. Because string text is allocated from the top of memory downward, STREND serves as the highest allowable address for string storage.

- Defining new (non-string) variables or arrays moves STREND upward (toward higher addresses), shrinking the available area for string text.
- When attempting to allocate space for a string, the allocator checks whether the new string region would cross the STREND boundary. If it would:
  - The garbage collection routine (invoked by the FRE routine or automatically) is run to reclaim unused string storage.
  - If, after garbage collection, there is still insufficient space, an OUT OF MEMORY error is signalled.
- STREND is stored as a two-byte little-endian address (pointer to end-of-array-storage +1).

## FREETOP ($33-$34)
FREETOP (zero-page $33-$34) points to the current bottom of the string text storage area — effectively the top of free RAM from the strings' perspective (strings grow downward).

- New string text is placed at addresses below the value in FREETOP; after allocation FREETOP is decremented to point below the newly added string text.
- The garbage collection routine readjusts FREETOP upward when it compacts/reclaims unused string text space.
- On power-on/reset FREETOP is initialized to the top of RAM. The BASIC CLR command sets FREETOP to the BASIC memory end described in location 55 ($37), allowing a program to reserve a block of BASIC memory unaffected by string allocation.

## Key Registers
- $0031-$0032 - Zero Page - STREND: pointer to end of BASIC array storage (+1) and start of free RAM
- $0033-$0034 - Zero Page - FREETOP: pointer to bottom of string text storage (strings grow downward)

## References
- "freetop_string_text_pointer" — expands on FREETOP holding current end of string text and how FRE compares it with STREND during garbage collection
- "array_storage_arytab" — expands on STREND marking the end of the array storage area described by ARYTAB

## Labels
- STREND
- FREETOP
