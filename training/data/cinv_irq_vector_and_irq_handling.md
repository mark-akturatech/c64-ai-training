# CINV ($0314-$0315) — IRQ Interrupt Vector

**Summary:** CINV at $0314-$0315 is the C64 KERNAL vector to the IRQ interrupt routine (default $FA31). CIA #1 Timer B generates an IRQ ~1/60 s at power-up; the vector points to the routine that updates the software clock, STOP-key check, cursor blink, tape interlock, and keyboard scanning.

## Description
This vector contains the 16-bit address of the routine executed when an IRQ occurs (default $FA31 / decimal 59953). At power-on, CIA #1 Timer B is configured to generate an IRQ approximately every 1/60 second; the IRQ routine pointed to by this vector performs the system-periodic tasks: updating the software clock, STOP-key checking, cursor blinking, maintaining the tape interlock, and scanning the keyboard.

Guidelines and implementation details from the ROM:

- Disable IRQs before changing this vector to avoid a fatal interrupt while modifying the two bytes. Use 6510 SEI/CLI, or use the KERNAL VECTOR routine at 64794 ($FD1A) to set the vector safely.
- The ROM contains a small IRQ prologue executed before jumping through this vector which distinguishes IRQ vs BRK and preserves registers. That prologue pushes registers in this exact sequence:
  - PHA
  - TXA
  - PHA
  - TYA
  - PHA
- Your replacement IRQ handler must restore the stack/registers before returning. Either return through the normal IRQ path in ROM, or restore with:
  - PLA
  - TAY
  - PLA
  - TAX
  - PLA
  - RTI
- There is a single IRQ vector but multiple possible IRQ sources (two CIAs and several VIC-II IRQ sources). If you enable multiple sources, your IRQ handler must determine the interrupt source and dispatch appropriately.
- If you replace the default IRQ routine, remember the ROM handler performs keyboard scanning and clock updates — call or chain to the saved original routine at least once every 1/60 s if you want to retain those functions. Save the old vector in another location and JMP to it (via that saved address) rather than hard-coding a jump into ROM.

## Source Code
```asm
; Vector location (CINV)
; $0314-$0315 -> default $FA31
; Example: set vector safely (assembler-style pseudo)
    SEI                 ; disable IRQs
    LDA #<addr          ; low byte of new handler
    STA $0314
    LDA #>addr          ; high byte of new handler
    STA $0315
    CLI                 ; re-enable IRQs

; ROM IRQ prologue (register save sequence executed before vector)
    PHA
    TXA
    PHA
    TYA
    PHA

; Corresponding restore sequence if not returning via ROM
    PLA
    TAY
    PLA
    TAX
    PLA
    RTI

; KERNAL VECTOR routine (use instead of manual writes)
; VECTOR routine address: 64794 ($FD1A)
; (Call convention not expanded here — use KERNAL docs)
```

## Key Registers
- $0314-$0315 - KERNAL - IRQ interrupt vector (CINV), points to IRQ handler (default $FA31)

## References
- "irqtmp_save_area_for_cassette_io" — expands on cassette I/O save/restore of the IRQ vector before changing it

## Labels
- CINV
