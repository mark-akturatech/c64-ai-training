# KERNAL ROM: Good-exit Epilogue for Tape and IEEE ($F5A9-$F5AE)

**Summary:** KERNAL ROM epilogue at $F5A9-$F5AE performs a successful-load exit: clears the carry (CLC), loads end-of-load address low/high from zero-page variables EAL/EAH into X/Y, and returns with RTS. Contains mnemonics CLC, LDX, LDY, RTS and references zero-page $00AE/$00AF.

## Description
This short KERNAL routine is the common "good exit" path used after a successful tape or IEEE load. Sequence and purpose:

- CLC at $F5A9 clears the CPU carry flag to indicate a successful operation.
- LDX $AE / LDY $AF load the end-of-load address (EAL = $00AE, EAH = $00AF) into X and Y respectively, supplying the caller with the final address in X/Y.
- RTS returns to the caller.

Both the tape and IEEE load completion paths jump here after closing channels; this routine finalizes the successful return state expected by KERNAL callers.

## Source Code
```asm
        ; GOOD EXIT
F5A9   18        CLC             ; clear carry for a good exit
        ;
        ; SET UP END LOAD ADDRESS
        ;
F5AA   A6 AE     LDX $AE         ; LDX EAL (end address low)
F5AC   A4 AF     LDY $AF         ; LDY EAH (end address high)
        ;
F5AE   60        RTS             ; return
```

## Key Registers
- $F5A9-$F5AE - KERNAL ROM - Tape/IEEE successful-exit epilogue (CLC; LDX EAL; LDY EAH; RTS)
- $00AE - Zero page - EAL (end-of-load address low)
- $00AF - Zero page - EAH (end-of-load address high)

## References
- "tape_addressing_and_block_load" — expands on TRD block-load follow-up and end-address/result handling
- "ieee_receive_and_store_loop" — covers the IEEE receive/store path that jumps here after closing channels

## Labels
- EAL
- EAH
