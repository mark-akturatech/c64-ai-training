# COPY BASIC — Machine-language LOAD/SAVE routines (listing)

**Summary:** Machine-language implementation of COPY's LOAD and SAVE using KERNAL calls JSR $FFC6/$FFC9 (OPEN), $FFE4/$FFB7 (read), $FFD2 (CHROUT/write), $FFCC (CLOSE); uses zero-page buffer/counters at $FB-$FE and indirect addressing LDA ($FD),Y / STA ($FB),Y.

**Description**
This chunk is a complete assembly listing for the COPY BASIC program's machine-language LOAD and SAVE transfer routines. The LOAD path opens device/channel 2 (JSR $FFC6), reads bytes with the KERNAL IN/READ sequence (JSR $FFE4 then JSR $FFB7), stores incoming bytes into the buffer pointed to by zero-page $FB using indirect indexed addressing (STA ($FB),Y), tracks length/position in zero page counters, and closes with JSR $FFCC. The SAVE path opens device/channel 2 (JSR $FFC9), reads bytes from memory via indirect indexed addressing (LDA ($FD),Y), outputs them via CHROUT (JSR $FFD2), compares the current Y against a counter at $FB to step through a block, increments block counters in $FE/$FC, and closes via JSR $FFCC when finished.

Registers and zero-page variables used:
- $FB — zero-page pointer low (used as base for indirect indexed reads/writes), also stores the current Y on LOAD before close.
- $FC — zero-page counter (compared to $FE on SAVE to determine end of file/block).
- $FD — zero-page pointer high/indirect pointer (used as source pointer for SAVE LDA ($FD),Y).
- $FE — zero-page block counter / length tracking.
- X, Y — index registers used to iterate bytes within a block; X is set to #$02 before OPEN (device channel parameter passed in A/X per BASIC call convention).

Flow highlights:
- LOAD:
  - LDX #$02, JSR $FFC6 to OPEN 2,8,2.
  - LDY #$00 and loop: JSR $FFE4 (read), STA ($FB),Y, JSR $FFB7 (read status), test bit 6 (AND #$40); if set, the record is ready to close; else INY and loop until Y wraps, then INC $FC and restart.
  - On READY, store Y into $FB, JSR $FFCC to CLOSE, RTS.
- SAVE:
  - LDX #$02, JSR $FFC9 to OPEN 2,8,2.
  - LDY #$00 and loop: LDA ($FD),Y, JSR $FFD2 (CHROUT), CPY $FB; if equal, branch to BREAK; else INY and loop; when Y wraps, INC $FE and restart.
  - BREAK: LDA $FE, CMP $FC; if not equal, continue output; else STY $FD (store Y into $FD?), JSR $FFCC to CLOSE, RTS.

**Note:** The zero-page variables ($FB-$FE) are utilized as follows:
- $FB/$FC: Pointer to the start of the memory area to be loaded or saved.
- $FD/$FE: Pointer to the end of the memory area to be loaded or saved.

Before invoking these routines, the calling code must initialize these zero-page pointers to define the memory range for the LOAD or SAVE operation. For example, to set up a LOAD operation for a memory block starting at $1000 and ending at $2000, the initialization would be:


This setup ensures that the LOAD routine knows the exact memory range to operate on.

## Source Code

```asm
    LDA #$00
    STA $FB
    LDA #$10
    STA $FC
    LDA #$00
    STA $FD
    LDA #$20
    STA $FE
```

```asm
; Machine-language listing used by COPY BASIC to emulate LOAD and SAVE

; LOAD
        LDX  #$02
        JSR  $FFC6       ; OPEN 2,8,2

LOAD:   LDY  #$00

READ:   JSR  $FFE4       ; IN
        STA  ($FB),Y
        JSR  $FFB7       ; READST
        AND  #$40
        BNE  READY
        INY
        BNE  READ
        INC  $FC
        JMP  LOAD

READY:  STY  $FB
        JSR  $FFCC       ; CLOSE 2
        RTS

; SAVE
        LDX  #$02
        JSR  $FFC9       ; OPEN 2,8,2

SAVE:   LDY  #$00

WRITE:  LDA  ($FD),Y
        JSR  $FFD2       ; CHROUT (OUT)
        CPY  $FB
        BEQ  BREAK
CONT:   INY
        BNE  WRITE
        INC  $FE
        JMP  SAVE

BREAK:  LDA  $FE
        CMP  $FC
        BNE  CONT

        STY  $FD
        JSR  $FFCC       ; CLOSE 2
        RTS
```

## Key Registers
- $00FB-$00FE - Zero Page - buffer pointer / counters used by LOAD/SAVE (base pointer, counters/length).
- $FFB7 - KERNAL - READST (read status after IN)  
- $FFC6 - KERNAL - OPEN (used by LOAD)  
- $FFC9 - KERNAL - OPEN (used by SAVE)  
- $FFD2 - KERNAL - CHROUT (character output / write)  
- $FFE4 - KERNAL - IN (read byte)  
- $FFCC - KERNAL - CLOSE (close channel)

## References
- "copy_file_source_annotation_and_conclusion" — expands on annotations and concluding remarks about this routine
- "getting_out_of_trouble_unscratching_file" — expands on subsequent chapter starts and context in the manual following this listing