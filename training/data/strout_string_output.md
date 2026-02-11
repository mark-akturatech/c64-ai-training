# STROUT ($AB1E)

**Summary:** STROUT ($AB1E) is a KERNAL routine that outputs a zero-terminated string located at the address specified by the Accumulator (low byte) and Y register (high byte). It calls CHROUT for each character. Invoke with `JSR $AB1E` (A=low byte, Y=high byte).

**Description**

STROUT prints a string pointed to by the 16-bit address formed from A (low byte) and Y (high byte). The string must be terminated with a zero byte; characters are emitted one at a time by calling CHROUT. The routine is part of the higher-level PRINT implementation (it is the subroutine used when a print statement needs to output a string whose address is in A and Y).

Calling convention:
- **Entry:** A = low byte of string address, Y = high byte of string address.
- **Behavior:** Reads bytes from the specified memory location, calls CHROUT for each non-zero byte, and stops when a zero byte is encountered.
- **Exit/Side-effects:**
  - **Registers:** A, X, and Y registers are preserved; processor status flags are affected.
  - **Pointer Advancement:** The A/Y pointer is advanced to the byte following the zero terminator upon return.
  - **Edge Cases:** Non-printable bytes are passed to CHROUT without filtering. If the address points to inaccessible memory, behavior is undefined and may cause a system crash.

## Source Code

```assembly
STROUT:
    STA $FB         ; Store low byte of string address
    STY $FC         ; Store high byte of string address
    LDY #$00        ; Initialize index register Y to 0
LOOP:
    LDA ($FB),Y     ; Load byte at address ($FB + Y)
    BEQ DONE        ; If zero terminator, exit loop
    JSR CHROUT      ; Output character
    INY             ; Increment index
    BNE LOOP        ; Repeat until zero terminator
DONE:
    RTS             ; Return from subroutine
```

## Key Registers

- **$AB1E** - KERNAL - STROUT: Print zero-terminated string (A = low byte, Y = high byte); uses CHROUT for output.

## References

- "print_statement" — expands on STROUT as a subroutine within PRINT for string output.

## Labels
- STROUT
