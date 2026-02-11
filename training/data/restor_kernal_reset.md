# RESTOR: KERNAL RESET (continuation at $FD15)

**Summary:** Documents the KERNAL RESTOR routine, which resets system vectors to their default values by copying them from the ROM table at $FD30 to RAM locations $0314-$0333.

**Description**

The RESTOR routine is invoked via the KERNAL vector at $FF8A. Its primary function is to restore the system vectors to their default settings by copying them from the ROM-based table at $FD30 to the corresponding RAM locations at $0314-$0333.

The routine operates as follows:

1. **Initialize Pointers:**
   - Loads the X register with $30 and the Y register with $FD, setting the (X,Y) pair to point at the KERNAL vector table starting at $FD30.
   - Clears the carry flag (CLC) to indicate a "set" operation for the subsequent VECTOR routine.

2. **Invoke VECTOR Routine:**
   - Calls the VECTOR routine at $FD1A, which performs the actual copying of vectors from the ROM table to RAM.

3. **VECTOR Routine Details:**
   - The VECTOR routine uses the zero-page addresses $C3 and $C4 (referred to as MEMUSS) to temporarily store the source address during the copy operation.
   - It copies 32 bytes from the source table at $FD30 to the destination addresses at $0314-$0333.

The KERNAL vector table at $FD30 contains the default addresses for various system routines, including interrupt vectors and I/O operations. Restoring these vectors ensures that the system operates with the standard configuration.

## Source Code

```asm
; RESTOR routine at $FD15
FD15: A2 30       LDX #$30        ; Load X with $30
FD17: A0 FD       LDY #$FD        ; Load Y with $FD
FD19: 18          CLC             ; Clear carry to indicate "set" operation
FD1A: 20 1A FD    JSR $FD1A       ; Jump to VECTOR routine
FD1D: 60          RTS             ; Return from subroutine

; VECTOR routine at $FD1A
FD1A: 85 C3       STA $C3         ; Store A in MEMUSS low byte
FD1C: 84 C4       STY $C4         ; Store Y in MEMUSS high byte
FD1E: A0 1F       LDY #$1F        ; Set Y to 31 (number of vectors - 1)
FD20: B1 C3       LDA ($C3),Y     ; Load byte from source
FD22: 91 14       STA ($14),Y     ; Store byte to destination
FD24: 88          DEY             ; Decrement Y
FD25: 10 F9       BPL $FD20       ; Loop until all bytes are copied
FD27: 60          RTS             ; Return from subroutine
```

## Key Registers

- **$FF8A:** KERNAL vector entry for RESTOR.
- **$FD15-$FD1D:** Instructions for the RESTOR routine.
- **$FD1A-$FD27:** VECTOR routine that performs the vector copying.
- **$FD30-$FD4F:** KERNAL vector table containing default vector addresses.
- **$0314-$0333:** RAM locations where the vectors are restored.
- **$00C3-$00C4:** Zero-page addresses used as temporary storage (MEMUSS) during the copy operation.

## References

- "vector_kernal_move" — Details the VECTOR routine's functionality.
- "kernal_reset_vectors" — Describes the KERNAL vector table at $FD30.

## Labels
- RESTOR
- VECTOR
- MEMUSS
