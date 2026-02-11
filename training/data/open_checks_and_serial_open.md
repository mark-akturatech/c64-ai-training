# CHKOUT — KERNAL ROM: open channel for output (serial/tape handling)

**Summary:** Disassembly and explanation of the KERNAL CHKOUT routine (ROM $F250–$F279 region) that opens a logical output channel given X = logical file number, calls LOOKUP/JZ100 to extract table entries, handles device types (keyboard/screen/RS232/tape), uses serial LISTN/TALK sequences (JSR $ED0C, JMP $EFE1) and prepares tape cassette routines and file buffer pointers (zero page $B9, $BA, $9A, $90).

## CHKOUT (open channel for output) — behavior and flow

- Entry: logical file number is in X. CHKOUT checks the logical file table (JSR LOOKUP at $F30F).
  - If LOOKUP fails (file not in table) it jumps to ERROR3 ($F701).
  - If found, it calls JZ100 (JSR $F31F) to extract the table entry into zero page fields.
- It examines the "device" byte from the table (stored in zero page $BA, labeled FA in the disassembly):
  - If $BA == $00 (keyboard/device 0) it is considered an input-only device for output and jumps to ERROR7 ($F70D).
  - If $BA == $03 (screen/device 3) it stores the device number into DFLTO ($009A) and returns (all output goes to the screen).
  - If $BA >= $03 it branches to handle serial devices (JSR LISTN at $ED0C, prepare TALK/LISTEN sequence).
  - If $BA == $02 (RS232) it jumps to the RS232-specific CHKOUT handler at $EFE1 (CKO232).
- Tape (cassette) channels are handled specially:
  - Secondary address (SA) is loaded from zero page $B9.
  - If the command in SA indicates READ (compare to #$60), CHKOUT treats opening for output as an error (branch to ERROR7).
  - Otherwise it stores the default output device into $009A and returns.
- Serial handling:
  - For serial devices TAX saves the device number, JSR LISTN ($ED0C) issues a "listen" sequence to the device.
  - After LISTN the code checks $B9 (secondary). If a secondary address is present the sequence continues (next steps not shown in this snippet).
- Error handling jumps in this snippet:
  - ERROR3 at $F701 — file not open (LOOKUP failed).
  - ERROR5 at $F707 — device not present (BIT $90 check failed earlier).
  - ERROR7 at $F70D — device is not valid for output (e.g., keyboard or trying to open tape for output as read).
- Zero page usage (KERNAL fields shown here):
  - $BA (FA) — device number read from logical-file table.
  - $B9 (SA) — secondary address for the device.
  - $9A (DFLTO) — default output device pointer/value stored for the open channel.
  - $90 (STATUS) — tested with BIT $90 to detect device present/listening (earlier in code).

This chunk covers only the CHKOUT entry logic and device selection/dispatch; further serial TALK/TKATN/TKSA sequences and cassette header/file-search helpers are implemented in other routines (see References).

## Source Code
```asm
.,F248 8A       TXA             JX350  TXA
.,F249 24 90    BIT $90         BIT    STATUS          ;DID HE LISTEN?
.,F24B 10 E6    BPL $F233       BPL    JX320           ;YES
                                ;
.,F24D 4C 07 F7 JMP $F707       JMP    ERROR5          ;DEVICE NOT PRESENT
                                ;***************************************
                                ;* CHKOUT -- OPEN CHANNEL FOR OUTPUT     *
                                ;*                                     *
                                ;* THE NUMBER OF THE LOGICAL FILE TO BE*
                                ;* OPENED FOR OUTPUT IS PASSED IN .X.  *
                                ;* CHKOUT SEARCHES THE LOGICAL FILE    *
                                ;* TO LOOK UP DEVICE AND COMMAND INFO. *
                                ;* ERRORS ARE REPORTED IF THE DEVICE   *
                                ;* WAS NOT OPENED FOR INPUT ,(E.G.     *
                                ;* KEYBOARD), OR THE LOGICAL FILE HAS   *
                                ;* REFERENCE IN THE TABLES.             *
                                ;* DEVICE 0, (KEYBOARD), AND DEVICE 3  *
                                ;* (SCREEN), REQUIRE NO TABLE ENTRIES  *
                                ;* AND ARE HANDLED SEPARATE.           *
                                ;***************************************
                                ;
.,F250 20 0F F3 JSR $F30F       NCKOUT JSR LOOKUP      ;IS FILE IN TABLE?
.,F253 F0 03    BEQ $F258       BEQ    CK5             ;YES...
                                ;
.,F255 4C 01 F7 JMP $F701       JMP    ERROR3          ;NO...FILE NOT OPEN
                                ;
.,F258 20 1F F3 JSR $F31F       CK5    JSR JZ100       ;EXTRACT TABLE INFO
                                ;
.,F25B A5 BA    LDA $BA         LDA    FA              ;IS IT KEYBOARD?
.,F25D D0 03    BNE $F262       BNE    CK10            ;NO...SOMETHING ELSE.
                                ;
.,F25F 4C 0D F7 JMP $F70D       CK20   JMP ERROR7      ;YES...NOT OUTPUT FILE
                                ;
                                ;COULD BE SCREEN,SERIAL,OR TAPES
                                ;
.,F262 C9 03    CMP #$03        CK10   CMP #3
.,F264 F0 0F    BEQ $F275       BEQ    CK30            ;IS SCREEN...DONE
.,F266 B0 11    BCS $F279       BCS    CK40            ;IS SERIAL...ADDRESS IT
.,F268 C9 02    CMP #$02        CMP    #2              ;RS232?
.,F26A D0 03    BNE $F26F       BNE    CK15
                                ;
.,F26C 4C E1 EF JMP $EFE1       JMP    CKO232
                                ;
                                ;
                                ;SPECIAL TAPE CHANNEL HANDLING
                                ;
.,F26F A6 B9    LDX $B9         CK15   LDX SA
.,F271 E0 60    CPX #$60        CPX    #$60            ;IS COMMAND READ?
.,F273 F0 EA    BEQ $F25F       BEQ    CK20            ;YES...ERROR
                                ;
.,F275 85 9A    STA $9A         CK30   STA DFLTO       ;ALL OUTPUT GOES HERE
                                ;
.,F277 18       CLC             CLC                    ;GOOD EXIT
.,F278 60       RTS             RTS
                                ;
.,F279 AA       TAX             CK40   TAX             ;SAVE DEVICE FOR DFLTO
.,F27A 20 0C ED JSR $ED0C       JSR    LISTN           ;TELL HIM TO LISTEN
                                ;
.,F27D A5 B9    LDA $B9         LDA    SA              ;IS THERE A SECOND?
.,F27F 10 05    BPL $F286       BPL    CK50            ;YES...
```

## Key Registers
- $0090 - Zero Page - STATUS (BIT test used to detect device listening/presence)
- $009A - Zero Page - DFLTO (default output device for the opened channel)
- $00B9 - Zero Page - SA (secondary address for the logical file/device)
- $00BA - Zero Page - FA (device number stored in the logical-file table entry)

## References
- "serial_command_and_listen" — expands on TALK/LISTN/TKATN/TKSA serial device opening sequences
- "jtget_and_cassette_buffers" — expands on tape/cassette helpers (FAF/FAH) used to search/create tape files and write headers

## Labels
- CHKOUT
