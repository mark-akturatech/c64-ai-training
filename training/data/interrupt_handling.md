# CIA 6526 — Interrupt handling overview

**Summary:** CIA1 ($DC00-$DC0F) drives CPU /IRQ, CIA2 ($DD00-$DD0F) drives CPU /NMI. The CIA Interrupt Control Register (ICR, $DC0D / $DD0D) — reading the ICR clears all interrupt flags and de-asserts IRQ/NMI; NMI is edge-triggered so CIA2's ICR must be read inside the NMI handler.

## Interrupt sources
Each CIA has five interrupt sources:
- Timer A underflow
- Timer B underflow
- TOD alarm match
- Shift register transfer complete (8 bits)
- FLAG pin negative edge

## Interrupt acknowledgement and behaviour
- Reading the ICR register ($DC0D for CIA1, $DD0D for CIA2) clears all pending interrupt flags and de-asserts the IRQ or NMI line.
- Writes to the ICR set or clear the enable mask bits (see other references for the ICR bit mask layout).
- Important: The CPU NMI input is edge-triggered. The NMI handler must read $DD0D (CIA2 ICR) to clear the CIA2 interrupt flag; otherwise subsequent NMIs will not be triggered.

## Typical IRQ setup (summary)
- Install IRQ vector ($0314/$0315), disable interrupts (SEI), clear/disable CIA interrupts, acknowledge any pending flags by reading ICR, program Timer A count and control, enable Timer A interrupt via ICR, re-enable interrupts (CLI).
- The canonical example enabling CIA1 Timer A interrupt is included in the Source Code section below.

## Source Code
```asm
; Typical IRQ Setup for Timer A (CIA1)
        SEI                 ; Disable interrupts
        LDA #<handler       ; Set IRQ vector low byte
        STA $0314
        LDA #>handler       ; Set IRQ vector high byte
        STA $0315

        LDA #$7F            ; Disable all CIA1 interrupts (write to ICR)
        STA $DC0D
        LDA $DC0D           ; Acknowledge any pending interrupts (read ICR)

        LDA #<count         ; Set Timer A low byte
        STA $DC04
        LDA #>count         ; Set Timer A high byte
        STA $DC05

        LDA #$81            ; Enable Timer A interrupt (write to ICR)
        STA $DC0D

        LDA #$11            ; Start Timer A, continuous mode, PHI2 clock (CRA)
        STA $DC0E

        CLI                 ; Enable interrupts
```

## Key Registers
- $DC00-$DC0F - CIA1 (6526) register block (ICR at $DC0D, Timer A low/high $DC04/$DC05, Timer A control $DC0E)
- $DD00-$DD0F - CIA2 (6526) register block (ICR at $DD0D)
- $DC0D - CIA1 Interrupt Control Register (ICR) — read clears flags, write masks enable/disable sources
- $DD0D - CIA2 Interrupt Control Register (ICR) — read clears flags; must be read in NMI handler
- $DC04/$DC05 - CIA1 Timer A low/high (count)
- $DC0E - CIA1 Timer A control (CRA)
- $0314/$0315 - CPU IRQ vector low/high (set to IRQ handler address)

## References
- "interrupt_control_register_icr" — expands on ICR read clears flags and write masks enable/disable sources
- "cia1_detailed_connections" — expands on CIA1 -> /IRQ usage and typical IRQ setup in KERNAL
- "cia2_detailed_connections" — expands on CIA2 -> /NMI behavior and need to clear ICR in NMI handler

## Labels
- ICR
- TIMALO
- TIMAH
- CRA
