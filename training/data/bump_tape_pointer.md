# Bump tape buffer pointer / increment active tape buffer index ($A6)

**Summary:** Increments the active tape buffer index at zero page $A6, compares the new index (LDY $A6 / CPY #$C0) against the tape buffer length #$C0 (192) and returns; calls ROM routine JSR $F7D0 (get_tape_buffer_start_pointer). Mnemonics: JSR/INC/LDY/CPY/RTS.

## Description
This small ROM routine advances the active tape buffer index and performs a bounds/ wrapping check against the buffer length:

- Calls get_tape_buffer_start_pointer (JSR $F7D0). The original inline comment indicates the routine returns the tape buffer start pointer in X and Y.
- Increments the zero-page byte $A6 (active tape buffer index).
- Loads Y from $A6, then compares Y with #$C0 (192 decimal), which is treated as the buffer length/limit.
- Returns (RTS). The CPY result will determine control flow in the caller (wrap/limit handling is not performed here).

**[Note: Source may contain an error — the JSR comment says it returns the pointer in Y, but LDY $A6 immediately overwrites Y; the CPY therefore compares the incremented $A6, not the Y returned by JSR.]**

## Source Code
```asm
.,F80D 20 D0 F7    JSR $F7D0      ; get tape buffer start pointer in XY
.,F810 E6 A6       INC $A6        ; increment tape buffer index
.,F812 A4 A6       LDY $A6        ; load Y from active tape buffer index
.,F814 C0 C0       CPY #$C0       ; compare with buffer length (192)
.,F816 60          RTS            ; return
```

## Key Registers
- $00A6 - Zero Page - active tape buffer index (incremented and compared)
- $F7D0 - ROM subroutine entry - get_tape_buffer_start_pointer (returns tape buffer start pointer in X/Y per source comment)

## References
- "get_tape_buffer_start_pointer" — covers the ROM routine called at $F7D0
- "find_specific_tape_header" — covers advancing to the next tape header when a name comparison fails