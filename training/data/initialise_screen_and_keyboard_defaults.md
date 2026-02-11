# Initialise screen and keyboard (C64 ROM $E518)

**Summary:** Sets up VIC-II via JSR $E5A0, clears shift-mode and cursor blink phase, stores keyboard decode pointer ($028F/$0290), keyboard buffer size ($0289), repeat delay/counters ($028C/$028B), default text colour ($0286), and cursor timing/enable ($00CD/$00CC). Contains exact STA/LDA opcodes and absolute addresses used by C64 KERNAL initialization.

## Description
This routine performs the initial setup of screen and keyboard state used by the KERNAL/ROM:

- JSR $E5A0 calls the VIC initialization routine (VIC-II register setup is performed there).
- $0291 is cleared to reset the shift-mode switch state.
- $00CF is cleared to reset the cursor blink phase (zero page location).
- The keyboard decode logic pointer is written as a 16-bit address: low byte to $028F and high byte to $0290.
- The keyboard buffer maximum size is set at $0289.
- The repeat delay counter initial value is stored at $028C.
- Default text colour is stored at $0286 (value $0E = light blue).
- The key repeat speed counter is stored at $028B (value $04).
- Cursor flash timing countdown is set at $00CD (zero page) and cursor enable flag at $00CC (zero page; $00 disables flash cursor).

All addresses are absolute C64 RAM locations as used by the ROM initialization (some are zero page: $00CF, $00CD, $00CC). Values written are exact bytes used by the ROM to initialise keyboard and screen state.

## Source Code
```asm
.,E518 20 A0 E5    JSR $E5A0       ; initialise the vic chip
.,E51B A9 00       LDA #$00        ; clear A
.,E51D 8D 91 02    STA $0291       ; clear the shift mode switch
.,E520 85 CF       STA $CF         ; clear the cursor blink phase
.,E522 A9 48       LDA #$48        ; get the keyboard decode logic pointer low byte
.,E524 8D 8F 02    STA $028F       ; save the keyboard decode logic pointer low byte
.,E527 A9 EB       LDA #$EB        ; get the keyboard decode logic pointer high byte
.,E529 8D 90 02    STA $0290       ; save the keyboard decode logic pointer high byte
.,E52C A9 0A       LDA #$0A        ; set the maximum size of the keyboard buffer
.,E52E 8D 89 02    STA $0289       ; save the maximum size of the keyboard buffer
.,E531 8D 8C 02    STA $028C       ; save the repeat delay counter
.,E534 A9 0E       LDA #$0E        ; set light blue
.,E536 8D 86 02    STA $0286       ; save the current colour code
.,E539 A9 04       LDA #$04        ; speed 4
.,E53B 8D 8B 02    STA $028B       ; save the repeat speed counter
.,E53E A9 0C       LDA #$0C        ; set the cursor flash timing
.,E540 85 CD       STA $CD         ; save the cursor timing countdown
.,E542 85 CC       STA $CC         ; save the cursor enable, $00 = flash cursor
```

## Key Registers
- $0291 - RAM - shift mode switch (cleared)
- $00CF - RAM (zero page) - cursor blink phase (cleared)
- $028F - RAM - keyboard decode pointer (low byte)
- $0290 - RAM - keyboard decode pointer (high byte)
- $0289 - RAM - keyboard buffer maximum size
- $028C - RAM - keyboard repeat delay counter
- $0286 - RAM - current text colour code (default $0E light blue)
- $028B - RAM - keyboard repeat speed counter
- $00CD - RAM (zero page) - cursor flash timing countdown
- $00CC - RAM (zero page) - cursor enable flag ($00 = flash cursor)

## References
- "initialise_vic_chip_registers" — VIC-II register initialization values and loop
- "build_line_start_table_and_clear_screen" — next step: build line-start table and clear the screen