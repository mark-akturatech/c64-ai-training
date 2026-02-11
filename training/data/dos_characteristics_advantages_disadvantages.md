# Purpose of a DOS — Commodore 1541 Intelligent-Peripheral Approach

**Summary:** Defines a disk operating system (DOS) and lists its core tasks (I/O, formatting, storage management, read/write). Describes Commodore's "intelligent peripheral" design for the 1541 disk drive (onboard 6502 CPU, 2K RAM, two 6522 I/O chips, 15.8K ROM DOS) and enumerates advantages and disadvantages.

## Purpose of a DOS
A disk operating system (DOS) is a machine-language program that controls a disk drive. Primary responsibilities:
1. Handling communications between a disk drive and a computer.
2. Carrying out housekeeping chores such as formatting a diskette.
3. Managing the storage of information on a diskette.
4. Reading and writing information onto a diskette's surface.

## Commodore's approach — the 1541 as an intelligent peripheral
Instead of loading DOS into the host computer's RAM at startup, Commodore places the DOS and necessary control hardware inside the disk drive. The 1541 contains:
- A 6502 microprocessor (onboard CPU).
- 2 KB of RAM.
- Two 6522 VIA (I/O) chips.
- A DOS program stored in 15.8 KB of ROM.

Because the drive has its own CPU, RAM, I/O, and ROM, many disk functions are handled internally by the drive rather than using the host computer's resources.

## Advantages
1. The DOS does not use any of the computer's memory.
2. Some disk operations can be carried out independently from the host CPU.
3. Disk operations do not slow down host processing.
4. One disk drive can be shared among several computers.

## Disadvantages
1. It is difficult to customize DOS routines (DOS is in the drive, not in host RAM).
2. Replacing or upgrading DOS requires replacing the drive ROMs.

## References
- "communicating_with_1541_methods" — expands on methods the computer uses to communicate with the 1541.
- "overview_of_1541_dos_and_hardware" — expands on 1541 ROM routines and the onboard 6502 (see later chapters).
