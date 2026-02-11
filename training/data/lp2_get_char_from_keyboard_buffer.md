# LP2 — GET CHARACTER FROM KEYBOARD BUFFER ($E5B4..$E5C9)

**Summary:** KERNAL routine LP2 removes and returns the first character from the keyboard buffer using zero-page KERNAL variables KEYD ($0277) and NDX ($C6). It shifts the remaining queue bytes down (copying $0278+X → $0277+X), decrements the queue length (NDX), returns the removed byte in A, enables interrupts (CLI), clears carry (CLC) and RTS.

## Description
Assumes there is at least one character in the keyboard buffer. Operation sequence:

- LDY $0277 — read the first byte (KEYD) into Y (temporarily holding the removed character).
- LDX #$00 and loop:
  - LDA $0278,X — read the next byte from the buffer (byte at $0278 + X).
  - STA $0277,X — write it one position earlier ($0277 + X), effectively shifting the queue up.
  - INX; CPX $C6 — increment index and compare with NDX (number of characters).
  - BNE loop until all bytes have been moved.
- DEC $C6 — decrement NDX to reflect one fewer character in queue.
- TYA — transfer the saved first character into A for return.
- CLI — re-enable interrupts (routine assumes interrupts may have been disabled earlier).
- CLC — clear the carry flag on return.
- RTS — return to caller with removed character in A, NDX updated, interrupts enabled, carry clear.

Behavioral notes (from code):
- The removed character is returned in accumulator A.
- NDX ($C6) is decremented by one.
- Interrupts are explicitly enabled before return (CLI).
- Carry flag is cleared (CLC) before RTS.

## Source Code
```asm
.,E5B4 AC 77 02 LDY $0277       read KEYD, first character in keyboard buffer queue
.,E5B7 A2 00    LDX #$00
.,E5B9 BD 78 02 LDA $0278,X     overwrite with next in queue
.,E5BC 9D 77 02 STA $0277,X
.,E5BF E8       INX
.,E5C0 E4 C6    CPX $C6         compare with NDX, number of characters in queue
.,E5C2 D0 F5    BNE $E5B9       till all characters are moved
.,E5C4 C6 C6    DEC $C6         decrement NDX
.,E5C6 98       TYA             transfer read character to (A)
.,E5C7 58       CLI             enable interrupt
.,E5C8 18       CLC
.,E5C9 60       RTS
```

## Key Registers
- $0277 - KERNAL variable (KEYD) - first character in keyboard buffer queue (read into Y).
- $0278 - KERNAL keyboard buffer area - bytes following KEYD (source for shifting).
- $C6   - KERNAL variable (NDX) - number of characters currently in keyboard queue (queue length).

## References
- "input_from_keyboard" — expands on code paths that use this LP2 routine to fetch characters from the keyboard queue
- "input_from_screen_or_keyboard" — expands on the keyboard input path that calls LP2 when reading from the keyboard

## Labels
- LP2
- KEYD
- NDX
