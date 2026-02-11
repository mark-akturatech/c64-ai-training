# Kick Assembler: Library entry format and assertion directives

**Summary:** Library section entries use the format `libraryname;entrytype;typedata` (entry types: `function`, `constant`); expression test directives `.assert` and `.asserterror` check evaluated expressions and expected results during assembly.

## Library entry format
Library entries are declared using a semicolon-separated line:

- Format: libraryname;entrytype;typedata
- Entry types: `function` and `constant`
- Examples:
  - `Math;constant;PI`
  - `Math;function;abs;1` (function with 1 parameter)

## Assertion directives (.assert and .asserterror)
- .assert checks that an expression evaluates to an expected result during assembly. Syntax (as shown in examples):
  .assert "description", expression, expected_result

  The assembler prints the description, the evaluated result, and the expected result. If they differ an error message is appended.

  Example assembler output lines (exact form shown in source):
  - `2+5*10/2=27.0 (27.0)`
  - `2+2=4.0 (5.0) – ERROR IN ASSERTION!!!`
  - `Vector(1,2,3)+Vector(1,1,1)=(2.0,3.0,4.0) ((2.0,3.0,4.0))`

- .asserterror asserts that an expression produces an error (used to test erroneous parameter usage). Syntax example from source:
  `.asserterror "Test1" , 20/10`

## Source Code
```asm
.assert "2+5*10/2", 2+5*10/2, 27
.assert "2+2", 2+2, 5
.assert "Vector(1,2,3)+Vector(1,1,1)", Vector(1,2,3)+Vector(1,1,1), Vector(2,3,4)

; When assembling this code the assembler prints:
; 2+5*10/2=27.0 (27.0)
; 2+2=4.0 (5.0) – ERROR IN ASSERTION!!!
; Vector(1,2,3)+Vector(1,1,1)=(2.0,3.0,4.0) ((2.0,3.0,4.0))

.asserterror "Test1" , 20/10
```
