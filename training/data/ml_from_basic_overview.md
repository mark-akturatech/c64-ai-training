# Using Machine Language from BASIC — five methods

**Summary:** Describes five C64 techniques for invoking or integrating 6502 machine-language code from CBM BASIC: the BASIC SYS statement, the BASIC USR function, changing RAM I/O (KERNAL) vectors, changing RAM interrupt vectors (IRQ/NMI handlers), and replacing the CHRGET routine (wedge). Covers purpose and typical use-cases for each.

## Overview
Experienced C64 programmers use one of five primary techniques to run or integrate machine code with BASIC. Each technique has different control, parameter-passing, visibility to BASIC, and persistence characteristics — choose the method matching whether you need a one-shot call, a value returned to BASIC, transparent I/O redirection, background/real-time execution, or interception of BASIC input/tokenization.

## 1) BASIC SYS statement
Purpose:
- Transfer execution from BASIC to a machine-language routine at an absolute address (called with SYS <address>).
When to use:
- Simple, explicit hand-off to ML routines that either run and return control to BASIC (via an RTS or by jumping back to BASIC) or take control of the machine.
Notes:
- SYS takes a numeric (decimal) address; parameter passing is typically done via zero-page or known memory locations.
- Use when you need a straightforward, explicit call from a BASIC program to a runnable ML routine.

## 2) BASIC USR function
Purpose:
- Call a machine-language routine as a function and receive a numeric result back into a BASIC expression (e.g., X = USR(addr)).
When to use:
- When ML computes and returns a value used directly by BASIC (math, geometry, lookup results).
Notes:
- USR returns a numeric value to BASIC; parameters and richer data are typically exchanged via memory (zero-page or data buffers).
- Use when the ML routine is logically a subroutine that produces a value for BASIC rather than taking over execution.

## 3) Changing RAM I/O vectors (KERNAL vector redirection)
Purpose:
- Replace KERNAL/I/O entry-point pointers (vectors kept in writable RAM) so BASIC and other system code call your ML routines for standard services (character input/output, file/device routines, etc.).
When to use:
- Transparent redirection of standard services (screen output, keyboard input, device handlers, serial I/O) without altering BASIC source.
- Implement wedges, device emulators, alternate console I/O, or intercept CHROUT/CHRIN behavior.
Notes:
- This is a non-invasive way to make BASIC use custom ML handlers for I/O; restoring original vectors is important to avoid system instability.

## 4) Changing RAM interrupt vectors (IRQ/NMI handlers)
Purpose:
- Install ML code to run in response to hardware interrupts (IRQ/NMI) by writing new handler addresses into writable interrupt vector locations.
When to use:
- Time-critical background tasks: raster effects, sprite multiplexing, scanline timing, periodic sampling, or multitasking-like background routines.
Notes and cautions:
- Interrupt handlers must preserve registers and follow calling conventions expected by KERNAL/other handlers when chaining.
- Always save and restore the original vector if you need to return system behavior to normal.
- Careful with re-entrancy and interaction with BASIC; disabling interrupts briefly while modifying vectors is common.

## 5) Changing the CHRGET routine (wedge)
Purpose:
- Replace the KERNAL character-fetch routine used by BASIC input/tokenizer (CHRGET) so BASIC line input and tokenization can be intercepted or extended.
When to use:
- Implementing a wedge (a small extension that adds commands or changes BASIC’s tokenization and editor behavior), command shortcuts, or custom line-editing behavior that BASIC will use transparently.
Notes:
- A wedge traps character input at the point BASIC requests characters; it's powerful for adding editor-level features or new BASIC keywords without modifying the interpreter source.
- Must emulate original CHRGET behavior where appropriate to avoid breaking BASIC input.

## Limitations and tradeoffs
- Parameter passing: BASIC→ML uses memory (zero page/buffers); SYS and USR do not provide direct register parameters.
- Persistence: Vector and handler changes persist until restored or reset; SYS/USR are one-shot calls.
- Stability: Interrupt and vector replacements can destabilize BASIC or KERNAL if original behavior is not preserved and restored properly.
- Visibility: Vector/CHRGET changes are transparent to BASIC code; SYS/USR require explicit calls.

## References
- "sys_and_usr_methods" — expands on SYS and USR method details
- "vector_kernal_routine" — expands on changing RAM vectors via the VECTOR routine (related to method 3)

## Labels
- CHRGET
