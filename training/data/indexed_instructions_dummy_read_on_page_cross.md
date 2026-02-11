# NMOS 6510 — Absolute-indexed page-cross dummy-read behavior (dummy read from <AAH, AAL+IL>)

**Summary:** Describes NMOS 6510 behavior for absolute,X / absolute,Y addressing when indexing causes a page crossing: the CPU inserts one extra cycle and performs a dummy read from the address formed as <AAH, AAL+IL> (low byte wrapped) before the high byte is corrected. Covers loads/logic/compare/RMW/read-modify/write groups and shows the (zp),Y cycle snippet. Mentions examples using CIA ($DC00/$DD00) and VIC-II ($D000 range) registers.

**Description**
For NMOS 6510 absolute indexed addressing (absolute,X and absolute,Y), if index addition causes the low byte to wrap (page crossing), the effective-address calculation forces one additional internal cycle: the CPU does a dummy read from the address composed of the original high byte and the low byte plus the index (i.e., <AAH, AAL+IL>) before it corrects (increments) the high byte and performs the real read/write at the incremented high-byte address. This extra cycle applies to page-crossing reads and also affects write instructions (a dummy read occurs before the eventual write).

Affected instruction classes (non-exhaustive list shown in source): ADC, AND, CMP, EOR, LDA, ORA, SBC, STA, LDX, LDY, TAS, SHX, SHY, and others using absolute indexed addressing. For zero-page-indirect,Y ((zp),Y) addressing, the sequence of fetches includes a zero-page pointer read and follows with low/high pointer reads; the provided cycle table for (zp),Y is included in the Source Code section below.

Practical consequences:
- When indexing a CIA or VIC register address across a page boundary (e.g., LDA $DC1D,X where X causes crossing from $DC0D to $DD0D), a dummy read at the uncorrected address occurs first, then the real access at the corrected (crossed) page.
- This behavior can be used intentionally (or must be accounted for) in tight raster code and interrupt-acknowledge sequences.

**[Note: Source may contain an error — example uses STA $CF22,X to feed VIC sprite pipe; $CF22 is outside the VIC-II $D000-$D02E range and may be a typo or banked/memory-mapped reference.]**

**Examples**
- Acknowledge both CIA interrupts in one indexed LDA:
  - LDX #$F0
  - LDA $DC1D,X
  This performs a dummy read at $DC0D and a normal read at $DD0D, acknowledging both CIAs in one instruction (one cycle faster and one byte shorter than two separate LDAs).
- 5-cycle raster split snippet:
  - LDX #$FF
  - LDY #$05
  - LDA #$00
  - STY $D021
  - STA $CF22,X
  (See note above regarding $CF22.)
- Sprite far-right trick: use STA VIC_REG,X timed so that the 4th cycle's read (uncorrected VIC address) supplies the sprite pattern byte, followed by a ghost byte, then the 5th cycle performs the write into the sprite pipeline. Test code filename referenced: VICII/sb_sprite_fetch/sbsprf24.prg (not included here).

## Source Code
```asm
; Notes and examples from source (verbatim snippets)
; (*) Add one cycle for indexing across page boundaries or write.
; A dummy read happens to the target address before the high byte was corrected.

; Example: acknowledge both CIA interrupts
LDX #$F0
LDA $DC1D, X

; Example: 5 cycle wide rastersplits
LDX #$FF
LDY #$05
LDA #$00
STY $D021
STA $CF22, X

; Example: Sprites far right in the border
; Use STA VIC_REG, X at the correct position in the rasterline so the 4th cycle
; occurs at the first sprite DMA-cycle and the 5th (the W-cycle) at the 2nd sprite DMA-cycle.
; Testcode:
; VICII/sb_sprite_fetch/sbsprf24.prg
```

```text
Zeropage Indirect Y Indexed ((zp),Y) — complete cycle diagram
Instructions: ADC (zp),y  STA (zp),y  AND (zp),y  LAX (zp),y  CMP (zp),y
              EOR (zp),y  LDA (zp),y  ORA (zp),y  SBC (zp),y

Cycle  Address-Bus        Operation               Read/Write
1      PC                 Opcode fetch            R
2      PC + 1             Direct Offset (ZP)      R
3      DO                 Absolute Address Low    R
4      DO + 1             Absolute Address High   R
5      <AAH, AAL + Y>     Dummy read              R
6      AA + Y             Data                    R/W
```

## Key Registers
- $D000-$D02E - VIC-II - graphics/sprite/raster registers (border/background among these; $D020/$D021 are in this range)
- $DC00-$DC0F - CIA 1 - timer/interrupt/port registers (example uses $DC0D)
- $DD00-$DD0F - CIA 2 - timer/interrupt/port registers (example uses $DD0D)

## References
- "zeropage_indirect_y_indexed_rmw_unintended" — expansion on related zero-page (indirect),Y behavior and RMW edge-cases

## Mnemonics
- ADC
- STA
- AND
- CMP
- EOR
- LDA
- ORA
- SBC
