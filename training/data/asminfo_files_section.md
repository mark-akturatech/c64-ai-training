# Kick Assembler: Files list format and .asserterror usage

**Summary:** Describes Kick Assembler's [files] list format with index;filepath entries (filepath may contain semicolons) and the .asserterror directive form that asserts code will produce an assembler error.

## Files list format
Kick Assembler emits a [files] section that lists involved files as index;filepath fields. The separator between the numeric index and the path is a semicolon; because file paths themselves may contain semicolons the implementation treats the first semicolon as the index delimiter. Paths stored from inside archives are prefixed with the archive name and a colon (for example, KickAss.jar:/path/inside/archive).

Example characteristics:
- Entry format: <index>;<filepath>
- Index is a decimal integer (examples show 0, 1).
- Filepath may include semicolons; only the first semicolon is the index separator.
- Archive-internal files are indicated with archive_prefix:path (e.g. KickAss.jar:/include/autoinclude.asm).

## Asserting errors in code
The .asserterror directive can be used in a form that asserts a piece of code will fail to assemble. Use the code-form to enclose assembler statements that must produce an assembler error.

- Syntax example (literal form): .asserterror "message", { <asm statements> }
- Purpose: the assembler should report an error when assembling the enclosed statements (assert that assembly fails).

## Source Code
```text
[files]
0;KickAss.jar:/include/autoinclude.asm
1;test1.asm
```

```text
Test1 – FAILED! | 2000:ad,00,10 -- 2000:ae,00,10
Test2 – OK.     | 2000:8d,00,04,8d,01,04,8d,02,04,8d,03,04
```

```asm
.asserterror "Test", { lda #"This must fail" }
```

## References
(Not applicable)
