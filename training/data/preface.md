# NMOS 6510 — Historical background on illegal/undocumented 6502 opcodes

**Summary:** Historical notes on NMOS MOS6510 (Commodore 64) and related chips (CSG8500, CSG8502), the spread of misinformation about illegal/undocumented 6502 opcodes, the mid‑1990s Wolfgang Lorenz test suite, and authorship/date metadata.

**Historical background**
Early public descriptions of so‑called "illegal" or "undocumented" 6502 opcodes were incomplete and often incorrect; book authors and magazines propagated many inaccuracies and myths. Over time, a small number of people began systematic, opcode‑by‑opcode investigations. By the mid‑1990s, Wolfgang Lorenz produced a test suite containing detailed, elaborated test programs that exercised undocumented opcodes and clarified many behaviors.

A subset of opcodes remained mysterious for longer and were labeled "unstable" until further physical analysis (decapping an actual NMOS CPU die) and follow‑up experiments resolved remaining ambiguities. The present document is a compiled, edited aggregation of prior work and existing documents (see References).

**Scope**
This document explicitly refers to MOS6510 (the NMOS CPU used in the Commodore 64) and the CSG8500, and to the CSG8502 used in the Commodore 128. Much of the material also applies to the MOS6502 family in general. MOS Technology licensed Rockwell and Synertek as second sources for the 6502 and supporting components; where vendor differences affect opcode behavior, this is noted in source material (not expanded here).

**Authorship / Date**
- Stated authorship and date in source: "24/12/24 groepaz/solution" (as provided in original text).

**Notes on research and verification**
- The mid‑90s Wolfgang Lorenz test suite is identified as a turning point for systematic undocumented‑opcode testing; the suite contains executable test programs rather than only descriptive notes.
- Physical die decapping and silicon analysis were later used to explain residual anomalies and confirm behavior of previously "unstable" opcodes.
- The document is an edited compilation of earlier sources; original source attribution and full reference details are not included in this chunk.

## References
- "scope_and_audience" — expands on applies‑to / scope and audience for this document
- "Extra Instructions Of The 65XX Series CPU" by Adam Vardy
- "Extra Instructions" by Joel Shepherd, COMPUTE!, October 1983
- "6510 Opcode" by Raymond Quirling, The Transactor, March 1986
- "Strange Opcodes" by Jim Butterfield, COMPUTE!, March 1993
- "64doc" by John West and Marko Mäkelä, June 3, 1994
- "6502/65C02 Functional Tests" by Klaus Dormann, available at https://github.com/Klaus2m5/6502_65C02_functional_tests
- "Illegal Opcodes of the MOS 6502: Glitches That Work" by The Oasis BBS, available at https://theoasisbbs.com/illegal-opcodes-of-the-mos-6502-glitches-that-work/
- "6502 'Illegal' Opcodes Demystified" by Norbert Landsteiner, available at https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes
- "How MOS 6502 Illegal Opcodes Really Work" by Ken Shirriff, available at https://www.righto.com/2013/02/
- "6502 Instruction Set" by Norbert Landsteiner, available at https://www.masswerk.at/6502/6502_instruction_set.html
- "6502/65C02 Emulator Library" by Hackaday.io, available at https://hackaday.io/project/183848-650265c02-emulator-library
- "6502-sim/fake6502.c" by 6502-sim, available at https://git.idk.st/stuff/6502-sim/src/branch/main/fake6502.c
- "6502/6502_65C02_functional_tests" by Klaus2m5, available at https://github.com/Klaus2m5/6502_65C02_functional_tests
- "6502/6502_65C02_functional_tests" by 6502, available at https://git.applefritter.com/6502/6502_65C02_functional_tests
- "Klaus Dormann's 6502 testsuite assembled for load and execution at 0800" by BigEd, available at https://gist.github.com/BigEd/8323021
- "6502/65C02 Emulator Library" by Hackaday.io, available at https://hackaday.io/project/183848-650265c02-emulator-library
- "6502-sim/fake6502.c" by 6502-sim, available at https://git.idk.st/stuff/6502-sim/src/branch/main/fake6502.c
- "6502/6502_65C02_functional_tests" by Klaus2m5, available at https://github.com/Klaus2m5/6502_65C02_functional_tests
- "6502/6502_65C02_functional_tests" by 6502, available at https://git.applefritter.com/6502/6502_65C02_functional_tests
- "Klaus Dormann's 6502 testsuite assembled for load and execution at 0800" by BigEd, available at https://gist.github.com/BigEd/8323021
