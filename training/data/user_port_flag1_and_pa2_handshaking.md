# USER PORT: FLAG1 (negative-edge) and PA2 (PORT A bit 2)

**Summary:** FLAG1 is a negative-edge sensitive input on the USER PORT (used for handshaking) that sets the CIA FLAG interrupt bit on any falling transition and can generate an IRQ if the FLAG interrupt is enabled; PA2 is bit 2 of CIA PORT A (address $DD00 / 56576) and is a normal bidirectional port bit with its Data Direction Register at $DD02 ($DD02 = 56578). 6526 (CIA) chip reference: Appendix M.

**Description**
- FLAG1 and PA2 are special USER PORT lines used primarily for handshaking between devices; they behave differently from the other USER PORT lines and are programmed differently from PORT B.
- FLAG1:
  - Negative-edge sensitive input (detects falling transitions).
  - Any negative transition on FLAG1 sets the FLAG interrupt bit in the CIA interrupt register.
  - If the FLAG interrupt is enabled, that bit will generate an interrupt request (IRQ) to the CPU.
  - If the FLAG interrupt is not enabled, software may poll the FLAG bit in the CIA interrupt/status register to detect transitions.
- PA2:
  - PA2 is bit 2 (mask %00000100) of PORT A on the 6526 CIA.
  - It is a normal port bit (can be driven or read depending on the Data Direction Register configuration).
  - PORT A (including PA2) is at $DD00 (decimal 56576); the Data Direction Register for PORT A (DDRA) is at $DD02 (decimal 56578).

## Source Code
```text
; CIA2 (User Port) minimal reference (base $DD00, decimal 56576)
; Addresses shown are absolute C64 addresses for CIA2

$DD00 (56576)  - PORT A (PA0..PA7)         ; PA2 is bit 2 (mask $04)
$DD02 (56578)  - DDRA  (Data Direction Register for PORT A)
$DD0D (56589)  - ICR   (Interrupt Control Register)
```

## Key Registers
- $DD00 - CIA 2 - PORT A (PA0..PA7). PA2 is bit 2 (mask $04).
- $DD02 - CIA 2 - DDRA (Data Direction Register for PORT A).
- $DD0D - CIA 2 - ICR (Interrupt Control Register).

## References
- "Appendix M (6526 CIA specifications)" — detailed CIA register maps, FLAG interrupt behavior and full timing/specifications.

## Labels
- FLAG1
- PA2
- PORTA
- DDRA
- ICR
