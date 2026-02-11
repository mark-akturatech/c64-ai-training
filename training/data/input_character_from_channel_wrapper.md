# CHRIN Wrapper at $FFCF (JMP ($0324))

**Summary:** Wrapper at $FFCF (opcode bytes 6C 24 03) performs JMP ($0324) to the CHRIN vector; it returns one input byte in A from the current input channel set by CHKIN ($FFC6). Keyboard input is handled specially: cursor turned on/blinking, line editing into the BASIC input buffer (up to 80 chars), then characters are returned one-by-one until the carriage return.

## Description
This ROM entry is a simple vectored wrapper located at $FFCF that indirect-jumps to the CHRIN vector stored at $0324. The actual CHRIN service routine (address taken from $0324/$0325) supplies a single byte from the currently selected input channel.

Behavior details preserved from the ROM comments:
- The active input channel is the one previously selected by CHKIN ($FFC6). If CHKIN has not selected another device, the keyboard is the input source.
- A single byte is returned in the accumulator (A).
- The input channel remains open after the call (it is not closed by this routine).
- Keyboard-specific handling (when the keyboard is the input channel):
  - The cursor is turned on and blinks until a carriage return is typed.
  - Line editing is supported; the logical input line (up to 80 characters) is stored in the BASIC input buffer.
  - After the line is entered and buffered, subsequent calls to CHRIN return the buffered characters one at a time. When the carriage return character is returned, the logical line has been completely processed; the next CHRIN call starts the process again.

The vector indirection at $0324 allows the CHRIN behavior to be redirected by changing the vector contents (common technique in the KERNAL).

## Source Code
```asm
; Fully commented ROM disassembly excerpt (CHRIN wrapper)
; wrapper at $FFCF that JMPs ($0324) to input a character from the current input channel (CHRIN)
;
; If CHKIN ($FFC6) has not been used to define another input channel the data is
; expected to be from the keyboard. The data byte is returned in the accumulator. The
; channel remains open after the call.
;
; Input from the keyboard is handled in a special way. First, the cursor is turned on
; and it will blink until a carriage return is typed on the keyboard. All characters
; on the logical line, up to 80 characters, will be stored in the BASIC input buffer.
; Then the characters can be returned one at a time by calling this routine once for
; each character. When the carriage return is returned the entire line has been
; processed. The next time this routine is called the whole process begins again.
.,FFCF 6C 24 03 JMP ($0324)     do input character from channel
```

## References
- "kernal_vectors_list" — expands on the CHRIN vector at $0324 and related KERNAL vectors

## Labels
- CHRIN
