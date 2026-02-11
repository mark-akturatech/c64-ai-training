# KERNAL: Initialize CIA1 Timer B, CRB and Processor Port (FBA6–FBC7)

**Summary:** KERNAL routine at $FBA6–$FBC7 sets CIA1 Timer B ($DC06/$DC07), writes CIA1 CRB ($DC0F) with #$19, reads CIA1 ICR ($DC0D), toggles processor port $0001 bit 3 (EOR #$08) and returns; uses zero-page $00BD as a condition source.

**Description**
- LDA $00BD; LSR — shifts the byte at zero page $BD right once; the LSR sets the Carry flag from bit0 of $00BD.
- Loads A with #$60, then conditionally replaces it with #$B0 if the LSR set Carry (BCC is used to skip the #$B0 load when Carry is clear). Result: A becomes either $60 (carry clear) or $B0 (carry set).
- X is set to #$00.
- STA $DC06 / STX $DC07 — writes A to CIA1 Timer B low ($DC06) and X (0) to Timer B high ($DC07), establishing an initial 16-bit Timer B value.
- AD $DC0D (LDA $DC0D) — reads CIA1 ICR (interrupt control register). The value is overwritten immediately; the read is likely for side effects/acknowledgement or timing.
- LDA #$19; STA $DC0F — writes #$19 to CIA1 CRB (control register B), configuring Timer/port behavior per CRB bits.
- LDA $0001; EOR #$08; STA $0001 — toggles bit 3 of the processor port ($01).
- AND #$08; RTS — leaves A masked to just bit 3 (0 or $08) on return.

(Parenthetical: side-effect read of $DC0D is likely intentional to acknowledge/prime CIA state.)

## Source Code
```asm
.,FBA6 A5 BD    LDA $BD
.,FBA8 4A       LSR
.,FBA9 A9 60    LDA #$60
.,FBAB 90 02    BCC $FBAF
.,FBAD A9 B0    LDA #$B0
.,FBAF A2 00    LDX #$00
.,FBB1 8D 06 DC STA $DC06
.,FBB4 8E 07 DC STX $DC07
.,FBB7 AD 0D DC LDA $DC0D
.,FBBA A9 19    LDA #$19
.,FBBC 8D 0F DC STA $DC0F
.,FBBF A5 01    LDA $01
.,FBC1 49 08    EOR #$08
.,FBC3 85 01    STA $01
.,FBC5 29 08    AND #$08
.,FBC7 60       RTS
```

## Key Registers
- $DC06-$DC07 - CIA1 - Timer B low/high (written to set initial Timer B value)
- $DC0D - CIA1 - Interrupt Control Register (ICR) (read for side-effects/acknowledgement)
- $DC0F - CIA1 - Control Register B (CRB) (written with #$19)
- $0001 - Processor port ($01) - system I/O / memory-configuration port (bit 3 toggled via EOR #$08)
- $00BD - Zero Page - input byte (LSR used to set branch Carry)

## References
- "init_filename_state" — expands on called after initializing filename/state variables
- "device_packet_assembly_and_control" — expands on status flags influence packet assembly