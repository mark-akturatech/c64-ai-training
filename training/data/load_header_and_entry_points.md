# KERNAL LOAD Library Header and Entry Points (LOAD, LOADSP)

**Summary:** KERNAL LOAD entry for cassette and IEEE serial devices; preserves .X/.Y alt-start into zero page $00C3/$00C4 (MEMUSS/MEMUSS+1) and vectors to the ILOAD monitor vector at $0330. Describes LOAD/NLOAD/LOADSP behavior, verify flag in A, SA alt-start behavior, and that high-load return is returned in X,Y.

## Overview
This chunk contains the library header comments describing the KERNAL LOAD routine behavior and the initial entry code:

- Purpose: Load from cassette (device 1 or 2) or IEEE-488 serial devices (device numbers 4–31 as determined by variable FA).
- Verify: A = 0 performs LOAD; A <> 0 performs VERIFY (verify flag).
- ALT vs NORMAL start: SA selects start-address mode — ALT LOAD if SA=0, NORMAL if SA=1 (SA = start-address flag).
- When ALT start (SA=0) is chosen, .X and .Y contain the low/high bytes of the load address; these are stored to MEMUSS/MEMUSS+1 ($00C3/$00C4).
- On entry, LOADSP stores .X/.Y into MEMUSS/MEMUSS+1 and then LOAD JMPs indirectly via the ILOAD monitor vector at $0330/$0331. The routine returns the high-load address in X,Y.

Preserved notes from the original comment block: device selection based on FA, A used as verify flag, monitor behaviors (ILOAD), and conventions for return registers.

## Source Code
```asm
                                .LIB   LOAD
                                ;**********************************
                                ;* LOAD RAM FUNCTION              *
                                ;*                                *
                                ;* LOADS FROM CASSETTE 1 OR 2, OR *
                                ;* SERIAL BUS DEVICES >=4 TO 31   *
                                ;* AS DETERMINED BY CONTENTS OF   *
                                ;* VARIABLE FA. VERIFY FLAG IN .A *
                                ;*                                *
                                ;* ALT LOAD IF SA=0, NORMAL SA=1  *
                                ;* .X , .Y LOAD ADDRESS IF SA=0   *
                                ;* .A=0 PERFORMS LOAD,<> IS VERIFY*
                                ;*                                *
                                ;* HIGH LOAD RETURN IN X,Y.       *
                                ;*                                *
                                ;**********************************
.,F49E 86 C3    STX $C3         LOADSP STX MEMUSS      ;.X HAS LOW ALT START
.,F4A0 84 C4    STY $C4         STY    MEMUSS+1
.,F4A2 6C 30 03 JMP ($0330)     LOAD   JMP (ILOAD)     ;MONITOR LOAD ENTRY
```

## Key Registers
- $00C3-$00C4 - Zero Page (KERNAL) - MEMUSS / MEMUSS+1: store .X/.Y alt start address (low/high)
- $0330-$0331 - KERNAL Vector - ILOAD indirect jump vector (JMP (ILOAD))

## References
- "nload_device_checks" — Handles device selection and further entry checks for LOAD/NLOAD
- "ieee_load_sequence" — Sequence after device is determined for IEEE device loads

## Labels
- LOAD
- LOADSP
- MEMUSS
- ILOAD
