# Zero Page $0010-$0018 — BASIC variable/input flags and line-number pointers

**Summary:** Zero page addresses $0010-$0018 store BASIC runtime flags and pointers: variable-fetch flag ($0010), input-method selector ($0011), sign register ($0012), current I/O device ($0013), default line-number storage ($0014-$0015), and string-stack pointers ($0016-$0018).

## Zero Page $0010-$0018 Overview
This block is part of the BASIC interpreter's zero-page workspace. Each byte is used by the interpreter to control parsing, input handling, numeric sign state for trig functions, program flow (current line number), and expression/string pointer management.

- $0010 — Variable Fetch
  - Integer variable acceptance flag used by the interpreter when fetching numeric variables (controls whether integer-only variables are accepted).
- $0011 — Input Method
  - Selector for INPUT/GET/READ mode (determines which input routine and parsing behavior to use).
- $0012 — Sign Register
  - Stores the sign for trigonometric functions and other signed numeric operations.
- $0013 — I/O Device
  - Current device number (default: keyboard/screen). Used to route INPUT/PRINT/OPEN/CHDIR style operations to the correct device.
- $0014-$0015 — Line Number
  - Two-byte storage for a line number used by program control flow (e.g., default target line for GOTO/GOSUB/RESTORE when stored temporarily).
- $0016 — String Stack Pointer
  - Pointer to the next expression (default value: $19). Used by the string/expression stack for parsing/evaluation.
- $0017-$0018 — String Stack Previous
  - Two-byte pointer holding the previous expression pointer (previous string-stack pointer).

## Source Code
```text
$0010   Variable Fetch          Integer variable acceptance flag
$0011   Input Method            INPUT/GET/READ mode selector
$0012   Sign Register           Sign for trigonometric functions
$0013   I/O Device              Current device number (default: keyboard/screen)
$0014-$0015  Line Number        Line number for program control flow
$0016   String Stack Ptr        Pointer to next expression (default: $19)
$0017-$0018  String Stack Prev  Previous expression pointer
```

## Key Registers
- $0010-$0018 - Zero Page - BASIC runtime flags and pointers (variable fetch flag, input method, sign register, I/O device, line-number storage, string stack pointers)

## References
- "basic_program_area" — expands on BASIC program area and line storage

## Labels
- VARIABLE_FETCH
- INPUT_METHOD
- SIGN_REGISTER
- IO_DEVICE
- LINE_NUMBER
- STRING_STACK_PTR
- STRING_STACK_PREV
