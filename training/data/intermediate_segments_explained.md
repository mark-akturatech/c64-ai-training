# Kick Assembler: .segmentout, .file and debugger 'dest' parameter

**Summary:** Explains Kick Assembler intermediate segments used by .file and .segmentout (implicit intermediate segment, parameters, special 'name' parameter) and the .segmentdef dest parameter for debugger organization.

## Overview
Kick Assembler provides intermediate segments that can be referenced by directives (for example .file). The .file directive uses an implicit intermediate segment so you can pass parameters to the file-processing stage similar to how you pass parameters with .segment or .segmentdef. The parameter named name is treated specially by the .file directive; all other parameters behave as standard intermediate parameters.

## Parameters and semantics
- .file uses an implicit intermediate segment. Parameters supplied to .file are forwarded through that intermediate segment so the file-processing routine can receive options.
- The name parameter is special for .file (handled by the directive); other parameters are treated as ordinary intermediate-segment parameters.
- .segmentout can be used to create an output mapping that references an intermediate segment and pass parameters to it (example below uses sidFiles).
- .segmentdef supports the same intermediate-parameter mechanism and additionally accepts a dest parameter (see below).

## Debugger data: dest parameter
- You can mark segments with a destination by using the dest parameter in .segmentdef (for example dest="DISKDRIVE" or dest="BANK1").
- The dest parameter does not change the assembler/linker behavior; it is metadata passed to debuggers so they can organize debug data (for example, labels belonging to code marked as DISKDRIVE can be kept separate from labels belonging to on-computer code).
- The meaning of specific destination names is defined by the debugger (Kick Assembler only forwards the string).

## Source Code
```asm
.segmentout [sidFiles="data/music.sid"]

.segmentdef [dest="DISKDRIVE"]
```

## References
- "segmentout_directive_and_zeropage_example" — expands on using .segmentout with intermediate segments and examples for zeropage/output mapping
