# Kick Assembler: Small example IRQ program (C64)

**Summary:** Kick Assembler example demonstrating IRQ setup, VIC-II register usage ($D011, $D012, $D019, $D020, $D021), CIA interrupt control ($DC0D/$DD0D), integration of BasicUpstart2, importing binary music data, and utilizing a macro (SetBorderColor).

**Program Description**

This Kick Assembler example installs a simple IRQ handler (label `irq1`), sets the IRQ vector ($0314/$0315) to that handler, configures VIC-II registers for a raster interrupt, enables CIA interrupts, and calls a music routine at $1000. It demonstrates:

- `BasicUpstart2(start)` to emit a BASIC SYS line for automatic start.
- Setting the IRQ vector in zero page ($0314/$0315).
- VIC-II border/background color writes ($D020 / $D021) and raster setup ($D011 / $D012).
- CIA ICR writes at $DC0D and $DD0D.
- Embedding binary music data with `.import binary`.
- A small macro (`SetBorderColor`) for convenience.

The IRQ handler toggles the border color (via the `SetBorderColor` macro), calls a music playback subroutine at $1003, and then chains to $EA81 (KERNAL entry used here as an example return).

## Source Code

```asm
; Kick Assembler example: Simple IRQ (C64)
BasicUpstart2(start)
; ---------------------------------------------------------
; Simple IRQ
; ---------------------------------------------------------
* = $4000            ; Main Program
start:
    lda #$00
    sta $d020
    sta $d021
    lda #$00
    jsr $1000         ; init music
    sei
    lda #<irq1
    sta $0314         ; IRQ vector low
    lda #>irq1
    sta $0315         ; IRQ vector high
    lda #$7f
    sta $dc0d         ; CIA1 ICR: disable all interrupts
    sta $dd0d         ; CIA2 ICR: disable all interrupts
    lda $dc0d         ; acknowledge any pending CIA1 interrupts
    lda $dd0d         ; acknowledge any pending CIA2 interrupts
    lda #$81
    sta $d01a         ; enable raster interrupt
    lda #$1b
    sta $d011         ; set bit 7 of $D011 to 1
    lda #$80
    sta $d012         ; set raster line for interrupt
    lda #$01
    sta $d019         ; acknowledge any pending VIC-II interrupts
    cli
    jmp *

; ---------------------------------------------------------
irq1:
    lda #$01
    sta $d019         ; acknowledge raster interrupt
    SetBorderColor(2)
    jsr $1003         ; play one frame/tick of music
    SetBorderColor(0)
    jmp $ea81         ; return to KERNAL IRQ handler
; ---------------------------------------------------------
* = $1000            ; Music data area
.import binary "Ode to 64.bin"
; ---------------------------------------------------------
; Macro: SetBorderColor(color)
.macro SetBorderColor(color) {
    lda #color
    sta $d020
}
```

## Key Registers

- $0314-$0315: RAM - IRQ vector (low/high) for the IRQ handler.
- $D000-$D02E: VIC-II - used registers in this example:
  - $D011: Control Register 1.
  - $D012: Raster Position.
  - $D019: Interrupt Status Register.
  - $D01A: Interrupt Control Register.
  - $D020: Border Color.
  - $D021: Background Color.
- $DC00-$DC0F: CIA 1 - $DC0D (Interrupt Control Register) written here.
- $DD00-$DD0F: CIA 2 - $DD0D (Interrupt Control Register) written here.

## References

- "getting_started_running_assembler" — expands on running the assembler for this example.
- "functions_define" — expands on macros and functions used in examples.