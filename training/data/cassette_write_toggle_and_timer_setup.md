# WRITE — Cassette write/format bit output routine (KERNAL)

**Summary:** Implements cassette write bit output by shifting OCHAR into carry (LSR), selecting short/long write pulse, loading a one-shot period into CIA1 Timer 2 ($DC06/$DC07), clearing/arming the timer interrupt ($DC0D/$DC0F), toggling the 6510 port write bit at $01 (R6510), and returning (RTS). Searchable terms: $DC06, $DC07, $DC0D, $DC0F, $0001, OCHAR, LSR, BCC, RTS.

## Description
This KERNAL routine (label WRITE) emits a single cassette write pulse determined by the LSB of OCHAR. Operation steps:

- Load OCHAR (zero page $BD) into A and shift right once (LSR A) so the former bit 0 is placed into Carry.
- Use the branch (BCC) to select between two pulse widths:
  - If Carry clear (bit was 0): load #$60 (short write pulse).
  - If Carry set (bit was 1): load #$B0 (long write pulse).
- Set up CIA1 Timer 2 with the chosen low byte and a zero high byte (LDX #$00; STA $DC06; STX $DC07). This programs the one-shot duration.
- Read CIA1 Interrupt Control Register (LDA $DC0D) to clear any pending IRQ condition for this timer.
- Write #$19 into CIA1 control register B ($DC0F) to enable the timer in one-shot mode (arm the timer).
- Toggle bit $08 on the 6510 port at zero page $01 (R6510) with EOR #$08 / STA $01, then mask off all but the write bit with AND #$08 before returning with RTS.

Behavioral notes taken directly from the routine: the write bit is toggled per bit output, timer is used as a one-shot to produce the pulse width, and the routine returns immediately after arming/toggling (bit-level processing / end-of-block handling continues elsewhere).

## Source Code
```asm
                                .LIB   WRITE
                                ; CASSETTE INFO - FSBLK IS BLOCK COUNTER FOR RECORD
                                ;       FSBLK = 2 -FIRST HEADER
                                ;             = 1 -FIRST DATA
                                ;             = 0 -SECOND DATA
                                ;
                                ; WRITE - TOGGLE WRITE BIT ACCORDING TO LSB IN OCHAR
                                ;
.,FBA6 A5 BD    LDA $BD         WRITE  LDA OCHAR       ;SHIFT BIT TO WRITE INTO CARRY
.,FBA8 4A       LSR             LSR    A
.,FBA9 A9 60    LDA #$60        LDA    #96             ;...C CLR WRITE SHORT
.,FBAB 90 02    BCC $FBAF       BCC    WRT1
.,FBAD A9 B0    LDA #$B0        WRTW   LDA #176        ;...C SET WRITE LONG
.,FBAF A2 00    LDX #$00        WRT1   LDX #0          ;SET AND STORE TIME
.,FBB1 8D 06 DC STA $DC06       WRTX   STA D1T2L
.,FBB4 8E 07 DC STX $DC07       STX    D1T2H
.,FBB7 AD 0D DC LDA $DC0D       LDA    D1ICR           ;CLEAR IRQ
.,FBBA A9 19    LDA #$19        LDA    #$19            ;ENABLE TIMER (ONE-SHOT)
.,FBBC 8D 0F DC STA $DC0F       STA    D1CRB
.,FBBF A5 01    LDA $01         LDA    R6510           ;TOGGLE WRITE BIT
.,FBC1 49 08    EOR #$08        EOR    #$08
.,FBC3 85 01    STA $01         STA    R6510
.,FBC5 29 08    AND #$08        AND    #$08            ;LEAVE ONLY WRITE BIT
.,FBC7 60       RTS             RTS
```

## Key Registers
- $DC06-$DC07 - CIA1 - Timer 2 low/high (D1T2L / D1T2H) — one-shot period bytes set here
- $DC0D-$DC0F - CIA1 - Interrupt Control Register / Control B (D1ICR / D1CRB) — read to clear IRQ, write to arm timer
- $0001 - 6510 I/O port (R6510) — write bit toggled via EOR/STA; masked with AND #$08
- $00BD - Zero page - OCHAR (source bit shifted into carry)

## References
- "write_end_of_block_and_bit_processing" — expands on continued bit-level processing and end-of-block handling
- "bsiv_change_irq_vectors" — expands on uses of IRQ vector changes for write-zero/data timing

## Labels
- WRITE
- OCHAR
- D1T2L
- D1T2H
- D1ICR
- D1CRB
- R6510
