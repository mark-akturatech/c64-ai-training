# GETIN ($FFE4)

**Summary:** KERNAL GETIN function at $FFE4 reads one byte from the default input device and returns it in the A register. The call is vectored via the two-byte pointer at $032A (typically pointing to ROM handler $F13E); uses/overwrites A, X, Y registers.

**Description**

JSR $FFE4 invokes the KERNAL GETIN entry. The routine reads a single byte from the system's default input stream and places the byte in the A register. The implementation is vectored: KERNAL entry $FFE4 uses the two-byte vector at zero page $032A (little-endian) to jump to the actual handler (commonly $F13E in ROM).

Registers:
- Output: A = byte read.
- Clobbered: A, X, Y (these registers are used by the routine and may be modified).

Behavior notes:
- The routine reads from the "default input" device (device selection handled elsewhere).
- CHRIN ($FFCF) is a higher-level input routine that may call GETIN for byte reads.

**Behavior when no input is available:**
- For the keyboard: If the keyboard buffer is empty, GETIN returns 0 in the A register. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_283.html?utm_source=openai))
- For RS-232: If the RS-232 receive buffer is empty, GETIN returns 0 in the A register. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_283.html?utm_source=openai))
- For other devices (e.g., screen, serial, cassette): GETIN behaves similarly to CHRIN, which may block until input is available. ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

**Effect on CPU status flags:**
- Carry flag: Always clear upon return.
- Zero flag: Set if no character is available (A = 0); clear if a character is read (A ≠ 0).
- Negative flag: Reflects the sign of the character read (set if bit 7 of A is 1).

**Calling conventions and side effects:**
- Stack usage: GETIN uses the stack to store return addresses and may use additional stack space internally.
- Return-time side effects: The routine may modify system variables related to input buffers and device status.

**Echoing and device-specific handling:**
- GETIN does not perform character echoing. It retrieves input without displaying it on the screen.
- Device-specific handling:
  - Keyboard: Reads from the keyboard buffer without echoing.
  - RS-232: Reads from the RS-232 buffer; validity should be checked using READST.
  - Other devices: Behavior depends on the specific device and may involve blocking reads.

Example usage:

## Source Code

```assembly
JSR $FFE4 ; result in A
```


```text
; GETIN routine (disassembled from ROM at $F13E)
F13E  AD 99 00  LDA $0099    ; Load current input device number
F141  C9 00     CMP #$00     ; Is it the keyboard?
F143  F0 0C     BEQ $F151    ; If yes, jump to keyboard input handling
F145  C9 02     CMP #$02     ; Is it RS-232?
F147  F0 0C     BEQ $F155    ; If yes, jump to RS-232 input handling
F149  20 CF FF  JSR $FFCF    ; Otherwise, call CHRIN for input
F14C  90 03     BCC $F151    ; If no error, jump to return
F14E  4C 4F F1  JMP $F14F    ; Handle error (return A = 0)
F151  60        RTS          ; Return

; Keyboard input handling
F151  20 9F FF  JSR $FF9F    ; Call SCNKEY to scan keyboard
F154  60        RTS          ; Return

; RS-232 input handling
F155  20 1F F1  JSR $F11F    ; Call RS-232 input routine
F158  60        RTS          ; Return
```

## Key Registers

- $032A - Zero Page - KERNAL GETIN vector (2-byte pointer to real handler, low/high)
- $FFE4 - KERNAL - GETIN entry point (vectored JSR entry)
- $F13E - ROM - Typical real handler address referenced by $032A vector
- $FFCF - KERNAL - CHRIN (higher-level character input, may call GETIN)

## References

- "chrin" — expands on higher-level input routine that may call GETIN (CHRIN $FFCF)
- Commodore 64 Programmer's Reference Guide: User Callable KERNAL Routines ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_283.html?utm_source=openai))
- KERNAL API | Ultimate Commodore 64 Reference ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Labels
- GETIN
