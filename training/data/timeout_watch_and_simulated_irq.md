# STT1–STT4: Timeout-watch setup and optional simulated T1 IRQ (KERNAL)

**Summary:** STT1/STT2/STT3/STT4 implement the KERNAL timeout-watch that computes and programs CIA1 timer values ($DC04-$DC07), enables the timers via CIA1 CRA ($DC0E), sets a pending-IRQ marker (STUPID at $02A4), and optionally forces a simulated IRQ via SIMIRQ if the old T1 flag in CIA1 ICR ($DC0D) was already set. Uses KERNAL variables CMP0 ($B0), TEMP ($B1), CASTON ($02A2) and STUPID ($02A4).

## Description
- Entry (STT1): STX TEMP stores the X register constant into TEMP ($B1). LDA CMP0; ASL/ASL; ADC CMP0 computes CMP0*5 (multiply by 4 then add original). ADC TEMP adds that scaled CMP0 to the long-byte TEMP, adjusting the high/low long-byte count and storing back into TEMP.
- Sign-aware adjustment and scaling: A zeroing of A then BIT CMP0 tests CMP0’s sign. If CMP0 is negative (bit7 set) the code branches to a different rotate/shift sequence; otherwise it performs a series of ROL/ASL operations that shift bits through A and TEMP so the corrected value is multiplied by 4 and the rotated bits end up in X (TAX). This preserves multi-byte carries across TEMP/A for the final timer adjustment.
- Rollover avoidance wait (STT3): LDA D1T2L ($DC06) then CMP #$16; BCC loops while D1T2L < $16 to avoid setting timer values too close to current Timer2 low byte — prevents immediate rollover or missed timing window.
- Program CIA1 Timer1: ADC TEMP adds the scaled offset to the present D1T2L value, STA D1T1L ($DC04). TXA; ADC D1T2H ($DC07); STA D1T1H ($DC05) stores the adjusted low/high bytes for Timer1.
- Enable timers and mark pending IRQ: LDA CASTON ($02A2); STA D1CRA ($DC0E) writes the control register to enable timers. STA STUPID ($02A4) writes a non-zero marker meaning a T1 IRQ is expected but not yet occurred.
- Check and handle an already-set T1 IRQ: LDA D1ICR ($DC0D); AND #$10 tests the Timer1 interrupt flag. If not set, CLI; RTS returns normally (STT4). If set, the routine pushes a simulated return address (>STT4/<STT4) onto the stack and JMPs to SIMIRQ ($FF43) to simulate servicing the IRQ immediately.
- Purpose: precisely schedule a timeout for the next dipole (tape-drive timing), avoid race conditions with CIA timer rollover, and if an IRQ was already pending, force the IRQ handling path to run now via SIMIRQ.

## Source Code
```asm
                                ;
                                ; STT1 - SET UP TIMEOUT WATCH FOR NEXT DIPOLE
                                ;
.,F8E2 86 B1    STX $B1         STT1   STX TEMP        ;.X HAS CONSTANT FOR TIMEOUT
.,F8E4 A5 B0    LDA $B0         LDA    CMP0            ;CMP0*5
.,F8E6 0A       ASL             ASL    A
.,F8E7 0A       ASL             ASL    A
.,F8E8 18       CLC             CLC
.,F8E9 65 B0    ADC $B0         ADC    CMP0
.,F8EB 18       CLC             CLC
.,F8EC 65 B1    ADC $B1         ADC    TEMP            ;ADJUST LONG BYTE COUNT
.,F8EE 85 B1    STA $B1         STA    TEMP
.,F8F0 A9 00    LDA #$00        LDA    #0
.,F8F2 24 B0    BIT $B0         BIT    CMP0            ;CHECK CMP0 ...
.,F8F4 30 01    BMI $F8F7       BMI    STT2            ;...MINUS, NO ADJUST
.,F8F6 2A       ROL             ROL    A               ;...PLUS SO ADJUST POS
.,F8F7 06 B1    ASL $B1         STT2   ASL TEMP        ;MULTIPLY CORRECTED VALUE BY 4
.,F8F9 2A       ROL             ROL    A
.,F8FA 06 B1    ASL $B1         ASL    TEMP
.,F8FC 2A       ROL             ROL    A
.,F8FD AA       TAX             TAX
.,F8FE AD 06 DC LDA $DC06       STT3   LDA D1T2L       ;WATCH OUT FOR D1T2H ROLLOVER...
.,F901 C9 16    CMP #$16        CMP    #22             ;...TIME FOR ROUTINE...!!!...
.,F903 90 F9    BCC $F8FE       BCC    STT3            ;...TOO CLOSE SO WAIT UNTILL PAST
.,F905 65 B1    ADC $B1         ADC    TEMP            ;CALCULATE AND...
.,F907 8D 04 DC STA $DC04       STA    D1T1L           ;...STORE ADUSTED TIME COUNT
.,F90A 8A       TXA             TXA
.,F90B 6D 07 DC ADC $DC07       ADC    D1T2H           ;ADJUST FOR HIGH TIME COUNT
.,F90E 8D 05 DC STA $DC05       STA    D1T1H
.,F911 AD A2 02 LDA $02A2       LDA    CASTON          ;ENABLE TIMERS
.,F914 8D 0E DC STA $DC0E       STA    D1CRA
.,F917 8D A4 02 STA $02A4       STA    STUPID          ;NON-ZERO MEANS AN T1 IRQ HAS NOT OCCURED YET
.,F91A AD 0D DC LDA $DC0D       LDA    D1ICR           ;CLEAR OLD T1 INTERRUPT
.,F91D 29 10    AND #$10        AND    #$10            ;CHECK FOR OLD-FLAG IRQ
.,F91F F0 09    BEQ $F92A       BEQ    STT4            ;NO...NORMAL EXIT
.,F921 A9 F9    LDA #$F9        LDA    #>STT4          ;PUSH SIMULATED RETURN ADDRESS ON STACK
.,F923 48       PHA             PHA
.,F924 A9 2A    LDA #$2A        LDA    #<STT4
.,F926 48       PHA             PHA
.,F927 4C 43 FF JMP $FF43       JMP    SIMIRQ
.,F92A 58       CLI             STT4   CLI             ;ALLOW FOR RE-ENTRY CODE
.,F92B 60       RTS             RTS
                                .END
```

## Key Registers
- $DC04-$DC07 - CIA1 - D1T1L/D1T1H/D1T2L/D1T2H (Timer1 low/high and Timer2 low/high)
- $DC0D-$DC0E - CIA1 - D1ICR (Interrupt Control Register) / D1CRA (Control Register A)

## References
- "tape_operation_timer_and_irq_setup" — expands on Enables timers that STT1 adjusts and prepares for
- "motor_control_and_interrupt_enable" — expands on Interacts with timer enabling/state flags set earlier

## Labels
- STT1
- STT2
- STT3
- STT4
- CMP0
- TEMP
- CASTON
- STUPID
