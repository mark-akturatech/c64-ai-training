# Kick Assembler: .assert directive and plugin registration

**Summary:** Explains Kick Assembler's .assert directive for testing expressions (e.g. ".assert \"2+5*10/2\", 2+5*10/2, 27"), behavior when results differ, support for numerical and compound types (vectors), and how to register Java-based plugins (.plugin directive and KickAss.plugin file) — classpath must expose plugin classes.

## .assert directive (testing expressions)
.assert is a directive for unit-style checks inside an assembly source. Typical usage supplies:
- a quoted expression string (for display),
- the evaluated expression (an assembler expression),
- the expected value.

Behavior described in the source:
- The directive prints the result and the expected value.
- If the actual result does not match the expected value, the mismatch is flagged as an error (assembly fails or reports an error).
- The mechanism supports numeric types and compound types such as vectors.

Example semantics (from source): .assert "2+5*10/2", 2+5*10/2, 27 — the directive will evaluate the expression, print the computed result and the expected 27, and report an error if they differ.

## Plugin registration and classpath
Plugin classes must be visible on the Java classpath when Kick Assembler runs:
- If running from Eclipse (or another IDE configured with the project classpath), plugin classes are typically already visible.
- If running Kick Assembler from the command line, you must provide the plugin classes on the Java classpath (either via the CLASSPATH environment variable or the java command's -cp/--classpath option).

Telling Kick Assembler about plugins:
- Project-local plugin: add a .plugin directive in the assembly source to load a single plugin class for that project:
  - .plugin "fully.qualified.ClassName"
- Global plugin (available for all Kick Assembler runs): place a file named KickAss.plugin in the same locations as KickAss.jar (search path). Each non-comment line contains one fully qualified plugin class name. Lines starting with // are comments.

## Source Code
```asm
; .assert example (from source)
.assert "2+5*10/2", 2+5*10/2, 27

; .plugin example (project-local)
.plugin "test.plugins.macros.MyMacro"
```

```text
; KickAss.plugin file example (placed alongside KickAss.jar)
; // My macro plugins
test.plugins.macros.MyMacro1
test.plugins.macros.MyMacro2
```

## Key Registers
(omitted — this chunk does not document C64/6502 hardware registers)

## References
(none)