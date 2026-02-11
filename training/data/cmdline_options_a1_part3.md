# Kick Assembler — Command-line options (part 3), Preprocessor directives, and 6502 mnemonics (appendix)

**Summary:** Lists Kick Assembler CLI options (-executelog, -fillbyte, -libdir, -log, -maxaddr, -mbfiles, -noeval, -nooutput, -o, -odir, -pseudoc3x, -replacefile, -showmem, -symbolfile, -symbolfiledir, -time, -vicesymbols, -warningsoff) and the ':name=' script-parameter notation; documents preprocessor directives (#define, #if, #elif, #else, #endif, #import*, #importonce, #undef) and provides a complete 6502 mnemonic/opcode table.

**Command-line options (part 3)**

- **-executelog**  
  Logs the output of the executed program (captures stdout/stderr of the run).

- **-fillbyte**  
  Specifies the byte used to fill space between memory blocks in generated PRG files.

- **-libdir**  
  Adds an extra library search path for imports/includes.

- **-log**  
  Logs assembler output to a specified file.

- **-maxaddr**  
  Sets the upper memory limit (defines the highest allowed address for placement).

- **-mbfiles**  
  Saves one output file per memory block (splits by memory map blocks).

- **-noeval**  
  Parses source but stops before expression evaluation (useful for checking syntax/include structure).

- **-nooutput**  
  Disables emission of output files (assembles up to code generation step but doesn't write files).

- **-o**  
  Sets the output file name (PRG/BIN).

- **-odir**  
  Sets the output directory for produced files.

- **-pseudoc3x**  
  Allows semicolons between pseudocommand arguments (compatibility mode).

- **-replacefile**  
  Replaces a referenced source file with another file every time it's referred (filename substitution).

- **-showmem**  
  Displays the memory map after assembly.

- **-symbolfile**  
  Generates a .sym symbol file.

- **-symbolfiledir**  
  Sets the folder/directory for generated symbol file(s).

- **-time**  
  Displays assembly time (elapsed time for the assemble run).

- **-vicesymbols**  
  Generates a label file compatible with the VICE debugger.

- **-warningsoff**  
  Turns off warnings (suppresses warning messages).

**Script parameter notation:**

- **:name=**  
  Passes strings/variables into scripts/parameters. This notation is used by the assembler when calling scripts. Example: `:myvar=value`

**Preprocessor directives**

Supported preprocessor directives with examples:

- **#define**  
  Defines a preprocessor symbol.  
  Example: `#define DEBUG`

- **#if**  
  Evaluates an expression; if false, the source following the #if is discarded until the matching #else/#elif/#endif.  
  Example: `#if !DEBUG`

- **#elif**  
  Acts as an #else followed by #if; used inside an #if/#endif block to provide an additional conditional branch.  
  Example: `#elif TEST`

- **#else**  
  Starts an else block after an #if; executed if the preceding #if/#elif condition(s) were false.  
  Example: `#else`

- **#endif**  
  Marks the end of an #if/#else/#elif block.  
  Example: `#endif`

- **#import**  
  Imports another source file unconditionally.  
  Example: `#import "file2.asm"`

- **#importif**  
  Imports another source file only if the given expression evaluates to true.  
  Example: `#importif !DEBUG "file2.asm"`

- **#importonce**  
  Makes the assembler skip importing the current file if it has already been imported (prevents duplicate includes).  
  Example: `#importonce`

- **#undef**  
  Removes the definition of a preprocessor symbol.  
  Example: `#undef DEBUG`

## Source Code

```text
# Preprocessor directive examples
#define DEBUG
#if !DEBUG
#elif TEST
#else
#endif
#import "file2.asm"
#importif !DEBUG "file2.asm"
#importonce
#undef DEBUG
```

```text
# Command-line example notation
:name=
```

## Mnemonics
- LDA
- STA
- LDX
- STX
- LDY
- STY
- ADC
- SBC
- AND
- ORA
- EOR
- CMP
- CPX
- CPY
- INC
- DEC
- INX
- INY
- DEX
- DEY
- ASL
- LSR
- ROL
- ROR
- BIT
- JMP
- JSR
- RTS
- RTI
- BRK
- NOP
- BCC
- BCS
- BEQ
- BNE
- BMI
- BPL
- BVC
- BVS
- CLC
- SEC
- CLD
- SED
- CLI
- SEI
- CLV
- PHA
- PLA
- PHP
- PLP
- TAX
- TXA
- TAY
- TYA
- TSX
- TXS
- DCP
- DCM
- ISB
- ISC
- INS
- LAX
- LAX#
- SAX
- AXS
- SLO
- ASO
- RLA
- SRE
- LSE
- RRA
- ANC
- ANC2
- ALR
- ASR
- ARR
- SBX
- SAX
- LAS
- LAR
- SHA
- AXA
- SHX
- SXA
- XAS
- SHY
- SYA
- SAY
- TAS
- SHS
- ANE
- XAA
- ATX
- LXA
- USBC
- SBC#
