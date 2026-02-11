# Read next byte from tape buffer (KERNAL $F199-$F1AC)

**Summary:** KERNAL routine that returns the next byte from the tape buffer using zero-page pointer $B2 (indirect,Y) and index $A6; calls ROM helpers $F80D and $F841 to advance the buffer and to initiate tape reads. Returns with Carry clear = success, Carry set = error.

## Description
This routine retrieves the next available byte from the tape input buffer. Flow:

- JSR $F80D — "bump tape pointer" (advance the buffer pointer/state). The code immediately tests the Z flag produced by that call.
- BNE $F1A9 — if the bump routine indicates the buffer is not exhausted (non-zero result), branch to load the next byte.
- If the buffer was exhausted (zero result), JSR $F841 to initiate a tape read from the device. If that read helper sets the carry (BCS), propagate the error (exit with carry set).
- On successful initiation, clear A and store 0 to $A6 (tape buffer index) then loop back to bump the pointer; BEQ is used as an unconditional branch after LDA #$00 (since A==0).
- When a byte is available, LDA ($B2),Y loads the byte from the buffer via the zero-page pointer at $B2 (indirect,Y indexing) and CLC clears the carry (success), then RTS returns.

Return conventions:
- Carry clear on success (byte returned in A).
- Carry set on error (exit path via BCS $F1B4).

Zero page usage:
- $B2/$B3 form the base pointer for the tape buffer (used with LDA ($B2),Y).
- $A6 is used as the tape buffer index and is cleared when a read is initiated.

## Source Code
```asm
.,F199 20 0D F8    JSR $F80D       ; bump tape pointer
.,F19C D0 0B       BNE $F1A9       ; if not end get next byte and exit
.,F19E 20 41 F8    JSR $F841       ; initiate tape read
.,F1A1 B0 11       BCS $F1B4       ; exit if error flagged
.,F1A3 A9 00       LDA #$00        ; clear A
.,F1A5 85 A6       STA $A6         ; clear tape buffer index
.,F1A7 F0 F0       BEQ $F199       ; loop, branch always
.,F1A9 B1 B2       LDA ($B2),Y     ; get next byte from buffer
.,F1AB 18          CLC             ; flag no error
.,F1AC 60          RTS
```

## Key Registers
- $A6 - Zero Page - tape buffer index (cleared when initiating read)
- $B2-$B3 - Zero Page - pointer (low/high) to tape buffer, used with indirect,Y addressing
- $F80D - KERNAL ROM - helper: bump tape pointer / advance buffer (called)
- $F841 - KERNAL ROM - helper: initiate tape read from device (called)

## References
- "input_character_from_channel_device_dispatch" — expands on how the KERNAL obtains bytes from tape devices and invokes this routine