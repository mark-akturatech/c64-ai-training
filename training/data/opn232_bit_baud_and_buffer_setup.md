# KERNAL RS-232 OPEN SEQUENCE — Baud calculation, TV-table lookup, modem line checks

**Summary:** Consolidated KERNAL ROM sequence for the RS-232 OPN (open) path: calls BITCNT, stores BITNUM, computes baud rate using M51CTR/M51AJB and TV-standard table lookup (BAUDO/BAUDOP), calls patchable POPEN at $FF2E, checks M51CDR bit for 3/X line and verifies modem line states via CIA2 Port B ($DD01). Includes assembly excerpt with labels (OPN025..OPN050) and JSR targets ($EF4A, $FF2E, $F00D).

**Operation**
This snippet is the middle of the RS-232 open (OPN) sequence in the Commodore 64 KERNAL ROM. It performs the following, in order:

- Calls the BITCNT routine (JSR $EF4A) and stores the X register into BITNUM ($0298).
- Begins the baud-rate calculation:
  - Loads M51CTR ($0293) and masks with #$0F to obtain a low nybble count; if zero it branches to the later OPN010 path.
  - Prepares an index by shifting left (ASL) and transferring to X to build a table offset.
  - Reads the TV-standard flag from PALNTS ($02A6); selects the correct BAUD tables depending on PAL vs NTSC:
    - For NTSC: loads BAUDO-1, BAUDO-2 from $FEC1/$FEC0 indexed by X.
    - For PAL: loads BAUDOP-1, BAUDOP-2 from $E4EB/$E4EA indexed by X.
  - Stores the selected start-test rate into M51AJB+1 ($0296) and M51AJB ($0295), then reloads M51AJB to compute the final baud.
  - Calls the patchable POPEN routine at $FF2E (JSR $FF2E).
- Checks for modem/data-line responses:
  - Loads M51CDR ($0294) and shifts right to test bit 0 (3/X line); if that bit indicates the 3 line, branch to OPN050.
  - If not, checks CIA2 Port B ($DD01) by shifting left and testing the carry (this examines the high bit after ASL), to verify X-line proper states; if the test fails it jumps to CKDSRX (JSR $F00D), the DSR-error exit.

Labels from the listing (OPN025..OPN050) and comments are preserved in the assembly excerpt in Source Code.

## Source Code
```asm
.,F41D 20 4A EF JSR $EF4A       OPN025 JSR BITCNT
.,F420 8E 98 02 STX $0298              STX BITNUM
                                ;
                                ; CALC BAUD RATE
                                ;
.,F423 AD 93 02 LDA $0293              LDA M51CTR
.,F426 29 0F    AND #$0F               AND #$0F
.,F428 F0 1C    BEQ $F446              BNE OPN010
                                ;
                                ; CALCULATE START-TEST RATE...
                                ;  DIFFERENT THAN ORIGINAL RELEASE 901227-01
                                ;
.,F42A 0A       ASL                    ASL A           ;GET OFFSET INTO TABLES
.,F42B AA       TAX                    TAX
.,F42C AD A6 02 LDA $02A6              LDA PALNTS      ;GET TV STANDARD
.,F42F D0 09    BNE $F43A              BNE OPN026
.,F431 BC C1 FE LDY $FEC1,X            LDY BAUDO-1,X   ;NTSC STANDARD
.,F434 BD C0 FE LDA $FEC0,X            LDA BAUDO-2,X
.,F437 4C 40 F4 JMP $F440              JMP OPN027
                                ;
.,F43A BC EB E4 LDY $E4EB,X     OPN026 LDY BAUDOP-1,X  ;PAL STANDARD
.,F43D BD EA E4 LDA $E4EA,X            LDA BAUDOP-2,X
.,F440 8C 96 02 STY $0296       OPN027 STY M51AJB+1    ;HOLD START RATE IN M51AJB
.,F443 8D 95 02 STA $0295              STA M51AJB
.,F446 AD 95 02 LDA $0295       OPN028 LDA M51AJB      ;CALCULATE BAUD RATE
.,F449 0A       ASL                    ASL
.,F44A 20 2E FF JSR $FF2E              JSR POPEN       ;GOTO PATCH AREA
                                ;
                                ; CHECK FOR 3/X LINE RESPONSE
                                ;
.,F44D AD 94 02 LDA $0294       OPN030 LDA M51CDR      ;BIT 0 OF M51CDR
.,F450 4A       LSR                    LSR A
.,F451 90 09    BCC $F45C              BCC OPN050      ;...3 LINE
                                ;
                                ; CHECK FOR X LINE PROPER STATES
                                ;
.,F453 AD 01 DD LDA $DD01              LDA D2PRB
.,F456 0A       ASL                    ASL A
.,F457 B0 03    BCS $F45C              BCS OPN050
.,F459 20 0D F0 JSR $F00D              JMP CKDSRX      ;NO DATA SET...DSR ERROR EXIT
```

## Key Registers
- $DD01 - CIA 2 - Port B (used here to test modem/X-line state via bit shifts)

## References
- "kernal_rs232_open_full" — full OPN/POPEN sequence and cleanup (see other chunks for CLN232, POPEN, buffer setup)

## Labels
- BITNUM
- M51CTR
- M51AJB
- PALNTS
- M51CDR
