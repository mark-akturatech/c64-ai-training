# KERNAL: Load from CBM IEEE device ($F4B8)

**Summary:** KERNAL routine at $F4B8–$F4F0 implements "load from IEEE device" using OPENI/TALK/TKSA/ACPTR; it checks FNLEN ($00B7), saves/restores SA ($00B9), receives the two-byte load address into EAL/EAH ($00AE/$00AF), tests STATUS ($0090) for file-not-found, supports SA=0 fallback to MEMUSS ($00C3/$00C4), and finally JSRs LODING.

## Routine Overview
This KERNAL routine performs the standard IEEE-488 (CBM) file load start sequence:

- Verify a file name is present by checking FNLEN ($00B7). If zero, jump to ERROR8.
- Save current SA (secondary address / special argument) from $00B9 into X.
- Call LUKING to print a "SEARCHING" message.
- Put the special load command value #$60 into SA ($00B9) and JSR OPENI to open the device file.
- LDA FA ($00BA) and JSR TALK to establish the talk (open) on the device.
- LDA SA and JSR TKSA to tell the device which secondary address to use (TKSA prepares the device to transfer).
- JSR ACPTR to read the first byte (low load address) into A and STA EAL ($00AE).
- Test STATUS ($0090) by two LSRs then BCS; if branch taken control goes to LD90 (file-not-found handling).
- If OK, JSR ACPTR again to read the next byte (high load address) into EAH ($00AF).
- TXA/BNE checks old SA (X was loaded with SA earlier). If X != 0, use that disk address; otherwise, load the user-specified default start address from MEMUSS ($00C3/$00C4) into EAL/EAH.
- JSR LODING to announce the load operation and continue with the byte-transfer loop (handled in a separate routine).

Notes:
- ACPTR is used to receive single bytes from the IEEE device; the first two bytes are treated as the 16-bit load address (low then high).
- The code checks STATUS with two LSRs and BCS; this reproduces the original KERNAL's status-bit test (see ACPTR/STATUS for exact bit meanings in related documents).
- The routine preserves and inspects SA to decide whether to use the device-supplied address or MEMUSS.

## Source Code
```asm
                                ;
                                ;LOAD FROM CBM IEEE DEVICE
                                ;
.,F4B8 A4 B7    LDY $B7         LDY    FNLEN           ;MUST HAVE FILE NAME
.,F4BA D0 03    BNE $F4BF       BNE    LD25            ;YES...OK
                                ;
.,F4BC 4C 10 F7 JMP $F710       JMP    ERROR8          ;MISSING FILE NAME
                                ;
.,F4BF A6 B9    LDX $B9         LD25   LDX SA          ;SAVE SA IN .X
.,F4C1 20 AF F5 JSR $F5AF       JSR    LUKING          ;TELL USER LOOKING
.,F4C4 A9 60    LDA #$60        LDA    #$60            ;SPECIAL LOAD COMMAND
.,F4C6 85 B9    STA $B9         STA    SA
.,F4C8 20 D5 F3 JSR $F3D5       JSR    OPENI           ;OPEN THE FILE
                                ;
.,F4CB A5 BA    LDA $BA         LDA    FA
.,F4CD 20 09 ED JSR $ED09       JSR    TALK            ;ESTABLISH THE CHANNEL
.,F4D0 A5 B9    LDA $B9         LDA    SA
.,F4D2 20 C7 ED JSR $EDC7       JSR    TKSA            ;TELL IT TO LOAD
                                ;
.,F4D5 20 13 EE JSR $EE13       JSR    ACPTR           ;GET FIRST BYTE
.,F4D8 85 AE    STA $AE         STA    EAL
                                ;
.,F4DA A5 90    LDA $90         LDA    STATUS          ;TEST STATUS FOR ERROR
.,F4DC 4A       LSR             LSR    A
.,F4DD 4A       LSR             LSR    A
.,F4DE B0 50    BCS $F530       BCS    LD90            ;FILE NOT FOUND...
.,F4E0 20 13 EE JSR $EE13       JSR    ACPTR
.,F4E3 85 AF    STA $AF         STA    EAH
                                ;
.,F4E5 8A       TXA             TXA                    ;FIND OUT OLD SA
.,F4E6 D0 08    BNE $F4F0       BNE    LD30            ;SA<>0 USE DISK ADDRESS
.,F4E8 A5 C3    LDA $C3         LDA    MEMUSS          ;ELSE LOAD WHERE USER WANTS
.,F4EA 85 AE    STA $AE         STA    EAL
.,F4EC A5 C4    LDA $C4         LDA    MEMUSS+1
.,F4EE 85 AF    STA $AF         STA    EAH
.,F4F0 20 D2 F5 JSR $F5D2       LD30   JSR LODING      ;TELL USER LOADING
```

## Key Registers
- $00B7 - FNLEN - file name length (must be nonzero)
- $00B9 - SA - secondary address / special argument (saved in X)
- $00BA - FA - file/device number for TALK
- $0090 - STATUS - device status tested after first ACPTR
- $00AE - EAL - effective load address, low byte (filled from device)
- $00AF - EAH - effective load address, high byte (filled from device)
- $00C3-$00C4 - MEMUSS - user's preferred load address (low/high), used if SA=0

## References
- "nload_device_checks_and_basic_errors" — expands on errors and device-checks when device is IEEE
- "ieee_receive_and_store_loop" — expands on the byte-receive loop after fetching the load address
- "load_header_and_entry_points" — expands on monitor entry behavior and alternate start semantics

## Labels
- FNLEN
- SA
- FA
- STATUS
- EAL
- EAH
- MEMUSS
