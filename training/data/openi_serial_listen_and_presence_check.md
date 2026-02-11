# OPENI (KERNAL $F3D5) — SERIAL/IEEE DEVICE OPEN CHECK

**Summary:** KERNAL OPENI ($F3D5) checks for a valid secondary address (SA, $00B9) and filename length (FNLEN, $00B7), clears the serial STATUS ($0090), issues LISTN ($ED0C) and SECND ($EDB9) to contact the device, and jumps to ERROR5 ($F707) if the device is not present.

## Behavior and control flow
- Entry: OPENI at $F3D5 expects SA in $00B9 and file-name length in $00B7.
- If SA is negative (bit7 set), the routine returns immediately (BMI $F3D3).
- If FNLEN is zero (BEQ $F3D3), the routine also returns (no filename to send).
- The serial STATUS byte at $0090 is cleared (STA $0090) before contacting the device.
- FA (device number) is loaded from $00BA and LISTN is called (JSR $ED0C) to issue a LISTEN on the device.
- SA is reloaded, ORA #$F0 is applied (sets high nibble flags for SECND), then SECND is called (JSR $EDB9) to send the secondary/command byte.
- STATUS ($0090) is tested: if BPL (STATUS bit7 clear) the device is present and execution continues.
- If STATUS indicates no response (negative), the routine removes the two-byte return address from the stack (PLA; PLA) and jumps to ERROR5 ($F707) to signal "device not present" to the calling OS routines (prevents returning to OS).

Notes:
- The ORA #$F0 prepares the secondary/command byte (sets bits 4–7) before calling SECND; this is a flags/encoding step for the serial protocol.
- The double PLA removes the return address pushed by the OS so ERROR5 is executed as the effective return error handler.

## Source Code
```asm
.,F3D5 A5 B9    LDA $B9         OPENI  LDA SA
.,F3D7 30 FA    BMI $F3D3       BMI    OP175           ;NO SA...DONE
                                ;
.,F3D9 A4 B7    LDY $B7         LDY    FNLEN
.,F3DB F0 F6    BEQ $F3D3       BEQ    OP175           ;NO FILE NAME...DONE
                                ;
.,F3DD A9 00    LDA #$00        LDA    #0              ;CLEAR THE SERIAL STATUS
.,F3DF 85 90    STA $90         STA    STATUS
                                ;
.,F3E1 A5 BA    LDA $BA         LDA    FA
.,F3E3 20 0C ED JSR $ED0C       JSR    LISTN           ;DEVICE LA TO LISTEN
                                ;
.,F3E6 A5 B9    LDA $B9         LDA    SA
.,F3E8 09 F0    ORA #$F0        ORA    #$F0
.,F3EA 20 B9 ED JSR $EDB9       JSR    SECND
                                ;
.,F3ED A5 90    LDA $90         LDA    STATUS          ;ANYBODY HOME?
.,F3EF 10 05    BPL $F3F6       BPL    OP35            ;YES...CONTINUE
                                ;
                                ;THIS ROUTINE IS CALLED BY OTHER
                                ;KERNAL ROUTINES WHICH ARE CALLED
                                ;DIRECTLY BY OS.  KILL RETURN
                                ;ADDRESS TO RETURN TO OS.
                                ;
.,F3F1 68       PLA             PLA
.,F3F2 68       PLA             PLA
.,F3F3 4C 07 F7 JMP $F707       JMP    ERROR5          ;DEVICE NOT PRESENT
                                ;
```

## Key Registers
- $00B9 - KERNAL zero page - SA (secondary address / command byte)
- $00B7 - KERNAL zero page - FNLEN (filename length)
- $0090 - KERNAL zero page - STATUS (serial/IEC status byte)
- $00BA - KERNAL zero page - FA (device number / file address)
- $F3D5 - KERNAL ROM - OPENI entry point (this routine)
- $ED0C - KERNAL ROM - LISTN (issue LISTEN)
- $EDB9 - KERNAL ROM - SECND (send secondary/command byte)
- $F707 - KERNAL ROM - ERROR5 (device not present / error handler)

## References
- "serial_send_filename" — expands on sending the filename over the serial line when device present and filename length > 0
- "open_rs232_init_and_param_transfer" — related path for opening RS-232 ports (OPN232)

## Labels
- OPENI
- SA
- FNLEN
- STATUS
- FA
