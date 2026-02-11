# C64 FLAG-line ISR (cassette pulse reader)

**Summary:** Interrupt Service Routine for the cassette FLAG line using CIA1 timers ($DC05, $DC0E, $DC0D) and VIC-II border ($D020). Saves A/Y on stack, toggles border color for debug, reads CIA Timer A latched value, restarts Timer A, adjusts the latched value to decide Bit0/Bit1 (threshold compare via EOR/LSR sequence), assembles bits MSb-first with ROL $03, and uses a self-modifying branch to switch phases (pilot/sync/data).

## ISR Operation
This ISR is invoked on each FLAG-line pulse from the tape head. Each pulse length is represented by the CIA Timer A latched value (read from $DC05). The routine:

- Saves A and Y on the stack (PHA / TYA / PHA) and restores them before RTI (PLA / TAY / PLA).
- Flashes the screen border as a visual/debug cue by toggling $D020 (LDA $D020 / EOR #$05 / STA $D020).
- Reads the latched Timer A value ($DC05). It then restarts Timer A for the next pulse by writing control flags to CIA1 CRA ($DC0E). The value written here (LDY #$19 / STY $DC0E) sets Start Timer A, continuous mode and forces the latched value to be loaded for the next measurement.
- Determines whether the just-measured pulse is longer or shorter than a threshold (effectively subtracting $0200 cycles from the 16-bit timer and using the result's carry). The code performs an EOR #$02 then two LSRs on the read byte; the ensuing carry indicates whether the pulse was bigger than the Threshold (see inline comment and note about SBC in the source). The carry from those shifts is used as the comparison result.
- Groups bits MSb-first into the byte buffer at $03 by executing ROL $03. Because ROL shifts the existing bits left and moves the previous bit7 into the processor Carry, the carry reflects whether a full byte boundary was crossed. LDA $03 followed by BCC/BCS inspects the carry result to decide whether a complete byte is now available.
- Uses a self-modifying branch to change control flow depending on loader phase: alignment to the pilot byte, reading pilot train and sync, and subsequent data bytes. The code writes into the branch operand ($036D) to retarget the branch at $036C to different addresses during load (common IRQ-loader technique).
- Clears the CIA interrupt latch by reading $DC0D (interrupt control register read clears the pending latch), then restores registers and RTI.

Important behavior details:
- Bit assembly is MSb-first: ROL $03 shifts the buffer left and moves the newest bit into bit0 position by carry handling (the code uses carry to detect byte completion).
- The code avoids using SBC to subtract $0200 because SBC would require clearing carry beforehand and would modify multiple status flags, complicating the use of carry for the following ROL and branch logic (source comment explains rationale).
- The branch at $036C is self-modified: when the first pilot byte is detected, STA $036D updates the branch operand so subsequent interrupts jump to a different handler address (pilot/sync/data phases).
- $DC0D is read to clear the CIA interrupt latch; the register is clear-on-read.

## Source Code
```asm
; ***************************************************************
; * ISR                                                         *
; * Description: Interrupt Service Routine that handles FLAG    *
; *              line interrupts                                *
; ***************************************************************

; Each interrupt is triggered by a pulse read from tape, so we need to
; compare it's size (counted by a timer) with a Threshold value, to
; decide if it's a Bit 0 pulse or Bit 1 pulse.

0351  48             PHA            ; We'll be using A and Y registers
0352  98             TYA            ; so we save them on the processor stack,
0353  48             PHA            ; just as every Interrupt Service Routine does.

0354  AD 20 D0       LDA $D020      ; Perform border flash among 2 colors
0357  49 05          EOR #$05
0359  8D 20 D0       STA $D020

035C  AD 05 DC       LDA $DC05      ; Read the Timer value

035F  A0 19          LDY #$19       ; CIA #1 Control Register A re-initialized
0361  8C 0E DC       STY $DC0E      ; for the next pulse measurement:
                                    ;  Start Timer A                (bit 0)
                                    ;  Timer A run mode: continuous (bit 3)
                                    ;  Force latched value to be
                                    ;  loaded to Timer A counter    (bit 4)

0364  49 02          EOR #$02       ; This piece of code subtracts $200 clock cycles
0366  4A             LSR            ; from the Timer value. (4)
0367  4A             LSR            ; Carry is set when pulse is bigger than Threshold
                                    ; ie. [Latch value - $200] clock cycles.

0368  26 03          ROL $03        ; Group bits with MSb First

036A  A5 03          LDA $03
036C  90 02          BCC $0370      ; IF AND ONLY IF the last bit of a byte was just
                                    ; read, a 0 will be moved from bit 7 of $03
                                    ; to the Carry by the "ROL $03" instruction,
                                    ; otherwise the Carry will be set (see code
                                    ; at $0379 to understand why).
                                    ; Therefore Carry is set IFF a complete byte
                                    ; is not yet available.(5)
                                    ; If a complete byte is available, it is kept
                                    ; by the A register.

; (4) Why not to use the SBC instruction to subtract?
;     Answer: with SBC we should invert the carry bit (that holds
;     the borrow at the end of the instruction) to use it in the
;     following "ROL $03" instruction.
;     Also remember that SBC would need a CLC before it and that it
;     affects more Processor Status register bits (N, Z, C, and V).

; (5) This is a self-modified Branch which branches to different addresses during load,
;     to properly use the available byte just read.
;     It's a VERY common thing in IRQ loaders to use a self-modifying branch there.
;     When we are waiting for the FIRST Pilot Byte (to align the byte-oriented loader
;     to the bit-oriented pulse storage method), this branches to $0370.
;     When alignment was done, we need to read in the whole pilot sequence and the
;     Sync Byte, so that this branch branches to $0384.
;     When Sync Byte is found, we read a single byte we don't even use, at $0399.
;     And so on...

036E  B0 0D          BCS $037D      ; Always jumps

; -----------------------------------------------------------------------------------
0370  C9 40          CMP #$40       ; Check if this byte is the FIRST Pilot Byte
0372  D0 09          BNE $037D
0374  A9 16          LDA #$16
0376  8D 6D 03       STA $036D      ; Change the branch at $036C, to jump to $0384
; -----------------------------------------------------------------------------------

; This code is executed everytime we exit from the ISR (with the RTI).
;

0379  A9 FE          LDA #$FE       ; This will cause the "ROL $03" instruction to
037B  85 03          STA $03        ; always set Carry if a whole byte was not yet
                                    ; built in the byte buffer at $03.

037D  AD 0D DC       LDA $DC0D      ; Clear Interrupt Latch.
                                    ; This register is clear-on-read.

0380  68             PLA            ; Pop the values of A and Y registers from
0381  A8             TAY            ; the Processor stack before returning.
0382  68             PLA

0383  40             RTI
; ***************************************************************
; * ISR.END                                                     *
; ***************************************************************
```

## Key Registers
- $D020 - VIC-II - Border color register (used here for visual/debug flash)
- $DC05 - CIA1 - Timer A latched value (high byte read of Timer A latch)
- $DC0E - CIA1 - Control Register A (CRA) write: start Timer A, continuous mode, force latch load (used to restart Timer A)
- $DC0D - CIA1 - Interrupt Control Register (ICR) read clears the interrupt latch (clear-on-read)

## References
- "read_pilot_train_and_sync_byte" — expands on ISR transitions into pilot/sync reading logic (self-modified branch addresses)
- "figuring_out_threshold_value" — explains how the ISR comparison yields the threshold decision and timing math

## Labels
- D020
- DC05
- DC0E
- DC0D
