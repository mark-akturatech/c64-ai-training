# 6510 Hardware Vectors ($FFFA-$FFFF)

**Summary:** The 6510 CPU reserves the last six bytes of memory ($FFFA-$FFFF / 65530-65535) for three 16-bit interrupt vectors: NMI, RES (power-on reset), and IRQ/BRK. Each vector contains a little-endian 16-bit address pointing to the start of the corresponding handler routine.

## Vectors
The 6510 monitors three fixed vectors located at the end of the 64K address space. (Stored little-endian: low byte at the even address, high byte at the next.)

- $FFFA (65530) — Non-Maskable Interrupt (NMI) vector  
  - Points to main NMI routine at $FE43 (decimal 65091).

- $FFFC (65532) — System Reset (RES) vector  
  - Points to power-on / reset routine at $FCE2 (decimal 64738).

- $FFFE (65534) — Maskable Interrupt Request (IRQ) and BRK vector  
  - Points to main IRQ/BRK handler at $FF48 (decimal 65352).

These vectors tell the CPU where to begin execution when the corresponding event occurs.

## Source Code
```text
Location Range: 65530-65535 ($FFFA-$FFFF)
6510 Hardware Vectors (little-endian address storage)

Address   Dec     Purpose                      Target address (hex)   Target (dec)
$FFFA    65530   NMI vector (low byte)         -> points to $FE43      65091
$FFFB    65531   NMI vector (high byte)
$FFFC    65532   RES vector (low byte)         -> points to $FCE2      64738
$FFFD    65533   RES vector (high byte)
$FFFE    65534   IRQ/BRK vector (low byte)     -> points to $FF48      65352
$FFFF    65535   IRQ/BRK vector (high byte)
```

## Key Registers
- $FFFA-$FFFF - 6510 - NMI / RES / IRQ/BRK hardware vectors (last six bytes of memory; 16-bit little-endian addresses)

## References
- "nmi_interrupt_entry_point" — expands on NMI vector target  
- "main_irq_brk_interrupt_entry_point" — expands on IRQ/BRK vector target

## Labels
- NMI
- RES
- IRQ
