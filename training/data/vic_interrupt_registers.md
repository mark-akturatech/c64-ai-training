# VIC-II Interrupt Registers ($D019-$D01A)

**Summary:** VIC-II interrupt registers $D019 (IRQ status) and $D01A (IRQ control/mask) report and enable Raster, Sprite-to-Sprite collision, Sprite-to-Background collision, and Light Pen interrupts; status bits are cleared by writing 1, the control register is a mask (1 = enable) and an active enabled status will assert the CPU IRQ line.

## Overview
The VIC-II generates four distinct interrupt sources that can trigger the CPU IRQ line when enabled: raster compare, sprite-to-sprite collisions, sprite-to-background collisions, and light-pen strobe. $D019 holds the current interrupt status flags (which VIC-II events have occurred). $D01A is the interrupt mask/control register that selects which of those events will actually raise the IRQ line.

Behavioral highlights:
- A set bit in $D019 indicates the corresponding event has occurred.
- Writing a 1 to a bit in $D019 clears that status bit (write-1-to-clear).
- $D01A is a read/write mask: bits set to 1 enable the corresponding interrupt source; bits clear disable it.
- If any bit that is both set in the status register and enabled in the mask is present, the VIC-II will assert the CPU IRQ line.
- The raster compare that sets the raster interrupt is configured via $D012 (raster compare register) (raster compare = current raster line equals $D012).

## Bit fields and meanings
- Bit 0 — Raster interrupt
  - Status: set when VIC-II raster compare condition occurs (current raster = $D012).
  - Control: enable raster interrupts.
- Bit 1 — Sprite-to-sprite collision
  - Status: set when any two sprites collide.
  - Control: enable sprite-to-sprite collision interrupts.
- Bit 2 — Sprite-to-background collision
  - Status: set when any sprite collides with background graphics (playfield).
  - Control: enable sprite-to-background collision interrupts.
- Bit 3 — Light-pen interrupt (strobe)
  - Status: set when light-pen event/strobe occurs.
  - Control: enable light-pen interrupts.
- Bits 4-7 — Unused / read as 0 (no defined VIC-II interrupts on these bits)

Notes:
- Reading $D019 returns the raw flags; it does not clear them.
- Clearing a flag requires writing a 1 to the corresponding bit(s) of $D019. Writing 0 has no effect on that bit.
- To change which events generate IRQs, write the desired mask to $D01A (1 = enabled). Typically you set $D01A to a value where desired bits are 1 and others 0.
- The VIC-II IRQ is combined with other chips' IRQs (CIAs, etc.) on the CPU IRQ line.

## Source Code
```text
Register map (VIC-II IRQ registers)
$D019 - IRQ Status (read / write-to-clear)
  bit 0 = Raster interrupt flag
  bit 1 = Sprite-to-sprite collision flag
  bit 2 = Sprite-to-background collision flag
  bit 3 = Light-pen flag
  bits 4-7 = unused / 0

$D01A - IRQ Control / Mask (read/write)
  bit 0 = Enable raster interrupt (1 = enabled)
  bit 1 = Enable sprite-to-sprite interrupts
  bit 2 = Enable sprite-to-background interrupts
  bit 3 = Enable light-pen interrupt
  bits 4-7 = unused / 0
```

```asm
; Examples (6502 assembly)
; Enable raster interrupt only:
    LDA #$01
    STA $D01A    ; enable raster IRQ

; Clear raster status flag (write-1-to-clear):
    LDA #$01
    STA $D019    ; clear raster flag

; Enable raster and sprite-to-sprite interrupts:
    LDA #$03
    STA $D01A
```

## Key Registers
- $D019-$D01A - VIC-II - IRQ status and IRQ control (Raster, Sprite-to-Sprite collision, Sprite-to-Background collision, Light-pen)

## References
- "hardware_vectors" — expands on NMI/IRQ vectors and their default handlers

## Labels
- $D019
- $D01A
