# Status (.P) register (Processor Status) — RAM $030F (decimal 783)

**Summary:** Processor Status (.P) register bit assignments and BASIC/POKE usage; searchable terms: $030F, P register, POKE 783, SEI, Interrupt Disable (IRQ), status flags (Negative, Overflow, Break, Decimal, IRQ Disable, Zero, Carry).

## Description
The processor status register (.P) holds condition flags used by the 6502 CPU. BASIC stores a copy of the CPU status byte at decimal address 783 (hex $030F) for SYS entry/exit; user programs can POKE this location to modify the saved status used when returning to BASIC.

- It is safe to clear all bits before a SYS call with:
  - POKE 783,0
- Be careful with the Interrupt Disable flag (bit 2): a 1 in that bit is equivalent to executing SEI (disable IRQs). Setting this bit can prevent keyboard IRQs and other system IRQ handling, making the machine difficult to operate.
- To set all flags except Interrupt Disable, use:
  - POKE 783,247  (247 decimal = 0b11110111; bit 2 = 0)

**[Note: Source may contain an error — original text states "seven different flags"; the status byte is eight bits with one bit marked "Not Used".]**

## Source Code
```text
Status (.P) register bit assignments (bit value shown in decimal):

| Bit | Value | Name              |
|-----|-------|-------------------|
| 7   | 128   | Negative (N)      |
| 6   | 64    | Overflow (V)      |
| 5   | 32    | Not Used          |
| 4   | 16    | Break (B)         |
| 3   | 8     | Decimal (D)       |
| 2   | 4     | Interrupt Disable (I) |
| 1   | 2     | Zero (Z)          |
| 0   | 1     | Carry (C)         |
```

```basic
10 REM Examples
20 POKE 783,0    : REM clear all status bits before SYS
30 POKE 783,247  : REM set all bits except Interrupt Disable (I)
```

## Key Registers
- $030F - RAM - Saved Processor Status (.P) used by BASIC for SYS entry/exit (SPREG)

## References
- "register_storage_addresses" — expands on SPREG storing the status register for SYS entry/exit
- "cinv_irq_vector" — expands on Interrupt Disable implications for IRQ handling

## Labels
- SPREG
