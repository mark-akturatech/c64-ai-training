# IRQ entry $EA31..$EA86

**Summary:** IRQ handler at $EA31..$EA86 — calls the OS real-time clock increment ($FFEA), handles cursor flashing (uses $CC/$CD/$CF/$CE and screen/color pointers), controls the cassette motor via 6510 port $01 (cassette sense bit $10, motor bit $20, interlock $C0), calls the keyboard scan routine (JSR $EA87), clears CIA1 ICR ($DC0D) and restores registers before RTI.

## IRQ flow and behavior
This ROM IRQ entry performs these steps in order:

- Increment the real-time clock
  - JSR $FFEA — uses the KERNAL routine that advances the real-time clock.

- Cursor flashing (only when enabled)
  - Reads cursor enable flag at $CC; if $CC == $00, the flash code is skipped.
  - Decrements countdown at $CD; if $CD not zero after DEC, skip flashing.
  - If counted out, reload $CD with #$14 (LDA #$14; STA $CD).
  - Load cursor column from $D3 into Y (LDY $D3).
  - LSR $CF shifts bit0 of $CF into the carry (cursor blink phase).
  - Read character under cursor: LDA ($D1),Y where $D1 is the screen pointer (zero-page pointer).
  - Branch on carry (BCS) — if cursor-phase bit was 1, branch to flip behavior accordingly.
    - If carry was 0, INC $CF to set the blink phase to 1.
  - Save the character under the cursor to $CE (STA $CE).
  - Call the colour-pointer helper (JSR $EA24) to prepare the colour RAM pointer.
  - Read the colour RAM byte via LDA ($F3),Y and save it to $0287 (STA $0287).
  - Load current colour code from $0286 (LDX $0286).
  - Toggle bit 7 of the saved character with EOR #$80 (this flips the high bit; toggles the visible cursor state).
  - Call the routine to write the modified character and its colour back to screen (JSR $EA1C).

- Cassette motor control (uses 6510 port $01 and interlock $C0)
  - Read 6510 I/O port at $01 (LDA $01).
  - Mask with #$10 (AND #$10) — the cassette switch sense bit.
  - If the cassette sense is high (switch open), then:
    - Clear interlock $C0 (STY $C0 with Y=#$00).
    - Read $01 again, ORA #$20 to turn the motor off (set motor bit), and store back to $01.
  - If the cassette sense is low (switch closed), then:
    - Check interlock $C0; if nonzero, skip turning motor on.
    - Otherwise read $01, AND #$1F to turn motor on (clear motor bit), then STA $01 to save.

- Keyboard scan
  - JSR $EA87 — call the keyboard scanning routine.

- Clear CIA1 interrupt flag
  - LDA $DC0D — reading CIA1 ICR clears the timer interrupt flag for VIA1.

- Restore registers from stack and return
  - PLA; TAY  — restore Y
  - PLA; TAX  — restore X
  - PLA       — restore A
  - RTI       — return from interrupt

## Source Code
```asm
.,EA31 20 EA FF JSR $FFEA       ; increment the real time clock
.,EA34 A5 CC    LDA $CC         ; get the cursor enable, $00 = flash cursor
.,EA36 D0 29    BNE $EA61       ; if flash not enabled skip the flash
.,EA38 C6 CD    DEC $CD         ; decrement the cursor timing countdown
.,EA3A D0 25    BNE $EA61       ; if not counted out skip the flash
.,EA3C A9 14    LDA #$14        ; set the flash count
.,EA3E 85 CD    STA $CD         ; save the cursor timing countdown
.,EA40 A4 D3    LDY $D3         ; get the cursor column
.,EA42 46 CF    LSR $CF         ; shift b0 cursor blink phase into carry
.,EA44 AE 87 02 LDX $0287       ; get the colour under the cursor
.,EA47 B1 D1    LDA ($D1),Y     ; get the character from current screen line
.,EA49 B0 11    BCS $EA5C       ; branch if cursor phase b0 was 1
.,EA4B E6 CF    INC $CF         ; set the cursor blink phase to 1
.,EA4D 85 CE    STA $CE         ; save the character under the cursor
.,EA4F 20 24 EA JSR $EA24       ; calculate the pointer to colour RAM
.,EA52 B1 F3    LDA ($F3),Y     ; get the colour RAM byte
.,EA54 8D 87 02 STA $0287       ; save the colour under the cursor
.,EA57 AE 86 02 LDX $0286       ; get the current colour code
.,EA5A A5 CE    LDA $CE         ; get the character under the cursor
.,EA5C 49 80    EOR #$80        ; toggle b7 of character under cursor
.,EA5E 20 1C EA JSR $EA1C       ; save the character and colour to the screen @ the cursor
.,EA61 A5 01    LDA $01         ; read the 6510 I/O port
.,EA63 29 10    AND #$10        ; mask 000x 0000, the cassette switch sense
.,EA65 F0 0A    BEQ $EA71       ; if the cassette sense is low skip the motor stop
                                ; the cassette sense was high, the switch was open, so turn
                                ; off the motor and clear the interlock
.,EA67 A0 00    LDY #$00        ; clear Y
.,EA69 84 C0    STY $C0         ; clear the tape motor interlock
.,EA6B A5 01    LDA $01         ; read the 6510 I/O port
.,EA6D 09 20    ORA #$20        ; mask xxxx xx1x, turn off the motor
.,EA6F D0 08    BNE $EA79       ; go save the port value, branch always
                                ; the cassette sense was low so turn the motor on, perhaps
.,EA71 A5 C0    LDA $C0         ; get the tape motor interlock
.,EA73 D0 06    BNE $EA7B       ; if the cassette interlock <> 0 don't turn on motor
.,EA75 A5 01    LDA $01         ; read the 6510 I/O port
.,EA77 29 1F    AND #$1F        ; mask xxxx xx0x, turn on the motor
.,EA79 85 01    STA $01         ; save the 6510 I/O port
.,EA7B 20 87 EA JSR $EA87       ; scan the keyboard
.,EA7E AD 0D DC LDA $DC0D       ; read VIA 1 ICR, clear the timer interrupt flag
.,EA81 68       PLA             ; pull Y
.,EA82 A8       TAY             ; restore Y
.,EA83 68       PLA             ; pull X
.,EA84 AA       TAX             ; restore X
.,EA85 68       PLA             ; restore A
.,EA86 40       RTI
```

## Key Registers
- $01 - 6510 - CPU port A (cassette sense bit = #$10, tape motor bit = #$20)
- $CC - zero page - cursor enable flag (nonzero = flash enabled)
- $CD - zero page - cursor timing countdown
- $CE - zero page - saved character under cursor
- $CF - zero page - cursor blink phase (bit0 shifted into carry)
- $D1 - zero page pointer - screen memory pointer used with Y (LDA ($D1),Y)
- $D3 - zero page - cursor column (loaded into Y)
- $F3 - zero page pointer - colour RAM pointer used with Y (LDA ($F3),Y)
- $0286-$0287 - RAM bytes used for current colour code / saved colour under cursor
- $DC0D - CIA1 - Interrupt Control Register (read to clear VIA1 timer interrupt)

## References
- "print_and_store_char_and_colour_at_cursor" — routine called at JSR $EA1C to write toggled cursor-character and colour to screen
- "calculate_colour_ram_pointer_ea24" — helper called at JSR $EA24 when manipulating the cursor colour byte
- "keyboard_scan_overview" — expands on the keyboard scan routine called via JSR $EA87

## Labels
- $CC
- $CD
- $CE
- $CF
- $D1
- $D3
- $F3
- $01
