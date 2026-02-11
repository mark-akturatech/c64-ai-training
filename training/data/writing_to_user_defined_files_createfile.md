# Kick Assembler: createFile and VICE symbols export

**Summary:** Use Kick Assembler's createFile() to create or overwrite host files from a script (.var/.eval); requires running Kick Assembler with the -afo switch for security. Export assembler labels to a VICE-readable .vs file using the --vicesymbols option.

## createFile
createFile("filename") creates (or overwrites) a file on the host from a Kick Assembler script and returns a file object usable from the script (example shows .writeln). For security this operation is blocked unless Kick Assembler is started with the -afo switch (allow file output). Example usage in a script:

- Declare a file handle with .var and write a line with .eval/.writeln.
- The file is created/overwritten with the given name in the current working directory of the JVM running Kick Assembler.

## Exporting Labels to VICE
Use the --vicesymbols option to export symbol/label definitions from a Kick Assembler run into a .vs file that can be loaded by the VICE emulator. The exported .vs filename is produced by Kick Assembler and contains label names and addresses for use in VICE.

## Source Code
```asm
; create/overwrite host file from Kick Assembler script
.var myFile = createFile("breakpoints.txt")
.eval myFile.writeln("Hello World")

; example call inside assembly script
jsr source1.clearColor
```

```text
; run Kick Assembler and export labels for VICE
java -jar KickAss.jar source1.asm --vicesymbols

; Security: allow file creation when starting Kick Assembler
; (required switch)
-afo
```

## References
- "breakpoints_file_example" — expands on example writing breakpoints file