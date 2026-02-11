# Kick Assembler: FileValue writeln and sourcefile path/name functions

**Summary:** Describes FileValue.writeln behavior (used on values returned by createFile) and the getPath()/getFilename() functions for Kick Assembler source files; contains short example snippets and a tiny assembly fragment referencing $D020/$D021 (VIC-II).

**FileValue Functions**

In Kick Assembler, the `createFile` function allows you to create or overwrite a file on the disk. It returns a FileValue, which provides methods to write data to the file. The primary functions available for a FileValue are:

- **writeln(text):** Writes the provided text followed by a newline to the FileValue (output file handle).
- **writeln():** Writes a blank line (a newline) to the FileValue.

**Note:** For security reasons, you must use the `-afo` switch on the command line to allow file generation. For example:


**Usage Example: createFile and writeln Workflow**

The following example demonstrates the workflow of creating a file, writing to it, and closing it:


In this example:

1. `createFile("output.txt")` creates or overwrites a file named "output.txt" and returns a FileValue assigned to `myFile`.
2. `myFile.writeln("Hello, World!")` writes "Hello, World!" followed by a newline to the file.
3. `myFile.writeln("This is a second line.")` writes "This is a second line." followed by a newline to the file.

**Note:** The FileValue is automatically closed when the assembler finishes execution; explicit closing is not required.

**Sourcefile Path and Filename Functions**

Kick Assembler provides functions to retrieve the path and filename of the current source file:

- **getPath():** Returns the path of the current source file as a string.
- **getFilename():** Returns the filename (basename) of the current source file as a string.

**Examples:**


These functions are useful for debugging or generating output files relative to the source file's location.

## Source Code

```shell
java -jar KickAss.jar source.asm -afo
```

```kickassembler
.var myFile = createFile("output.txt")
.eval myFile.writeln("Hello, World!")
.eval myFile.writeln("This is a second line.")
```

```kickassembler
.print "Path : " + getPath()
.print "Filename : " + getFilename()
```


```asm
inc $d020
dec $d021
jmp main
*=$1000
.fill $100, i
}
```

```text
.print "Path : " + getPath()
.print "Filename : " + getFilename()
```

## Key Registers

- $D020-$D021 - VIC-II - border color ($D020) and background color ($D021)

## References

- [Kick Assembler Manual: Writing to User Defined Files](https://theweb.dk/KickAssembler/webhelp/content/ch12s05.html)
- [Kick Assembler Manual: Console Output](https://theweb.dk/KickAssembler/webhelp/content/ch03s11.html)