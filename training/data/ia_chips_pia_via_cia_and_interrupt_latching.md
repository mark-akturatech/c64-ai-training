# Interface Adapter (IA) chips: PIA, VIA, CIA — event latching and interrupt control

**Summary:** PIA, VIA, and CIA interface-adapter chips latch transient events into status flags and provide programmable interrupt gating (enable/mask bits) that drive the CPU IRQ line. These chips give fine-grained control over which latched events generate IRQs and require software to clear the latched flags.

**Overview**
Interface Adapter (IA) chips (PIA, VIA, CIA) monitor peripheral events and capture brief or transient signals by setting internal status flags (latches). Latching ensures an event that is shorter than the CPU polling period is still observable by software until the flag is explicitly cleared. Each IA presents both event flags and interrupt-control bits so software can choose which flags will assert the chip's interrupt output to the CPU.

**Event latching**
- Transient events (timer underflows, edge-detected inputs, serial shifts, handshake transitions, etc.) are captured into per-event status bits (latched flags).
- A latched flag remains set until software clears it; this preserves the event state across CPU instruction timing and prioritization.
- Latches decouple asynchronous external timing from the CPU’s polling and instruction execution timing.

**Interrupt gating and masking**
- IA chips include per-event interrupt enable/mask bits that determine whether a set flag will actually assert the chip’s IRQ output.
- The chip IRQ output is combined with the CPU’s global interrupt mask (the processor Interrupt Disable/Enable state) — both must allow interrupts for the CPU to take an IRQ vector.
- This two-level control (chip-level enables + CPU interrupt mask) lets software acknowledge and defer interrupt-driven processing reliably.

**Software clearing and handling**
- Software detects latched events by reading the adapter’s status register(s) and then clears the appropriate flag(s) according to the chip’s specified clear method (chip-specific).
- Typical handling flow: (1) mask or disable further interrupts for the event if needed, (2) read/inspect status, (3) perform servicing, (4) clear the flag(s) per the chip’s required write/read-clear semantics, (5) re-enable interrupts.
- Exact clear semantics, interrupt-enable bit locations, and read/write behaviors differ between PIA, VIA, and CIA and must be consulted in each chip’s specification.

## Source Code
```assembly
; Example assembly code for 6522 VIA interrupt handling

; Disable interrupts
SEI

; Read the Interrupt Flag Register to determine the source of the interrupt
LDA VIA_IFR

; Check if Timer 1 interrupt flag is set (bit 6)
AND #%01000000
BEQ NotTimer1Interrupt

; Handle Timer 1 interrupt
; (Insert Timer 1 interrupt handling code here)

; Clear Timer 1 interrupt flag by writing a 1 to bit 6 of the IFR
LDA #%01000000
STA VIA_IFR

NotTimer1Interrupt:

; Re-enable interrupts
CLI
```
In this example, the code disables interrupts, reads the Interrupt Flag Register (IFR) of the 6522 VIA to check if the Timer 1 interrupt flag (bit 6) is set, handles the interrupt if it is, clears the flag by writing a 1 to bit 6 of the IFR, and then re-enables interrupts.

## Key Registers
- **6520 PIA:**
  - **Data Direction Register A (DDRA):** Controls the direction (input/output) of Port A pins.
  - **Data Direction Register B (DDRB):** Controls the direction (input/output) of Port B pins.
  - **Control Register A (CRA):** Controls interrupt enables and other functions for Port A.
  - **Control Register B (CRB):** Controls interrupt enables and other functions for Port B.
  - **Interrupt Flag Register (IFR):** Indicates which interrupt sources are active.
  - **Interrupt Enable Register (IER):** Enables or disables specific interrupts.

- **6522 VIA:**
  - **Data Direction Register A (DDRA):** Controls the direction (input/output) of Port A pins.
  - **Data Direction Register B (DDRB):** Controls the direction (input/output) of Port B pins.
  - **Timer 1 Low-Order Counter (T1C-L):** Low byte of Timer 1 counter.
  - **Timer 1 High-Order Counter (T1C-H):** High byte of Timer 1 counter.
  - **Timer 2 Low-Order Counter (T2C-L):** Low byte of Timer 2 counter.
  - **Timer 2 High-Order Counter (T2C-H):** High byte of Timer 2 counter.
  - **Shift Register (SR):** Used for serial data transfer.
  - **Auxiliary Control Register (ACR):** Controls timer modes and shift register operation.
  - **Peripheral Control Register (PCR):** Controls handshake lines and interrupt generation.
  - **Interrupt Flag Register (IFR):** Indicates which interrupt sources are active.
  - **Interrupt Enable Register (IER):** Enables or disables specific interrupts.

- **6526 CIA:**
  - **Data Direction Register A (DDRA):** Controls the direction (input/output) of Port A pins.
  - **Data Direction Register B (DDRB):** Controls the direction (input/output) of Port B pins.
  - **Timer A Low-Order Counter (TALO):** Low byte of Timer A counter.
  - **Timer A High-Order Counter (TAHI):** High byte of Timer A counter.
  - **Timer B Low-Order Counter (TBLO):** Low byte of Timer B counter.
  - **Timer B High-Order Counter (TBHI):** High byte of Timer B counter.
  - **Time of Day Clock (TOD):** Real-time clock registers.
  - **Serial Data Register (SDR):** Used for serial data transfer.
  - **Control Register A (CRA):** Controls Timer A and serial port operation.
  - **Control Register B (CRB):** Controls Timer B and time-of-day clock.
  - **Interrupt Control Register (ICR):** Indicates and controls interrupt sources.

## References
- "1982 MOS Technology Data Catalog"
- "Commodore 64 Programmer's Reference Guide"
- "Commodore 1541 User's Guide"
- "6502 Assembly Language Programming 2nd Edition" by Lance A. Leventhal

## Labels
- IFR
- IER
- ACR
- ICR
