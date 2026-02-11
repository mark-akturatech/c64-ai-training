# input a character from channel (ROM $F157)

**Summary:** ROM routine at $F157 that dispatches character input based on the device number stored in $0099. It handles input from the keyboard, screen, RS-232, tape, and IEC/serial-bus devices. Key operations include saving cursor positions, preparing screen parameters, reading tape bytes, and managing end-of-input conditions.

**Description**
Entry: LDA $99 — device number for the open channel.

Behavioral dispatch:
- **Device = $00 (keyboard):** Save current cursor column/row ($00D3/$00D6) into input-cursor variables ($00CA/$00C9), then JMP $E632 to the shared screen/keyboard input entry.
- **Device = $03 (screen):** Store the device number into $00D0 (used: $xx = screen, $00 = keyboard), copy current screen line length from $00D5 into $00C8 (input EOL pointer), then JMP $E632 to the same shared input entry.
- **Device > $03:** Branch to IEC/serial-bus device handling at $F1AD (handles IEC peripheral devices).
- **Device < $03 and = $02:** Branch to RS-232 handler at $F1B8 (serial/RS-232 device input routine).
- **Remaining case (tape device):** Routing to tape-byte routine:
  - Preserve X in $0097.
  - JSR $F199 to get a tape byte; if carry set (error), branch to error-exit sequence.
  - PHA to save the returned byte and JSR $F199 again to get the next byte; if carry set, branch to error-exit.
  - At $F186, the BNE instruction checks if the byte read is zero. If it is zero (indicating end-of-input), the routine sets the EOI (End Of Input) flag by calling JSR $FE1C, which ORs $40 into the serial status byte.
  - DEC $00A6 decrements the tape buffer index.
  - Restore X from $0097, PLA to restore the saved byte, and RTS.
  - Error exit path clears/restores registers and returns (TAX/PLA/TXA/LDX/RTS sequence).

Notes on flow and flags:
- The routine uses the zero-page device number at $0099 to select the input source.
- Screen vs. keyboard selection shares a common entry at $E632 after setup.
- Tape input sequence relies on JSR $F199 to read bytes and uses the carry flag to detect errors; EOI handling sets the $40 bit into the serial status via $FE1C.
- The code saves and restores X in $0097 and uses the stack to hold temporary byte data between JSRs.
- The branch at $F186 checks if the byte read is zero to detect the end-of-input condition.

## Source Code
```asm
.,F157 A5 99    LDA $99         ; get the input device number
.,F159 D0 0B    BNE $F166       ; if not the keyboard, continue
                                ; the input device was the keyboard
.,F15B A5 D3    LDA $D3         ; get the cursor column
.,F15D 85 CA    STA $CA         ; set the input cursor column
.,F15F A5 D6    LDA $D6         ; get the cursor row
.,F161 85 C9    STA $C9         ; set the input cursor row
.,F163 4C 32 E6 JMP $E632       ; input from screen or keyboard
                                ; the input device was not the keyboard
.,F166 C9 03    CMP #$03        ; compare device number with screen
.,F168 D0 09    BNE $F173       ; if not screen, continue
                                ; the input device was the screen
.,F16A 85 D0    STA $D0         ; input from keyboard or screen, $xx = screen,
                                ; $00 = keyboard
.,F16C A5 D5    LDA $D5         ; get current screen line length
.,F16E 85 C8    STA $C8         ; save input [EOL] pointer
.,F170 4C 32 E6 JMP $E632       ; input from screen or keyboard
                                ; the input device was not the screen
.,F173 B0 38    BCS $F1AD       ; if input device > screen, go do IEC devices
                                ; the input device was < screen
.,F175 C9 02    CMP #$02        ; compare the device with the RS232 device
.,F177 F0 3F    BEQ $F1B8       ; if RS232 device, go get a byte from the RS232 device
                                ; only the tape device left...
.,F179 86 97    STX $97         ; save X
.,F17B 20 99 F1 JSR $F199       ; get a byte from tape
.,F17E B0 16    BCS $F196       ; if error, just exit
.,F180 48       PHA             ; save the byte
.,F181 20 99 F1 JSR $F199       ; get the next byte from tape
.,F184 B0 0D    BCS $F193       ; if error, just exit
.,F186 D0 05    BNE $F18D       ; if end reached (byte read is zero)
.,F188 A9 40    LDA #$40        ; set EOI
.,F18A 20 1C FE JSR $FE1C       ; OR into the serial status byte
.,F18D C6 A6    DEC $A6         ; decrement tape buffer index
.,F18F A6 97    LDX $97         ; restore X
.,F191 68       PLA             ; restore the saved byte
.,F192 60       RTS             
.,F193 AA       TAX             ; copy the error byte
.,F194 68       PLA             ; dump the saved byte
.,F195 8A       TXA             ; restore error byte
.,F196 A6 97    LDX $97         ; restore X
.,F198 60       RTS             
```

## Key Registers
- $0099 - RAM - input device number for channel dispatch (0=keyboard, 2=RS-232, 3=screen, others -> IEC/tape)
- $0097 - RAM - saved X (temporary storage during tape read)
- $00A6 - RAM - tape buffer index (decremented on successful tape read)
- $00C8 - RAM - input EOL pointer (set from $00D5 for screen input)
- $00C9 - RAM - saved input cursor row (destination for $00D6)
- $00CA - RAM - saved input cursor column (destination for $00D3)
- $00D0 - RAM - input source flag (stored device number when screen selected)
- $00D3 - RAM - cursor column (copied to $00CA for keyboard input)
- $00D5 - RAM - current screen line length (copied to $00C8 for screen input)
- $00D6 - RAM - cursor row (copied to $00C9 for keyboard input)

## References
- "get_character_from_input_device" — expands on lower-level input-device selection and keyboard handling
- "tape_get_byte_routine" — expands on called routine when input device is tape ($F199)
- "serial_bus_input_check_and_dispatch" — expands on called routine when input device is the serial bus (IEC)
- "rs232_device_input_handling_loop" — expands on called routine for RS-232 device input