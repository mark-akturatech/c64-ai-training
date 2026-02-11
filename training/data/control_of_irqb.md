# CIA CRB — Control of /IRQB (CB1 / CB2)

**Summary:** CRB (Control Register B) sets CB1/CB2 edge flags and controls whether those flags generate /IRQB; bit 7 = CB1 flag (interrupt enable = CRB bit 0), bit 6 = CB2 flag (interrupt enable = CRB bit 3). Bits 6/7 are cleared by a read of Peripheral B Output Register (PRB). Addresses: CIA1 CRB = $DC0F, PRB = $DC01; CIA2 CRB = $DD0F, PRB = $DD01.

## Control of /IRQB
Bit 7 of CRB is set by an active transition on CB1; whether that flag causes an /IRQB interrupt is controlled by CRB bit 0. Similarly, bit 6 of CRB is set by an active transition on CB2; whether that flag causes an /IRQB interrupt is controlled by CRB bit 3.

Both CRB bits 6 and 7 are cleared (reset) by performing a Read Peripheral B Output Register operation (reading PRB). This behavior mirrors the CRA/IRQA relationship for Peripheral A.

The description applies to both CIA chips (6526/6520): the same CRB bits and PRB-read clearing behavior exist for CIA1 and CIA2.

## Source Code
```text
CRB — Control Register B (bits described in source)

Bit 7  : CB1 flag (set by active transition on CB1)
Bit 6  : CB2 flag (set by active transition on CB2)
Bit 5  : — (not described in this source)
Bit 4  : — (not described in this source)
Bit 3  : Interrupt enable for CB2 flag (controls interrupting from bit 6)
Bit 2  : — (not described in this source)
Bit 1  : — (not described in this source)
Bit 0  : Interrupt enable for CB1 flag (controls interrupting from bit 7)

Notes:
- Reading Peripheral B Output Register (PRB) clears bits 6 and 7 in CRB.
- "Active transition" means the configured edge/polarity that sets the corresponding flag (per CB1/CB2 configuration elsewhere).
```

## Key Registers
- $DC0F - CIA1 - CRB (Control Register B): bit7 CB1 flag, bit6 CB2 flag, interrupt enables at bit0 (CB1) and bit3 (CB2); bits6/7 cleared by read of PRB.
- $DC01 - CIA1 - PRB (Peripheral B Output Register) — read clears CRB bits 6/7.
- $DD0F - CIA2 - CRB (Control Register B): same behavior as CIA1.
- $DD01 - CIA2 - PRB (Peripheral B Output Register) — read clears CRB bits 6/7.

## References
- "6520_control_registers" — expands on CRB bits usage analogous to CRA and other control register details

## Labels
- CRB
- PRB
