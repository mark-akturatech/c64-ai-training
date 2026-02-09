# Kick Assembler — Version (asminfo) and .assert testing directives

**Summary:** asminfo's version line (e.g. `[version] 5.12`) holds the assembler version; Kick Assembler provides `.assert` directives for testing expressions and will count and report total and failed assertions after assembling.

## Version section (asminfo)
The asminfo file contains a single line with the assembler version in the format:
- `[version] 5.12` (example)
This single-line entry is used to report the assembler version in tooling and logs.

## Testing — .assert directives
- `.assert` directives are provided to test expressions during assembly.
- They were introduced to facilitate testing the assembler itself but are usable for testing macros, pseudo-commands, and functions.
- When `.assert` directives are used, the assembler:
  - Automatically counts the number of assertions executed.
  - Automatically counts the number of failed assertions.
  - Displays these counts when assembling finishes.

With the assert directive you can test the value of expressions. It takes three arguments: a description, an
**[Note: Source truncated — the remainder of the `.assert` argument description is missing in the original text.]**

## Source Code
```text
# asminfo example (single line)
[version] 5.12

# (Original text fragment regarding .assert)
Kick Assembler has .assert directives that are useful for testing. They were made to make it easy to test the
assembler itself, but you can use them for testing your own pseudo-commands, macros, functions. When assertions
are used, the assembler will automatically count the number of assertions and the number of failed assertions and
display these when the assembling has finished.

With the assert directive you can test the value of expressions. It takes three arguments: a description, an
```

## Key Registers
- (none)

## References
- (none)