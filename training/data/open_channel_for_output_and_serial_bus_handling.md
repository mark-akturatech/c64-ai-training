# open channel for output ($F250-$F28E)

**Summary:** C64 KERNAL routine at $F250–$F28E to open a channel for output: calls file-find ($F30F) and file-detail setup ($F31F), inspects zero page device/secondary addresses ($00BA, $00B9), handles keyboard/screen/tape/RS232 cases (RS232 opens via $EFE1), performs serial-bus LISTEN (JSR $ED0C), optionally raises ATN (JSR $EDBE), sends secondary address (JSR $EDB9), checks device presence via serial status byte ($0090), and returns with carry clear on success and device saved to $009A.

**Description**
This KERNAL routine implements the "open channel for output" path after a file has been located. Key behavioral steps:

- Call find-file: JSR $F30F — if file not found, JMP $F701 (file-not-open error).
- Populate file details from the file table: JSR $F31F.
- Read current device number from zero page $00BA.
  - If device = keyboard ($00BA == $00), jump to error ($F70D).
  - Compare device to screen (#$03). If equal, save the output device number and return success.
  - If device > screen (BCS), this branches into the serial-bus/device handling code.
  - If device == #$02 (RS232) branch to RS232 open handler at $EFE1.
  - Otherwise (assumed tape), proceed to tape open handling.
- Tape handling: load secondary address from $00B9 and compare with #$60 (CPX #$60); if equal the routine jumps back to the keyboard-not-output error ($F25F -> $F70D).
- On successful (non-error) path save the output device number in zero page $009A, clear carry (CLC), and RTS (return success).
- Serial-bus device path:
  - TAX to copy device number into X for device command routines.
  - JSR $ED0C to command devices to LISTEN.
  - Load secondary address ($00B9). If BPL (bit7 clear) then branch to $F286 to send secondary address; otherwise JSR $EDBE to set serial ATN high, then (flow continues) send secondary address.
  - JSR $EDB9 sends the secondary address after LISTEN.
  - TXA restores device number to A.
  - BIT $0090 tests the serial status byte; BPL (bit7 clear) means device is present: save device number ($009A), CLC, RTS. Otherwise jump to $F707 (device-not-present error).

Return conventions used by this routine:
- On success: output device stored in $009A, carry clear, RTS.
- On error: jumps to KERNAL error handlers at $F701 / $F707 / $F70D.

**Clarifications:**

1. **Secondary Address Check (CPX #$60 at $F271–$F273):**
   - **Purpose:** The routine checks if the secondary address ($00B9) is $60.
   - **Reason for Error on $60:** In the Commodore 64, the secondary address $60 is reserved for input operations. Therefore, attempting to open a tape device for output with this secondary address is invalid, triggering the 'not output' error.

2. **Ambiguous Branching After JSR $EDBE:**
   - **Instruction:** After JSR $EDBE, the instruction D0 03 (BNE $F289) is present.
   - **Clarification:** The JSR $EDBE sets the ATN (Attention) line high on the serial bus. The subsequent BNE instruction is effectively a branch always because the JSR instruction sets the zero flag to 0 (resulting in a non-zero status), causing the BNE to always branch. This ensures the flow continues to the next step without conditional checks.

3. **Device Codes Mapping:**
   - The Commodore 64 assigns specific device numbers to its peripherals:
     - **0:** Keyboard
     - **1:** Datassette (Tape)
     - **2:** RS-232C device
     - **3:** Screen (CRT display)
     - **4:** Serial bus printer
     - **8:** CBM serial bus disk drive
   - Device numbers 4 and above refer to devices on the serial bus.

## Source Code
```asm
.,F250 20 0F F3 JSR $F30F       ; find a file
.,F253 F0 03    BEQ $F258       ; if file found continue
.,F255 4C 01 F7 JMP $F701       ; else do 'file not open' error and return
.,F258 20 1F F3 JSR $F31F       ; set file details from table,X
.,F25B A5 BA    LDA $BA         ; get the device number
.,F25D D0 03    BNE $F262       ; if the device is not the keyboard go ??
.,F25F 4C 0D F7 JMP $F70D       ; go do 'not output file' error and return
.,F262 C9 03    CMP #$03        ; compare the device with the screen
.,F264 F0 0F    BEQ $F275       ; if the device is the screen go save output device number and exit
.,F266 B0 11    BCS $F279       ; if > screen then go handle a serial bus device
.,F268 C9 02    CMP #$02        ; compare the device with the RS232 device
.,F26A D0 03    BNE $F26F       ; if not the RS232 device then it must be the tape device
.,F26C 4C E1 EF JMP $EFE1       ; else go open RS232 channel for output
.,F26F A6 B9    LDX $B9         ; get the secondary address
.,F271 E0 60    CPX #$60        ; check if secondary address is $60
.,F273 F0 EA    BEQ $F25F       ; if so, do not output file error and return
.,F275 85 9A    STA $9A         ; save the output device number
.,F277 18       CLC             ; flag ok
.,F278 60       RTS
.,F279 AA       TAX             ; copy the device number
.,F27A 20 0C ED JSR $ED0C       ; command devices on the serial bus to LISTEN
.,F27D A5 B9    LDA $B9         ; get the secondary address
.,F27F 10 05    BPL $F286       ; if address to send go ??
.,F281 20 BE ED JSR $EDBE       ; else set serial ATN high
.,F284 D0 03    BNE $F289       ; branch always
.,F286 20 B9 ED JSR $EDB9       ; send secondary address after LISTEN
.,F289 8A       TXA             ; copy device number back to A
.,F28A 24 90    BIT $90         ; test the serial status byte
.,F28C 10 E7    BPL $F275       ; if the device is present go save the output device number and exit
.,F28E 4C 07 F7 JMP $F707       ; else do 'device not present error' and return
```

## Key Registers
- $009A - Zero page - saved output device number (device chosen for output)
- $00BA - Zero page - current device number (from file details)
- $00B9 - Zero page - secondary address (used for tape/serial)
- $0090 - Zero page - serial status byte (BIT tested to verify device presence)

## References
- "find_file_and_find_file_A" — expands on file lookup prior to opening for output
- "output_char_to_cassette_and_rs232" — expands on actual output paths used after opening the device
- "set_file_details_from_table" — expands on populating device/secondary address used here

## Labels
- $009A
- $00BA
- $00B9
- $0090
