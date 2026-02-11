# KERNAL: Read a byte from the keyboard buffer (shift buffer, return A)

**Summary:** KERNAL ROM routine that pulls the first character from the keyboard buffer at $0277/$0278, shifts remaining bytes down, decrements the buffer count at $00C6, returns the character in A (TYA), re-enables interrupts (CLI) and signals success by clearing the carry (CLC).

## Operation
This routine removes the oldest byte from the keyboard FIFO and compacts the buffer by copying each subsequent byte one position earlier.

- LDY $0277 loads the current (first) character into Y for later return.
- The loop (using X from #$00) copies bytes from $0278+X to $0277+X until X equals the buffer count in $00C6, effectively shifting the buffer contents down one slot.
- DEC $C6 decrements the buffer count (number of bytes in the buffer).
- TYA transfers the saved character (Y) into A for the caller.
- CLI re-enables interrupts (routine expects interrupts may have been disabled).
- CLC is used as the KERNAL success flag: carry clear = byte obtained (success). (KERNAL conventions: CLC = success, SEC = failure.)
- RTS returns to the caller.

Behavioral details preserved from the listing:
- Addresses: buffer bytes at $0277 (current slot) and $0278 (next slot), buffer length/count at $00C6.
- The shift is done in-place using STA $0277,X = store into $0277 + X, reading from $0278,X.
- The routine returns the removed byte in A and indicates success via the CPU carry flag cleared.

## Source Code
```asm
.; Read a character from the keyboard buffer: shift buffer down, decrement index, return key in A, re-enable interrupts, flag success.
.,E5B4 AC 77 02 LDY $0277       ; get the current character from the buffer
.,E5B7 A2 00    LDX #$00        ; clear the index
.,E5B9 BD 78 02 LDA $0278,X     ; get the next character,X from the buffer
.,E5BC 9D 77 02 STA $0277,X     ; save it as the current character,X in the buffer
.,E5BF E8       INX             ; increment the index
.,E5C0 E4 C6    CPX $C6         ; compare it with the keyboard buffer index
.,E5C2 D0 F5    BNE $E5B9       ; loop if more to do
.,E5C4 C6 C6    DEC $C6         ; decrement keyboard buffer index
.,E5C6 98       TYA             ; copy the key (from Y) to A
.,E5C7 58       CLI             ; enable interrupts
.,E5C8 18       CLC             ; flag got byte (carry clear = success)
.,E5C9 60       RTS             ; return
```

## Key Registers
- $0277-$0278 - RAM - keyboard buffer (first slot at $0277, next at $0278)
- $00C6 - RAM - keyboard buffer count/index (number of bytes in buffer)

## References
- "wait_for_key_and_autoload_run_sequence" — expands on the wait-for-key loop that uses this routine
- "input_from_screen_or_keyboard_loop" — related input-processing routines that consume/modify the keyboard buffer