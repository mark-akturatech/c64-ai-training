# KERNAL SAVE library (SAVE / SAVESP / NSAVE)

**Summary:** Commodore 64 KERNAL ROM SAVE routines for cassette or IEEE-488 devices (uses vectors and KERNAL calls such as JMP ($0332) ISAVE, OPENI, LISTN, SECND, CIOUT, TWRT, STOP $FFE1). Handles indirect start/end addresses via SAL/SAH and SA, supports tape header/write (TAPEH/TWRT) and IEEE talk/listen sequences.

## Save routine overview
This chunk is the KERNAL SAVE library: routines that write a memory range to either cassette or IEEE-488 devices. Start address is supplied indirectly (via .A and saved into SAL/SAH), end address in X/Y; FA (device number) determines cassette vs IEEE. The code performs device open/listen/talk sequences, transmits the start address to the device, then iterates memory and sends bytes using CIOUT. It checks the STOP key and handles closing/unlisten appropriately. For cassette writes, it prepares tape header blocks (TAPEH) and calls TWRT to write to tape; it can also write an EOT header if requested.

Key variables used in code (names shown in source):
- SA (file secondary address) — stored at $B9
- SAL / SAH — low/high byte of the current output address (e.g., $AC/$AD)
- FA — device number (loaded from $BA)
- FNLEN — file-name length ($B7)
- FSBLK, CNTDN, PRP, OCHAR — other variables referenced by surrounding KERNAL tape/device logic (mentioned in original source)

Control flow highlights:
- SAVESP stores indirect start pointer (.A) into EAL/EAH and then transfers the start address into SAL/SAH for use during output.
- Execution jumps to the ISAVE vector (JMP ($0332)) to allow system-wide or user override.
- NSAVE acts as a monitor entry variant by loading FA (device) and validating it.
- For IEEE devices: OPENI is called to open the channel; LISTN and SECND set device to receive and secondary address; RD300 (read buffer init) is called; CIOUT is used to transmit SAL and SAH to the device, then the data loop sends bytes until CMPSTE indicates the end address has been reached. STOP ($FFE1) is polled to detect user abort; on abort CLSEI closes the channel.
- For cassette devices (FA with C-set): ZZZ obtains tape buffer address, CSTE2 is called and then TAPEH/TWRT sequences write headers and data blocks; optional EOT header on request.

KERNAL calls referenced (examples from listing):
- ISAVE vector: JMP ($0332)
- OPENI (open device)
- LISTN (device listen)
- SECND (set secondary address)
- RD300 (buffer/IO init)
- CIOUT (output a byte to open channel)
- CMPSTE (compare start to end)
- STOP ($FFE1) (detect STOP key)
- CLSEI (close device)
- INCSAL (increment SAL)
- UNLSN (unlisten)
- ZZZ, CSTE2, TAPEH, TWRT — cassette helper routines
- MSG / OUTFN — user message ('SAVING' and file name output)

Behavioral/caveats visible in code:
- Device number validation: devices <3 cause an error; device selection via FA and bit tests determine cassette vs IEEE.
- File-name presence is enforced (FNLEN must be non-zero).
- When sending to IEEE devices the start address low/high are transmitted before data bytes (CIOUT).
- The data loop increments SAL (low byte) and uses CMPSTE to determine when the specified end address is reached.
- STOP key causes early termination with channel close (CLSEI) and returns (with SEC and RTS).

