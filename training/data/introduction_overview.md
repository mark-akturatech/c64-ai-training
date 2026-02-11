# Kick Assembler — Chapter 1 Overview

**Summary:** Kick Assembler is an advanced MOS 65xx (6510/6502-family) cross-assembler with an integrated JavaScript‑like script language, support for plugins (Java), SID and standard graphics import, macros, illegal/DTV opcodes, pseudo-commands, and segment-based output management (added in 5.x).

## Overview
Kick Assembler combines a full-featured 65xx assembler with a tightly integrated script language (JavaScript-like) so that assembler directives and script code interact directly rather than using a separate prepass. The integrated scripting makes it convenient to generate binary data inside assembler sources (examples in the manual: sine waves, vector coordinates, graphics converters) instead of using external tools.

Core features documented in this chapter:
- Modern assembler features: macros, unrolling loops, pseudo-commands.
- Opcode coverage: legal, illegal, and DTV opcodes supported.
- Data-generation: script language constructs for producing tables and complex data at assemble time.
- Import capabilities: SID files import and importers for standard graphics formats.
- Extensibility: third‑party Java plugins are supported.
- Output control: segment support (introduced in 5.x) for directing assembler output to files, disk images, or other segments.

The manual recommends starting with Chapter 2 (Getting Started), Chapter 3 (Basic Assembler Functionality) and Chapter 4 (Introducing the Script Language) before diving into more advanced topics; a quick-reference appendix lists directives, options and values.

## Version history
- 1.x — Early private 6510 cross-assembler (developed ~2003). Not publicly released.
- 2.x — (2006) Combined assembler with a script language so sources can include programs that generate assembler data; project became public in August 2006.
- 3.x — Reworked assembling mechanism: introduced a flexible pass algorithm, recording of side effects and handling of invalid values; improved performance and enabled more advanced features.
- 4.x — Replaced parser-generator-based parsing with a handwritten parser and added a preprocessor; resulted in faster parsing, more flexible syntax and better error handling. Scoping system replaced to include all entities (not just symbols).
- 5.x — Added segments to manage and channel output of directives to files, disk images and other segments.

## Project background and infrastructure
The Kick Assembler project grew into a professional setup with:
- A source code repository.
- A large automated test suite.
- Automated build and deployment infrastructure.

Community contributions (feedback, suggestions) over time—especially via email and CSDB—are acknowledged in the project history.

## Credits and third‑party tools
- JFlex (lexical analyser): Gerwin Klein.
- CUP (parser generator): Scott Hudson, Frank Flannery, C. Scott Ananian.
- XMLMind: provided sponsorship via a pro version of their XML editor (used to write this manual).
- Thanks to contributors who provided feedback via mail and CSDB.

Contact: the manual lists the project contact as kickassembler@no.spam.theweb.dk (remove "no.spam." to get the real address).

## References
- "getting_started_running_assembler" — expands on practical first steps and examples (Chapter 2 Getting Started)
- "front_matter_and_table_of_contents_ignored" — expands on table of contents and front-matter