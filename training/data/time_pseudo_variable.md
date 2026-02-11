# .TIME pseudo variable (ca65)

**Summary:** .time (ca65) returns a constant POSIX integer (seconds since the Epoch) representing the assembler translation time; commonly embedded into generated code using directives like .dword to store a 32-bit timestamp.

## Description
Reading the pseudo variable .time yields a constant integer value equal to the current translation time in POSIX standard (seconds since the Epoch). The value is evaluated at assemble/translation time and is suitable for encoding the build/translation timestamp into generated binaries or data blocks.

Usage constraints: the value is a compile-time constant (not a runtime system call), suitable for storage with size directives (.byte/.word/.dword) as required.

Example usage is to store the timestamp as a 32-bit value with .dword.

## Source Code
```asm
        .dword  .time   ; Place time here
```

## References
- "version_pseudo_variable" — expands on .VERSION and other build/assembler metadata pseudo variables
- "pseudo_variables_overview" — general overview of pseudo variables in ca65