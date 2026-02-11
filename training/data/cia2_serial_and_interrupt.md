# CIA 2 — Serial Shift and Interrupt Status ($DD0C, $DD0D)

**Summary:** Describes CIA 2 serial shift register ($DD0C) and the Interrupt Control / Interrupt Status register ($DD0D) on the C64 (6526/6522-compatible CIA). Includes bit-level ICR mapping (read/write semantics: set/clear on write using bit 7) and serial-shift behavior tied to the CNT pin.

## Description
- $DD0C (Serial Shift Register, SR): an 8-bit read/write shift register used for serial transfers. Bits are clocked on edges of the CNT pin; software can write a byte into $DD0C to load the shift register and can read $DD0C to sample the current shifted value. Typical use: shift data in/out on CNT transitions and generate a serial interrupt when shifting completes (see ICR bits for serial interrupt source).

- $DD0D (Interrupt Control / Interrupt Status Register, ICR): reports which CIA interrupt sources are pending and provides write semantics to set or clear the interrupt-enable bits. Bits 0–4 correspond to individual interrupt sources (Timer A, Timer B, TOD alarm, Serial, FLAG). Writing to ICR uses bit 7 as a set/clear control: writes with bit 7 = 1 set the bits specified in bits 0–6; writes with bit 7 = 0 clear the bits specified. Reading ICR returns the raw interrupt flags in bits 0–4; on read bit 7 is also set if any interrupt flag is active.

**[Note: Source wording "FLAG non-maskable interrupt status" is ambiguous — FLAG is an interrupt source reported in ICR; it is not itself a CPU NMI vector. ]**

## Source Code
```text
Register reference (CIA 2, $DD00-$DD0F excerpt)

$DD0C  Serial Shift Register (SR)
  - 8-bit read/write shift register
  - Data is shifted on CNT pin edges
  - Writing loads the shift register; reading returns current shifted byte
  - Serial interrupt source reported in ICR when conditions met

$DD0D  Interrupt Control / Interrupt Status Register (ICR)
  Read:
    bit 7 = 1 if any interrupt flag (bits 0-4) is set (summary flag)
    bits 6 = unused/reserved
    bit 5 = FLAG interrupt flag
    bit 4 = Serial interrupt flag
    bit 3 = TOD alarm interrupt flag
    bit 2 = Timer B underflow interrupt flag
    bit 1 = Timer A underflow interrupt flag
    bit 0 = (implementation note: Timer A/other ordering — see below)
  Write:
    bit 7 = 1 => set bits specified in bits 0-6
    bit 7 = 0 => clear bits specified in bits 0-6
    (bits 0-4 select the individual interrupt flags to set/clear)

Example assembly (read SR, clear serial interrupt):
```asm
    LDA $DD0C        ; read serial shift register
    LDA #%10000000   ; prepare ICR write: bit7=1 to set, clear uses bit7=0
    STA $DD0D        ; (example: set summary bit — see ICR semantics)
    ; To clear a specific interrupt flag (e.g. Serial):
    LDA #%00010000   ; bit4 = Serial flag; bit7=0 to clear
    STA $DD0D
```
(Note: the exact assembler code for clearing/setting depends on desired flag operation.)
```

## Key Registers
- $DD00-$DD0F - CIA 2 - peripheral register block including serial shift ($DD0C) and interrupt control/status ($DD0D)

## References
- "hardware_vectors" — expands on interrupt/NMI handling and vectoring

## Labels
- DD0C
- DD0D
