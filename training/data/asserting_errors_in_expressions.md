# Kick Assembler: .asserterror directive (testing error handling)

**Summary:** .asserterror — Kick Assembler directive to assert that an expression produces an error (useful for unit tests of assembler error handling). Also notes brief macro-plugin info (Java IMacro).

## Description
.asserterror evaluates an expression and expects it to raise an assembler error. If the expression produces an error, the assertion is considered OK; if the expression evaluates normally, the assertion fails and is reported as an error. This directive is intended for automated tests of assembler error handling.

Behavior:
- If the expression triggers an assembler error: output reports OK for that test.
- If the expression evaluates successfully: output reports ERROR IN ASSERTION for that test.

Example uses include asserting invalid operands, divide-by-zero, type errors, or other assembler parse/eval errors.

Macro plugin note:
- To implement a macro plugin for Kick Assembler, create a Java class that implements the IMacro interface (e.g., test.plugins.macros.MyMacro3).

## Source Code
```asm
; Examples showing expected outcomes:
.asserterror "Test1", 20/10      ; will fail (20/10 evaluates successfully -> ERROR IN ASSERTION)
.asserterror "Test2", 20/false   ; expected error due to invalid operand -> OK
```

```java
// Macro plugin example (from documentation)
package test.plugins.macros;
public class MyMacro3 implements IMacro {
    // implement IMacro methods...
}
```

## References
- "test.plugins.macros.MyMacro3" — example macro plugin class
- "3rd Party Java plugins" — plugin chapter / section in documentation
