# Raster register (VIC-II $D012 + YSCROLL bit 7)

**Summary:** The VIC-II raster counter is a 9-bit value: the low 8 bits are in the RASTER register ($D012), and the 9th (most significant) bit is in bit 7 of the YSCROLL (YSCRL) register ($D011). Writing both parts schedules a raster compare that sets the raster interrupt flag in the Interrupt Request Register (VIRQ, $D019) and—if enabled in the Interrupt Mask Register (VIRQM, $D01A)—generates an interrupt. Remember to store the 9th bit when scheduling raster interrupts.

**Raster operation**

The VIC-II tracks the current electron-beam scan line as a 9-bit value. Reading:
- Low 8 bits: read from RASTER ($D012).
- 9th bit (MSB): read from bit 7 of the YSCROLL (YSCRL) register ($D011).

Writing:
- You may write a 9-bit raster value by storing the low 8 bits to $D012 and the 9th bit into bit 7 of $D011.
- When the current scanline equals the stored 9-bit value, the raster-compare bit (bit 0) in the VIRQ register ($D019) will be set.
- If the corresponding mask/enable bit (bit 0) in VIRQM ($D01A) is set, the raster-compare will generate a CPU interrupt.
- If you fail to store the 9th bit along with the low 8 bits, the 9-bit comparison will not occur, and the interrupt will not trigger as expected.

**RAST macro implementation**

The RAST macro sets the full 9-bit raster value for scheduling raster interrupts. Below is an example implementation in assembly language:

```assembly
; RAST macro to set 9-bit raster value
; Usage: RAST raster_value
; raster_value: 9-bit raster line number (0-511)

.macro RAST raster_value
    lda #<raster_value          ; Load low 8 bits of raster_value
    sta $D012                   ; Store to RASTER register ($D012)
    lda $D011                   ; Load current value of Control Register 1 ($D011)
    and #%01111111              ; Clear bit 7 (MSB of raster)
    ora #>raster_value          ; Set bit 7 according to raster_value's MSB
    sta $D011                   ; Store back to Control Register 1
.endmacro
```

In this macro:
- `#<raster_value` extracts the low 8 bits of the 9-bit raster value.
- `#>raster_value` extracts the 9th bit (MSB) of the raster value.
- The macro first writes the low 8 bits to $D012.
- Then, it updates bit 7 of $D011 to set the 9th bit of the raster value.

**Example usage:**

To set the raster interrupt to line 300:

```assembly
RAST 300
```

This will configure the VIC-II to trigger an interrupt when the raster reaches line 300.

## Key Registers

- $D012 - VIC-II - Raster register (low 8 bits of current scanline / compare low byte)
- $D011 - VIC-II - Control Register 1 (bit 7 contains the 9th (MSB) raster bit)
- $D019 - VIC-II - Interrupt Request Register (VIRQ) (bit 0 is the raster-compare flag)
- $D01A - VIC-II - Interrupt Mask Register (VIRQM) (bit 0 enables raster-compare interrupts)

## References

- "video_interrupts_virq_and_virqm" — expands on how raster compares set VIRQ and can cause interrupts

## Labels
- RASTER
- YSCRL
- VIRQ
- VIRQM
