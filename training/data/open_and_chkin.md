# CHKIN / OPEN Input Logic (KERNAL)

**Summary:** CHKIN (entry $F20E) uses LOOKUP and JZ100 to resolve a logical file's device/command table entries and sets the default input device (DFLTN, $99). It handles device 0 (keyboard), device 3 (screen), RS-232 serial devices (TALK/LISTN/TKSA/TKATN), and tape special cases by checking $BA/$B9 and command flags.

**Operation**

This chunk documents the CHKIN routine that opens a logical file for input. Callers pass the logical file number in X; CHKIN locates the logical file entry with JSR LOOKUP, then extracts the device/command information via JSR JZ100. It validates that the file was opened and that the referenced device supports input; special-case devices (keyboard device 0 and screen device 3) are accepted without table entries. Serial (RS-232) devices are handled by issuing TALK/TKSA/TKATN sequences. Tape files are validated by checking a command/flag byte in $B9.

Key behaviors:

- JSR LOOKUP; if the file is not found, JMP ERROR3 (file not open).
- If found, JSR JZ100 extracts table fields (device number, command).
- LDA $BA — device/command field is examined:
  - If $BA == 0 (keyboard), store device into $99 (DFLTN) and return.
  - If $BA == 3 (screen), store into $99 and return.
  - If $BA >= 3 (BCS taken), treat as serial device: TAX (device number), JSR TALK to request the device to TALK.
    - Then test $B9 (secondary/parameter): if high bit clear (BPL), JSR TKSA to send secondary; otherwise JSR TKATN to release attention.
- If device was not serial and not keyboard/screen, CMP $BA to 2 (RS-232 marker): if equal, JMP CKI232 to handle RS-232 specifics.
- For tape-like devices, LDX $B9; CPX #$60 tests whether the command is a read ($60 indicates read command in this context). If not a read, JMP ERROR6 (not an input file).
- On success, the device number is stored to $99 (DFLTN) and the routine returns (CLC/RTS).

Notes on conventions in this snippet:

- $99 (DFLTN) is written as the default input device for subsequent input operations.
- $BA and $B9 are zero page KERNAL variables used here to hold device/command and secondary/command parameter values respectively (symbolic names FA/SA appear in comments).
- TALK/TKSA/TKATN/TKATN/CKI232 are KERNAL routines that implement IEEE-488/serial handshaking and RS-232 device protocols.

Flow summary (by code labels):

- $F20E — entry JSR LOOKUP
  - Not found -> ERROR3
  - Found -> JSR JZ100 to extract table info
- Check device ($BA):
  - 0 -> keyboard -> store $99 and return
  - 3 -> screen -> store $99 and return
  - >=3 -> serial handling (TALK then TKSA/TKATN), then return
  - ==2 -> RS-232 -> JMP CKI232
  - else (tape/other) -> check $B9 (command) CPX #$60: if equal, accept; else ERROR6

## Source Code

```asm
                                ;* CHKIN -- OPEN CHANNEL FOR INPUT     *
                                ;*                                     *
                                ;* THE NUMBER OF THE LOGICAL FILE TO BE*
                                ;* OPENED FOR INPUT IS PASSED IN .X.   *
                                ;* CHKIN SEARCHES THE LOGICAL FILE     *
                                ;* TO LOOK UP DEVICE AND COMMAND INFO. *
                                ;* ERRORS ARE REPORTED IF THE DEVICE   *
                                ;* WAS NOT OPENED FOR INPUT ,(E.G.     *
                                ;* CASSETTE WRITE FILE), OR THE LOGICAL*
                                ;* FILE HAS NO REFERENCE IN THE TABLES.*
                                ;* DEVICE 0, (KEYBOARD), AND DEVICE 3  *
                                ;* (SCREEN), REQUIRE NO TABLE ENTRIES  *
                                ;* AND ARE HANDLED SEPARATE.           *
                                ;***************************************
                                ;
.,F20E 20 0F F3 JSR $F30F       NCHKIN JSR LOOKUP      ;SEE IF FILE KNOWN
.,F211 F0 03    BEQ $F216       BEQ    JX310           ;YUP...
                                ;
.,F213 4C 01 F7 JMP $F701       JMP    ERROR3          ;NO...FILE NOT OPEN
                                ;
.,F216 20 1F F3 JSR $F31F       JX310  JSR JZ100       ;EXTRACT FILE INFO
                                ;
.,F219 A5 BA    LDA $BA         LDA    FA
.,F21B F0 16    BEQ $F233       BEQ    JX320           ;IS KEYBOARD...DONE.
                                ;
                                ;COULD BE SCREEN, KEYBOARD, OR SERIAL
                                ;
.,F21D C9 03    CMP #$03        CMP    #3
.,F21F F0 12    BEQ $F233       BEQ    JX320           ;IS SCREEN...DONE.
.,F221 B0 14    BCS $F237       BCS    JX330           ;IS SERIAL...ADDRESS IT
.,F223 C9 02    CMP #$02        CMP    #2              ;RS232?
.,F225 D0 03    BNE $F22A       BNE    JX315           ;NO...
                                ;
.,F227 4C 4D F0 JMP $F04D       JMP    CKI232
                                ;
                                ;SOME EXTRA CHECKS FOR TAPE
                                ;
.,F22A A6 B9    LDX $B9         JX315  LDX SA
.,F22C E0 60    CPX #$60        CPX    #$60            ;IS COMMAND A READ?
.,F22E F0 03    BEQ $F233       BEQ    JX320           ;YES...O.K....DONE
                                ;
.,F230 4C 0A F7 JMP $F70A       JMP    ERROR6          ;NOT INPUT FILE
                                ;
.,F233 85 99    STA $99         JX320  STA DFLTN       ;ALL INPUT COME FROM HERE
                                ;
.,F235 18       CLC             CLC                    ;GOOD EXIT
.,F236 60       RTS             RTS
                                ;
                                ;AN SERIAL DEVICE HAS TO BE A TALKER
                                ;
.,F237 AA       TAX             JX330  TAX             ;DEVICE # FOR DFLTO
.,F238 20 09 ED JSR $ED09       JSR    TALK            ;TELL HIM TO TALK
                                ;
.,F23B A5 B9    LDA $B9         LDA    SA              ;A SECOND?
.,F23D 10 06    BPL $F245       BPL    JX340           ;YES...SEND IT
.,F23F 20 CC ED JSR $EDCC       JSR    TKATN           ;NO...LET GO
.,F242 4C 48 F2 JMP $F248       JMP    JX350
                                ;
.,F245 20 C7 ED JSR $EDC7       JX340  JSR TKSA        ;SEND SECOND
```

## Key Registers

- $99 - KERNAL - DFLTN: default input device store (set by CHKIN)
- $BA - KERNAL zero page - Device/command code (symbolic name FA in comments)
- $B9 - KERNAL zero page - Secondary/command parameter (symbolic name SA in comments)

## References

- "lookup_and_clall" — expands on LOOKUP and JZ100 routines used to find table entries and extract LAT/FAT/SAT information
- Commodore 64 Programmer's Reference Guide, Chapter 5: "BASIC to Machine Language" — details on KERNAL routines and zero-page variables
- Commodore 64 Memory Map — provides addresses and descriptions of system variables and routines

## Labels
- CHKIN
- DFLTN
- FA
- SA
