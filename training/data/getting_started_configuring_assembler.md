# Kick Assembler — Configuring the Assembler (KickAss.cfg)

**Summary:** How to use command-line options (java -jar kickass.jar -showmem, -execute) and place default options in KickAss.cfg (file must sit next to KickAss.jar); comment rules for KickAss.cfg (lines starting with #). Example settings show -showmem and -execute invoking VICE.

## Config file usage and command-line options
- Kick Assembler accepts command-line options (see Appendix A in original manual for full list). Example invocation:
  - java -jar kickass.jar -showmem myCode.asm
- To apply a set of options every time you assemble, create a file named KickAss.cfg in the same folder as KickAss.jar. Each line in KickAss.cfg is treated as a single command-line option (the assembler prepends these options when run).
- Example use case: always display the memory map after assembling and then automatically launch the assembled program in the VICE emulator using -execute.

## Comment rules and path notes
- Lines in KickAss.cfg that begin with # are treated as comments and ignored.
- Paths may be written with forward slashes as shown in the example; replace the example path with the actual path to your VICE executable on your machine.
- The assembler is launched via Java (java -jar ...). Ensure KickAss.jar and KickAss.cfg are colocated (same folder) so the assembler will read the config file automatically when invoked.

## References
- "basic_assembler_functionality_overview_and_mnemonics" — expands on -showmem and memory map output described later in Basic Assembler Functionality
