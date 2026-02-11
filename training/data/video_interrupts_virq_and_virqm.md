# Video Interrupts (VIRQ $D019)

**Summary:** VIRQ ($D019) is the VIC-II interrupt status register that reports raster, sprite-background collision, sprite-sprite collision, light-pen, and the "any enabled interrupt" flag; bits are cleared by writing a 1. CPU interrupts are only signaled when the corresponding bit is set in the video interrupt mask register VIRQM ($D01A).

**Video Interrupts — Description**

The VIC-II sets bits in the video interrupt status register VIRQ ($D019) when specific video events occur. The set bits indicate which condition(s) have happened; software reads this register to determine the cause of a video interrupt. To clear a set bit in VIRQ, you must write a 1 to that bit position (write-1-to-clear). Multiple bits can be cleared at once by writing a mask with 1s in the desired bit positions.

Whether the VIC-II asserts IRQ to the CPU depends on the corresponding bits in the video interrupt mask register VIRQM ($D01A). If a bit in VIRQM is set, the matching VIRQ bit can cause an actual CPU interrupt; if the mask bit is clear, VIRQ will still reflect the event but no IRQ is signaled.

The register uses the following bit positions (see Source Code for masks and examples).

## Source Code

```text
VIC-II video interrupt registers (absolute C64 addresses)

$D019 - VIRQ  (Interrupt status; write 1 to clear bit)
  Bit 0 (mask $01)  - Raster interrupt
  Bit 1 (mask $02)  - Sprite-to-background collision
  Bit 2 (mask $04)  - Sprite-to-sprite collision
  Bit 3 (mask $08)  - Light pen
  Bits 4-6          - unused / reserved
  Bit 7 (mask $80)  - Set if any enabled interrupt is pending (summary flag)

$D01A - VIRQM (Interrupt mask / enable for CPU)
  Uses the same bit positions as $D019: set bit to enable that event to generate a CPU IRQ.
```

```asm
; Example: clear only the raster interrupt flag in VIRQ
    LDA #$01      ; bit0 = raster
    STA $D019     ; write 1 to clear raster flag

; Example: acknowledge all known interrupts (clear bits 0,1,2,3)
    LDA #$0F      ; bits 0-3 = 1
    STA $D019

; Example: enable raster interrupt to generate CPU IRQ
    LDA $D01A     ; read current mask
    ORA #$01      ; set raster-enable bit
    STA $D01A
```

```asm
; Example: Setting up a raster interrupt at line 100
    SEI                  ; Disable interrupts
    LDA #$7F
    STA $DC0D            ; Disable CIA-1 interrupts
    LDA #$00
    STA $D011            ; Clear high bit of raster line
    STA $DC0D            ; Acknowledge any pending CIA-1 interrupts
    STA $DD0D            ; Acknowledge any pending CIA-2 interrupts
    LDA #100
    STA $D012            ; Set raster line for interrupt
    LDA #<IRQHandler
    STA $0314            ; Set interrupt vector low byte
    LDA #>IRQHandler
    STA $0315            ; Set interrupt vector high byte
    LDA #$01
    STA $D01A            ; Enable raster interrupt
    CLI                  ; Enable interrupts
    RTS

IRQHandler:
    LDA #$07
    STA $D020            ; Change border color to yellow
    LDX #$90
Pause:
    DEX
    BNE Pause            ; Delay loop
    LDA #$00
    STA $D020            ; Change border color back to black
    ASL $D019            ; Acknowledge the interrupt
    JMP $EA31            ; Jump to KERNAL's IRQ handler
```

## Key Registers

- $D019 - VIC-II - Video Interrupt Status (VIRQ); write-1-to-clear; bits: $01 raster, $02 sprite-bg collision, $04 sprite-sprite collision, $08 light-pen, $80 any-enabled flag
- $D01A - VIC-II - Video Interrupt Mask (VIRQM); same bit positions enable CPU IRQs for corresponding VIRQ bits

## References

- "raster_register_and_interrupt_setup" — expands on writing raster value triggers and raster interrupt setup
- Commodore 64 Programmer's Reference Guide: Programming Graphics - Other graphics features
- Raster interrupt - C64-Wiki
- Raster Interrupts and Splitscreen | C64 OS

## Labels
- VIRQ
- VIRQM
