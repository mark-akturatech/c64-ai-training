# Non-IRQ CBM Data Block — Tape Loader (02A7–0303)

**Summary:** CBM Data-block non-IRQ turbo loader that installs a new KERNAL STOP vector ($0328-$0329 → $02A7), blanks the screen via VIC-II $D011, initializes zeroed RAM locations, implements a Read Bit routine using CIA timers and ICRs ($DC0D, $DD0D, $DD07, $DD0F), and performs autostart via the IMAIN vector at $0302.

## Boot & flow overview
This loader is a compact non-IRQ (polled) tape loader and bootstrap. Key actions, in order:

- Install new KERNAL STOP vector: store $02A7 into $0328/$0329 so the KERNAL STOP entry goes to the loader entry.
- Disable interrupts briefly (SEI), perform vector change and initialization, then re-enable interrupts (CLI) during setup.
- Initialize several zeroed RAM locations used by the loader (zeroing $00C6, $00C0, $0002).
- Blank the screen by clearing bit(s) in VIC-II $D011 (AND #$EF), then provide a brief delay loop.
- Set SEI again and JMP into loader main at $0351.
- Read Bit subroutine: poll CIA1 ICR ($DC0D) to detect the incoming tape pulse (negative edge), check CIA2 ICR ($DD0D) for a prior Timer-B countdown state, reload Timer B latch ($DD07) and start Timer B via Control B ($DD0F) with a one-shot/force-load pattern ($19) to time pulses.
- Return-to-prompt routine: JSR $A68E to reset CHRGET pointer, store via indirect pointer ($007A),Y, then JMP $A474 which prints "READY" and continues with keyboard buffer processing.
- Contains small data tables used for RUN <RETURN> key sequence and autostart bytes at $0302 ($AE $02).

Behavioral notes (from the listing):
- The loader uses polled CIA interrupt flags (no IRQ handler); CIA timer B is used as a precise countdown for bit-timing (one-shot mode via $DD0F).
- The STOP vector patch ensures control transfers into the loader when the KERNAL STOP routine is invoked.
- The autostart is performed via the IMAIN/autostart mechanism at $0302.

## Source Code
```asm
******************
* CBM Data block *
******************

--New STOP routine (ignore it now)-
02A7  A9  80      LDA #$80
02A9  05  91      ORA $91
02AB  4C  EF  F6  JMP $F6EF
-----------------------------------

************************
* Start of this Loader *
************************
--Boot-----------------------------
02AE  A9  A7      LDA #$A7
02B0  78          SEI
02B1  8D  28  03  STA $0328  ; Changes Vector to "Kernal STOP
02B4  A9  02      LDA #$02   ; Routine" into $02A7
02B6  8D  29  03  STA $0329

02B9  58          CLI

02BA  A0  00      LDY #$00   ; Inits some locations used by
02BC  84  C6      STY $C6    ; this loader
02BE  84  C0      STY $C0
02C0  84  02      STY $02

02C2  AD  11  D0  LDA $D011  ; Blanks screen
02C5  29  EF      AND #$EF
02C7  8D  11  D0  STA $D011

02CA  CA          DEX        ; A small pause here
02CB  D0  FD      BNE $02CA
02CD  88          DEY
02CE  D0  FA      BNE $02CA

02D0  78          SEI        ; Sets interrupt disable
                             ; status bit
02D1  4C  51  03  JMP $0351
-----------------------------------

--Read Bit subroutine--------------
02D4  AD  0D  DC  LDA $DC0D  ; Checks the interrupt register
02D7  29  10      AND #$10   ; to see if the pulse (negative
02D9  F0  F9      BEQ $02D4  ; edge on a C64) came in or not

02DB  AD  0D  DD  LDA $DD0D  ; Checks the countdown (bit 2 will
                             ; be 1 if countdown runned out)

02DE  8E  07  DD  STX $DD07  ; Sets a new Timer B countdown

02E1  4A          LSR        ; Move bit 2 to the Carry bit
02E2  4A          LSR
02E3  A9  19      LDA #$19   ; Starts Timer B (one shot, force
02E5  8D  0F  DD  STA $DD0F  ; latch value being loaded)
02E8  60          RTS
-----------------------------------

--Back to prompt-------------------
02E9  20  8E  A6  JSR $A68E  ; Resets the CHRGET pointer

02EC  A9  00      LDA #$00
02EE  A8          TAY
02EF  91  7A      STA ($7A),Y

02F1  4C  74  A4  JMP $A474  ; Prints Ready and then
                             ; processes keyboard buffer
-----------------------------------

--Tables---------------------------
02F4  52 D5 0D    ;"R", "SHIFT+U", "RETURN" (stays for "RUN", followed by RETURN key)

02F7  00 00 00 00 00 00 00 00 00

0300  8B E3       ; default value, not changed

0302  AE 02       ; used to perform the Autostart
-----------------------------------
```

## Key Registers
- $D000-$D02E - VIC-II - Display/control register range; $D011 used here to blank the screen (AND #$EF).
- $DC00-$DC0F - CIA 1 (6526) - Interrupt Control/Status at $DC0D polled for incoming tape pulse detection.
- $DD00-$DD0F - CIA 2 (6526) - Timer B and control: $DD07 (Timer B high/part of latch reload), $DD0F (Control B — start/one-shot/force-load), $DD0D (Interrupt Control/Status checked for countdown state).
- $0328-$0329 - RAM - KERNAL STOP vector (overwritten to point to $02A7).
- $0302-$0303 - RAM - IMAIN / autostart vector (autostart bytes present at $0302).
- $02A7 - RAM - Loader entry (new STOP routine / loader code start).
- $00C6, $00C0, $0002 - RAM - Zeroed initialization locations used by the loader.
- $007A - RAM - Indirect pointer used by STA ($7A),Y for restoring CHRGET/printing prompt.

## References
- "nonirq_cbm_header_block_listing" — expands on CBM Header block and contains the remaining loader core
- "nonirq_loader_autostart_i_main" — expands on Autostart via IMAIN vector ($0302-$0303)