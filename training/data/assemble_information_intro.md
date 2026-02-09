# Kick Assembler — Assemble Information (Chapter 15)

**Summary:** Describes Kick Assembler's AsmInfo option and the assembled-source metadata exposed for editor integration (error/syntax feedback, directive help). Covers predefined fields: allSourceSpecific, meta, version, libraries.

## Overview
Kick Assembler exposes assembled-source information via the AsmInfo option to support editor integration (for example: error/syntax feedback and directive/keyword help). The interface is intended for editor/tool consumption and may change; contact the author if you depend on a stable format.

## Exposed fields
- allSourceSpecific (meta)  
  - All source-specific infos collected for the assembled project. Contains per-source metadata produced during assembly.

- meta (predefined)  
  - General metadata block about the assembled output (project-level info).

- version (predefined)  
  - The version of the assembler that produced the AsmInfo output.

- libraries (predefined)  
  - Information about libraries used by the assembled source (library names/versions/references).

## Notes
- The AsmInfo interface is experimental/stable subject to change — tools should tolerate additions or reordering.  
- Contact the Kick Assembler author for guarantees or if you require a stable contract.

## Source Code
(omitted — this chunk contains descriptive metadata names and their meanings; no assembly or data listings provided)

## Key Registers
(omitted)

## References
(omitted)