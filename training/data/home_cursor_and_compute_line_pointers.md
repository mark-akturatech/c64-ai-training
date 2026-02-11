# Home cursor and compute screen pointers (ROM $E566–$E598)

**Summary:** Homes the cursor (zeroes cursor row/column in zero page $00D3/$00D6), walks the logical-line start table at $00D9 indexed by row to compute screen pointers, calls the screen-address fetch routine (JSR $E9F0), sets current screen line length into $00D5, and jumps to the colour-RAM pointer calculation (JMP $EA24). Uses BMI to detect logical-line-start markers (sign-bit test).

## Operation
- Entry: homes the cursor by clearing Y and storing zero into $00D3 (cursor column) and $00D6 (cursor row).
- It then converts the cursor row/column into screen memory addresses by iterating through a logical-line start pointer table:
  - LDX is loaded with the cursor row ($00D6), LDA with the cursor column ($00D3).
  - LDY $00D9,X loads the high byte (or marker byte) for the start-of-line pointer for line X.
  - BMI is used to detect a logical-line-start marker (sign bit set) — if set, the code continues to fetch the screen address.
  - Otherwise the code clears carry and ADC #$28 (adds a line length value) to the column, stores it back to $00D3, decrements the row (DEX) and loops until a logical-line-start is found.
- Once a logical-line-start marker is found, JSR $E9F0 is invoked to fetch a screen address for the current row/column state.
- After the fetch:
  - LDA #$27 sets a line-length base value (literal #$27).
  - The code then increments the row (INX), reloads LDY $00D9,X and again tests BMI for logical-line-start; if not set it clears carry and ADC #$28 to add another line length and continues scanning forward, incrementing X until a logical-line-start is encountered.
  - When the forward scan completes the current computed line length is stored into $00D5.
  - The routine then JMPs $EA24 to calculate the pointer to colour RAM and return to the caller.
- There is an alternate path at $E591 that compares X with $00C9; if equal it returns with RTS, otherwise it JMPs $E6ED (alternate handling).

Notes:
- Logical-line-start detection uses BMI after LDY $00D9,X (sign-bit test).
- ADC #$28 and LDA #$27 are used to assemble line-length values (hex $28 = 40 decimal; hex $27 = 39 decimal).

## Source Code
```asm
.,E566 A0 00    LDY #$00        clear Y
.,E568 84 D3    STY $D3         clear the cursor column
.,E56A 84 D6    STY $D6         clear the cursor row

                                *** set screen pointers for cursor row, column
.,E56C A6 D6    LDX $D6         get the cursor row
.,E56E A5 D3    LDA $D3         get the cursor column
.,E570 B4 D9    LDY $D9,X       get start of line X pointer high byte
.,E572 30 08    BMI $E57C       if it is the logical line start continue
.,E574 18       CLC             else clear carry for add
.,E575 69 28    ADC #$28        add one line length
.,E577 85 D3    STA $D3         save the cursor column
.,E579 CA       DEX             decrement the cursor row
.,E57A 10 F4    BPL $E570       loop, branch always
.,E57C 20 F0 E9 JSR $E9F0       fetch a screen address
.,E57F A9 27    LDA #$27        set the line length
.,E581 E8       INX             increment the cursor row
.,E582 B4 D9    LDY $D9,X       get the start of line X pointer high byte
.,E584 30 06    BMI $E58C       if logical line start exit
.,E586 18       CLC             else clear carry for add
.,E587 69 28    ADC #$28        add one line length to the current line length
.,E589 E8       INX             increment the cursor row
.,E58A 10 F6    BPL $E582       loop, branch always
.,E58C 85 D5    STA $D5         save current screen line length
.,E58E 4C 24 EA JMP $EA24       calculate the pointer to colour RAM and return
.,E591 E4 C9    CPX $C9         compare it with the input cursor row
.,E593 F0 03    BEQ $E598       if there just exit
.,E595 4C ED E6 JMP $E6ED       else go ??
.,E598 60       RTS
```

## Key Registers
- $00D3 - Zero page - Cursor column (updated while converting to screen pointer)
- $00D6 - Zero page - Cursor row (index for scanning line-start table)
- $00D9 - Zero page - Line-start pointer table base (indexed by row: LDY $00D9,X)
- $00D5 - Zero page - Current screen line length (saved after computation)
- $00C9 - Zero page - Input cursor row used for comparison at $E591

## References
- "build_line_start_table_and_clear_screen" — expands on uses the line-start table created earlier
- "initialise_vic_chip_registers" — expands on VIC initialization called earlier during overall init