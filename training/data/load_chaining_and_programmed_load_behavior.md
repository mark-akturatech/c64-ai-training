# Programmed LOAD from within BASIC — chaining behavior and avoiding reload loops

**Summary:** Describes BASIC LOAD behavior when invoked from a running program (chaining): pointers including SOV are preserved but execution resumes at the first BASIC statement; use a variable flag to avoid infinite reload loops. Mentions monitor .L/.S commands for non-relocating loads.

## Chaining behavior (BASIC LOAD inside a program)
A LOAD executed from within a running BASIC program preserves pointers and variables (for example SOV is not altered). This lets you retain computed values across the load. However, programmed LOAD implements "chaining": after the LOAD completes the BASIC program restarts execution at the first statement (it does not continue from where it left off). Without a guard, a programmed LOAD can cause the program to reload repeatedly (infinite loop).

## Fix: use a variable flag to skip repeated LOADs
Use a variable as a flag to detect whether the LOAD has already been performed. Set the flag immediately before the LOAD; when execution restarts at the top of the program the flag prevents re-entering the LOAD sequence. The provided example demonstrates the minimal pattern.

## Monitor .L / .S commands
Some machine-language monitors provide commands to LOAD without changing pointers or relocating the program. Implementations vary across monitors; the .L command (example format shown) may bring back a program without relocation on some monitors. There is also a .S command reported to perform a program load without changing pointers (including SOV). Monitor behavior differs — check the specific monitor you use.

## Source Code
```basic
100 IF A=1 GOTO 130
110 A=1
120 LOAD"ML",8,1
130 REM continue...
```

```text
Example monitor load format (monitor dependent):
.L"PROGRAM",01

Note: some monitors provide a .S command to load without changing pointers.
```

## References
- "monitor_save_command_format_and_load_relocation" — differences between .L and BASIC LOAD behaviors; monitor-specific load/relocation notes