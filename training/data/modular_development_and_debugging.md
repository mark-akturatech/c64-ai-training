# Modular development guidance for C64 assembly

**Summary:** Advice on modular development for assemblers: break programs into small, testable routines, store reusable segments separately, place subroutines at the end to allow unused ones to be removed, and use assembler module-chaining/linking to speed development (useful on slow Commodore 64 disk drives).

## Guidance
- Break a program into small routines. Test each routine individually before merging; this isolates bugs to interconnections rather than internal routine logic.
- Save small, reusable segments (subroutines/data/definitions) for reuse in later projects to avoid re‑writing common functionality.
- While coding, if a symbol or definition is missing, proceed with the creative work (note the missing item on paper) and add the definition later — the assembler only flags undefined symbols at assembly time.
- Place subroutines at the end of the source. Unlike macros, subroutines occupy memory whether called or not; placing them at the end makes it easier to delete unused ones to save memory and reduce assembly time.
- Use assembler support for chaining or linking modules (if available). Write modules as separate files and let the assembler link them during assembly.
  - Advantages: you can edit/print only the module you are working on; tested modules remain untouched; changes to shared definitions require only loading the definition file.
  - Partitioning is highly beneficial on slow disk systems (typical of Commodore 64 drives) because it reduces load/edit/print time for the active development area.
- Keep definitions and data areas separate from frequently changed code so they rarely need modification once stable.

## References
- "what_an_assembler_can_do" — expands on creating libraries of subroutines and macros
