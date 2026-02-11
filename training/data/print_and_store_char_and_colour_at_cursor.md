# Print routine at $EA13 — store character A and colour X

**Summary:** Disassembles the C64 ROM print routine at $EA13 that copies character A into Y, initializes a cursor countdown ($CD), calls $EA24 to compute the colour-RAM pointer, then writes the character to screen RAM via STA ($D1),Y and the colour to colour-RAM via STA ($F3),Y. Searchable terms: $EA13, $EA24, $CD, $D1, $F3, $D3, STA (indirect), TAY, TYA.

**Routine overview**
This small ROM routine prints a character (in A) and its colour (in X) at the current cursor position. Sequence:
- Save the character in Y (TAY).
- Initialize a cursor countdown counter at zero-page $CD.
- Call $EA24 to compute the pointer to the colour-RAM page for the current screen line.
- Restore the saved character (TYA).
- Load the cursor column from zero-page $D3 into Y.
- Store the character into screen RAM using the indirect zero-page pointer at $D1: STA ($D1),Y.
- Move the colour from X to A (TXA) and store it to colour RAM using the indirect pointer at $F3: STA ($F3),Y.
- Return (RTS).

Notes:
- STA ($D1),Y and STA ($F3),Y use zero-page indirect,Y addressing: the two-byte pointers at $D1/$D2 and $F3/$F4 should point to the base of the target screen/colour line calculated by $EA24.
- $CD is used as a cursor repeat/countdown timer; the disassembly sets it to $02 here (source comments question if $14 is usual).

## Source Code
```asm
.; print character A and colour X
.,EA13 A8       TAY             ; copy the character
.,EA14 A9 02    LDA #$02        ; set the count to $02 (comment in source: "usually $14 ??")
.,EA16 85 CD    STA $CD         ; save the cursor countdown
.,EA18 20 24 EA JSR $EA24       ; calculate the pointer to colour RAM
.,EA1B 98       TYA             ; get the character back

.; save the character and colour to the screen @ the cursor
.,EA1C A4 D3    LDY $D3         ; get the cursor column
.,EA1E 91 D1    STA ($D1),Y     ; save the character to screen RAM at (D1)+Y
.,EA20 8A       TXA             ; copy the colour to A
.,EA21 91 F3    STA ($F3),Y     ; save to colour RAM at (F3)+Y
.,EA23 60       RTS             ; return

.; set colour memory address parallel to screen
.,EA24 A5 D1    LDA $D1         ; load screen RAM base address low byte
.,EA26 85 F3    STA $F3         ; store as colour RAM base address low byte
.,EA28 A5 D2    LDA $D2         ; load screen RAM base address high byte
.,EA2A 29 03    AND #$03        ; mask to get relevant bits
.,EA2C 09 D8    ORA #$D8        ; set high bits to point to colour RAM
.,EA2E 85 F4    STA $F4         ; store as colour RAM base address high byte
.,EA30 60       RTS             ; return
```

## Key Registers
- $CD - zero page - cursor countdown / repeat-timer storage
- $D1 - zero page pointer (pair $D1/$D2) - screen RAM base pointer used by STA ($D1),Y
- $F3 - zero page pointer (pair $F3/$F4) - colour RAM base pointer used by STA ($F3),Y
- $D3 - zero page - cursor column (Y index for column within line)

## References
- "calculate_colour_ram_pointer_ea24" — called to compute the colour-RAM pointer for the current line before storing the colour byte
- Commodore 64 ROM Disassembly
- C64 ROM: Routine at E9FF
- C64 ROM: Routine at E56C
- C64 ROM: Routine at E000
- C64Addr
- Memory Map - C64-Wiki
- Commodore 64 memory map
- Zero page - C64-Wiki
- Page - C64-Wiki
- Commodore 64 memory map
- ROM Disassembly | Ultimate Commodore 64 Reference
- C64 ROM: Routine at ED40
- C64 ROM: Routine at E9FF
- C64 ROM: Routine at E56C
- C64 ROM: Routine at E000
- C64Addr
- Memory Map - C64-Wiki
- Commodore 64 memory map
- Zero page - C64-Wiki
- Page - C64-Wiki
- Commodore 64 memory map
- ROM Disassembly | Ultimate Commodore 64 Reference
- C64 ROM: Routine at ED40