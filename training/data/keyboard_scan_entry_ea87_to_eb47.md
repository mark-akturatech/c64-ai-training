# Keyboard scan routine entry at $EA87 (full scan, decode, repeat, buffer store)

**Summary:** Commodore 64 keyboard matrix scan and decode routine starting at $EA87; uses VIA1 DRA/DRB ($DC00/$DC01) to drive/read columns/rows, saves key count in $CB, handles SHIFT/CTRL/C= via $028D and an indirect JMP through $028F, selects decode table via pointer in $F5/$F6, implements repeat (counters at $028C/$028B) and writes decoded character into keyboard buffer $0277 using index $C6. Mnemonics shown: LDA/STA/LDX/LDY/JSR/JMP/RTS, bit tests (BIT), and indirect/zero-page addressing.

## Overview
This chunk documents the entire keyboard scan entry beginning at $EA87 and ending with RTS at $EB47. The routine:

1. Clears the keyboard modifier flags in $028D and sets up "no key" sentinel in $CB.
2. Drives VIA1 DRA ($DC00) to select a column and reads VIA1 DRB ($DC01) to sample the rows. If $DC01 = $FF (no key), the routine exits early.
3. Initializes decode table pointer low/high bytes into $F5/$F6 (pointing at the character decode tables).
4. Iterates columns and for each column loops rows (8 rows per column): reads $DC01 until stable, shifts the row bit into carry, and if a key is closed:
   - Loads character index from the decode table via (F5),Y.
   - Tests for special codes (< $05 are modifier keys; $03 is STOP). For SHIFT/CBM/CTRL codes it ORs them into $028D.
   - Increments and bounds the key count saved in $CB.
5. After scanning entire matrix, does an indirect JMP ($028F) to evaluate modifier combinations (SHIFT/CTRL/C=); execution returns into the decoding path.
6. Uses the key count saved in $CB as an index into the selected decode table (LDA ($F5),Y).
7. Compares the current key count with last key count in $C5 to detect held keys and apply repeat logic using repeat delay at $028C and repeat speed at $028B.
8. If accepted (first press or allowed repeat) saves the decoded character into keyboard buffer $0277 at index $C6 (if buffer not full). Then re-enables column 7 (for STOP) and returns.

