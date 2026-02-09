# Memory Maps (Appendix C)

**Summary:** Overview of memory maps, their limitations, and guidance for using them; mentions POKE/PEEK locations and memory addresses for experimentation and program conversion.

## Introduction
A word about memory maps: they are always too big or too small for the use you have in mind. The maps that follow are intended to be fairly complete and associate each location with a type of activity, but they may appear cryptic in places.

## Guidance for users
- Beginners: You may feel swamped by detail. There's no harm in browsing; the information is present when you're ready. Try reading from or changing memory locations (POKE/PEEK) to observe effects, but verify addresses in the maps that follow before altering memory.
- Advanced programmers: The maps do not provide exhaustive usage notes (which parts of the system or which routines access each location). Time and space constraints prevent full cross-references; use the maps as a compact lookup to aid conversions and to locate corresponding memory regions in other machines.
- Program conversion: If converting programs between machines, use the maps to find corresponding memory locations in the target machine; the maps are a starting point rather than a complete specification.

## References
- "pet_original_memory_map_part1" — expands on Start of detailed PET memory map