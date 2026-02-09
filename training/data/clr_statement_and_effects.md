# CLR (BASIC statement)

**Summary:** CLR is a BASIC statement that frees RAM used by variables, arrays, GOSUB addresses, FOR..NEXT loops, user-defined functions and files; the BASIC program itself remains. CLR does not properly CLOSE disk or cassette files (incomplete buffers and file state are lost to the computer while the drive may still consider the file open).

## Description
CLR is a single-keyword statement (FORMAT: CLR) that makes available RAM previously used by BASIC run-time structures but no longer needed. When executed, CLR erases from memory:

- variables
- arrays
- GOSUB return addresses
- FOR...NEXT loop control information
- user-defined (FN) functions
- file handles tracked by BASIC

The BASIC program listing itself (the program text) is left intact.

Important file-caveat: CLR does not properly close files opened on disk drives or cassette tape. File information (including any incomplete I/O buffers) is lost to the computer; external devices (for example, a disk drive) may still think the file is open. Use the CLOSE statement to properly close disk/tape files.

**[Note: Source may contain an error — the original text read "mode available"; corrected to "more available".]**

## Syntax
TYPE: Statement  
FORMAT: CLR

## Example
The following BASIC program demonstrates that a numeric variable is cleared by CLR:

```basic
10 X=25
20 CLR
30 PRINT X
```

Running the program yields:

```text
RUN
0

READY
```

## Source Code
```basic
10 CLOSE 1
20 CLOSE X
30 CLOSE 9*(1+J)
```

```basic
10 X=25
20 CLR
30 PRINT X
```

(text excerpt:)
Action: This statement makes available RAM memory that had been used
but is no longer needed. Any BASIC program in memory is untouched, but
all variables, arrays, GOSUB addresses, FOR...NEXT loops, user-defined
functions, and files are erased from memory, and their space is more
available to new variables, etc.

In the case of files to the disk and cassette tape, they are not
properly CLOSED by the CLR statement. The information about the files is
lost to the computer, including any incomplete buffers. The disk drive
will still think the file is OPEN. See the CLOSE statement for more
information on this.
```

## References
- "close_statement" — proper file closing vs CLR behavior for disk/tape files