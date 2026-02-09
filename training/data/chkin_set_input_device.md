# CHKIN ($FFC6) — Set logical input device

**Summary:** KERNAL CHKIN ($FFC6) sets the logical input device for a given logical file (X), validating the file is open and an input file, handling keyboard/screen/RS232 and serial-bus devices, sending TALK and secondary address when needed, checking device presence via STATUS ($90), and storing the default input device in DFLTN ($99).

## Description
On entry (X) contains the logical file number. CHKIN performs these steps:

- Calls the "find file" routine (JSR $F30F). If the file is not open it jumps to the I/O error handler for "FILE NOT OPEN" (I/O error #3).
- Calls the routine that sets file variables (JSR $F31F).
- Loads the current device number from $BA (FA). Control flow depends on this device number:
  - If $BA == 0 or $BA == 3 the routine treats input as keyboard/screen and stores the device as default input (DFLTN) and returns.
  - If $BA < 3 and not equal to 2 then it checks the secondary address in $B9; if $B9 == $60 it accepts and stores DFLTN and returns, otherwise it jumps to I/O error #6 ("NOT OUTPUT FILE").
  - If $BA == 2 it jumps to the RS-232 input handler (JMP $F04D).
  - If $BA >= 3 it treats the device as a serial-bus device and proceeds to bus protocol.
- For serial-bus devices:
  - Transfers X <- A (TAX) then JSR $ED09 to send the TALK command to the serial device.
  - Loads secondary address from $B9 and, if negative (bit7 set), waits for the clock (JSR $EDCC). Otherwise it sends the talk secondary address (JSR $EDC7).
  - Transfers back TXA/8-bit A (TXA) then tests the I/O STATUS byte at $90 with BIT $90. If the STATUS indicates device presence (BIT result positive), the device number is stored to DFLTN ($99) and the routine returns. If STATUS indicates the device is not present, it jumps to the I/O error handler for "DEVICE NOT PRESENT" (I/O error #5).

Return conditions:
- Stores the resolved input device number into DFLTN ($99) before RTS on success.
- I/O error #3 if the logical file is not open.
- I/O error #6 if the file is not an input file (or fails the $B9/$60 check path).
- I/O error #5 if the serial-bus device is not present according to STATUS ($90).

The routine relies on these KERNAL zero-page/file variables: $BA (current device), $B9 (secondary address), $99 (DFLTN default input device) and checks I/O STATUS at $90.

## Source Code
```asm
.,F20E 20 0F F3 JSR $F30F       find file number
.,F211 F0 03    BEQ $F216       ok, skip next command
.,F213 4C 01 F7 JMP $F701       I/O error #3, file not open
.,F216 20 1F F3 JSR $F31F       set file variables
.,F219 A5 BA    LDA $BA         FA, current device number
.,F21B F0 16    BEQ $F233       keyboard
.,F21D C9 03    CMP #$03        screen
.,F21F F0 12    BEQ $F233       yes
.,F221 B0 14    BCS $F237       larger than 3, serial bus device
.,F223 C9 02    CMP #$02        RS232
.,F225 D0 03    BNE $F22A       nope
.,F227 4C 4D F0 JMP $F04D       input from RS232
.,F22A A6 B9    LDX $B9         SA, current secondary address
.,F22C E0 60    CPX #$60
.,F22E F0 03    BEQ $F233
.,F230 4C 0A F7 JMP $F70A       I/O error #6, not output file
.,F233 85 99    STA $99         DFLTN, default input device
.,F235 18       CLC
.,F236 60       RTS
.,F237 AA       TAX
.,F238 20 09 ED JSR $ED09       send TALK to serial device
.,F23B A5 B9    LDA $B9         SA
.,F23D 10 06    BPL $F245       send SA
.,F23F 20 CC ED JSR $EDCC       wait for clock
.,F242 4C 48 F2 JMP $F248
.,F245 20 C7 ED JSR $EDC7       send talk secondary address
.,F248 8A       TXA
.,F249 24 90    BIT $90         STATUS, I/O status word
.,F24B 10 E6    BPL $F233       store DFLTN, and exit
.,F24D 4C 07 F7 JMP $F707       I/O error #5, device not present
```

## Key Registers
- $0099 - KERNAL - DFLTN (default input device)
- $00B9 - KERNAL - SA, current secondary address
- $00BA - KERNAL - FA, current device number
- $0090 - KERNAL/I/O - STATUS (ST), I/O status word checked with BIT $90

## References
- "find_file_lat_search" — expands on finding logical file index used here
- "clrchn_restore_default_io" — expands on reverting default devices (UNTALK/UNLISTEN)