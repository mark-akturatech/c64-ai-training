# Introduction — Memory Map, ROM, RAM, OS and BASIC

**Summary:** Defines the memory map concept for the Commodore 64, explains ROM vs RAM and the roles of the Operating System (OS) and BASIC interpreter in ROM, and describes why a memory map is essential for PEEK/POKE and machine-language programming and for controlling memory-mapped hardware.

## Introduction
A memory map is a guide to a computer’s internal hardware and software laid out by address. On the Commodore 64 it identifies where RAM, ROM, system software, and hardware I/O appear in the address space so programmers can read, write, or invoke functionality by address.

The system’s master control programs — the Operating System (OS) and the BASIC interpreter — reside in Read-Only Memory (ROM). These routines are available immediately at power-on and implement fundamental services (keyboard input, screen output, file I/O, LOAD, etc.). Applications you load into RAM coexist with the ROM-resident system software; applications often make use of OS/BASIC routines by calling the addresses that implement those services.

Machine-language programming requires familiarity with the memory map because you must place code and data at appropriate addresses, avoid or reuse system areas correctly, and call system routines by their entry addresses. Even when working in BASIC, advanced use of PEEK and POKE depends on knowing which addresses hold system state or control hardware.

## Memory-mapped hardware
Many of the C64’s support chips (those that provide graphics, sound, and communications) are accessed by reading and writing memory addresses rather than through separate I/O instructions. Because these chips appear in the CPU’s address space, controlling graphics, sound, and peripheral I/O is accomplished by manipulating the memory addresses that correspond to those devices. A memory map lists those addresses so programmers can precisely control the hardware.

## Why a memory map is useful
- Enables PEEK/POKE use in BASIC to read or change system state or hardware registers.
- Lets machine-language programmers place code/data safely (avoiding ROM or reserved system areas) and locate vectors and entry points in the OS.
- Documents where hardware control registers live so graphics/sound/I/O can be manipulated directly.
- Serves as a reference to understand how system software and application software share address space.

## How to Use This Book
The book describes the system memory locations and shows, where possible, how to utilize them in your programs. For details on specific areas (starting with zero page and BASIC working storage), see the referenced chapter.

## References
- "chapter1_zero_page_and_basic_working_storage" — expands on zero page and the start of detailed memory-map entries.