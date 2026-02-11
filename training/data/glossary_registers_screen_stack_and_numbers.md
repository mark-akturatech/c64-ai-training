# MACHINE — Glossary: registers, screen, stack, numeric concepts

**Summary:** Glossary entries for C64/6502-relevant terms: Zero page ($00..$FF), Two's complement (example: -1 = $FF), Status register / processor status word (flags), screen memory/editing, stack, self-modifying code, symbolic assembler/labels, store/write operations, signed/unsigned numbers, and testable flags.

## Definitions
- Register: A processor location that holds information temporarily (internal CPU storage for flags, indices, accumulator, etc.).
- Screen editing: The ability to change the displayed screen by altering the computer's screen memory; editing the screen updates memory and vice versa.
- Screen memory: The portion of memory that contains the data shown on the display; reading it reveals current screen contents, writing it alters the display.
- Selected: A chip or device that has been signaled (enabled) to participate in a data transfer; unselected devices ignore data operations.
- Self-modifying: A program that alters its own instructions at runtime; uncommon and generally discouraged.
- Signed number: A numeric representation that can express positive and negative values.
- Source code: Instructions written in assembly language (the programmer's human-readable input before assembly).
- Stack: A temporary "scratch pad" area of memory used for last-in, first-out storage (push/pop of return addresses, registers, etc.).
- Status register / Processor status word: The processor register that holds status flags (condition bits reflecting arithmetic/logic results and control bits).
- Store: To copy data from the processor into memory (the value remains in the processor as well).
- Subroutine: A sequence of instructions callable by other code (reusable routine entered via JSR/JSR-like call).
- Symbolic address / Label: A programmer-assigned name that identifies a memory location (used instead of numeric addresses).
- Symbolic assembler: An assembler that accepts symbolic addresses/labels rather than only numeric addresses.
- Testable flag: A status flag that can be examined and acted upon using conditional branch instructions.
- Two's complement: A method for representing signed negative numbers; for single-byte values, -1 is represented as $FF.
- Unsigned number: A numeric representation that cannot express negative values (only zero and positive values).
- Write: To send information out to a device (I/O write operation).
- Zero page: The lowest 256 bytes of memory (addresses whose high byte is $00).

## References
- "glossary_machine_monitor_memory_rom" — expands on related memory, machine, and monitor terms
- "glossary_f_to_m_terms" — expands on F–M entries including interrupts and machine language
- "glossary_b_to_e_terms" — expands on B–E entries such as Effective address and Event flag