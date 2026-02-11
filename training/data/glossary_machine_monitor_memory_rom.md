# MACHINE - Glossary (machine/monitor and memory terms)

**Summary:** Definitions of machine/monitor and memory concepts for 6502/C64-era systems: machine language monitor, memory (RAM/ROM), memory-mapped I/O, memory page, op code/operand, object code, pointer, processor status word (status register), NMI, push/pull (stack), overflow, octothorpe (#), microprocessor/microcomputer, operating system, non-symbolic assembler, read/read-only memory.

## Definitions

- Machine language monitor: A program that provides direct communication with the computer for machine-language programming (e.g., examine/modify memory, enter and run machine code).

- Monitor: Either (a) a program that allows a user to communicate with the computer (machine/monitor tools), or (b) the video display device (screen).

- Memory: The computer's storage, organized into individually addressed locations.

- Memory mapped: Hardware circuits (I/O, timers, video, etc.) that are accessed using memory addresses rather than dedicated I/O instructions; reads and writes to those addresses communicate with the device.

- Memory page: A block of 256 consecutive memory locations whose addresses share the same high byte (i.e., the same $XX page).

- Microcomputer: A computer system built from microchips, containing a microprocessor, memory, and input/output circuits.

- Microprocessor: The central processing logic (CPU) implemented on a microchip; performs instruction decoding and arithmetic/logic.

- Non-maskable interrupt (NMI): An interrupt input that cannot be disabled (masked) by normal software control.

- Non-symbolic assembler: An assembler that requires actual numeric addresses (no symbolic labels); programmers must supply concrete addresses.

- Object code: The machine-language program (binary op codes and operands) that the computer executes.

- Octothorpe (#): The symbol "#" (also called number sign, pound sign, hash mark).

- Operand: The portion of an instruction following the op code that specifies data or the location (address) used by the operation.

- Operation code (op code): The portion of an instruction that specifies the operation to perform.

- Overflow: A condition where an arithmetic operation produces a result too large (or out of range) to fit in the destination field; typically sets the CPU's overflow flag.

- Pointer: A memory location containing an address, commonly stored in two consecutive bytes (low byte first on 6502 systems).

- Processor status word / status register: The processor register that holds status flags (condition bits) reflecting results of operations and control state.

- Push: Store a value onto the stack (decrement stack pointer on 6502 then write).

- Pull: Remove a value from the stack (read then increment stack pointer on 6502).

- Random access memory (RAM): Memory where data can be written and later read; volatile storage used for program and data working space.

- Read: To obtain (fetch) information from a device or memory location.

- Read only memory (ROM): Memory containing fixed data or program code stored at manufacture or programming time; not writable during normal operation.

- Operating system: A collection of programs on the computer that handle common tasks such as input/output and timing, and provide services to application programs.

## References
- "glossary_f_to_m_terms" — expands on F–M glossary items (includes Machine language).
- "glossary_registers_screen_stack_and_numbers" — expands on registers, screen memory, stack, and numeric representations.
- "glossary_header_and_a_terms" — expands on the start of the glossary and A-terms.