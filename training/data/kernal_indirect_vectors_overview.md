# Kernal Indirect Vectors ($031A-$032D)

**Summary:** Describes the Kernal indirect vectors stored at RAM addresses $031A-$032D (39 vectors) and their relationship to the ROM jump table at $FF81; explains that 10 of the ROM jump-table entries indirect through these RAM vectors, and recommends using the Kernal VECTOR routine at $FD1A to change vectors safely.

## Kernal Indirect Vectors — Overview
There are 39 Kernal routines whose entry addresses are held in RAM at $031A-$032D. The ROM jump table at the top of ROM ($FF81, decimal 65409) contains entries for many Kernal services; for ten of those services the ROM entry is a machine instruction that jumps to the address stored in the corresponding RAM vector in $031A-$032D. On power-up these RAM vector addresses are initialized to point at the original Kernal ROM routines.

Because the vectors live in RAM, any entry may be changed to extend or replace Kernal functionality (commonly used to add support for new I/O devices, e.g. an IEEE disk drive via an adapter). Many of the vectored routines are I/O-related.

Cautions:
- Some vectored routines are interrupt-driven. Changing those vectors while interrupts are enabled is unsafe.
- For a safe, unified method to change these RAM vectors (and the interrupt vectors), use the Kernal VECTOR routine at $FD1A (decimal 64794).

More detailed descriptions of each routine are provided in the documentation for the routine's ROM location (see referenced routine-name chunks).

## Key Registers
- $031A-$032D - Kernal - table of 39 RAM indirect vectors for Kernal routines (initialized to ROM routine addresses; 10 are indirectly jumped-to via ROM jump table entry at $FF81)

## References
- "iopen_..._istop" — expands on individual I/O vector entries  
- "usrcmd_vector" — expands on USRCMD vector and legacy behavior

## Labels
- VECTOR
