# MACHINE — Monitors vs BASIC/OS Monitors

**Summary:** Describes machine-language monitors (MLM) vs the built-in operating system/BASIC monitor; notes machine-specific availability (PET/CBM built-in MLM, VIC-20/C64 usually require cartridge or RAM load, PLUS/4 built-in MLM) and common entry commands (SYS 4, SYS 8, MONITOR).

## Monitors: What They Are
The operating system provides low-level services (keyboard input, screen output, device I/O). A monitor is a program-layer that interprets user commands for a particular environment:

- BASIC monitor: interprets BASIC-level commands (NEW, LOAD, LIST, RUN) and provides text editing and program management for BASIC code.
- Machine-language monitor (MLM): a separate environment for direct interaction with machine code — examining memory, entering opcodes, disassembling, single-stepping, setting breakpoints, and executing code. BASIC commands such as NEW or LIST are meaningless inside an MLM; you must leave the BASIC monitor to use the MLM.

Machine differences:
- PET/CBM: includes a built-in machine-language monitor.
- VIC-20 and Commodore 64: typically do not include a built-in MLM; a monitor is usually provided via cartridge or must be loaded into RAM.
- Commodore Plus/4: includes a powerful built-in MLM.

Entry commands vary by system; common examples seen on Commodore machines are SYS 4, SYS 8, or a typed MONITOR (exact entry depends on model and ROM configuration).

## References
- "machine_language_monitor_usage" — expands on typical features and commands of a machine language monitor
- "entering_program_with_mlm" — expands on practical steps to enter assembled code using a monitor