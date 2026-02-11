# Kernal PAL/NTSC Detection & 1/60s IRQ Compensation ($FF5B-$FF7F)

**Summary:** Patch area in later Commodore 64 Kernal ROM at $FF5B–$FF7F (decimal 65371–65407) containing code to detect PAL vs NTSC and compensate timing so the 1/60s IRQ (sixtieth-of-a-second interrupt) is accurate on both systems.

**Description**

This ROM patch region ($FF5B–$FF7F) is present in later Kernal releases and implements a hardware/clock standard test (PAL vs NTSC) to adjust system timing, ensuring the periodic 1/60-second IRQ remains accurate under both video standards.

The detection algorithm operates as follows:

1. **Initialize Raster Line for IRQ:**
   - Set the raster line register ($D012) to $37 (decimal 55), configuring the VIC-II to generate an interrupt when the raster reaches line 55.

2. **Wait for Raster Line to Reach $37:**
   - Continuously read the raster line register ($D012) until it equals $37.

3. **Check Interrupt Request Register:**
   - Read the Interrupt Request Register ($D019) and mask with $01 to check if the raster interrupt occurred.

4. **Determine Video Standard:**
   - If the raster interrupt occurred at line $37, the system is NTSC.
   - If the raster interrupt occurred at line $137 (decimal 311), the system is PAL.

The result is stored in memory location $02A6, where:

- $00 indicates NTSC.
- $01 indicates PAL.

This detection allows the system to adjust the timing of the 1/60-second IRQ to maintain accurate timekeeping across different video standards.

The patch was introduced in Kernal revision 3 (901227-03) to address timing differences between European (PAL) and U.S. (NTSC) systems. ([bozimmerman.com](https://bozimmerman.com/anonftp/pub/cbm/ALLFILES.html?utm_source=openai))

The complete "cint_initialize_screen_editor_and_vic_ii_chip" routine, which includes this patch, is located at $FF5B in the Kernal ROM. ([cbmitapages.it](https://www.cbmitapages.it/c64/c64rom.htm?utm_source=openai))

No significant side effects are noted, and the compensation parameters are stored at memory location $02A6.

## Source Code

The assembly listing for the patch at $FF5B–$FF7F is as follows:

```assembly
FF5B   20 18 E5   JSR $E518       ; Initialize VIC-II
FF5E   AD 12 D0   LDA $D012       ; Load current raster line
FF61   D0 FB      BNE $FF5E       ; Wait until raster line is 0
FF63   AD 19 D0   LDA $D019       ; Load Interrupt Request Register
FF66   29 01      AND #$01        ; Mask raster interrupt flag
FF68   8D A6 02   STA $02A6       ; Store result in $02A6
FF6B   4C DD FD   JMP $FDDD       ; Jump to next routine
FF6E   A9 81      LDA #$81        ; Load value for Timer A control
FF70   8D 0D DC   STA $DC0D       ; Store in CIA Timer A control register
FF73   AD 0E DC   LDA $DC0E       ; Load Timer A control register
FF76   29 80      AND #$80        ; Mask out unwanted bits
FF78   09 11      ORA #$11        ; Set Timer A to continuous mode
FF7A   8D 0E DC   STA $DC0E       ; Store back to Timer A control register
FF7D   4C 8E EE   JMP $EE8E       ; Jump to IRQ handler
```

## Key Registers

- **$D012**: VIC-II Raster Line Register.
- **$D019**: VIC-II Interrupt Request Register.
- **$02A6**: Memory location storing the video standard flag (0 for NTSC, 1 for PAL).
- **$DC0D**: CIA Timer A Control Register.
- **$DC0E**: CIA Timer A Control Register.

## References

- ([cbmitapages.it](https://www.cbmitapages.it/c64/c64rom.htm?utm_source=openai))
- ([bozimmerman.com](https://bozimmerman.com/anonftp/pub/cbm/ALLFILES.html?utm_source=openai))