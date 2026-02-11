# KERNAL SERIAL4.0: TALK / LISTN helpers (entry $ED09)

**Summary:** Helpers in the KERNAL SERIAL4.0 library at $ED09–$ED40 implement TALK/LISTN address formation (ORA #$40 / ORA #$20), RS‑232 NMI protection (JSR RSP232), buffered-character LISTN handling (BIT $94 / C3P0), EOI flag setting/clearing (ROR/LSR $A3 / R2D2), and serial-bus attention + clock/data toggling via CIA2 port A ($DD00 / D2PRA). Includes calls to ISOUR / ISOURA, DATAHI, CLKLO/CLKHI, W1MS and DEBPIA.

## Description
This chunk is the KERNAL SERIAL4.0 routines that prepare and initiate communication on the CBM serial bus:

- TALK / LISTN formation:
  - TALK: ORA #$40 at $ED09 sets the TALK bit in the device address.
  - LISTN: ORA #$20 at $ED0C sets the LISTEN bit in the device address.
- RS‑232 protection:
  - Both paths call JSR $F0A4 (RSP232) at $ED0E to protect the routine from RS‑232 NMIs before touching serial hardware.
- LISTN buffered-character handling:
  - BIT $94 (C3P0) at $ED12 tests whether there is a buffered character waiting.
  - If a buffered character exists, the code sets the EOI flag by SEC / ROR $A3 (R2D2) and JSRs ISOUR ($ED19) to send the last character.
  - After send, LSR $94 (clear C3P0) and LSR $A3 (clear R2D2) clear buffer and EOI flags.
- Storing the talk/listen address:
  - PLA / STA $95 (BSOUR) at $ED20–$ED21 stores the formed source address for later use.
- Bus line sequencing and timing:
  - SEI is used in multiple places to prevent IRQs while manipulating lines.
  - JSR $EE97 (DATAHI) ensures the DATA line is released/high.
  - The routine compares the address with #$3F at $ED27–$ED29; CLKHI ($EE85) is called only for the specific unlisten case indicated by #$3F.
  - ATTENTION assert: LDA $DD00 / ORA #$08 / STA $DD00 at $ED2E–$ED33 sets the attention bit on CIA2 Port A (D2PRA).
  - After asserting ATTENTION, the routine forces clock low (JSR $EE8E CLKLO) and sets DATA high (JSR $EE97 DATAHI), waits 1 ms (JSR $EEB3 W1MS), then proceeds to ISOUR / ISOURA sequences to actually toggle clock/data and debounce the PIA (JSR $EEA9 DEBPIA).
- ISOUR (entry at $ED40) repeats critical operations with SEI set: JSR DATAHI and JSR DEBPIA to ensure DATA is released and debounced.

Routine references used by this code:
- RSP232 ($F0A4) — RS‑232 NMI protection
- ISOUR / ISOURA ($ED40 / $ED36) — send attention / send data sequences with proper clock toggling
- DATAHI ($EE97), CLKLO ($EE8E), CLKHI ($EE85), W1MS ($EEB3), DEBPIA ($EEA9)

Behavioral notes preserved from source (verbatim intent):
- LISTN checks for an already buffered character and will send it immediately, toggling the EOI flag around the send.
- ATTENTION is asserted by ORA #$08 to $DD00 (CIA2 port A).
- SEI is used around hardware manipulation to prevent IRQ interference.
- Clock-high transition is only performed for the unlisten case detected by CMP #$3F.

## Source Code
```asm
                                .LIB   SERIAL4.0
                                ; COMMAND SERIAL BUS DEVICE TO TALK
.,ED09 09 40    ORA #$40        TALK   ORA #$40        ; MAKE A TALK ADR
.:ED0B 2C       .BYTE $2C       .BYT   $2C             ; SKIP TWO BYTES
                                ; COMMAND SERIAL BUS DEVICE TO LISTEN
.,ED0C 09 20    ORA #$20        LISTN  ORA #$20        ; MAKE A LISTEN ADR
.,ED0E 20 A4 F0 JSR $F0A4       JSR    RSP232          ; PROTECT SELF FROM RS232 NMI'S
.,ED11 48       PHA             LIST1  PHA
                                ;
                                ;
.,ED12 24 94    BIT $94         BIT    C3P0            ; CHARACTER LEFT IN BUF?
.,ED14 10 0A    BPL $ED20       BPL    LIST2           ; NO...
                                ;
                                ; SEND BUFFERED CHARACTER
                                ;
.,ED16 38       SEC             SEC                    ; SET EOI FLAG
.,ED17 66 A3    ROR $A3         ROR    R2D2
                                ;
.,ED19 20 40 ED JSR $ED40       JSR    ISOUR           ; SEND LAST CHARACTER
                                ;
.,ED1C 46 94    LSR $94         LSR    C3P0            ; BUFFER CLEAR FLAG
.,ED1E 46 A3    LSR $A3         LSR    R2D2            ; CLEAR EOI FLAG
                                ;
                                ;
.,ED20 68       PLA             LIST2  PLA             ; TALK/LISTEN ADDRESS
.,ED21 85 95    STA $95         STA    BSOUR
.,ED23 78       SEI             SEI
.,ED24 20 97 EE JSR $EE97       JSR    DATAHI
.,ED27 C9 3F    CMP #$3F        CMP    #$3F            ; CLKHI ONLY ON UNLISTEN
.,ED29 D0 03    BNE $ED2E       BNE    LIST5
.,ED2B 20 85 EE JSR $EE85       JSR    CLKHI
                                ;
.,ED2E AD 00 DD LDA $DD00       LIST5  LDA D2PRA       ; ASSERT ATTENTION
.,ED31 09 08    ORA #$08        ORA    #$08
.,ED33 8D 00 DD STA $DD00       STA    D2PRA
                                ;
.,ED36 78       SEI             ISOURA SEI
.,ED37 20 8E EE JSR $EE8E       JSR    CLKLO           ; SET CLOCK LINE LOW
.,ED3A 20 97 EE JSR $EE97       JSR    DATAHI
.,ED3D 20 B3 EE JSR $EEB3       JSR    W1MS            ; DELAY 1 MS
.,ED40 78       SEI             ISOUR  SEI             ; NO IRQ'S ALLOWED
.,ED41 20 97 EE JSR $EE97              JSR DATAHI      ; MAKE SURE DATA IS RELEASED
.,ED44 20 A9 EE JSR $EEA9              JSR DEBPIA      ; DATA SHOULD BE LOW
```

## Key Registers
- $DD00 - CIA 2 (D2PRA) - Port A; ATTENTION bit set via ORA #$08 / STA $DD00

## References
- "serial_isour_isr" — expands on ISR routines and ISOUR used to send characters on the serial bus

## Labels
- ISOUR
- ISOURA
- BSOUR
- C3P0
- R2D2
- D2PRA
