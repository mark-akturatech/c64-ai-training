# Program location counter and .LIB pseudo-opcode

**Summary:** Defines the assembler "program location counter" (the current assembly address / location counter) and documents the .LIB pseudo-opcode (include another disk file into the assembler source stream).

**Program location counter**

The program location counter is the assembler's current assembly address (the location counter) used to assign addresses to assembled bytes and labels. It is the value the assembler uses as the address for the next emitted byte or directive. (Common assembler synonyms: "." or "locctr", depending on assembler.)

**.LIB pseudo-opcode**

The `.LIB` pseudo-opcode is used to include the contents of another source file into the current assembly at the point where the `.LIB` directive appears. This allows for modular assembly programming by separating code into multiple files and including them as needed.

**Syntax:**


- **Filename Specification:** The filename must be enclosed in double quotes. It can include a path relative to the assembler's current working directory or an absolute path. The assembler will search for the file in the specified location.

**Behavior Details:**

- **Search Path:** The assembler searches for the specified file in the current working directory. If a relative path is provided, it is resolved based on the current working directory. Absolute paths are used as specified.

- **Default Disk/Device:** The assembler accesses the file from the disk or device specified in the path. If no device is specified, the default device is used.

- **Recursion and Include-Once Semantics:** The `.LIB` directive can be used recursively to include files that themselves contain `.LIB` directives. However, care must be taken to avoid circular inclusions, which can lead to infinite loops. The assembler does not inherently prevent multiple inclusions of the same file; if a file is included multiple times, its contents will be processed each time it is encountered.

**Interaction with Program Location Counter:**

The `.LIB` directive does not affect the program location counter. The included file's contents are assembled as if they were part of the original source file at the point of inclusion, maintaining the continuity of the program location counter.

**Examples:**

1. **Including a File:**

   To include a file named `macros.asm` located in the same directory as the current source file:


   This will insert the contents of `macros.asm` into the source at the point where the `.LIB` directive appears.

2. **Including a File from a Specific Path:**

   To include a file located in a subdirectory:


   This will include `constants.asm` from the `includes` subdirectory.

3. **Handling Errors:**

   If the specified file cannot be found or opened, the assembler will generate an error message indicating the issue. For example:


   This indicates that the assembler was unable to locate or access `nonexistent.asm`.

## Source Code

```
.LIB "filename"
```

   ```
   .LIB "macros.asm"
   ```

   ```
   .LIB "includes/constants.asm"
   ```

   ```
   Error: Cannot open file 'nonexistent.asm'
   ```


## References

- "pseudo_opcode_dbyte_directive" — expands on Previous data-definition directives
- "pseudo_opcode_end_marker" — expands on End-of-file marker (.END) and file termination