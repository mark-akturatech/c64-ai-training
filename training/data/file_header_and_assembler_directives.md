# FULL TRACK 20 ERROR SOURCE LISTING (top-of-file directives)

**Summary:** This section contains the initial directives and metadata from the 20M.PAL source file, including a corrected BASIC `OPEN` command, a `SYS` call to address 40960, an assembler option directive `-OPT P,02`, and an origin directive setting the assembly start address to `$0400`.

**File header and assembler/BASIC directives**

This chunk includes:

- **Title:** `FULL TRACK 20 ERROR SOURCE LISTING`
- **Filename:** `20M.PAL` (noted in a `REM` statement)
- **BASIC `OPEN` Command:** Opens a file on device 8 with logical file number 2 and secondary address 2. The filename is `"0:20M.B,P,W"`, where:
  - `0:` specifies the drive number.
  - `20M.B` is the filename.
  - `P` indicates a PRG (program) file.
  - `W` sets the file mode to write.
- **`SYS 40960`:** Executes a machine language routine starting at memory address 40960 (`$A000`).
- **Assembler Option:** `-OPT P,02` (specific assembler option; exact semantics depend on the assembler used).
- **Origin Directive:** `*= $0400` sets the assembly origin to memory address `$0400`.

## Source Code

```text
FULL  TRACK  20  ERROR  SOURCE  LISTING

100 REM
20M.PAL
110 REM
120 OPEN 2,8,2,"0:20M.B,P,W"
130 REM
140 SYS 40960
150
160 -OPT P,02
170
180 *= $0400
190
200 ;
```

## References

- [Commodore 64 BASIC V2.0 OPEN Command](https://www.c64-wiki.com/wiki/OPEN)
- [Commodore 64 BASIC V2.0 SYS Command](https://www.c64-wiki.com/wiki/SYS)
- [Commodore 64 BASIC V2.0 Commands](https://www.c64-wiki.com/wiki/BASIC_V2.0)