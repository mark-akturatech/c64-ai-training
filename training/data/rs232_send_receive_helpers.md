# RS232 SEND (KERNAL) — Transmit state machine and configuration

**Summary:** RS232 transmit routines from the KERNAL: RS232 SEND and SEND NEW RS232 BYTE. Uses zero‑page variables BITTS/$B4, NXTBIT/$B5, RODATA/$B6, ROPRTY/$BD and buffer pointer page ($F9), plus 6551 command/control images at $0293-$029D and buffer pointers at $0298-$029E. Handles parity, stop bits (from 6551 images), 3-line vs X-line handshake (DSR/CTS), and sets RS232 status on handshake errors.

## Overview
This chunk documents the KERNAL transmit-side state machine responsible for shifting out bits of the current RS232 byte and for setting up the next byte when one has finished. Two entry points are present:

- RS232 SEND (main): invoked to progress transmission when an NMI (from the 6551/CTS) indicates the transmitter can advance. It:
  - Reads BITTS ($B4) — the remaining bit-count state.
  - If BITTS == 0 it jumps to SEND NEW RS232 BYTE to fetch the next byte.
  - Otherwise it shifts the current RODATA byte right (LSR $B6), updates parity (EOR with ROPRTY/$BD), stores the next bit to send in NXTBIT ($B5), and decrements BITTS.
  - When BITTS reaches zero it evaluates 6551 command/control images ($0294/$0293) to decide whether/which parity bits and how many stop bits to append and adjusts BITTS accordingly; parity handling supports no parity, odd/even, mark/space as encoded by the 6551 image bits.

- SEND NEW RS232 BYTE: prepares variables to begin sending a new byte:
  - Tests handshake mode via bit(s) in the 6551 command image ($0294). If in X‑line mode it checks external handshake lines (DSR and CTS) via the RS232 port read (BIT $DD01); if handshake fails it sets RS232 status (RSSTAT) and returns with an error.
  - Clears parity (ROPRTY/$BD) and NXTBIT ($B5).
  - Loads BITNUM from $0298 and stores to BITTS ($B4).
  - Loads the start page RODBS ($029D) into Y and compares to RODBE ($029E); if equal the output buffer is empty and the code disables the RS232 timer.
  - Otherwise it reads the next byte with indirect indexed addressing LDA ($F9),Y into RODATA ($B6) and increments RODBS ($029D).

The routines use the 6551 (ACIA) configuration images kept in KERNAL workspace rather than reading the device directly; those images are consulted to determine parity and stop‑bit behavior.

## Detailed behavior and variables
- Zero‑page variables used by the transmitter:
  - $B4 (BITTS) — RS232 out bit count (remaining bits to send, modified by DEC/INC).
  - $B5 (NXTBIT) — next RS232 bit to present to the hardware (low 3 bits used).
  - $B6 (RODATA) — RS232 out byte buffer (byte currently being shifted out).
  - $BD (ROPRTY) — running parity accumulator / parity output selection.
  - ($F9) — pointer to the RS232 out buffer page; LDA ($F9),Y reads the next byte.

- 6551 image/control memory:
  - $0293 and $0294 are used as 6551 control/command register images (M51CTR at $0293, M51CDR at $0294). The code uses BIT $0294 and BIT $0293 tests (and tests bit $20 in $0294) to decide parity, mark/space, and stop bits behavior.

- Parity & stop-bit handling (as implemented):
  - After BITTS reaches zero for a byte, the code loads #$20 and BITs it against $0294 to check a parity enable flag. If parity is disabled the routine skips parity insertion.
  - If parity is enabled the code follows branches (BMI/BVS/BPL/BVC patterns) to select mark/space/odd/even modes and set ROPRTY/$BD accordingly.
  - Stop bits are controlled via $0293 (M51CTR): a BPL branch indicates one stop bit; otherwise BITTS is decremented further to add the second stop bit when required.

- Handshake handling in SEND NEW RS232 BYTE:
  - A LSR of $0294 is used to test handshake mode; in X‑line mode the routine executes BIT $DD01 (CIA2) to check RS232 port status lines. If DSR or CTS indicate not ready, the code records an error in RSSTAT and branches accordingly.
  - If the output buffer is empty (RODBS == RODBE) the transmit timer is disabled (BEQ to disable path). Otherwise the next byte is loaded and RODBS incremented.

- Control flow notes:
  - The main SEND code assumes it runs under NMI timing; it shifts one bit per invocation and updates parity/bit counters so the NMI handler can present NXTBIT to the physical port.
  - The code uses signed branches (BMI/BPL/BVS/BVC) keyed to bits set in the 6551 image bytes to dispatch parity/mode choices; the exact mapping of which 6551 bits correspond to which branch targets mirrors the 6551 command/control layout.

