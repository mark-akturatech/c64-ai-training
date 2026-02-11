# Interrupt routine: bit-count check, VIA1 shadow tests, phase clear and timing set ($F9AC–$F9D2)

**Summary:** ROM interrupt-handler fragment (mnemonics LDA/STA/JSR/JMP) that checks a bit-count ($B4), consults VIA1 shadow bytes ($02A3 ICR, $02A4 CRA), clears the tape bit-cycle phase ($A4), tests the EOI flag ($A3), and calls timing setup (JSR $F8E2) or returns from interrupt (JMP $FEBC).

## Description
This ROM sequence runs inside an interrupt handler and continues bit-level tape/serial processing when a bit-count remains. Behavior:

- Early exit: If the bit-count at $B4 is zero, execution jumps to the interrupt-exit path (JMP $FEBC).
- Timer-A enable test: The code reads a software shadow of VIA1's interrupt-control register ($02A3) and masks bit0 (AND #$01). If Timer A interrupts are enabled (bit0 set), execution continues. If not, it reads a shadow of VIA1 CRA ($02A4) and branches out if nonzero — the CRA shadow being nonzero prevents further processing.
- Phase clear and shadow update: When permitted, the code clears the tape bit-cycle phase byte ($A4 = 0) and writes it back to the CRA shadow ($02A4) so the VIA1 CRA shadow reflects the cleared phase.
- EOI (End Of Interrupt) testing and branching: The EOI flag byte at $A3 is loaded and branch instructions test its sign:
  - BPL (positive or zero) branches to $F9F7 (further processing not included here).
  - BMI branches back to $F988 (older handler path).
- Timing setup: When certain conditions are met, X is set to #$A6 (timing maximum) and JSR $F8E2 is called to set up timing constants. After the timing call, $9B is tested; if nonzero a branch goes to $F98B.
- Final exit: If none of the branches take other action, execution jumps to $FEBC which restores registers and exits the interrupt (return-to-main via ISR restore).

Notes:
- The code uses RAM "shadow" copies ($02A3/$02A4) of VIA1 registers instead of directly reading hardware registers; these are workspace variables in ROM/RAM rather than direct chip addresses.
- Branch targets ($F988, $F98B, $F9F7) and the JSR target ($F8E2) are elsewhere in ROM; this fragment coordinates phase/timing and decides whether to finish the interrupt or continue further bit processing.

## Source Code
```asm
.,F9AC A5 B4    LDA $B4         get the bit count
.,F9AE F0 22    BEQ $F9D2       if all done go ??
.,F9B0 AD A3 02 LDA $02A3       read VIA 1 ICR shadow copy
.,F9B3 29 01    AND #$01        mask 0000 000x, timer A interrupt enabled
.,F9B5 D0 05    BNE $F9BC       if timer A is enabled go ??
.,F9B7 AD A4 02 LDA $02A4       read VIA 1 CRA shadow copy
.,F9BA D0 16    BNE $F9D2       if ?? just exit
.,F9BC A9 00    LDA #$00        clear A
.,F9BE 85 A4    STA $A4         clear the tape bit cycle phase
.,F9C0 8D A4 02 STA $02A4       save VIA 1 CRA shadow copy
.,F9C3 A5 A3    LDA $A3         get EOI flag byte
.,F9C5 10 30    BPL $F9F7       
.,F9C7 30 BF    BMI $F988       
.,F9C9 A2 A6    LDX #$A6        set timimg max byte
.,F9CB 20 E2 F8 JSR $F8E2       set timing
.,F9CE A5 9B    LDA $9B         
.,F9D0 D0 B9    BNE $F98B       
.,F9D2 4C BC FE JMP $FEBC       restore registers and exit interrupt
```

## Key Registers
- $02A3 - VIA1 ICR shadow - software copy of VIA1 Interrupt Control Register (bit0 = Timer A IRQ enable)
- $02A4 - VIA1 CRA shadow - software copy of VIA1 CRA (used here to reflect/clear bit-cycle phase)
- $A4   - ROM workspace / tape bit-cycle phase byte (cleared by this routine)
- $A3   - ROM workspace / EOI (End Of Interrupt) flag byte (signed-test used for branching)
- $B4   - ROM workspace / bit-count (if zero, handler exits)
- $9B   - ROM workspace / decision flag tested after timing setup

## References
- "bit_count_handling_phase_toggle_and_timing_adjust" — continues processing after updating phase/timing variables
- "timing_constant_fine_tuning_start_bit_and_sync_handling" — final timing tweaks and start-bit/sync handling occur next