# NMOS 6510 — References and verification sources

**Summary:** Reference list for NMOS 6510 undocumented-opcode verification and example code: VICE test-programs, emulator test suites, named test collections, demos/games that use undocumented opcodes (Blackmail FLI, Wizball, Spectipede, Turrican 3), historical opcode tables (oxyron, illopc, ffd2 fridge), visual6502 archive, and Codebase64 example snippets.

**Sources and verification**
- VICE test-programs (collection used to verify behavior):
  - https://sourceforge.net/p/vice-emu/code/HEAD/tree/testprogs/
- Emulator Test-suite by Wolfgang Lorenz (used for opcode verification):
  - http://www.zimmers.net/anonftp/pub/cbm/documents/chipdata/tsuit215_d64.zip
- Test programs by Piotr Fusik (named test collection referenced):
  - https://www.nesdev.org/wiki/Visual6502wiki/6502TestPrograms
- First CSDb "Unintended OpCode coding challenge":
  - http://csdb.dk/event/?id=2417
- Demos/games cited for real-world undocumented-opcode usage:
  - Blackmail — "FLI Graph v2.2" (FLI-related routines)
  - Wizball — LAX #imm usage reported
  - Spectipede — tape loader: ANE #imm usage reported
  - Turrican 3 — scroll routine: ANE #imm usage reported

Older opcode documents and consolidated references used to create the merged opcode list:
- Oxyron opcode page:
  - http://www.oxyron.de/html/opcodes02.html
- illopc (Freddy Offenga) opcode list:
  - http://www.ataripreservation.org/websites/freddy.offenga/illopc31.txt
- ffd2 fridge — 6502 NMOS extra opcodes:
  - http://www.ffd2.com/fridge/docs/6502-NMOS.extra.opcodes
- visual6502 wiki (unsupported opcodes page):
  - http://visual6502.org/wiki/index.php?title=6502_Unsupported_Opcodes

Additional threads, blogs, and wiki pages consulted for behavior details and historical notes:
- AtariAge forum thread mentioning LXA/LAX behavior:
  - http://www.atariage.com/forums/topic/168616-lxa-stable/#entry2092077
- Pagetable blog post (6502 undocumented/opcode notes):
  - http://www.pagetable.com/?p=39
- cbmhackers mailing list (historical discussion)
- NESDev unofficial opcodes wiki (general 6502 undocumented-opcode behavior):
  - https://wiki.nesdev.com/w/index.php/CPU_unofficial_opcodes

Example code snippets borrowed (attribution to Codebase64 and similar pages):
- Decrease X register by more than 1:
  - http://codebase64.org/doku.php?id=base:decrease_x_register_by_more_than_1
- Notes on ANC/ANC opcode use:
  - http://codebase64.org/doku.php?id=base:some_words_about_the_anc_opcode
- Advanced optimizing examples:
  - http://codebase64.org/doku.php?id=base:advanced_optimizing

visual6502 archive (site and "AllPages" snapshot used when the live wiki was offline):
- Archived visual6502 all-pages snapshot:
  - https://web.archive.org/web/20210405071236/http://visual6502.org/wiki/index.php?title=Special%3AAllPages

Notes from the source text:
- A few anecdotal quotes in the original material are unattributed (printed in italics in the source). The authors were not tracked for some quotes.
- The document lists specific internal cross-references and open-issue lists (see References below).

## References
- "opcode_naming_in_different_assemblers_matrix" — expands on historical opcode matrices and assembler name differences
- "wanted_contributions_and_open_issues" — lists areas where the authors request further verification and test-case porting (see Wanted)