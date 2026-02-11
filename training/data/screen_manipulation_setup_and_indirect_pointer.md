# MACHINE — Setup for screen manipulation (line length, screen page, zero-page indirect pointer)

**Summary:** Prepare line-length and screen-start pointers for multi-line screen updates on PET/CBM (screen at $8000) or VIC/Commodore 64 (screen page in $0288). Store screen start address low/high in zero page ($00BB/$00BC) and keep the line increment value (22/40/80 columns) in RAM ($03A0) so you can step an indirect pointer down lines.

**Description**
This chunk shows the minimal setup to:
- Pick the display line length (column count) as a byte (examples: $16 = 22, $28 = 40, $50 = 80).
- Pick the screen start page/address (PET/CBM absolute $8000; VIC/64 page read from $0288).
- Store the screen-start address as an indirect pointer in zero page (low byte at $00BB, high byte at $00BC).
- Store the line-length increment where convenient (example uses $03A0).
- Initialize a line counter in X (LDX #$00) to loop N lines.

Notes and behavior:
- The line-length value is used later when adding to the indirect screen pointer to move from one row to the next.
- The screen-start address will be used via indirect zero-page addressing (e.g., LDA ($BB),Y or STA ($BB),Y — requires $00BB/$00BC to hold the address).
- A NOP is shown as padding so code alignment/length is identical between PET and VIC variants; behavior is unchanged by the NOP.
- Choose the line-length constant appropriate to the target machine before assembling.

## Source Code
```asm
; Set line length (change per machine)
; 40-column machine:
        .A 033C  LDA #$28       ; 40 columns (decimal 40)
; 22-column machine:   LDA #$16 ; 22 columns
; 80-column PET:       LDA #$50 ; 80 columns

; Store line-length (increment) somewhere safe (not required to be zero page)
        .A 0341  STA $03A0      ; store increment (used later for stepping between rows)

; Screen page/address selection:
; PET/CBM (screen at $8000):
        .A 033E  LDX #$80       ; PET: high byte $80 -> screen at $8000
        .A 0340  NOP            ; pad so next code address identical for both machines

; VIC/Commodore 64 (screen page read from system location $0288):
;        .A 033E  LDX $0288    ; uncomment for VIC/64 variant — reads screen page value

; Store the screen page (high byte) into zero-page high byte of indirect pointer
        .A 0344  STX $00BC      ; zero page $00BC = high byte of screen start address

; Set low byte of screen-start pointer to zero (points at page start)
        .A 0346  LDA #$00
        .A 0348  STA $00BB      ; zero page $00BB = low byte (0 -> page offset 0)

; Initialize X as line counter (start at 0)
        .A 034A  LDX #$00
```

(Assembly addresses (.A xxxx) come from original listing and are for reference — remove or adjust as needed for your assembler.)

## Key Registers
- $03A0 - RAM - stored line-length increment (bytes per line: $16/$28/$50)
- $00BB-$00BC - Zero page - indirect pointer to screen start (low/high) for instructions using ($BB),Y / ($BB),X
- $0288 - RAM/system - VIC/Commodore screen page (read to get screen high byte for C64 variant)
- $8000 - PET/CBM - default screen memory start address (absolute)

## References
- "zero_page_management_hunt" — choose safe zero-page addresses for indirect pointers