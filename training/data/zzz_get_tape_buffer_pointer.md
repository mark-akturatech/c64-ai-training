# ZZZ - Return cassette buffer pointer (KERNAL ROM $F7D0)

**Summary:** Loads the cassette buffer pointer from the zero-page system variable TAPE1 ($00B2/$00B3) into X/Y and checks allocation state with CPY #$02 (callers test carry/zero). Mnemonics: LDX/LDY/CPY/RTS; addresses: $F7D0, $00B2, $00B3.

## Description
This KERNAL routine (entry $F7D0, label ZZZ) returns the cassette buffer pointer stored in the system variable TAPE1:

- Loads X with the low byte at $00B2 (TAPE1) and Y with the high byte at $00B3 (TAPE1+1).
- Compares Y with #$02 using CPY #$02 to determine allocation: a value of 0 or 1 denotes the buffer is de-allocated.
  - (CPY sets Carry if Y >= #$02; Carry clear indicates de-allocated.)
  - Callers branch on the carry/zero flags to react to allocation state.
- Returns with X/Y holding the pointer bytes (low/high) and executes RTS.

The routine makes no other side effects beyond loading X/Y and setting processor flags from the CPY.

## Source Code
```asm
                                ;FUNCTION TO RETURN TAPE BUFFER
                                ;ADDRESS IN TAPE1
                                ;
.,F7D0 A6 B2    LDX $B2         ZZZ    LDX TAPE1       ;ASSUME TAPE1
.,F7D2 A4 B3    LDY $B3         LDY    TAPE1+1
.,F7D4 C0 02    CPY #$02        CPY    #>BUF           ;CHECK FOR ALLOCATION...
                                ;...[TAPE1+1]=0 OR 1 MEANS DEALLOCATED
                                ;...C CLR => DEALLOCATED
.,F7D6 60       RTS             RTS
```

## Key Registers
- $00B2 - Zero Page - TAPE1 (cassette buffer pointer low byte)
- $00B3 - Zero Page - TAPE1+1 (cassette buffer pointer high byte, used for allocation check)
- $F7D0 - ROM (KERNAL) - entry point for "Return cassette buffer pointer" routine

## References
- "ldad1_compute_start_end_addresses" — expands on called-by LDAD1 to get the cassette pointer
- "tape_header_write_tapeh" — expands on called-by TAPEH to verify the tape buffer is allocated

## Labels
- ZZZ
- TAPE1
