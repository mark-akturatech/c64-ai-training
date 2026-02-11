# CHKOUT ($FFC9) — Set logical output device for logical file (X)

**Summary:** KERNAL routine CHKOUT at $FFC9 selects the logical output device for file number in X, validates the file is open and writable, prevents assigning the keyboard for output, handles screen/RS232/serial-bus devices (LISTEN + secondary address), checks device STATUS ($90), and stores the default output device (DFLTO $9A) or returns I/O errors (#3, #5, #7).

## Description
Entry: X = logical file number.

Sequence:
- Calls "fine file number" routine ($F30F). If it fails, returns I/O error #3 (file not open).
- Calls "set file values" ($F31F) to populate file bookkeeping.
- Reads zero-page $BA (current device number). If $BA == $00 (keyboard) branch to I/O error #7 (not output file).
- Device dispatch:
  - If device == $03 (screen), store device number into DFLTO ($9A) and return with CLC (no error).
  - If device == $02 (RS-232), jump to RS232 handling ($EFE1).
  - If device > $03 (serial-bus device):
    - Transfer file (X) to A and JSR send LISTEN ($ED0C).
    - Load $B9 (secondary address, SA). If SA is non-negative (bit7 clear), send SA via JSR $EDB9.
    - If SA has bit7 set (negative), JSR $EDBE to clear ATN, then conditionally send SA.
    - After sending SA, test STATUS ($90) with BIT and branch on sign: if STATUS indicates OK (BPL), store DFLTO ($9A) and return; otherwise return I/O error #5 (device not present).
- On success the selected device number is written to DFLTO ($9A). Return indicates success with CLC; errors jump to KERNAL I/O error handlers.

Errors returned by this routine:
- I/O error #3 — file not open
- I/O error #7 — not an output file (attempt to set keyboard or otherwise invalid)
- I/O error #5 — device not present (serial-bus device failed to respond after LISTEN/SA)

Notes about control flow:
- The routine relies on helper KERNAL services at $F30F (validate file number) and $F31F (set file variables).
- RS-232 uses a dedicated submission path ($EFE1).
- Serial-bus selection performs the standard LISTEN + send secondary-address sequence and checks the global I/O STATUS word ($90) for device presence.

## Source Code
```asm
                                *** CHKOUT: SET OUTPUT DEVICE
                                The KERNAL routine CHKOUT ($ffc9) is vectored to this
                                routine. On entry (X) must hold the logical filenumber. A
                                test is made to see if the file is open, or ?FILE NOT OPEN
                                error. If the device is 0, ie. the keyboard, or the file
                                is not an output file, then ?FILE OUTPUT FILE error is
                                generated. If the device is on the serial bus, then it
                                commanded to LISTEN and the secondary address is sent. ST
                                is then checked and if non-zero, then ?DEVICE NOT PRESENT
                                error. Finally, the device number is stored in DFLTO.
.,F250 20 0F F3 JSR $F30F       fine file number (X)
.,F253 F0 03    BEQ $F258       OK
.,F255 4C 01 F7 JMP $F701       I/O error #3, file not open
.,F258 20 1F F3 JSR $F31F       set file values
.,F25B A5 BA    LDA $BA         FA, current device number
.,F25D D0 03    BNE $F262       not keyboard
.,F25F 4C 0D F7 JMP $F70D       I/O error #7, not output file
.,F262 C9 03    CMP #$03        screen?
.,F264 F0 0F    BEQ $F275       yes
.,F266 B0 11    BCS $F279       serial bus device
.,F268 C9 02    CMP #$02        RS232
.,F26A D0 03    BNE $F26F       nope
.,F26C 4C E1 EF JMP $EFE1       submit to RS232
.,F26F A6 B9    LDX $B9         SA, current secondary address
.,F271 E0 60    CPX #$60
.,F273 F0 EA    BEQ $F25F       not output file error
.,F275 85 9A    STA $9A         DFLTO, default output device
.,F277 18       CLC             clear carry to indicate no errors
.,F278 60       RTS
.,F279 AA       TAX             file (X) to (A)
.,F27A 20 0C ED JSR $ED0C       send LISTEN to serial device
.,F27D A5 B9    LDA $B9         SA
.,F27F 10 05    BPL $F286       send SA
.,F281 20 BE ED JSR $EDBE       clear ATN
.,F284 D0 03    BNE $F289
.,F286 20 B9 ED JSR $EDB9       send listen secondary address
.,F289 8A       TXA
.,F28A 24 90    BIT $90         STATUS, I/O status word
.,F28C 10 E7    BPL $F275       OK, set output device
.,F28E 4C 07 F7 JMP $F707       I/O error #5, device not present
```

## Key Registers
- $FFC9 - KERNAL vector/entry - CHKOUT routine address
- $9A - Zero page - DFLTO (default output device stored here)
- $BA - Zero page - Current device number (FA in commentary)
- $B9 - Zero page - Secondary address (SA) for serial devices
- $90 - Zero page - I/O STATUS word (tested after LISTEN/SA)

## References
- "chkin_set_input_device" — symmetrical input-device logic (TALK vs LISTEN)
- "send_secondary_address" — SA/send logic used when selecting serial devices

## Labels
- CHKOUT
- DFLTO
- FA
- SA
