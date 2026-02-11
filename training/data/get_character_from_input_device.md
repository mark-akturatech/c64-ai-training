# KERNAL: Get character from current input device ($F13E)

**Summary:** KERNAL ROM routine at $F13E reads the selected input device number ($99), returns a character in A when available from keyboard buffer ($C6) or RS-232 Rx routine ($F086), preserves Y across the RS-232 call (saved to $97), and uses CLC/RTS to indicate "no byte/no-error". Contains references to RS-232 Rx and keyboard-buffer routines.

**Behavior and flow**
- Entry: LDA $99 — read the current input device number (zero-page $99).
- If $99 == 0 (keyboard):
  - LDA $C6 — load keyboard buffer index/counter.
  - BEQ $F155 — if buffer index is zero (buffer empty), branch to flag no-byte/no-error (CLC; RTS).
  - Otherwise SEI (disable interrupts) then JMP $E5B4 — transfer control to the keyboard-buffer retrieval routine (does the actual byte removal and return). This path does not return to $F13E (JMP).
- If $99 != 0:
  - CMP #$02 — test for RS-232 device (device number 2).
  - BNE $F166 — if not RS-232, branch to handle other devices.
  - For RS-232:
    - STY $97 — save Y (zero-page $97) before calling RS-232 routine.
    - JSR $F086 — call RS-232 Rx routine to fetch one byte (returns its byte in A).
    - LDY $97 — restore Y from $97.
    - Execution falls through to $F155.
- $F155: CLC — clear carry to indicate "no error" or success/no-byte status (used by the calling convention).
- $F156: RTS — return to caller.

Notes:
- The routine returns a character in A when one is retrieved (keyboard path via $E5B4 or RS-232 via $F086). When no character is available, the routine clears carry and returns without placing a valid byte in A.
- The routine saves/restores Y around the RS-232 JSR by storing Y to zero page $97; X is not saved/restored here.
- Interrupts are disabled (SEI) just before jumping into the keyboard buffer handler — likely to protect buffer manipulation during the read.

**[Note: Source may contain an error — the header text claimed "preserves index registers" but the code saves/restores Y only (STY/LDY $97); X is not preserved in this snippet.]**

## Source Code
```asm
.,F13E A5 99    LDA $99         ; get the input device number
.,F140 D0 08    BNE $F14A       ; if not the keyboard go handle other devices
                                ; the input device was the keyboard
.,F142 A5 C6    LDA $C6         ; get the keyboard buffer index
.,F144 F0 0F    BEQ $F155       ; if the buffer is empty go flag no byte and return
.,F146 78       SEI             ; disable the interrupts
.,F147 4C B4 E5 JMP $E5B4       ; get input from the keyboard buffer and return
                                ; the input device was not the keyboard
.,F14A C9 02    CMP #$02        ; compare the device with the RS232 device
.,F14C D0 18    BNE $F166       ; if not the RS232 device go handle other devices
                                ; the input device is the RS232 device
.,F14E 84 97    STY $97         ; save Y
.,F150 20 86 F0 JSR $F086       ; get a byte from RS232 buffer
.,F153 A4 97    LDY $97         ; restore Y
.,F155 18       CLC             ; flag no error
.,F156 60       RTS
```

## Key Registers
- $0099 - Zero Page (KERNAL ROM variable) - current input device number
- $00C6 - Zero Page (KERNAL ROM variable) - keyboard buffer index/counter
- $0097 - Zero Page (KERNAL ROM variable) - temporary storage for Y across RS-232 call

## References
- "rs232_get_byte_from_rx_buffer" — expands on obtaining a byte when input device is RS-232
- "display_control_io_message_if_direct_mode" — expands on possible display/control messages during I/O operations