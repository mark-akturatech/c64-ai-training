# KERNAL RS232 helpers — NO DSR/CTS, DISABLE TIMER, COMPUTE BIT COUNT

**Summary:** KERNAL 6502 routines for RS232 error handling and setup: NO DSR/CTS updates 6551 status image ($0297) with error flags ($40/$10), DISABLE TIMER manipulates CIA#2 ICR ($DD0D) and ENABL ($02A1) to mask timer interrupts and clear NMI, and COMPUTE BIT COUNT derives the word bit-count into X from M51CTR ($0293). Contains exact addresses and instruction flow for use with RS232 send/receive and handshake code.

## NO DSR / CTS ERROR
This handler marks a 6551 modem-control error in the 6551 status-image word at $0297 (RSSTAT). Two entry points exist:
- Entry for "NO DSR" places $40 in A and continues.
- Entry for "NO CTS" places $10 in A and continues.

Routine behavior:
- A is loaded with the appropriate error flag ($40 or $10).
- That flag is ORed into the current 6551 status-image at $0297 so the status image preserves existing bits and adds the error bit.
- The updated status-image is written back to $0297 for other RS232 routines to read.

Effect: sets the RSSTAT image with the DSR/CTS missing bit(s) for higher-level RS232 send/receive helpers to detect and handle.

## DISABLE TIMER
This routine manipulates CIA#2 and the KERNAL ENABL image to mask the CIA#2 timer interrupt and to clear an NMI condition (as used by the RS232 code).

Routine behavior (instruction-level):
- Load A with #$01 and store to CIA#2 ICR ($DD0D).
- EOR A with the current ENABL image at $02A1 (A := A XOR [$02A1]).
- OR A with #$80 (set bit 7).
- Store the result back to ENABL ($02A1).
- Store the same value to CIA#2 ICR ($DD0D) again.
- RTS.

Effect: writes to the CIA#2 interrupt control register ($DD0D) and updates the ENABL image ($02A1) so the timer B interrupt is masked and the NMI/enable bits (bit 7) are set in the ENABL image used by KERNAL interrupt handling.

## COMPUTE BIT COUNT
This routine computes the number of bits in the serial word to be sent and returns it in X. The number is derived from bits 5 and 6 of M51CTR (the 6551 control-register image) at $0293. Bit 7 of M51CTR denotes stop-bit count (not adjusted here).

Algorithm summary:
- Set X = 9 (default).
- Test bit 5 by performing BIT with A = #$20 against $0293.
  - If bit 5 is set, decrement X once.
- After the BIT, the V flag contains bit 6 of $0293.
  - If bit 6 is set (V=1), decrement X two additional times.
- Return with X holding the final bit count.

Result mapping (bits 6:5 of M51CTR -> final X):
- 00 -> X = 9
- 01 -> X = 8
- 10 -> X = 7
- 11 -> X = 6

Note: bit 7 (stop bits) is noted in the source but not handled by this routine; caller must account for stop-bit handling if needed.

## Source Code
```asm
; *** NO DSR / CTS ERROR
; (A) is loaded with the error flag - $40 for no DSR, and $10 for no CTS.
; This is then ORed with 6551 status image and stored in RSSTAT.
.;EF2E A9 40       LDA #$40         ; entrypoint for 'NO DSR'
.;EF30 2C          .BYTE $2C        ; mask next LDA-command
.;EF31 A9 10       LDA #$10         ; entrypoint for 'NO CTS'
.;EF33 0D 97 02    ORA $0297        ; RSSTAT, 6551 status register image
.;EF36 8D 97 02    STA $0297

; *** DISABLE TIMER
; This routine set the interrupt mask on CIA#2 timer B. It
; also clears the NMI flag.
.;EF39 A9 01       LDA #$01         ; CIA#2 interrupt control register
.;EF3B 8D 0D DD    STA $DD0D        ; ENABL, RS232 enables (CIA#2 ICR)
.;EF3E 4D A1 02    EOR $02A1
.;EF41 09 80       ORA #$80         ; ENABL
.;EF43 8D A1 02    STA $02A1        ; store back ENABL image
.;EF46 8D 0D DD    STA $DD0D
.;EF49 60          RTS

; *** COMPUTE BIT COUNT
; Compute number of bits in the word to be sent. Word length is in bits 5&6
; of M51CTR. Bit 7 indicates number of stop bits. On exit, number of bits in X.
.;EF4A A2 09       LDX #$09
.;EF4C A9 20       LDA #$20
.;EF4E 2C 93 02    BIT $0293        ; M51CTR, 6551 control register image
.;EF51 F0 01       BEQ $EF54
.;EF53 CA          DEX
.;EF54 50 02       BVC $EF58
.;EF56 CA          DEX
.;EF57 CA          DEX
.;EF58 60          RTS
```

## Key Registers
- $0293 - 6551 (M51CTR) - 6551 control-register image (bits 5&6 = word length info; bit 7 = stop-bit indicator)
- $0297 - 6551 (RSSTAT) - 6551 status-register image (ORed with $40 = NO DSR, $10 = NO CTS)
- $02A1 - KERNAL ENABL image - KERNAL interrupt enable image used to mask/unmask interrupts and NMI handling
- $DD00-$DD0F - CIA#2 registers (CIA#2 ICR is $DD0D) — CIA#2 interrupt control register manipulated to mask timer B

## References
- "rs232_send_receive_helpers" — expands on callers and when RS232 TX setup invokes NO DSR/CTS handling

## Labels
- M51CTR
- RSSTAT
- ENABL
