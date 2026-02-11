# GARBAG — String garbage-collection algorithm

**Summary:** Describes the BASIC string garbage collector that compacts updated string text by scanning string descriptors and relocating the highest valid copies, then updating the bottom-of-string-text pointer at $0033-$0034 ($33-$34). Keywords: string text storage, descriptors, garbage collection, $0033-$0034, STOP key, string arrays.

## Description
Whenever a string is modified, BASIC appends the revised text to the bottom of the string-text storage area, leaving the previous copy higher in memory and therefore wasted. To reclaim that space, the garbage collector must identify, for every string whose text currently resides in the string-text area (not embedded in program text), which descriptor contains the valid text instance that is highest in memory.

The collection algorithm:
- Scan every string descriptor to find the valid text that is highest in memory for that string.
- If a valid instance is not at the absolute highest available location, move that string text down (toward lower addresses) to occupy space previously held by now-invalid copies.
- After moving a string, descriptors are scanned again to find the next highest valid instance and move it likewise.
- Repeat this process until every string that resides in string-text storage has been considered and compacted.
- Finally, update the bottom-of-string-text pointer at addresses 51–52 decimal ($33–$34) to reflect the new end of the compacted text area.

Performance and behavior notes preserved from the source:
- If many strings have text in the string-text area, scanning every descriptor repeatedly can be very slow; the system may appear to hang. The STOP key is not even checked during this procedure (no interruption).
- A full collection is performed regardless of whether there is spare space; the collector runs in full even immediately after a previous collection.
- On machines with more memory (e.g., C64), collections are less frequent, but very large programs with many string arrays can still experience lengthy collection delays.

## Key Registers
- $0033-$0034 - Zero page - pointer to bottom of string text (decimal addresses 51–52)

## References
- "garbag_check_most_eligible" — subroutine that checks whether a given string is the most eligible to collect  
- "garbag_collect_string" — subroutine that moves a found string and updates its descriptor  
- "getspa_allocate_string_space" — may call GARBAG when allocation fails
