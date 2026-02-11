# Kick Assembler — Appendix A.1: Command-line options (part 1)

**Summary:** Command-line options for Kick Assembler: -afo, -aom (memory/output control), -asminfo / -asminfo all / -asminfofile / -asminfotostdout (assemble information export), -binfile (raw BIN output), -bytedump / -bytebump / -bytedumpfile (assembled-byte dumps), -debugdump (debug mapping), -define (preprocessor symbols), -dtv (enable DTV opcodes), -excludeillegal (omit illegal opcodes), -execute / -executelog (run assembled file; log execution), -fillbyte, -libdir, -log, -maxaddr, -mbfiles, -noeval, -nooutput.

**Command-line options (concise reference)**
- **-afo**  
  Allow file output outside the configured output directory (permit writing files to paths outside the assembler's output dir).

- **-aom**  
  Allow overlapping memory blocks (do not treat overlapping .org/.block ranges as an error).

- **-asminfo / -asminfo all**  
  Export assemble information (mapping from assembled addresses to source locations). The "all" variant exports additional detail.

- **-asminfofile <file>**  
  Specify the filename to write the assemble-info output.

- **-asminfotostdout / -asminfoToStdOut**  
  Direct asminfo output to stdout instead of a file (two accepted spellings shown in source).

- **-binfile**  
  Output a raw binary (.bin) file instead of a .prg file.

- **-bytedump / -bytebump**  
  Dump assembled bytes with source to ByteDump.txt (a textual byte dump interleaved with source lines).

- **-bytedumpfile <file>**  
  Specify the filename for the bytedump output (overrides default ByteDump.txt).

- **-debugdump**  
  Dump an infofile for a C64 debugger that maps assembled bytes to source-code locations (used by external debugger tools).

- **-define <SYM>**  (example: -define DEBUG)  
  Define a preprocessor symbol (symbol becomes available to conditional compilation and macros).

- **-dtv**  
  Enable DTV-specific opcodes (assemble DTV-extended instructions).

- **-excludeillegal**  
  Exclude illegal (undocumented) 6502 opcodes from the instruction set (treat them as invalid).

- **-execute "<command ...>"**  (example: -execute "x64 +sound")  
  Execute a given program using the assembled file as an argument; commonly used to launch an emulator with the assembled program if assembly succeeds.

- **-executelog <file>**  (example: -executelog execlog.txt)  
  When -execute is used, capture the executed program's output to the given logfile.

- **-fillbyte <0-255>**  (example: -fillbyte 255)  
  Byte value used to fill gaps between memory blocks in the generated .prg file (single byte value 0–255).

- **-libdir <path>**  (example: -libdir ../stdLib)  
  Add a library search path for the assembler's INCLUDE/IMPORT operations (where external files are looked up).

- **-log <file>**  (example: -log logfile.txt)  
  Write the assembler's console output to the specified logfile.

- **-maxaddr <number>**  (example: -maxaddr 8191)  
  Set the upper memory address limit for assembly; default is 65535. A negative value disables the limit (unlimited memory).

- **-mbfiles**  
  Save one file per memory block instead of producing a single combined output file (creates separate output files per block).

- **-noeval**  
  Parse the source but exit before evaluation (syntax/parse pass only).

- **-nooutput**  
  Disable output of files during assembling.

Notes:
- The source shows some options twice (e.g., -dtv, -excludeillegal); duplicates are consolidated here.
- Case variants for some flags are shown in source (e.g., -asminfotostdout vs -asminfoToStdOut); both spellings appear to be accepted.

## Source Code
```text
Quick Reference
Option             Example                     Description

-execute           -execute "x64 +sound"       Execute a given program with the assembled file as argument.
-executelog        -executelog execlog.txt     If set, this generates a logfile for the output of the program executed using '-execute'.
-fillbyte          -fillbyte 255               Sets the byte used to fill the space between memoryblocks in the prg file.
-libdir            -libdir ../stdLib           Defines a library path where the assembler will look when it tries to open external files.
-log               -log logfile.txt            Prints the output of the assembler to a logfile.
-maxaddr           -maxaddr 8191              Sets the upper limit for the memory, default is 65535. Setting a negative value means unlimited memory.
-mbfiles           -mbfiles                   One file will be saved for each memory block instead of one big file.
-noeval            -noeval                    Parse the sourcecode but exit before evaluation.
-nooutput          -nooutput                  Disable output of files during assembling.
```

## References
- "cmdline_options_a1_part2" — continues the Kick Assembler command-line option listing (remaining options)
