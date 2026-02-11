# GETIN wrapper at $FFE4 (JMP ($032A))

**Summary:** GETIN wrapper at $FFE4 performs an indirect JMP through the KERNAL vector $032A (JMP ($032A)); this dispatches to the current device's GET handler. For most devices it behaves like CHRIN ($FFCF); for the keyboard it returns 0 in A when the keyboard buffer is empty and depends on the IRQ scanner to fill that buffer.

## Description
$FFE4 is a small KERNAL wrapper that indirect-jumps to the GETIN vector stored at $032A/$032B. The CPU loads the 16-bit little-endian address from $032A and transfers control to that address, so the active input device can supply a character.

Behavior specifics from the ROM comments:
- The routine is intended to "get character from input device".
- For all devices except the keyboard it operates identically to CHRIN ($FFCF).
- When the keyboard is the current input device the handler will pull a single character from the keyboard buffer (filled by the IRQ keyboard-scanning routine). If the buffer is empty the value returned in the accumulator will be zero.
- The result is returned in the accumulator (A).

Because this is a vectored entry, device handlers can be changed by updating the word at $032A. The wrapper itself contains no logic other than the JMP ($032A) indirection.

(Technical note: JMP ($032A) fetches the low byte from $032A and the high byte from $032B and jumps to that address.)

## Source Code
```asm
; Fully commented ROM disassembly excerpt
; Wrapper at $FFE4 that JMPs ($032A) to get a character from the input device (GETIN).
; For keyboard this behaves like CHRIN but returns 0 if buffer empty.
                                *** get character from input device
                                in practice this routine operates identically to the CHRIN routine, $FFCF,
                                for all devices except for the keyboard. If the keyboard is the current input
                                device this routine will get one character from the keyboard buffer. It depends
                                on the IRQ routine to read the keyboard and put characters into the buffer.
                                If the keyboard buffer is empty the value returned in the accumulator will be zero.
.,FFE4 6C 2A 03 JMP ($032A)     do get character from input device
```

## References
- "kernal_vectors_list" — expands on the GETIN vector at $032A and other KERNAL vectors
- CHRIN ($FFCF) — referenced behavior comparison in source

## Labels
- GETIN
