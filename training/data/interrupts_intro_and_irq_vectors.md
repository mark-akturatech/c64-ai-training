# MACHINE - Introduction to interrupts (NMI, IRQ, BRK)

**Summary:** Covers 6502 interrupt types (NMI, IRQ, BRK) and the IRQ vector addresses used by PET/CBM ($0090-$0091, dec 144-145) and the VIC/Commodore 64 ($0314-$0315, dec 788-789). Explains why changing the IRQ vector interferes with system services (clock, keyboard, cassette motor, cursor, input) and the need to preserve normal interrupt servicing when installing a custom handler.

**Overview**
- Interrupt types:
  - NMI (non-maskable interrupt) — high-priority, cannot be disabled.
  - IRQ (maskable interrupt) — can be masked by the SEI/CLI instructions.
  - BRK — software interrupt invoked by the BRK instruction (software-triggered).
- On 6502-based systems, the CPU vectors are stored as two-byte little-endian addresses (low byte at the first vector address, high byte at the next).
- The system IRQ vector location differs between PET/CBM and the C64/VIC-based machines; software that replaces the IRQ vector must account for the platform's vector addresses.

**Interrupt vector locations (relevant to PET/CBM and C64)**
- PET / CBM IRQ vector: $0090-$0091 (decimal 144–145).
- VIC / Commodore 64 IRQ vector: $0314-$0315 (decimal 788–789).

Modifying these memory locations changes where the CPU branches when an IRQ occurs, so any change will affect all IRQ-driven OS and hardware services.

**Why modifying the IRQ vector affects system services**
- The system (OS/ROM + device drivers) relies on the IRQ to perform periodic and asynchronous tasks:
  - system clock/timers
  - keyboard scanning and input buffering
  - cassette motor control and tape I/O timing
  - cursor blinking/management and screen updates that rely on timed interrupts
  - other input polling or time-critical routines
- If you overwrite the IRQ vector without preserving or chaining to the original handler, those OS-level services will stop functioning (clock stops, keyboard/input may cease, cassette motor control lost, cursor may freeze, etc.).
- Many OS routines expect an IRQ-driven environment; replacing the vector without compensating logic will break higher-level services that call those OS routines.

**Preserving normal interrupt service when adding a custom handler**
When diverting the IRQ vector, follow these general precautions (standard 6502/C64 practice):
- Save the original vector:
  - Read and store the two bytes currently at the IRQ vector addresses (low then high).
- Install your vector safely:
  - Use SEI before writing the new vector to prevent a race with an IRQ occurring while you patch the vector; write the two bytes (low, then high); then use CLI to re-enable IRQs.
- In your IRQ handler:
  - Preserve CPU state: push registers (e.g., P, A, X, Y) or otherwise save any registers you modify.
  - Keep processing brief. Long handlers will disturb system timing and real-time tasks.
  - Chain to the original handler: either JSR/JMP to the original vector address (or call it via the saved address) after your work, or emulate/replicate the original handler’s essential actions before returning.
  - Restore saved registers and return with RTI so the interrupted context is restored correctly.
- On systems with multiple IRQ consumers (OS + your code), chaining is the most compatible approach: do your task, then call (or jump to) the original handler so the system continues its expected processing.
- If you only need to run code periodically, consider having your handler set a flag and return quickly; run the heavy work from the main program loop at a safe time.

**[Note: modifying vectors must account for the two-byte little-endian layout; write low byte then high byte.]**

## Source Code
```assembly
; Example: Safely installing a custom IRQ handler on the Commodore 64

; Save the original IRQ vector
SEI                     ; Disable interrupts
LDA $0314               ; Load low byte of current IRQ vector
STA old_irq_vector      ; Store it
LDA $0315               ; Load high byte of current IRQ vector
STA old_irq_vector+1    ; Store it

; Install new IRQ vector
LDA #<custom_irq_handler ; Load low byte of new IRQ handler address
STA $0314               ; Store it
LDA #>custom_irq_handler ; Load high byte of new IRQ handler address
STA $0315               ; Store it
CLI                     ; Re-enable interrupts

; Custom IRQ handler
custom_irq_handler:
  PHA                   ; Save accumulator
  TXA                   ; Transfer X to A
  PHA                   ; Save X
  TYA                   ; Transfer Y to A
  PHA                   ; Save Y

  ; Custom interrupt processing code here

  ; Chain to original IRQ handler
  JMP (old_irq_vector)  ; Jump to original IRQ handler

  ; Restore registers and return from interrupt
  PLA                   ; Restore Y
  TAY                   ; Transfer A to Y
  PLA                   ; Restore X
  TAX                   ; Transfer A to X
  PLA                   ; Restore accumulator
  RTI                   ; Return from interrupt

; Data storage
old_irq_vector:
  .word 0               ; Storage for original IRQ vector address
```

## Key Registers
- $0090-$0091 - PET/CBM - IRQ vector (decimal 144–145)
- $0314-$0315 - VIC / Commodore 64 - IRQ vector (decimal 788–789)

## References
- "interrupt_vector_modification_and_sei_cli" — expands on masks and safe modification of the IRQ vector (SEI/CLI usage and race conditions)
- "interrupt_project_example" — example of diverting the IRQ vector to custom code and chaining back to the original handler