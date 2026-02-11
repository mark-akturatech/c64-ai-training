# Wait-for-PLAY/RECORD routine (ROM $F838–$F83F)

**Summary:** Small KERNAL wait-for-PLAY/RECORD loop at $F838 that calls the cassette-sense helper (JSR $F82E) which returns the cassette switch status in the Z flag; if the switch is open it sets Y=#$2E and branches to the message/display/wait routine at $F81E to show "PRESS RECORD & PLAY ON TAPE" and poll until the switch closes.

**Description**
This ROM fragment implements the blocking wait used before starting a cassette write. Behavior details:
- JSR $F82E is the canonical cassette-sense helper; it returns with the zero flag set or clear to indicate the cassette switch status (the code here treats Z=1 as "switch closed").
- BEQ $F836 (taken when Z=1) exits the wait path — i.e., no prompt is required when the cassette switch is already closed.
- If the switch is open, code loads Y with #$2E (index for the string "PRESS RECORD & PLAY ON TAPE") and uses BNE to unconditionally branch to $F81E, which performs the message display and loops until the cassette switch closes.
- The LDY/BNE pair is a compact way to both set the message index and jump to the display/wait routine in one instruction sequence.
- This routine is always reached via the write-initiation path and always uses the cassette-sense helper + display flow.

## Source Code
```asm
.,F838 20 2E F8 JSR $F82E       ; return the cassette sense in Zb
.,F83B F0 F9    BEQ $F836       ; exit if switch closed
                                ; cassette switch was open
.,F83D A0 2E    LDY #$2E        
                                ; index to "PRESS RECORD & PLAY ON TAPE"
.,F83F D0 DD    BNE $F81E       ; display message and wait for switch, branch always

; Cassette-sense helper at $F82E
.,F82E AD 01 DC LDA $DC01       ; read CIA1 port A
.,F831 29 10    AND #$10        ; mask cassette sense bit
.,F833 60       RTS             ; return with Z flag set if switch closed

; Display/wait routine at $F81E
.,F81E 20 2F F1 JSR $F12F       ; display message indexed by Y
.,F821 20 D0 F8 JSR $F8D0       ; check for STOP key
.,F824 20 2E F8 JSR $F82E       ; check cassette sense
.,F827 D0 F8    BNE $F821       ; loop until switch closed
.,F829 A0 6A    LDY #$6A        ; index to "PRESS PLAY ON TAPE"
.,F82B 4C 2F F1 JMP $F12F       ; display message and exit

; Message display routine at $F12F
.,F12F 84 02    STY $02         ; store message index
.,F131 A9 00    LDA #$00
.,F133 85 03    STA $03         ; clear high byte of pointer
.,F135 A5 02    LDA $02
.,F137 0A       ASL
.,F138 0A       ASL
.,F139 0A       ASL
.,F13A 0A       ASL             ; multiply index by 16
.,F13B 85 02    STA $02
.,F13D A9 F0    LDA #$F0
.,F13F 85 03    STA $03         ; set high byte to $F0
.,F141 20 1D F1 JSR $F11D       ; print message
.,F144 60       RTS

; Print message routine at $F11D
.,F11D B1 02    LDA ($02),Y     ; load character from message
.,F11F F0 0A    BEQ $F12B       ; exit if null terminator
.,F121 20 D2 FF JSR $FFD2       ; output character
.,F124 C8       INY             ; increment index
.,F125 D0 F6    BNE $F11D       ; loop
.,F127 E6 03    INC $03         ; increment high byte of pointer
.,F129 D0 F2    BNE $F11D       ; loop
.,F12B 60       RTS             ; return

; Message table at $F0E7
.,F0E7 0D 50 52 45 53 53 20 52 45 43 4F 52 44 20 26 20
.,F0F7 50 4C 41 59 20 4F 4E 20 54 41 50 45 00
; "PRESS RECORD & PLAY ON TAPE" (index $2E)

.,F106 0D 50 52 45 53 53 20 50 4C 41 59 20 4F 4E 20 54
.,F116 41 50 45 00
; "PRESS PLAY ON TAPE" (index $6A)
```

## Key Registers
- **$DC01**: CIA1 Port A Data Register — bit 4 (mask #$10) reflects the cassette sense switch status; 0 when pressed (closed), 1 when released (open).

## References
- "cassette_sense_return" — expands on called to read the cassette switch status
- "initiate_tape_write" — expands on invoked by the write initiation path before starting a write

## Labels
- $DC01
