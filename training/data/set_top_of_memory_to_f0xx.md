# Set top-of-memory high byte to $F0 (helper)

**Summary:** Small KERNAL helper routine that forces the system "top of memory" high byte to $F0 by executing SEC; LDA #$F0; JMP $FE2D. Used when RS232 buffer allocation must place buffers in the $F000 page. Matches code at $F47D and jumps to vector $FE2D.

## Purpose
Force the system top-of-memory high byte to $F0 so allocated buffers (for example, RS232 buffers) can reside in the $F000 page. The routine performs the three-instruction sequence and then JMPs to the KERNAL/vector handler at $FE2D which finalizes the top-of-memory and returns to the caller.

## Operation
- SEC — set the carry flag (instruction present in source; likely part of the calling convention expected by the finalizing vector).
- LDA #$F0 — load accumulator with the desired high byte ($F0) for the top-of-memory pointer.
- JMP $FE2D — jump to the KERNAL/vector entry at $FE2D which completes setting the top-of-memory and returns.

The routine itself does not explicitly store the value into system zero-page pointers; it relies on the vector at $FE2D to read A (and possibly the carry) and perform the actual top-of-memory update and return.

## Source Code
```asm
.; Set the top of memory to F0xx
.,F47D 38       SEC             ; set carry (conventionally read top-of-memory)
.,F47E A9 F0    LDA #$F0        ; load high byte $F0 (target $F000 page)
.,F480 4C 2D FE JMP $FE2D       ; jump to KERNAL/vector that finalizes top-of-memory
```

## References
- "open_rs232_device_and_buffer_setup" — expands on Called when RS232 open needs to set buffers in the $F000 page
