# Kick Assembler — Appendix A.1: Command line options (part 2)

**Summary:** Continued list of Kick Assembler command-line options and brief behaviors: flags like -cfgfile, -debug, -debugdump, -define, -dtv, -excludeillegal, -execute, -nooutput, -o/-odir output controls, -pseudoc3x, -replacefile, -showmem, -symbolfile/-symbolfiledir, :name= style cmdline variables, -time, -vicesymbols, -warningsoff.

**Command line options (continued)**

This chunk documents the second part of the appendix A.1 command-line options for Kick Assembler. Items are listed with the exact descriptions available in the source. No interpretation beyond reformatting is added.

- **-cfgfile**
  - Use additional configuration files. (mentioned in the source list)

- **-debug**
  - Adds debug information such as stacktraces.

- **-debugdump**
  - Dump a debugging map for C64 debugger mapping bytes to source.

- **-define**
  - Define a preprocessor symbol.

- **-dtv**
  - Enable DTV opcodes.

- **-excludeillegal**
  - Exclude illegal opcodes (do not assemble them).

- **-execute**
  - Run a program with the assembled file as argument (e.g., launching an emulator).

- **-nooutput**
  - If set, this will disable output of files during assembling.

- **-o**
  - Set the output file. Example: `-o dots.prg`
  - Default: input filename with a ".prg" suffix.

- **-odir**
  - Set the output directory. Example: `-odir out`
  - Output files will be written in this directory (or relative to it).

- **-pseudoc3x**
  - Enables semicolon between pseudocommand arguments.

- **-replacefile**
  - Replace a referenced source file with another file.
  - Example usage in source shows two paths following the option:
    - `-replacefile`
    - `c:\source.asm`
    - `\replacement.asm`

- **-showmem**
  - Show a memory map after assembling.

- **-symbolfile**
  - Generates a `.sym` file with the resolved symbols.
  - The `.sym` file can be used in other sources with the `.import` source directive.

- **-symbolfiledir**
  - Specify the folder in which the symbolfile is written.
  - Example: `-symbolfiledir sources/symbolfiles`
  - If none is given, the symbolfile is written next to the source file.

- **-time**
  - Displays the assemble time.

- **-vicesymbols**
  - Generates a label file for the VICE emulator.

- **-warningsoff**
  - Turns off warning messages.

- **Colon-prefixed variables (script variables)**
  - Syntax examples in source: `:name=`, `:x=34 :version=beta2 :path="c:/C 64/"`
  - The source states: The `:` notation denotes variables passed to the script and can be accessed via the `cmdLineVars` hashtable available from the script.

## References

- "cmdline_options_a1_part1" — expands on previous command line options
- "cmdline_options_a1_part3" — continues the command line options listing
