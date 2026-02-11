# MOB enable control (MnE bits in $D015) and MOB positioning (sprite X/Y)

**Summary:** Describes MOVABLE OBJECT BLOCK (MOB / sprite) enable bits (MnE) in VIC-II register $D015 and how disabling a MOB stops all MOB operations; explains X/Y positioning using sprite position registers with 9-bit horizontal (512) × 8-bit vertical (256) resolution, reference corner (upper-left of the sprite array), and visible coordinate ranges X 23–347 ($17–$157) and Y 50–249 ($32–$F9).

## Enable
Each MOB (sprite) is individually enabled for display by setting its corresponding MnE bit to 1 in VIC-II register $D015 (register 21, $15). If an MnE bit is 0, that MOB is disabled — no sprite fetch, no DMA, and no display operations occur for that MOB. MnE bits directly control whether the VIC-II will consider that sprite during raster processing.

## Position
Each MOB position is controlled by its X and Y position registers (VIC-II sprite position registers). Horizontal resolution is 512 positions (9 bits), vertical resolution is 256 positions (8 bits). The sprite coordinate origin/reference corner used for positioning is the upper-left corner of the sprite bitmap array.

Visible ranges (hardware-visible on a standard C64 display area as noted in the source):
- X: 23 to 347 decimal ($17 to $157)
- Y: 50 to 249 decimal ($32 to $F9)

Because position registers allow values outside these visible ranges, sprites may be moved smoothly on and off-screen (substantial range of off-screen positions are addressable). Horizontal positions use a low byte plus a high-bit (MSB) to produce 9-bit X values (0–511); vertical positions are full 8-bit values (0–255).

## Source Code
```text
VIC-II sprite registers (absolute C64 addresses; VIC-II base $D000)

$D000-$D007  - Sprite 0-7 X position, low 8 bits (one byte per sprite)
$D008-$D00F  - Sprite 0-7 Y position, 8-bit (one byte per sprite)
$D010        - Sprite X MSB bits (bit 0 -> sprite 0 MSB, ... bit 7 -> sprite 7 MSB)
               (forms the 9th bit for X: X = (MSB_bit << 8) | X_low)
$D011        - Control / display register (VIC-II flags; not listed here in full)
...
$D015        - Sprite enable register (MnE bits)
               bit 0 = MnE for sprite 0 (1 = enabled)
               bit 1 = MnE for sprite 1
               ...
               bit 7 = MnE for sprite 7

Example: enable sprite 0 and sprite 1 (assembly)
```asm
    LDA #$03       ; bits 0 and 1 = 1
    STA $D015      ; write to sprite enable register (MnE)
```

Example: compute full 9-bit X position (conceptual)
```asm
    ; Assume sprite index in A (0-7), low X in $D000+index, MSB in $D010 bit index
    LDX #<index>
    LDA $D000,X           ; X low byte
    LSR A                 ; (example operations omitted)
    ; To test MSB:
    LDA $D010
    AND #(1 << index)     ; if nonzero, MSB = 1
    ; Full X = (MSB<<8) | X_low
```
```

## Key Registers
- $D000-$D00F - VIC-II - Sprite 0-7 X low ( $D000-$D007 ) and Y positions ( $D008-$D00F )
- $D010 - VIC-II - Sprite X MSB bits (9th horizontal bit for sprites 0-7)
- $D015 - VIC-II - Sprite enable register (MnE bits for sprites 0-7; 1 = enabled, 0 = disabled)

## References
- "movable_object_block_overview_and_layout" — MOB basic definition and display block layout
- "mob_memory_access_and_pointers" — how raster line matching triggers MOB data fetches

## Labels
- $D000-$D00F
- $D010
- $D015
