# Open channel for input (KERNAL $F20E)

**Summary:** KERNAL routine at $F20E to open a channel for input: calls file lookup (JSR $F30F), sets file details (JSR $F31F), checks device number in $BA, validates secondary address in $B9 (compares to #$60), handles keyboard (device 0), screen (device 3), RS232 (device 2 -> JMP $F04D) and serial-bus devices (commands TALK via JSR $ED09 / sends secondary with $EDC7 / waits with $EDCC). Tests serial presence via serial status byte $90 and returns error vectors $F701/$F70A/$F707 as appropriate.

## Routine behavior and flow

- Entry: JSR $F30F — perform file lookup for the logical file.
  - If file not found/open, branch to the 'file not open' error handler at $F701.
- On success, JSR $F31F — load file/device details from the table indexed by X.
- Device number is read from $BA.
  - If $BA == 0 (keyboard), save device number to $99, clear carry (CLC = success), and RTS.
  - If $BA == 3 (screen), same as above: save $BA -> $99, CLC, RTS.
- If A (device) >= 3 (unsigned) then branch to serial-bus handling at $F237. (Note: equality to 3 is already handled by BEQ.)
- Otherwise compare device to RS232 (#$02):
  - If equal, JMP $F04D to get input from the RS232 buffer/handler.
  - If not RS232, continue to check secondary address.

- Secondary address check:
  - LDX $B9 ; get secondary address
  - CPX #$60 ; compare with #$60
  - If equal, treat as valid input device: save device to $99, CLC, RTS.
  - If not equal, JMP $F70A to report "not input file" error.

- Serial-bus device path (starts at $F237):
  - TAX ; copy device number to X (device ID in X)
  - JSR $ED09 ; send TALK command to device on serial bus (device in X)
  - LDA $B9 ; reload secondary address
  - BPL skip-wait ; if secondary address has bit7 = 0, skip the immediate wait
  - JSR $EDCC ; otherwise wait for serial-bus end after send
  - JMP short-exit to continue
  - (If BPL taken) JSR $EDC7 ; send secondary address after TALK
  - TXA ; restore device number in A
  - BIT $90 ; test serial status byte ($90) to see if device is present/responding
    - If BIT result sets N (BPL taken), device present: save device ($99), CLC, RTS.
    - Else branch to $F707 to report "device not present" error.

- Error handlers referenced:
  - $F701 — 'file not open' error and return
  - $F70A — 'not input file' error and return
  - $F707 — 'device not present' error and return
- Special-case: RS232 input handling is at $F04D (jump target used when device == #$02).

## Source Code
```asm
.,F20E 20 0F F3 JSR $F30F
.,F211 F0 03    BEQ $F216
.,F213 4C 01 F7 JMP $F701
.,F216 20 1F F3 JSR $F31F
.,F219 A5 BA    LDA $BA
.,F21B F0 16    BEQ $F233
.,F21D C9 03    CMP #$03
.,F21F F0 12    BEQ $F233
.,F221 B0 14    BCS $F237
.,F223 C9 02    CMP #$02
.,F225 D0 03    BNE $F22A
.,F227 4C 4D F0 JMP $F04D
.,F22A A6 B9    LDX $B9
.,F22C E0 60    CPX #$60
.,F22E F0 03    BEQ $F233
.,F230 4C 0A F7 JMP $F70A
.,F233 85 99    STA $99
.,F235 18       CLC
.,F236 60       RTS
.,F237 AA       TAX
.,F238 20 09 ED JSR $ED09
.,F23B A5 B9    LDA $B9
.,F23D 10 06    BPL $F245
.,F23F 20 CC ED JSR $EDCC
.,F242 4C 48 F2 JMP $F248
.,F245 20 C7 ED JSR $EDC7
.,F248 8A       TXA
.,F249 24 90    BIT $90
.,F24B 10 E6    BPL $F233
.,F24D 4C 07 F7 JMP $F707
```

## Key Registers
- $B9 - KERNAL zero-page: secondary address (used to decide input vs not-input, compared to #$60; sign tested with BPL)
- $BA - KERNAL zero-page: device number (0=keyboard, 2=RS232, 3=screen, >=4 treated as serial-bus device)
- $99 - KERNAL zero-page: saved input device number (routine stores chosen device here)
- $90 - KERNAL zero-page: serial status byte (BIT tested to determine device presence/responding)

## References
- "find_file_and_find_file_A" — expands on the file lookup used to verify the logical file (JSR $F30F)
- "set_file_details_from_table" — expands on loading file/device details from tables (JSR $F31F)
- "open_channel_for_output_and_serial_bus" — expands on shared serial-bus device selection logic and similar output path logic