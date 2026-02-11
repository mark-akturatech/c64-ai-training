# ca65: -g, --debug-info (.DEBUGINFO)

**Summary:** The -g / --debug-info option (or the .DEBUGINFO control command) makes ca65 add a debug-information section to the object file containing all symbols (including locals) with symbol values and source-file positions; the linker will export these into a VICE label file so local symbols are visible in the VICE monitor.

## Description
When enabled, ca65 writes an extra section into each generated object file that records:
- every symbol defined in that object (global and local),
- each symbol's value (address/constant),
- the source file positions (file and line) where the symbol was defined.

The linker is able to read that debug-information section and will include the recorded symbols in the VICE label file it produces. As a result, symbols scoped as local inside modules (normally not exported) become available in the VICE monitor via the label file.

The same behavior is triggered either by passing -g or --debug-info on the ca65 command line, or by placing the .DEBUGINFO control directive in the assembly source.

## References
- "create_dep_files" — which dependency outputs include files referenced via debug information
