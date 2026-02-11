# CIA 6526 Interrupt Control Register (ICR) — Offset $0D

**Summary:** CIA 6526 ICR at offset $0D (absolute $DC0D for CIA1, $DD0D for CIA2) provides interrupt STATUS on read (TA, TB, ALRM, SP, FLG, IR) and an interrupt MASK on write using the Set/Clear (SC) bit; CIA1 ICR drives CPU /IRQ, CIA2 ICR drives /NMI.

## Description
The ICR behaves differently for read and write accesses.

Reading ICR (interrupt status)
- Bits 0-4 are latched interrupt flags:
  - Bit 0 (TA): Timer A underflow occurred
  - Bit 1 (TB): Timer B underflow occurred
  - Bit 2 (ALRM): TOD alarm match occurred
  - Bit 3 (SP): Shift register full/empty (8 bits transferred)
  - Bit 4 (FLG): Negative edge detected on FLAG pin
- Bits 5-6: always 0
- Bit 7 (IR): overall interrupt indicator — logical OR of the (flag bits 0-4 ANDed with their currently enabled masks)
- Reading the ICR clears all interrupt flags (bits 0-4) and de-asserts the CPU interrupt line (CIA1 -> /IRQ, CIA2 -> /NMI) regardless of the mask settings.

Writing ICR (interrupt mask control)
- Bits 0-4 are mask bits for enabling/disabling the corresponding interrupt sources:
  - Bit 0 (TA): Timer A underflow enable
  - Bit 1 (TB): Timer B underflow enable
  - Bit 2 (ALRM): TOD alarm enable
  - Bit 3 (SP): Shift register enable
  - Bit 4 (FLG): FLAG pin enable
- Bits 5-6: not used
- Bit 7 (SC): Set/Clear control:
  - SC = 1 (Set): bits written as 1 enable their corresponding interrupt sources
  - SC = 0 (Clear): bits written as 1 disable their corresponding interrupt sources
- Mask changes are performed only for bits written as 1; bits written as 0 leave the corresponding mask bit unchanged.

Behavioral notes
- Reading the ICR is a destructive read: it clears all latched interrupt flags and will therefore clear the edge that drives the CPU interrupt line. Software must sample and preserve flags before they are lost if needed.
- The IR bit (bit 7 on read) reflects enabled interrupts only — it is the OR of flag bits after applying the enable mask.
- CIA1 ICR writes/reads control the /IRQ output to the CPU; CIA2 ICR writes/reads control the /NMI output to the CPU.

## Source Code
```text
ICR bit layout (offset $0D)

Read (Interrupt STATUS):
  Bit 7  6  5  4   3   2    1   0
       IR  0  0  FLG  SP  ALRM  TB  TA
  - Bits 5-6 = 0
  - Bit 7 IR = logical OR of enabled sources (flags AND masks)
  - Reading clears ALL flags (TA, TB, ALRM, SP, FLG) and de-asserts /IRQ or /NMI

Write (Interrupt MASK):
  Bit 7  6  5  4   3   2    1   0
       SC  -  -  FLG  SP  ALRM  TB  TA
  - Bits 5-6: unused
  - Bit 7 SC = Set/Clear:
      SC=1 (Set): bits=1 enable corresponding interrupt
      SC=0 (Clear): bits=1 disable corresponding interrupt
```

```asm
; Example: Enable Timer A interrupt on CIA1
; Set SC=1, TA bit=1 -> enable TA
    LDA #$81      ; %10000001 = SC=1, TA=1
    STA $DC0D     ; CIA1 ICR

; Example: Disable Timer A interrupt on CIA1
; Set SC=0, TA bit=1 -> disable TA
    LDA #$01      ; %00000001 = SC=0, TA=1
    STA $DC0D     ; CIA1 ICR
```

## Key Registers
- $DC0D - CIA 1 - Interrupt Control Register (ICR) read=status / write=mask (drives CPU /IRQ)
- $DD0D - CIA 2 - Interrupt Control Register (ICR) read=status / write=mask (drives CPU /NMI)

## References
- "interrupt_handling" — how ICR clearing interacts with IRQ/NMI and handlers
- "timer_a_16bit" — Timer A underflow sets the ICR TA flag
- "timer_b_16bit" — Timer B underflow sets the ICR TB flag
- "serial_data_register_sdr" — SDR transfers set the ICR SP flag

## Labels
- ICR
