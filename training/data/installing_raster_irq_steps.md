# Installing a Raster IRQ Handler (C64 / VIC-II)

**Summary:** Step-by-step procedure to install a raster IRQ handler using VIC-II registers $D012 and $D011, enable raster IRQ via $D01A, and install the handler address into the IRQ vector at $0314-$0315 (decimal 788-789). Includes corrected formula for splitting a 16-bit address into low/high bytes.

## Procedure
1. Disable interrupts with SEI to prevent race conditions while changing vectors.
2. Enable the VIC-II raster interrupt by setting bit 0 of the VIC-II interrupt enable register ($D01A) to 1.
3. Set the 9-bit raster compare value:
   - Write the low 8 bits to $D012 (raster compare low).
   - Set/clear the high (9th) bit in $D011 so the full 9-bit value is correct (the high bit is stored in $D011).
4. Install the address of your IRQ handler into the IRQ vector at addresses 788–789 (decimal) = $0314–$0315 (hex). The low byte goes to $0314, the high byte to $0315.
   - Correct formula to split a 16-bit address AD into bytes:
     - LOWBYTE = AD AND $FF  (or LOWBYTE = AD - (HIBYTE * 256))
     - HIBYTE = (AD >> 8) AND $FF  (or HIBYTE = INT(AD / 256))
   - Note: the original source printed HIBYTE=INT(AD/156) — this is an error. See note below.
5. Re-enable interrupts with CLI.

When the IRQ fires, your handler should first confirm the raster-compare condition is the source (to avoid handling other IRQ sources), perform display changes, and then return with RTI.

**[Note: Source may contain an error — the original formula used 156 instead of 256 when computing HIBYTE; corrected above.]**

## Source Code
```asm
; Example: install raster IRQ handler at label MyIRQ (assumes 6502/commodore)
; raster_line = desired raster (0..511/9-bit). Example uses 200.
        SEI                 ; 1) Disable interrupts
; 2) Enable raster IRQ (bit 0) in $D01A
        LDA     $D01A
        ORA     #$01        ; set bit0 = enable raster IRQ
        STA     $D01A

; 3) Set raster compare (9-bit)
        LDA     #<RASTER    ; low 8 bits of desired raster
        STA     $D012
        ; set or clear high bit in $D011 (bit7 is the 9th raster bit)
        LDA     $D011
        AND     #%01111111  ; clear bit7
        ; if RASTER >= 256 then set bit7:
        ; ORA    #%10000000
        ; STA    $D011

; 4) Install IRQ vector (low byte at $0314, high byte at $0315)
        LDA     #<MyIRQ     ; low byte of handler address
        STA     $0314       ; decimal 788
        LDA     #>MyIRQ     ; high byte of handler address
        STA     $0315       ; decimal 789

        CLI                 ; 5) Re-enable interrupts
        RTS                 ; continue (if this code runs from main program)

; --- Your IRQ handler ---
MyIRQ:
        ; Confirm raster source / handle
        ; ... (save registers, do work)
        RTI

; Helper: define RASTER constant
RASTER  = 200
```

```text
Address mapping note:
- Decimal vector addresses 788-789 == $0314-$0315 (low/high bytes of IRQ vector).
- VIC-II registers shown: $D011 (control / high raster bit), $D012 (raster compare low), $D01A (interrupt enable).
```

## Key Registers
- $D011-$D012 - VIC-II - Raster high-bit control (in $D011) and raster compare low byte ($D012)
- $D01A - VIC-II - Interrupt Enable Register (bit 0 = raster IRQ enable)
- $0314-$0315 - IRQ Vector (low byte at $0314, high byte at $0315) — install handler address here

## References
- "raster_compare_irq_and_raster_scan_basics" — why the raster registers and 9-bit value matter
- "preserving_jiffy_clock_and_vectors" — preserving/chain the existing timer (jiffy) IRQ vector