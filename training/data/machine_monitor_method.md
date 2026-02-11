# 64MON — Machine Language Monitor (entry, save/load via BASIC)

**Summary:** 64MON is a machine language monitor for the Commodore 64 that permits entering code in HEX or SYMBOLIC form, saving/loading contiguous memory blocks (tape/disk), and provides debugging aids; typically used together with a BASIC loader (LOAD) and a flag variable to avoid repeated reloading.

**Overview**
64MON lets you enter machine code either as raw hexadecimal bytes or as symbolic assembly mnemonics, inspect and modify memory, and save the memory region containing the program to tape or disk. Advantages: easier entry of machine language routines, built‑in debugging aids (inspect, modify, single‑step), and faster saving/loading than typing raw DATA statements. Typical usage stores the assembled routine on tape/disk and uses BASIC to load it at program start.

Drawback: most workflows require the BASIC program to LOAD the machine language routine from tape or disk when the program starts (so the monitor-produced block must be saved and reloaded). The monitor itself is used interactively when building/debugging the routine; the runtime system normally relies on BASIC to fetch the machine code into RAM before jumping to it.

A common pattern uses a BASIC flag variable to prevent reloading the machine code on subsequent runs (for example, during development or iterative runs from BASIC).

## Source Code
```basic
10 IF FLAG=1 THEN 20
15 FLAG=1:LOAD"MACHINE LANGUAGE ROUTINE NAME",1,1
20
.
.
REST OF BASIC PROGRAM
```

**Monitor Commands**

64MON provides a set of commands for machine language development:

- **A**: Assemble a line of machine code.
- **C**: Compare two sections of memory and report differences.
- **D**: Disassemble a line of 6502 code.
- **F**: Fill memory with a specified value.
- **G**: Start execution at a specified address.
- **H**: Hunt through memory for occurrences of certain bytes.
- **I**: Interrogate memory, showing ASCII values of memory locations.
- **L**: Load a file from tape or disk.
- **M**: Display the hexadecimal values of memory locations.
- **N**: Adjust machine language program after moving it.
- **R**: Display the CPU registers.
- **S**: Save to tape or disk.
- **T**: Transfer code from one section of memory to another.
- **X**: Exit 64MON (BASIC will need to be reset).

These commands facilitate tasks such as assembling code, disassembling existing code, inspecting and modifying memory, and controlling program execution. For example, to assemble code starting at a specific address, you would use the `A` command followed by the address.

## References
- "data_statements_method" — expands on alternate entry method comparison
- "JiffyMON/64 2.0 Machine Language Monitor User's Guide" — provides detailed command descriptions and usage examples.