## Source Code
```asm
.,EEBB A5 B4    LDA $B4         BITTS, RS232 out bit count
.,EEBD F0 47    BEQ $EF06       send new RS232 byte
.,EEBF 30 3F    BMI $EF00
.,EEC1 46 B6    LSR $B6         RODATA, RS232 out byte buffer
.,EEC3 A2 00    LDX #$00
.,EEC5 90 01    BCC $EEC8
.,EEC7 CA       DEX
.,EEC8 8A       TXA
.,EEC9 45 BD    EOR $BD         ROPRTY, RS232 out parity
.,EECB 85 BD    STA $BD
.,EECD C6 B4    DEC $B4         BITTS
.,EECF F0 06    BEQ $EED7
.,EED1 8A       TXA
.,EED2 29 04    AND #$04
.,EED4 85 B5    STA $B5         NXTBIT, next RS232 bit to send
.,EED6 60       RTS
.,EED7 A9 20    LDA #$20
.,EED9 2C 94 02 BIT $0294       M51CDR, 6551 command register image
.,EEDC F0 14    BEQ $EEF2       no parity
.,EEDE 30 1C    BMI $EEFC       mark/space transmit
.,EEE0 70 14    BVS $EEF6       even parity
.,EEE2 A5 BD    LDA $BD         ROPRTY, out parity
.,EEE4 D0 01    BNE $EEE7
.,EEE6 CA       DEX
.,EEE7 C6 B4    DEC $B4         BITTS, out bit count
.,EEE9 AD 93 02 LDA $0293       M51CTR, 6551 control register image
.,EEEC 10 E3    BPL $EED1       one stop bit only
.,EEEE C6 B4    DEC $B4         BITTS
.,EEF0 D0 DF    BNE $EED1
.,EEF2 E6 B4    INC $B4         BITTS
.,EEF4 D0 F0    BNE $EEE6
.,EEF6 A5 BD    LDA $BD         ROPRTY
.,EEF8 F0 ED    BEQ $EEE7
.,EEFA D0 EA    BNE $EEE6
.,EEFC 70 E9    BVS $EEE7
.,EEFE 50 E6    BVC $EEE6
.,EF00 E6 B4    INC $B4         BITTS
.,EF02 A2 FF    LDX #$FF
.,EF04 D0 CB    BNE $EED1

                                *** SEND NEW RS232 BYTE
.,EF06 AD 94 02 LDA $0294       M51CDR, 6551 command register
.,EF09 4A       LSR             test handshake mode
.,EF0A 90 07    BCC $EF13       3-line mode (no handshake)
.,EF0C 2C 01 DD BIT $DD01       RS232 port
.,EF0F 10 1D    BPL $EF2E       no DSR, error
.,EF11 50 1E    BVC $EF31       no CTS, error
.,EF13 A9 00    LDA #$00
.,EF15 85 BD    STA $BD         ROPRTY, RS232 out parity
.,EF17 85 B5    STA $B5         NXTBIT, next bit to send
.,EF19 AE 98 02 LDX $0298       BITNUM, number of bits left to send
.,EF1C 86 B4    STX $B4         BITTS, RS232 out bit count
.,EF1E AC 9D 02 LDY $029D       RODBS, start page of out buffer
.,EF21 CC 9E 02 CPY $029E       RODBE, index to end if out buffer
.,EF24 F0 13    BEQ $EF39       disable timer
.,EF26 B1 F9    LDA ($F9),Y     RS232 out buffer
.,EF28 85 B6    STA $B6         RODATA, RS232 out byte buffer
.,EF2A EE 9D 02 INC $029D       RODBS
.,EF2D 60       RTS
```

## Key Registers
- $0293-$0294 - 6551 (ACIA) images — M51CTR (control) and M51CDR (command); used to select parity, mark/space, stop-bit behavior and handshake mode.
- $0298 - Kernel workspace BITNUM — number of bits configured to send per byte (loaded into BITTS).
- $029D-$029E - RODBS (start page of out buffer) and RODBE (end index); used to read next transmit byte and detect empty buffer.
- $B4 - Zero Page - BITTS, RS232 out bit count (remaining bits to transmit).
- $B5 - Zero Page - NXTBIT, next RS232 bit to present.
- $B6 - Zero Page - RODATA, current RS232 byte being shifted out.
- $BD - Zero Page - ROPRTY, running parity / parity output selection.
- $F9 (indirect pointer) - Zero Page pointer for RS232 out buffer pages (reads via LDA ($F9),Y).

## References
- "rs232_error_and_timer_and_bitcount" — expands on error codes, timer control and bit count computation
- "rs232_receive_and_processing" — receiver-side state machine complementary to this transmitter

## Labels
- RS232 SEND
- SEND NEW RS232 BYTE
- BITTS
- NXTBIT
- ROPRTY
