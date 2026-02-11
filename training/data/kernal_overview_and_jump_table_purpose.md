# KERNAL (Commodore 64) — rationale and jump-table interface

**Summary:** The KERNAL is the Commodore 64 ROM-based operating system that controls input/output and memory management and exposes its services via a standardized jump table (last page of memory, in ROM). Programs call KERNAL services by setting parameters, JSRing to the appropriate jump-table entry, and receiving results/back-control via processor registers.

## What the KERNAL is
The KERNAL is the Commodore 64 operating system layer stored in ROM that centralizes I/O and memory-management routines. It provides a stable API for machine-language programs so they do not depend on fixed ROM subroutine addresses that may change between system revisions.

## The jump-table design and rationale
- The KERNAL exposes its routines through a standardized JUMP TABLE rather than requiring programs to JSR directly to internal ROM subroutine addresses.
- Because ROM routine locations can change as Commodore updates the OS or hardware, the jump table is updated to point to the correct ROM locations; programs that use the jump table remain compatible across such changes.
- The KERNAL jump table contains the entry points for input/output and other utilities — the source text refers to "39 input/output routines and other utilities" available via the table.
- The jump table is placed on the last page of memory (read-only ROM) so programs can find a single, stable set of entry vectors.

## How to use the KERNAL jump table (call sequence)
Typical usage pattern:
1. Prepare parameters where the specific KERNAL routine expects them (registers, memory locations, or pointers — see each routine's description for the exact calling convention).
2. JSR to the appropriate location in the KERNAL jump table (JSR = 6502 Jump to SubRoutine).
3. The KERNAL routine performs its function and then transfers control back to the calling program. Some routines return values/flags in CPU registers — consult the individual routine documentation for which registers are used.

Notes:
- Do not JSR directly to internal ROM routines if you want forward-compatibility; always use the jump table entries.
- Exact register usage and parameter locations differ per KERNAL routine and must be checked in the routine-specific documentation.

## References
- "kernal_power_up_initialization_steps" — what the KERNAL does on power-up (initialization steps)
- "using_kernal_routines_and_calling_conventions" — how to prepare for and call KERNAL routines