## Source Code
```asm
                                .LIB   SAVE
                                ;***********************************
                                ;* SAVE                            *
                                ;*                                 *
                                ;* SAVES TO CASSETTE 1 OR 2, OR    *
                                ;* IEEE DEVICES 4>=N>=31 AS SELECT-*
                                ;* ED BY VARIABLE FA.              *
                                ;*                                 *
                                ;*START OF SAVE IS INDIRECT AT .A  *
                                ;*END OF SAVE IS .X,.Y             *
                                ;***********************************
.,F5DD 86 AE    STX $AE         SAVESP STX EAL
.,F5DF 84 AF    STY $AF         STY    EAH
.,F5E1 AA       TAX             TAX                    ;SET UP START
.,F5E2 B5 00    LDA $00,X       LDA    $00,X
.,F5E4 85 C1    STA $C1         STA    STAL
.,F5E6 B5 01    LDA $01,X       LDA    $01,X
.,F5E8 85 C2    STA $C2         STA    STAH
                                ;
.,F5EA 6C 32 03 JMP ($0332)     SAVE   JMP (ISAVE)
.,F5ED A5 BA    LDA $BA         NSAVE  LDA FA  ***MONITOR ENTRY
.,F5EF D0 03    BNE $F5F4       BNE    SV20
                                ;
.,F5F1 4C 13 F7 JMP $F713       SV10   JMP ERROR9      ;BAD DEVICE #
                                ;
.,F5F4 C9 03    CMP #$03        SV20   CMP #3
.,F5F6 F0 F9    BEQ $F5F1       BEQ    SV10
.,F5F8 90 5F    BCC $F659       BCC    SV100
.,F5FA A9 61    LDA #$61        LDA    #$61
.,F5FC 85 B9    STA $B9         STA    SA
.,F5FE A4 B7    LDY $B7         LDY    FNLEN
.,F600 D0 03    BNE $F605       BNE    SV25
                                ;
.,F602 4C 10 F7 JMP $F710       JMP    ERROR8          ;MISSING FILE NAME
                                ;
.,F605 20 D5 F3 JSR $F3D5       SV25   JSR OPENI
.,F608 20 8F F6 JSR $F68F       JSR    SAVING
.,F60B A5 BA    LDA $BA         LDA    FA
.,F60D 20 0C ED JSR $ED0C       JSR    LISTN
.,F610 A5 B9    LDA $B9         LDA    SA
.,F612 20 B9 ED JSR $EDB9       JSR    SECND
.,F615 A0 00    LDY #$00        LDY    #0
.,F617 20 8E FB JSR $FB8E       JSR    RD300
.,F61A A5 AC    LDA $AC         LDA    SAL
.,F61C 20 DD ED JSR $EDDD       JSR    CIOUT
.,F61F A5 AD    LDA $AD         LDA    SAH
.,F621 20 DD ED JSR $EDDD       JSR    CIOUT
.,F624 20 D1 FC JSR $FCD1       SV30   JSR CMPSTE      ;COMPARE START TO END
.,F627 B0 16    BCS $F63F       BCS    SV50            ;HAVE REACHED END
.,F629 B1 AC    LDA ($AC),Y     LDA    (SAL)Y
.,F62B 20 DD ED JSR $EDDD       JSR    CIOUT
.,F62E 20 E1 FF JSR $FFE1       JSR    STOP
.,F631 D0 07    BNE $F63A       BNE    SV40
                                ;
.,F633 20 42 F6 JSR $F642       BREAK  JSR CLSEI
.,F636 A9 00    LDA #$00        LDA    #0
.,F638 38       SEC             SEC
.,F639 60       RTS             RTS
                                ;
.,F63A 20 DB FC JSR $FCDB       SV40   JSR INCSAL      ;INCREMENT CURRENT ADDR.
.,F63D D0 E5    BNE $F624       BNE    SV30
.,F63F 20 FE ED JSR $EDFE       SV50   JSR UNLSN
.,F642 24 B9    BIT $B9         CLSEI  BIT SA
.,F644 30 11    BMI $F657       BMI    CLSEI2
.,F646 A5 BA    LDA $BA         LDA    FA
.,F648 20 0C ED JSR $ED0C       JSR    LISTN
.,F64B A5 B9    LDA $B9         LDA    SA
.,F64D 29 EF    AND #$EF        AND    #$EF
.,F64F 09 E0    ORA #$E0        ORA    #$E0
.,F651 20 B9 ED JSR $EDB9       JSR    SECND
                                ;
.,F654 20 FE ED JSR $EDFE       CUNLSN JSR UNLSN       ;ENTRY FOR OPENI
                                ;
.,F657 18       CLC             CLSEI2 CLC
.,F658 60       RTS             RTS
.,F659 4A       LSR             SV100  LSR A
.,F65A B0 03    BCS $F65F       BCS    SV102           ;IF C-SET THEN IT'S CASSETTE
                                ;
.,F65C 4C 13 F7 JMP $F713       JMP    ERROR9          ;BAD DEVICE #
                                ;
.,F65F 20 D0 F7 JSR $F7D0       SV102  JSR ZZZ         ;GET ADDR OF TAPE
.,F662 90 8D    BCC $F5F1       BCC    SV10            ;BUFFER IS DEALLOCATED
.,F664 20 38 F8 JSR $F838       JSR    CSTE2
.,F667 B0 25    BCS $F68E       BCS    SV115           ;STOP KEY PRESSED
.,F669 20 8F F6 JSR $F68F       JSR    SAVING          ;TELL USER 'SAVING'
.,F66C A2 03    LDX #$03        SV105  LDX #PLF        ;DECIDE TYPE TO SAVE
.,F66E A5 B9    LDA $B9         LDA    SA              ;1-PLF 0-BLF
.,F670 29 01    AND #$01        AND    #01
.,F672 D0 02    BNE $F676       BNE    SV106
.,F674 A2 01    LDX #$01        LDX    #BLF
.,F676 8A       TXA             SV106  TXA
.,F677 20 6A F7 JSR $F76A       JSR    TAPEH
.,F67A B0 12    BCS $F68E       BCS    SV115           ;STOP KEY PRESSED
.,F67C 20 67 F8 JSR $F867       JSR    TWRT
.,F67F B0 0D    BCS $F68E       BCS    SV115           ;STOP KEY PRESSED
.,F681 A5 B9    LDA $B9         LDA    SA
.,F683 29 02    AND #$02        AND    #2              ;WRITE END OF TAPE?
.,F685 F0 06    BEQ $F68D       BEQ    SV110           ;NO...
                                ;
.,F687 A9 05    LDA #$05        LDA    #EOT
.,F689 20 6A F7 JSR $F76A       JSR    TAPEH
.:F68C 24       .BYTE $24       .BYT   $24             ;SKIP 1 BYTE
                                ;
.,F68D 18       CLC             SV110  CLC
.,F68E 60       RTS             SV115  RTS
                                ;SUBROUTINE TO OUTPUT:
                                ;'SAVING <FILE NAME>'
                                ;
.,F68F A5 9D    LDA $9D         SAVING LDA MSGFLG
.,F691 10 FB    BPL $F68E       BPL    SV115           ;NO PRINT
                                ;
.,F693 A0 51    LDY #$51        LDY    #MS11-MS1       ;'SAVING'
.,F695 20 2F F1 JSR $F12F       JSR    MSG
.,F698 4C C1 F5 JMP $F5C1       JMP    OUTFN           ;<FILE NAME>
                                .END
```

## References
- "device_open_and_tape_serial_init" — expands on OPENI, LISTN, SECND, TALK/LIST setup and usage
- "tapefile_library" — expands on TAPEH/TWRT/TWRT2 tape write helpers and formats
- "read_library" — complementary read routines that verify saved data and perform read-side checks

## Labels
- SAVE
- SAVESP
- NSAVE
