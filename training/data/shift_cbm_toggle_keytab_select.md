# KERNAL: Shift/CBM handling and KEYTAB selection (keyboard vector switch)

**Summary:** Detects simultaneous <SHIFT> and <CBM> via SHFLAG ($028D), compares with LSTSHF ($028E) to ignore repeats, optionally toggles VIC-II memory-control bit ($D018 EOR #$02) to switch character set, detects <CTRL> to select an alternate KEYTAB offset, loads the selected KEYTAB pointer from KERNAL vectors ($EB79/$EB7A) into $F5/$F6, then jumps to the key-decode routine (JMP $EAE0).

## Behavior and implementation details
- Entry condition: A contains SHFLAG ($028D) tested for value #$03 (both <SHIFT> and <CBM> down). If not equal, execution continues at the branch path for other cases.
- Repeated press suppression: If SHFLAG equals LSTSHF ($028E) the routine returns (BEQ $EB42) to avoid reprocessing an unchanged shift pattern.
- MODE gating: Loads MODE ($0291) and uses BMI to skip the character-set toggle if the sign bit is set (MODE negative). If MODE allows (sign bit clear), it toggles bit 1 of VIC-II memory-control ($D018) with EOR #$02 and stores it back — this flips the upper/lower-case character set selection in VIC-II.
- CTRL detection and KEYTAB selection:
  - The code performs ASL on A and compares with #$08 to test for a shifted bit pattern indicating <CTRL>.
  - If the test shows <CTRL> set (carry from ASL leads to result >= #$08), A is loaded with #$06 and transferred to X; X indexes into the keyboard-select vector table at $EB79/$EB7A.
  - The routine reads the low byte of the KEYTAB pointer from $EB79+X into $F5 and the high byte from $EB7A+X into $F6 (forming the KEYTAB pointer in $F6:$F5).
- After setting the KEYTAB pointer (or skipping that step), the routine jumps to $EAE0 — the main key-image decode routine that produces the final ASCII value using the selected KEYTAB.

## Source Code
```asm
.,EB48 AD 8D 02 LDA $028D       SHFLAG
.,EB4B C9 03    CMP #$03        <SHIFT> and <CBM> at the same time
.,EB4D D0 15    BNE $EB64       nope
.,EB4F CD 8E 02 CMP $028E       same as LSTSHF
.,EB52 F0 EE    BEQ $EB42       if so, end
.,EB54 AD 91 02 LDA $0291       read MODE, shift key enable flag
.,EB57 30 1D    BMI $EB76       end
.,EB59 AD 18 D0 LDA $D018       VIC memory control register
.,EB5C 49 02    EOR #$02        toggle character set, upper/lower case
.,EB5E 8D 18 D0 STA $D018       and store
.,EB61 4C 76 EB JMP $EB76       process key image
.,EB64 0A       ASL
.,EB65 C9 08    CMP #$08        test <CTRL>
.,EB67 90 02    BCC $EB6B       nope
.,EB69 A9 06    LDA #$06        set offset for ctrl
.,EB6B AA       TAX             to (X)
.,EB6C BD 79 EB LDA $EB79,X     read keyboard select vectors, low byte
.,EB6F 85 F5    STA $F5         store in KEYTAB, decode table vector
.,EB71 BD 7A EB LDA $EB7A,X     read keyboard select vectors, high byte
.,EB74 85 F6    STA $F6         KEYTAB+1
.,EB76 4C E0 EA JMP $EAE0       process key image
```

## Key Registers
- $028D - System RAM (KERNAL workspace) - SHFLAG: current shift/CBM key state
- $028E - System RAM (KERNAL workspace) - LSTSHF: last recorded shift pattern
- $0291 - System RAM (KERNAL workspace) - MODE: shift-key enable flag (sign bit tested)
- $D018 - VIC-II - memory control register (bit $02 toggled to switch charset)
- $EB79-$EB7A - KERNAL ROM - keyboard-select vectors (low/high bytes of KEYTAB pointers indexed by X)
- $F5-$F6 - Zero page / KERNAL workspace - KEYTAB pointer (low/high) used by decode
- $EAE0 - KERNAL ROM - key-image decode routine entry (jump target)

## References
- "process_key_image_decode_and_buffer" — expands on what happens after selecting the KEYTAB vector; continues from JMP $EAE0
- "scnkey_keyboard_scan" — expands on how SHFLAG and SFDX are set (what this code inspects)

## Labels
- SHFLAG
- LSTSHF
- MODE
- KEYTAB
