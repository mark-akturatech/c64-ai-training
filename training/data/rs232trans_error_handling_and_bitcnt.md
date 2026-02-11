# KERNAL: BITCNT and RSRCVR (Transmitter/Receiver, 6551 M51CTR handling)

**Summary:** Implements BITCNT (calculates word length based on 6551 M51CTR) and RSRCVR (NMI receiver routine) for the C64 KERNAL; touches $0293 (M51CTR) and zero-page variables $A7-$AB used for input bit collection, parity, and buffer pointers. BITCNT returns bit-count+1 in X; RSRCVR shifts incoming bits into RIDATA, updates RIPRTY, checks stop bits via M51CTR, and stores completed bytes.

## BITCNT — calculate actual number of bits to send
BITCNT (entry at $EF4A) computes the transmit word length (returned as #bits+1) based on the 6551 ACIA control register (M51CTR at $0293). Algorithm summary:
- Initialize X = 9 (base value, returned as #bits+1).
- Test M51CTR bit fields (via BIT $0293 with A = #%00100000).
  - Depending on the relevant control bits (bit 5 and bit 6 of M51CTR), decrement X one or more times to reflect 7/8/6/5 bit word formats produced by the 6551.
- Return with X holding the computed value; calling code expects returned value = number_of_data_bits + 1.

(The routine returns via RTS with X set. The exact bit-to-word mapping follows the 6551 M51CTR layout checked by masks used in the routine.)

## RSRCVR — NMI routine to collect incoming RS-232 bits
RSRCVR (entry at $EF59) is the NMI handler used to collect serial input bits into bytes and store completed bytes in a circular buffer. Key behavior and variables:
- Entry check: LDX $A9 (RINONE) — if non-zero, a start bit condition did not hold and routine returns immediately.
- Bit counting: DEC $A8 (BITCI) decrements the bit counter. If BITCI becomes zero a full byte has been received (BEQ => branch to store). If negative (BMI), the handler is processing stop bits.
- Parity: On each data bit, RIPRTY ($AB) is XORed with INBIT ($A7) to keep running parity. The incoming bit is shifted into RIDATA ($AA): LSR $A7 (INBIT), then ROR $AA (RIDATA) so new bit enters bit 7 (carry) into low-order position as configured.
- Stop-bit processing and validation:
  - When the stop-bit stage is reached, BITCI is decremented again (DEC $A8) to make parity checking work with no-parity modes.
  - The routine loads M51CTR ($0293) and ASL A to move the stop-bit configuration into the carry, then uses ADC BITCI to combine stop-bit count info with BITCI to decide accept/store behavior. This supports 6551-configured stop-bit counts.
- Buffering: On successful reception and validation of the stop bit(s), the assembled RIDATA/RIPRTY are stored via the indirect buffer pointer (RIBUF) into the receive ring (RIDBS/RIDBE pointers) — exact store path is elsewhere in the KERNAL (RSR store branch points are present but not fully shown in this excerpt).
- Quick return: If a start-bit condition is seen to be invalid early, routine returns (BNE RSRTRT).

Variables used (names from comments / zero-page addresses):
- INBIT ($A7) — current sampled input bit
- BITCI / BITCI ($A8) — bit count remaining
- RINONE ($A9) — flag for start-bit check (non-zero indicates no start)
- RIDATA ($AA) — shift register / byte input buffer
- RIPRTY ($AB) — running parity accumulator for the incoming byte
- RIBUF, RIDBE, RIDBS — pointers / indices to the receive buffer (indirect buffer handling referenced)

Behavioral notes:
- Parity is calculated by XORing each incoming data bit into RIPRTY.
- Incoming data bits are shifted (LSR INBIT; ROR RIDATA) so that the sampled bit enters the data byte as intended by the KERNAL bit order.
- M51CTR influences both BITCNT and stop-bit validation in RSRCVR. The code explicitly reads $0293 and manipulates the accumulator to extract the relevant configuration bits.

## Source Code
```asm
                                ;   RETURNS #OF BITS+1
                                ;
.,EF4A A2 09    LDX #$09        BITCNT LDX #9          ;CALC WORD LENGTH
.,EF4C A9 20    LDA #$20               LDA #$20
.,EF4E 2C 93 02 BIT $0293              BIT M51CTR
.,EF51 F0 01    BEQ $EF54              BEQ BIT010
.,EF53 CA       DEX                    DEX             ;BIT 5 HIGH IS A 7 OR 5
.,EF54 50 02    BVC $EF58       BIT010 BVC BIT020
.,EF56 CA       DEX                    DEX             ;BIT 6 HIGH IS A 6 OR 5
.,EF57 CA       DEX                    DEX
.,EF58 60       RTS             BIT020 RTS
                                .END
                                .LIB   RS232RCVR
                                ; RSRCVR - NMI ROUTINE TO COLLECT
                                ;  DATA INTO BYTES
                                ;
                                ; RSR 8/18/80
                                ;
                                ; VARIABLES USED
                                ;   INBIT - INPUT BIT VALUE
                                ;   BITCI - BIT COUNT IN
                                ;   RINONE - FLAG FOR START BIT CHECK <>0 START BIT
                                ;   RIDATA - BYTE INPUT BUFFER
                                ;   RIPRTY - HOLDS BYTE INPUT PARITY
                                ;   RIBUF - INDIRECT POINTER TO DATA BUFFER
                                ;   RIDBE - INPUT BUFFER INDEX TO END
                                ;   RIDBS - INPUT BUFFER POINTER TO START
                                ;   IF RIDBE=RIDBS THEN INPUT BUFFER EMPTY
                                ;
.,EF59 A6 A9    LDX $A9         RSRCVR LDX RINONE      ;CHECK FOR START BIT
.,EF5B D0 33    BNE $EF90              BNE RSRTRT      ;WAS START BIT
                                ;
.,EF5D C6 A8    DEC $A8                DEC BITCI       ;CHECK WHERE WE ARE IN INPUT...
.,EF5F F0 36    BEQ $EF97              BEQ RSR030      ;HAVE A FULL BYTE
.,EF61 30 0D    BMI $EF70              BMI RSR020      ;GETTING STOP BITS
                                ;
                                ; CALC PARITY
                                ;
.,EF63 A5 A7    LDA $A7                LDA INBIT       ;GET DATA UP
.,EF65 45 AB    EOR $AB                EOR RIPRTY      ;CALC NEW PARITY
.,EF67 85 AB    STA $AB                STA RIPRTY
                                ;
                                ; SHIFT DATA BIT IN
                                ;
.,EF69 46 A7    LSR $A7                LSR INBIT       ;IN BIT POS 0
.,EF6B 66 AA    ROR $AA                ROR RIDATA      ;C INTO DATA
                                ;
                                ; EXIT
                                ;
.,EF6D 60       RTS             RSREXT RTS
                                ; HAVE STOP BIT, SO STORE IN BUFFER
                                ;
.,EF6E C6 A8    DEC $A8         RSR018 DEC BITCI       ;NO PARITY, DEC SO CHECK WORKS
.,EF70 A5 A7    LDA $A7         RSR020 LDA INBIT       ;GET DATA...
.,EF72 F0 67    BEQ $EFDB              BEQ RSR060      ;...ZERO, AN ERROR?
                                ;
.,EF74 AD 93 02 LDA $0293              LDA M51CTR      ;CHECK FOR CORRECT # OF STOP BITS
.,EF77 0A       ASL                    ASL A           ;CARRY TELL HOW MAY STOP BITS
.,EF78 A9 01    LDA #$01               LDA #01
.,EF7A 65 A8    ADC $A8                ADC BITCI
```

## Key Registers
- $0293 - 6551 (ACIA) - M51CTR (control register: word length / stop bits flags used by BITCNT and RSRCVR)
- $A7 - Zero Page - INBIT (sampled input bit)
- $A8 - Zero Page - BITCI (bit count remaining)
- $A9 - Zero Page - RINONE (start-bit flag)
- $AA - Zero Page - RIDATA (shifted-in input byte buffer)
- $AB - Zero Page - RIPRTY (running parity accumulator)

## References
- "rs232trans_parity_and_bgn" — expands on transmitter start and parity code that uses BITCNT

## Labels
- BITCNT
- RSRCVR
- M51CTR
- INBIT
- BITCI
- RINONE
- RIDATA
- RIPRTY
