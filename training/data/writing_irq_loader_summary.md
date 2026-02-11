# IRQ-based tape loader — step-by-step summary

**Summary:** Step-by-step checklist for an IRQ-based C64 datasette loader using CIA#1 Timer A, the CIA interrupt control ($DC0D), and the CPU IRQ vector ($FFFE/$FFFF); covers SEI/CLI, clearing/masking CIA interrupts, latching Timer A ($DC04/$DC05), enabling FLAG-line IRQ and aligning on the pilot/header to determine target RAM address.

**Procedure**
- Disable CPU maskable interrupts: execute SEI.
- Mask/disable CIA interrupts at the CIA interrupt-control register by writing to $DC0D (modify the CIA ICR to disable the individual interrupt sources).
- Clear any latched CIA interrupt requests by reading $DC0D (the ICR read returns/clears latched interrupt flags).
- Load the 16-bit start/latch value for CIA#1 Timer A into $DC04/$DC05 (the Timer A latch — the timer will count down from this value; use one-shot/restart per pulse to measure subsequent pulse durations).
- Enable the datasette FLAG-line interrupt source in the CIA interrupt mask (make the FLAG-line interrupt bit(s) active in the CIA ICR so FLAG transitions generate an IRQ).
- Install your ISR address by writing the low/high bytes of the IRQ vector at $FFFE/$FFFF to point to your interrupt service routine.
- Re-enable CPU maskable interrupts: execute CLI.
- Wait for a FLAG interrupt and use the CIA Timer A measurement (restarted on each pulse) to classify pulse lengths; use pilot-byte timing to align/synchronize the stream.
- After synchronization, read the header block to determine the load/store RAM address for the following data bytes and proceed with data collection.

## Source Code
```assembly
; Example assembly code for setting up the IRQ vector and ISR

; Disable interrupts
SEI

; Set up the IRQ vector to point to our ISR
LDA #<ISR
STA $FFFE
LDA #>ISR
STA $FFFF

; Enable FLAG-line interrupt in CIA#1
LDA #%00010000  ; Set bit 4 to enable FLAG interrupt
STA $DC0D       ; Write to CIA#1 ICR

; Clear any pending interrupts by reading ICR
LDA $DC0D

; Set Timer A latch value for desired timing
LDA #<TIMER_VALUE
STA $DC04       ; Timer A low byte
LDA #>TIMER_VALUE
STA $DC05       ; Timer A high byte

; Configure Timer A control register for one-shot mode
LDA #%00010001  ; Start Timer A in one-shot mode
STA $DC0E       ; Timer A control register

; Re-enable interrupts
CLI

; Main loop
MAIN_LOOP:
  ; Wait for FLAG interrupt to trigger ISR
  JMP MAIN_LOOP

; Interrupt Service Routine
ISR:
  PHA            ; Save accumulator
  TXA
  PHA            ; Save X register
  TYA
  PHA            ; Save Y register

  ; Read Timer A value to determine pulse length
  LDA $DC04      ; Timer A low byte
  STA PULSE_LOW
  LDA $DC05      ; Timer A high byte
  STA PULSE_HIGH

  ; Process pulse length to determine data bit

  ; Clear FLAG interrupt by reading ICR
  LDA $DC0D

  ; Restart Timer A for next pulse measurement
  LDA #%00010001
  STA $DC0E

  ; Restore registers
  PLA
  TAY
  PLA
  TAX
  PLA

  ; End of interrupt
  RTI
```

## Key Registers
- $DC00-$DC0F - CIA #1 - includes Timer A latch ($DC04/$DC05) and Interrupt Control Register / Interrupt Latch ($DC0D)
- $FFFE/$FFFF - CPU - IRQ vector (low/high bytes for IRQ entry point)

## References
- "figuring_out_threshold_value" — how to extract threshold/timer values from code  
- "irq_isr" — ISR implementation that classifies pulses using the timer