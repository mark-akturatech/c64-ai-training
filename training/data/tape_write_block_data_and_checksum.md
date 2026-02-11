# Tape write — block data read and checksum handling (ROM $FC30-$FC4C)

**Summary:** ROM routine at $FC30-$FC4C that, after sync bytes, reads the next data byte from the buffer via the zero-page pointer ($AC/$AD), updates the running checksum ($D7), stores the byte to the tape-write holding location ($BD), and calls pointer-check/increment helpers (JSR $FCD1, JSR $FCDB). Handles final-checksum send when the buffer is exhausted.

## Operation
This routine is invoked once tape sync bytes are finished and the actual block data must be sent.

- Entry: JSR $FCD1 — call the pointer-check routine which returns flags indicating buffer position (source: "return Cb = 1 if pointer >= end").
- If carry is clear (BCC $FC3F) the buffer is not finished; branch to fetch the next data byte.
- If carry is set, control falls through. A BNE $FBC8 follows; per original comments this distinguishes pointer > end vs pointer == end:
  - If pointer > end, branch to $FBC8 to flag block done and exit the interrupt.
  - If pointer == end, the block is complete and the checksum byte must be written:
    - INC $AD increments the buffer pointer high byte to force subsequent checks to indicate "done" without low-byte wrapping concerns.
    - LDA $D7 / STA $BD loads the checksum into the tape-write byte ($BD).
    - BCS $FC09 restores registers and exits the interrupt (comment notes this branch is always taken for the exit).
- When not finished:
  - LDY #$00; LDA ($AC),Y — fetch the next byte from the buffer using the zero-page pointer at $AC/$AD (indirect,Y).
  - STA $BD — store fetched byte as the next tape write byte.
  - EOR $D7; STA $D7 — XOR into the running checksum and store it back in $D7.
  - JSR $FCDB — call the pointer-increment routine to advance the buffer pointer.
  - D0 BB (BNE $FC09) — restore registers and exit the interrupt (comment notes branch always).

Registers/variables used (zero page):
- $AC/$AD — buffer pointer (indirect address for LDA ($AC),Y)
- $BD — tape write byte (output holding register)
- $D7 — running checksum byte

Routines called:
- $FCD1 — pointer-check routine (sets flags/carry as described above)
- $FCDB — pointer-increment routine

Notes:
- The code ensures that when the checksum byte is to be sent, the buffer pointer is advanced (INC $AD) so future pointer-checks do not accidentally treat a wrapped low byte as not finished.
- Comments in the original listing state some branches are "always" taken; those are used to restore registers and return from the interrupt handler.

## Source Code
```asm
.,FC30 20 D1 FC JSR $FCD1       ; check read/write pointer, return Cb = 1 if pointer >= end
.,FC33 90 0A    BCC $FC3F       ; if not all done yet go get the byte to send
.,FC35 D0 91    BNE $FBC8       ; if pointer > end go flag block done and exit interrupt
                                ; else the block is complete, it only remains to write the
                                ; checksum byte to the tape so setup for that
.,FC37 E6 AD    INC $AD         ; increment buffer pointer high byte, force block-done next time
.,FC39 A5 D7    LDA $D7         ; get checksum byte
.,FC3B 85 BD    STA $BD         ; save checksum as tape write byte
.,FC3D B0 CA    BCS $FC09       ; restore registers and exit interrupt, branch always
                                ; the block isn't finished so get the next byte to write to tape
.,FC3F A0 00    LDY #$00        ; clear index
.,FC41 B1 AC    LDA ($AC),Y     ; get byte from buffer
.,FC43 85 BD    STA $BD         ; save as tape write byte
.,FC45 45 D7    EOR $D7         ; XOR with checksum byte
.,FC47 85 D7    STA $D7         ; save new checksum byte
.,FC49 20 DB FC JSR $FCDB       ; increment read/write pointer
.,FC4C D0 BB    BNE $FC09       ; restore registers and exit interrupt, branch always
```

## Key Registers
- $AC - Zero Page - Buffer pointer low byte (used by LDA ($AC),Y)
- $AD - Zero Page - Buffer pointer high byte
- $BD - Zero Page - Next tape write byte (output holding)
- $D7 - Zero Page - Running checksum byte
- $FCD1 - ROM routine - pointer-check routine (returns carry set if pointer >= end)
- $FCDB - ROM routine - pointer-increment routine

## References
- "tape_write_shift_count_and_new_byte_setup" — expands on continuation: when sync bytes are finished this chunk reads and processes block data
- "tape_write_parity_send" — expands on parity-bit sending when all data bits of a byte are done

## Labels
- AC
- AD
- BD
- D7
