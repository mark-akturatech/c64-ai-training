# SCNKEY — KERNAL keyboard scan routine (entry $FF9F)

**Summary:** KERNAL SCNKEY keyboard scan implementation (entry from $FF9F) for an 8x8 matrix using CIA1 ports $DC00/$DC01; clears SHFLAG ($028D), initializes key counter/SFDX ($CB), installs KEYTAB vector ($F5/$F6 → $EB81), debounces reads, tests bits with LSR/ROL, translates via KEYTAB, and sets SHFLAG for special keys.

**Description**
This routine (labeled SCNKEY in the Magnus Nyman disassembly) is the KERNAL keyboard-scanning implementation reached from the KERNAL entry at $FF9F. Behavior and key points:

- Clears the shift/status flag at $028D (SHFLAG).
- Initializes a key-number/counter in zero page ($CB) to #$40 (used for SFDX / key number storage).
- Uses CIA1 I/O to drive and read an 8×8 keyboard matrix:
  - Writes row masks to $DC00 and reads the input byte from $DC01.
  - A value of $FF from $DC01 means "no key pressed," and the routine skips scanning.
  - The routine writes an initial row mask (#$FE) then scans 8 rows (LDX #$08).
- Debouncing: after each write to the row port, it repeatedly reads $DC01 and compares the value against itself until stable (LDA $DC01 / CMP $DC01 / BNE loop).
- Key detection:
  - Tests bit0 with LSR (bit0=0 indicates a pressed key).
  - When a pressed bit is detected, it pushes/pulls registers to preserve state, then looks up a key identifier through the indirect KEYTAB vector stored in $F5/$F6 (set here to point at $EB81).
  - The looked-up key value is compared to small constants and may set SHFLAG ($028D) for special keys (via ORA/STA).
  - The pressed key number is written into the SFDX location ($CB).
- Iteration:
  - Uses ROL to rotate the row mask and STA $DC00 to advance to the next row.
  - Increments Y as a key counter and compares CPY #$41 (decimal 65) to stop after scanning all 64 matrix positions (8×8).
- After completing the scan, the routine performs stack clean-up (PLA) and returns control via the KEYLOG/PROCESS KEY IMAGE mechanism (next stage handled by the key-processing vector).

## Source Code
```asm
.,EA87 A9 00    LDA #$00
.,EA89 8D 8D 02 STA $028D       clear SHFLAG
.,EA8C A0 40    LDY #$40
.,EA8E 84 CB    STY $CB
.,EA90 8D 00 DC STA $DC00       store in keyboard write register
.,EA93 AE 01 DC LDX $DC01       keyboard read register
.,EA96 E0 FF    CPX #$FF        no key pressed
.,EA98 F0 61    BEQ $EAFB       skip
.,EA9A A8       TAY
.,EA9B A9 81    LDA #$81        point KEYTAB vector to $EB81
.,EA9D 85 F5    STA $F5
.,EA9F A9 EB    LDA #$EB
.,EAA1 85 F6    STA $F6
.,EAA3 A9 FE    LDA #$FE        bit0 = 0
.,EAA5 8D 00 DC STA $DC00       will test first row in matrix
.,EAA8 A2 08    LDX #$08        scan 8 rows in matrix
.,EAAA 48       PHA             temp store
.,EAAB AD 01 DC LDA $DC01       read
.,EAAE CD 01 DC CMP $DC01       wait for value to settle (key bouncing)
.,EAB1 D0 F8    BNE $EAAB
.,EAB3 4A       LSR             test bit0
.,EAB4 B0 16    BCS $EACC       no key pressed
.,EAB6 48       PHA
.,EAB7 B1 F5    LDA ($F5),Y     get key from KEYTAB
.,EAB9 C9 05    CMP #$05        value less than 5
.,EABB B0 0C    BCS $EAC9       nope
.,EABD C9 03    CMP #$03        value = 3
.,EABF F0 08    BEQ $EAC9       nope
.,EAC1 0D 8D 02 ORA $028D
.,EAC4 8D 8D 02 STA $028D       store in SHFLAG
.,EAC7 10 02    BPL $EACB
.,EAC9 84 CB    STY $CB         store keynumber we pressed in SFDX
.,EACB 68       PLA
.,EACC C8       INY             key counter
.,EACD C0 41    CPY #$41        all 64 keys (8*8)
.,EACF B0 0B    BCS $EADC       jump if ready
.,EAD1 CA       DEX             next key in row
.,EAD2 D0 DF    BNE $EAB3       row ready
.,EAD4 38       SEC             prepare for rol
.,EAD5 68       PLA
.,EAD6 2A       ROL             next row
.,EAD7 8D 00 DC STA $DC00       store bit
.,EADA D0 CC    BNE $EAA8       always jump
.,EADC 68       PLA             clean up
.,EADD 6C 8F 02 JMP ($028F)     jump via KEYLOG vector
```

## Key Registers
- $DC00-$DC01 - CIA1 - keyboard matrix: write row mask to $DC00 (drive columns/rows), read matrix state from $DC01.
- $028D - RAM - SHFLAG (shift / special-key flag)
- $00CB - Zero Page - SFDX / key-number storage and counter (initialized to #$40)
- $00F5-$00F6 - Zero Page (KERNAL vectors) - KEYTAB vector (set here to point at $EB81)
- $028F-$0290 - RAM - KEYLOG vector (used to process the key image after scanning)

## References
- "main_irq_entry" — expands on being called from IRQ to scan the keyboard
- "process_key_image_decode_and_buffer" — expands on the next stage: decode the scanned key and handle repeat/buffering

## Labels
- SCNKEY
- SHFLAG
- SFDX
- KEYTAB
- KEYLOG
