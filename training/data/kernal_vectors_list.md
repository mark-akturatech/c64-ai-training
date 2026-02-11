# KERNAL vector table ($0314-$0332)

**Summary:** KERNAL ROM vectors at $0314-$0332 — IRQ ($0314), BRK ($0316), NMI ($0318), device/file I/O vectors (OPEN $031A, CLOSE $031C, CHKIN $031E, CHKOUT $0320, CLRCHN $0322, CHRIN $0324, CHROUT $0326, STOP scan $0328, GETIN $032A, CLRCHNALL $032C), user function ($032E) and LOAD/SAVE ($0330/$0332). Vectors are stored as little-endian 16-bit addresses.

## Description
This chunk documents the default KERNAL vector table beginning at $0314. Each vector is a two-byte little-endian pointer (low byte then high byte) used by the KERNAL to dispatch interrupts and file/device services. The table contains CPU interrupt vectors followed by KERNAL service vectors for logical file and device I/O, console input/output, and high-level file operations (LOAD/SAVE).

Notable details:
- IRQ/BRK/NMI: Standard CPU interrupt dispatch vectors at $0314, $0316, $0318.
- I/O vectors: OPEN/CLOSE/CHKIN/CHKOUT/etc. are used by KERNAL device/file routines to indirect to device-specific implementations.
- LOAD/SAVE: Vectors at $0330/$0332 point to the default load/save handlers.
- $032E (user function) is a legacy vector: historically used by the PET machine-language monitor to extend monitor commands. In this KERNAL build it is initialized to point to the BRK/STOP/RESTORE handler and is updated by the KERNAL vector routine at $FD57, but it otherwise has no active function in normal operation. This entry is retained for backward compatibility.

The vector values shown in the supplied listing are the ROM-initialized targets (stored in RAM word locations $0314..$0332). When software reinitializes IO vectors (see routine "restore_default_io_vectors") these words may be reset to their defaults.

## Source Code
```asm
.:FD30 31 EA                    $0314 IRQ vector
.:FD32 66 FE                    $0316 BRK vector
.:FD34 47 FE                    $0318 NMI vector
.:FD36 4A F3                    $031A open a logical file
.:FD38 91 F2                    $031C close a specified logical file
.:FD3A 0E F2                    $031E open channel for input
.:FD3C 50 F2                    $0320 open channel for output
.:FD3E 33 F3                    $0322 close input and output channels
.:FD40 57 F1                    $0324 input character from channel
.:FD42 CA F1                    $0326 output character to channel
.:FD44 ED F6                    $0328 scan stop key
.:FD46 3E F1                    $032A get character from the input device
.:FD48 2F F3                    $032C close all channels and files
.:FD4A 66 FE                    $032E user function
                                Vector to user defined command, currently points to BRK.
                                This appears to be a holdover from PET days, when the built-in machine language monitor
                                would jump through the $032E vector when it encountered a command that it did not
                                understand, allowing the user to add new commands to the monitor.
                                Although this vector is initialized to point to the routine called by STOP/RESTORE and
                                the BRK interrupt, and is updated by the kernal vector routine at $FD57, it no longer
                                has any function.
.:FD4C A5 F4                    $0330 load
.:FD4E ED F5                    $0332 save
```

## Key Registers
- $0314-$0332 - KERNAL - Vector table: IRQ $0314, BRK $0316, NMI $0318, OPEN $031A, CLOSE $031C, CHKIN $031E, CHKOUT $0320, CLRCHN $0322, CHRIN $0324, CHROUT $0326, STOP scan $0328, GETIN $032A, CLRCHNALL $032C, USRFUNC $032E, LOAD $0330, SAVE $0332

## References
- "restore_default_io_vectors" — routine that (re)initialises these vectors
- "irq_vector_dispatch" — expands on vectors used by IRQ/BRK/NMI dispatch

## Labels
- OPEN
- CLOSE
- CHRIN
- CHROUT
- LOAD
- SAVE
