# PROCESS KEY IMAGE (KERNAL key decode at $EAE0)

**Summary:** Decodes a pressed key using the KEYTAB pointer at ($F5),Y and the SFDX key index ($CB), implements key-repeat using RPTFLG ($028A), DELAY ($028C) and KOUNT ($028B), queues the ASCII into the keyboard buffer at $0277,X and posts $7F to the keyboard write register $DC00. Entry is via the KEYLOG vector ($028F).

## Description
This KERNAL routine (entry reached through the vector at $028F) converts the key index produced by the keyboard scan into an ASCII code and — if appropriate — queues it into the keyboard buffer. Key points from the control flow and data usage:

- Entry: JMP ($028F) — KEYLOG vector points here.
- SFDX (key scan index) is read from zero-page $CB and used as Y to index the active keytable: LDA ($F5),Y. ($F5) holds the 16-bit pointer to the current KEYTAB table selected elsewhere (shift/CBM selection).
- The loaded ASCII is temporarily moved into X (TAX) so the routine can use A/Y for tests and counts, and later TXA to restore the ASCII for storing.
- Repeat detection:
  - Compares current key index (Y) to the last key index stored in LSTX ($C5). If different, the initial repeat delay is rearmed (LDY #$10 → DELAY $028C) and the routine proceeds to update last-key state and exit.
  - If the same key as before, the routine tests the RPTFLG flag at $028A (BIT $028A). Depending on the flag it can allow repeating all keys, none, or a subset.
  - Several key values are special-cased to not repeat: value $7F, <DEL> ($14), <space> ($20), cursor left/right ($1D), cursor down/up ($11). If any of these match, repeating is suppressed.
  - DELAY ($028C) is used as the interlude before repeats begin; each interrupt decrements DELAY (DEC $028C) until it reaches zero.
  - Once DELAY is zero, KOUNT ($028B) is used as the repeat rate counter; DEC $028B each time, and when it reaches zero it is reinitialized to $04 and the key is allowed to repeat (i.e., the character is queued).
- Buffering:
  - NDX ($C6) holds the current number of keys in the keyboard queue. The routine checks against XMAX ($0289) to avoid overflow.
  - When space exists, the ASCII (in X/A) is stored into the buffer at $0277,X (STA $0277,X), NDX is incremented and stored back to $C6.
- State updates:
  - LSTX ($C5) is updated with the current key index (store Y).
  - Last shift pattern SHFLAG ($028D) is copied to LSTSHF ($028E).
- Finalization:
  - Before returning the routine writes $7F to $DC00 (CIA1 port A, keyboard write register) to complete the key handling, then RTS.

This routine therefore ties together the key scan index (from scnkey_keyboard_scan), the active KEYTAB pointer (set by shift_cbm_toggle_keytab_select), per-key repeat handling, and the keyboard buffer queuing.

## Source Code
```asm
.,EADD 6C 8F 02 JMP ($028F)     jump through KEYLOG vector, points to $eae0
.,EAE0 A4 CB    LDY $CB         SFDX, number of the key we pressed
.,EAE2 B1 F5    LDA ($F5),Y     get ASCII value from decode table
.,EAE4 AA       TAX             temp store
.,EAE5 C4 C5    CPY $C5         same key as former interrupt
.,EAE7 F0 07    BEQ $EAF0       yepp
.,EAE9 A0 10    LDY #$10        restore the repeat delay counter
.,EAEB 8C 8C 02 STY $028C       DELAY
.,EAEE D0 36    BNE $EB26       always jump
.,EAF0 29 7F    AND #$7F
.,EAF2 2C 8A 02 BIT $028A       RPTFLG, test repeat mode
.,EAF5 30 16    BMI $EB0D       repeat all keys
.,EAF7 70 49    BVS $EB42       repeat none - exit routine
.,EAF9 C9 7F    CMP #$7F
.,EAFB F0 29    BEQ $EB26
.,EAFD C9 14    CMP #$14        <DEL> key pressed
.,EAFF F0 0C    BEQ $EB0D       yepp...
.,EB01 C9 20    CMP #$20        <space> key pressed
.,EB03 F0 08    BEQ $EB0D       yepp...
.,EB05 C9 1D    CMP #$1D        <CRSR LEFT/RIGHT>
.,EB07 F0 04    BEQ $EB0D       yepp..
.,EB09 C9 11    CMP #$11        <CRSRS DOWN/UP>
.,EB0B D0 35    BNE $EB42       yepp..
.,EB0D AC 8C 02 LDY $028C       DELAY
.,EB10 F0 05    BEQ $EB17       skip
.,EB12 CE 8C 02 DEC $028C       decrement DELAY
.,EB15 D0 2B    BNE $EB42       end
.,EB17 CE 8B 02 DEC $028B       decrement KOUNT, repeat speed counter
.,EB1A D0 26    BNE $EB42       end
.,EB1C A0 04    LDY #$04
.,EB1E 8C 8B 02 STY $028B       init KOUNT
.,EB21 A4 C6    LDY $C6         read NDX, number of keys in keyboard queue
.,EB23 88       DEY
.,EB24 10 1C    BPL $EB42       end
.,EB26 A4 CB    LDY $CB         read SFDX
.,EB28 84 C5    STY $C5         store in LSTX
.,EB2A AC 8D 02 LDY $028D       read SHFLAG
.,EB2D 8C 8E 02 STY $028E       store in LSTSHF, last keyboard shift pattern
.,EB30 E0 FF    CPX #$FF        no valid key pressed
.,EB32 F0 0E    BEQ $EB42       end
.,EB34 8A       TXA
.,EB35 A6 C6    LDX $C6         NDX, number of keys in buffer
.,EB37 EC 89 02 CPX $0289       compare to XMAX, max numbers oc characters in buffer
.,EB3A B0 06    BCS $EB42       buffer is full, end
.,EB3C 9D 77 02 STA $0277,X     store new character in keyboard buffer
.,EB3F E8       INX             increment counter
.,EB40 86 C6    STX $C6         and store in NDX
.,EB42 A9 7F    LDA #$7F
.,EB44 8D 00 DC STA $DC00       keyboard write register
.,EB47 60       RTS             exit
```

## Key Registers
- $028F - KERNAL vector area - KEYLOG vector (entry jump to key handler)
- $0277 - KERNAL RAM - keyboard buffer base (indexed with X)
- $0289 - KERNAL RAM - XMAX, maximum buffer count
- $028A - KERNAL RAM - RPTFLG (repeat mode flag)
- $028B - KERNAL RAM - KOUNT (repeat speed counter)
- $028C - KERNAL RAM - DELAY (initial repeat delay)
- $028D - KERNAL RAM - SHFLAG (current keyboard shift pattern)
- $028E - KERNAL RAM - LSTSHF (last keyboard shift pattern)
- $CB   - Zero page - SFDX (key scan index)
- $C5   - Zero page - LSTX (last key index)
- $C6   - Zero page - NDX (number of keys in keyboard queue)
- $F5   - Zero page pointer - pointer to active KEYTAB table (LDA ($F5),Y)
- $DC00 - CIA1 - keyboard write register (write #$7F to post key)

## References
- "scnkey_keyboard_scan" — provides the key index (SFDX) used by this routine
- "shift_cbm_toggle_keytab_select" — handles shift/CBM combination and selects the appropriate KEYTAB vector before re-entering this decode routine

## Labels
- KEYLOG
- SFDX
- LSTX
- NDX
- RPTFLG