## Detailed flow and important behaviors
- Initialization: $028D is cleared at $EA89. $CB is initialized to $40 (no key) at $EA8E-$EA8E.
- Decode table pointer: $F5/$F6 are set to low/high bytes (#$81 / #$EB) at $EA9B–$EAA1 (so subsequent LDA ($F5),Y reads from that table).
- Column/row scanning:
  - Column drive is placed on DRA ($DC00); rows are read from DRB ($DC01).
  - For each row read the code waits for DRB to stabilize (read, compare to itself), then LSR the value and BCS if no key in that row.
  - When a closed key is found, LDA ($F5),Y pulls the decode index. Values < $05 indicate modifier keys and are ORed into $028D; $03 is STOP and handled similarly.
  - Key count is stored in $CB; loop limits are enforced (CPY #$41 / BCS).
- Modifier evaluation: the code jumps indirect through the vector at $028F (JMP ($028F)) allowing selector logic (external chunk) to update decode table selection or other modifier state, then resumes the decode sequence.
- Key decode and repeat:
  - After full scan, key count is re-read and used to load a decoded character via LDA ($F5),Y.
  - If key count equals previous value ($C5), repeat handling is performed: set delay ($028C) and decrement speed ($028B) counters to produce repeating behavior. Special keys (Insert/Delete/Space/Right/Down/cursor movement) are treated to always allow repeat checks.
  - Table end marker is $7F; $FF indicates no key (handled early).
  - Repeat counters: $028C holds repeat delay (set to #$10 for initial delay), $028B holds repeat speed (reloaded to #$04 when it expires).
- Keyboard buffer write:
  - Buffer index is $C6; buffer base is $0277; size at $0289.
  - If buffer is not full (CPX $0289, BCS exits), the decoded character is stored at $0277,X and $C6 is incremented/stored.
- Final steps: column 7 is enabled (A9 #$7F / STA $DC00) for the STOP key at $EB42–$EB44, then RTS at $EB47.

## Source Code
```asm
.,EA87 A9 00    LDA #$00
.,EA89 8D 8D 02 STA $028D
.,EA8C A0 40    LDY #$40
.,EA8E 84 CB    STY $CB
.,EA90 8D 00 DC STA $DC00
.,EA93 AE 01 DC LDX $DC01
.,EA96 E0 FF    CPX #$FF
.,EA98 F0 61    BEQ $EAFB
.,EA9A A8       TAY
.,EA9B A9 81    LDA #$81
.,EA9D 85 F5    STA $F5
.,EA9F A9 EB    LDA #$EB
.,EAA1 85 F6    STA $F6
.,EAA3 A9 FE    LDA #$FE
.,EAA5 8D 00 DC STA $DC00
.,EAA8 A2 08    LDX #$08
.,EAAA 48       PHA
.,EAAB AD 01 DC LDA $DC01
.,EAAE CD 01 DC CMP $DC01
.,EAB1 D0 F8    BNE $EAAB
.,EAB3 4A       LSR
.,EAB4 B0 16    BCS $EACC
.,EAB6 48       PHA
.,EAB7 B1 F5    LDA ($F5),Y
.,EAB9 C9 05    CMP #$05
.,EABB B0 0C    BCS $EAC9
.,EABD C9 03    CMP #$03
.,EABF F0 08    BEQ $EAC9
.,EAC1 0D 8D 02 ORA $028D
.,EAC4 8D 8D 02 STA $028D
.,EAC7 10 02    BPL $EACB
.,EAC9 84 CB    STY $CB
.,EACB 68       PLA
.,EACC C8       INY
.,EACD C0 41    CPY #$41
.,EACF B0 0B    BCS $EADC
.,EAD1 CA       DEX
.,EAD2 D0 DF    BNE $EAB3
.,EAD4 38       SEC
.,EAD5 68       PLA
.,EAD6 2A       ROL
.,EAD7 8D 00 DC STA $DC00
.,EADA D0 CC    BNE $EAA8
.,EADC 68       PLA
.,EADD 6C 8F 02 JMP ($028F)
.,EAE0 A4 CB    LDY $CB
.,EAE2 B1 F5    LDA ($F5),Y
.,EAE4 AA       TAX
.,EAE5 C4 C5    CPY $C5
.,EAE7 F0 07    BEQ $EAF0
.,EAE9 A0 10    LDY #$10
.,EAEB 8C 8C 02 STY $028C
.,EAEE D0 36    BNE $EB26
.,EAF0 29 7F    AND #$7F
.,EAF2 2C 8A 02 BIT $028A
.,EAF5 30 16    BMI $EB0D
.,EAF7 70 49    BVS $EB42
.,EAF9 C9 7F    CMP #$7F
.,EAFB F0 29    BEQ $EB26
.,EAFD C9 14    CMP #$14
.,EAFF F0 0C    BEQ $EB0D
.,EB01 C9 20    CMP #$20
.,EB03 F0 08    BEQ $EB0D
.,EB05 C9 1D    CMP #$1D
.,EB07 F0 04    BEQ $EB0D
.,EB09 C9 11    CMP #$11
.,EB0B D0 35    BNE $EB42
.,EB0D AC 8C 02 LDY $028C
.,EB10 F0 05    BEQ $EB17
.,EB12 CE 8C 02 DEC $028C
.,EB15 D0 2B    BNE $EB42
.,EB17 CE 8B 02 DEC $028B
.,EB1A D0 26    BNE $EB42
.,EB1C A0 04    LDY #$04
.,EB1E 8C 8B 02 STY $028B
.,EB21 A4 C6    LDY $C6
.,EB23 88       DEY
.,EB24 10 1C    BPL $EB42
.,EB26 A4 CB    LDY $CB
.,EB28 84 C5    STY $C5
.,EB2A AC 8D 02 LDY $028D
.,EB2D 8C 8E 02 STY $028E
.,EB30 E0 FF    CPX #$FF
.,EB32 F0 0E    BEQ $EB42
.,EB34 8A       TXA
.,EB35 A6 C6    LDX $C6
.,EB37 EC 89 02 CPX $0289
.,EB3A B0 06    BCS $EB42
.,EB3C 9D 77 02 STA $0277,X
.,EB3F E8       INX
.,EB40 86 C6    STX $C6
.,EB42 A9 7F    LDA #$7F
.,EB44 8D 00 DC STA $DC00
.,EB47 60       RTS
```

## Key Registers
- $DC00 - VIA1 - DRA: keyboard column drive (written to select column)
- $DC01 - VIA1 - DRB: keyboard row input (read to detect closed rows)
- $0277 - RAM - keyboard buffer base (characters stored as STA $0277,X)
- $0289 - RAM - keyboard buffer size (compared with buffer index)
- $028B - RAM - repeat speed counter (decremented for repeat timing)
- $028C - RAM - repeat delay counter (initial delay for repeat)
- $028D - RAM - keyboard shift/control/C= flag (ORed with modifier codes)
- $028E - RAM - last keyboard shift pattern (saved copy of $028D)
- $028F - RAM - indirect vector (JMP ($028F)) used to evaluate SHIFT/CTRL/C= keys
- $028A - RAM - repeat-mode flags (BIT tested at $EAF2)
- $C5   - RAM - last key count (used for held-key detection)
- $C6   - RAM - keyboard buffer index (read/write for buffer head/tail)
- $CB   - RAM - current key count (accumulates number of closed keys found)
- $F5/$F6 - RAM - pointer (low/high) to the active key decode table (used with LDA ($F5),Y)

## References
- "evaluate_shift_ctrl_c_keys_eb48_to_eb76" — evaluates SHIFT/CTRL/C= and selects decode table
- "key_decode_tables_eb79_ec43" — character decode tables (standard/shift/cbm/control)
- "special_character_codes_ec44_to_ec5e" — special character handling (SHIFT/C= lock and case switching)