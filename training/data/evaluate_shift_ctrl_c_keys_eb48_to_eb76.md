# Evaluate SHIFT/CTRL/C= state ($028D) and act on changes

**Summary:** ROM routine that reads keyboard modifier flags at $028D/$028E, handles SHIFT+C= toggling of character memory base ($D018) (respecting the shift-mode switch at $0291), and selects the key-decode table pointer into $F5/$F6 (table block at $EB79/$EB7A) before returning to the main decode path ($EAE0).

## Description
This ROM fragment performs two related tasks during keyboard decoding:

- Detect and respond to a changed SHIFT + C= state:
  - Loads the current modifier flag from $028D and compares it with constant #$03 (interpreted as SHIFT + C= combination).
  - If the current flags equal #$03 and differ from the previous state stored at $028E, it reads the shift-mode switch at $0291.
  - If the shift-mode switch is not locked (bit7 clear; $0291 = $00 means enabled, $80 means locked), the routine toggles the character memory base by EOR-ing bit 1 of $D018 (EOR #$02). This flips the character set bank (start-of-character-memory bit1).
  - After toggling (or if locked), execution continues to the main key decode at $EAE0.

- Select the appropriate key-decoding table:
  - If the SHIFT+C= special case is not active, the code transforms the modifier byte from $028D (ASL) and compares with #$08.
  - If the compare indicates the high bit/threshold (result >= $08), the code overrides the index with $06 (this path corresponds to the CTRL-modified decode selection).
  - The index (in A or set to $06) is transferred to X, and the routine loads a 16-bit pointer from the table-address block at $EB79/$EB7A indexed by X: low byte from $EB79+X into $F5, high byte from $EB7A+X into $F6.
  - Finally it jumps back into the main decode path at $EAE0 to continue processing using the selected decode table.

Behavioral details preserved from the source:
- $028D: keyboard modifier flags (checked against #$03 for SHIFT+C=).
- $028E: previous modifier state used to detect changes.
- $0291: shift-mode switch ($00 = enabled, $80 = locked). If locked (bit7 set) the SHIFT+C= toggle is inhibited.
- $D018: VIC start of character memory; toggling bit1 changes which charset is used (EOR #$02).
- $F5/$F6: zero-page locations used to hold the 16-bit pointer to the selected decode table.
- The routine always returns control to $EAE0 (main key decode path) after its actions.

## Source Code
```asm
.,EB48 AD 8D 02    LDA $028D       ; get the keyboard shift/control/c= flag
.,EB4B C9 03       CMP #$03        ; compare with [SHIFT][C=]
.,EB4D D0 15       BNE $EB64       ; if not [SHIFT][C=] go to select table
.,EB4F CD 8E 02    CMP $028E       ; compare with last
.,EB52 F0 EE       BEQ $EB42       ; exit if still the same
.,EB54 AD 91 02    LDA $0291       ; get the shift mode switch $00 = enabled, $80 = locked
.,EB57 30 1D       BMI $EB76       ; if locked continue keyboard decode
                                ; toggle text mode
.,EB59 AD 18 D0    LDA $D018       ; get the start of character memory address
.,EB5C 49 02       EOR #$02        ; toggle address b1
.,EB5E 8D 18 D0    STA $D018       ; save the start of character memory address
.,EB61 4C 76 EB    JMP $EB76       ; continue the keyboard decode
                                ; select keyboard table
.,EB64 0A          ASL             ; << 1
.,EB65 C9 08       CMP #$08        ; compare with threshold (used to detect CTRL)
.,EB67 90 02       BCC $EB6B       ; if below threshold skip the index change
.,EB69 A9 06       LDA #$06        ; else override index (CTRL path)
.,EB6B AA          TAX             ; copy the index to X
.,EB6C BD 79 EB    LDA $EB79,X     ; get the decode table pointer low byte
.,EB6F 85 F5       STA $F5         ; save the decode table pointer low byte
.,EB71 BD 7A EB    LDA $EB7A,X     ; get the decode table pointer high byte
.,EB74 85 F6       STA $F6         ; save the decode table pointer high byte
.,EB76 4C E0 EA    JMP $EAE0       ; continue the keyboard decode
```

## Key Registers
- $028D - RAM - keyboard modifier flags (tested for SHIFT + C= with #$03)
- $028E - RAM - previous modifier state used to detect changes
- $0291 - RAM - shift-mode switch ($00 = enabled, $80 = locked; bit7 indicates lock)
- $D018 - VIC-II - start of character memory (toggling bit1 switches character bank)
- $F5 - Zero Page - decode-table pointer low byte (set from $EB79,X)
- $F6 - Zero Page - decode-table pointer high byte (set from $EB7A,X)
- $EB79-$EB7A - ROM table-block (pointer table entries indexed by X)
- $EAE0 - ROM - main key decode entry (jump target after setup)

## References
- "keyboard_scan_entry_ea87_to_eb47" — expands on the main scan routine that calls/evaluates this logic
- "key_decode_tables_eb79_ec43" — expands on table pointers read by this code
- "special_character_codes_ec44_to_ec5e" — expands on SHIFT+C= behavior and locking interactions with case switching

## Labels
- 028D
- 028E
- 0291
- D018
- F5
- F6
