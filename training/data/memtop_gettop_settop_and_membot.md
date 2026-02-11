# KERNAL: MEMTOP / MEMBOT (SETTOP/GETTOP / SETBOT/GETBOT) routines

**Summary:** KERNAL helper routines at $FE25–$FE42 manage detected memory boundaries using MEMSIZ ($0283/$0284) and MEMSTR ($0281/$0282). Entry uses the 6502 carry flag (set = read, clear = write); GET/SET forms transfer low/high bytes via X (low) and Y (high).

## Description
These short KERNAL helpers provide a uniform interface for other routines to read or store the detected top and bottom RAM addresses. Conventions:

- Entry by JSR to the labels MEMTOP ($FE25) or MEMBOT ($FE34).
- The 6502 carry flag selects the operation:
  - Carry = 1: perform a READ (load stored address into X/Y).
  - Carry = 0: perform a WRITE (store X/Y into the stored location).
- Data format: X contains the low byte, Y contains the high byte (little-endian).
- Each routine returns with RTS; GET uses LDX/LDY, SET uses STX/STY.
- Side effects: LDX/LDY affect NZ flags in the status register (standard 6502 behavior).

Routine map (addresses and behavior):
- $FE25 (MEMTOP) — branch on carry to SETTOP; with carry=1 falls through to GETTOP which loads MEMSIZ into X/Y; with carry=0 branches to SETTOP which stores X/Y into MEMSIZ. Returns at $FE33.
- $FE34 (MEMBOT) — same pattern for MEMSTR: carry=1 -> GET bottom (load MEMSTR into X/Y); carry=0 -> SETBOT (store X/Y into MEMSTR). Returns at $FE42.

These helpers are used by RAMTAS memory-detection and various KERNAL file I/O and timeout helpers to read or adjust the detected memory top and bottom.

## Source Code
```asm
.,FE25 90 06    BCC $FE2D       MEMTOP BCC SETTOP
                                ;
                                ;CARRY SET--READ TOP OF MEMORY
                                ;
.,FE27 AE 83 02 LDX $0283       GETTOP LDX MEMSIZ
.,FE2A AC 84 02 LDY $0284       LDY    MEMSIZ+1
                                ;
                                ;CARRY CLEAR--SET TOP OF MEMORY
                                ;
.,FE2D 8E 83 02 STX $0283       SETTOP STX MEMSIZ
.,FE30 8C 84 02 STY $0284       STY    MEMSIZ+1
.,FE33 60       RTS             RTS
                                ;MANAGE BOTTOM OF MEMORY
                                ;
.,FE34 90 06    BCC $FE3C       MEMBOT BCC SETBOT
                                ;
                                ;CARRY SET--READ BOTTOM OF MEMORY
                                ;
.,FE36 AE 81 02 LDX $0281       LDX    MEMSTR
.,FE39 AC 82 02 LDY $0282       LDY    MEMSTR+1
                                ;
                                ;CARRY CLEAR--SET BOTTOM OF MEMORY
                                ;
.,FE3C 8E 81 02 STX $0281       SETBOT STX MEMSTR
.,FE3F 8C 82 02 STY $0282       STY    MEMSTR+1
.,FE42 60       RTS             RTS
                                .END
```

## Key Registers
- $0283-$0284 - KERNAL RAM - MEMSIZ (top-of-memory, little-endian: low=$0283, high=$0284)
- $0281-$0282 - KERNAL RAM - MEMSTR (bottom-of-memory, little-endian: low=$0281, high=$0282)

## References
- "ramtas_memory_initialization_and_top_detection" — expands on uses of SETTOP during RAMTAS memory detection
- "sixty_and_file_io_helpers" — shows I/O timeout and memory-dependent routines that call these helpers

## Labels
- MEMTOP
- MEMBOT
- MEMSIZ
- MEMSTR
