# Commodore 64 & VIC-20 — extra RAM at $C000-$CFFF; removing/moving BASIC (SOB) to free $0801-$CFFF

**Summary:** Describes the common free 4K block at $C000-$CFFF on the Commodore 64, the method to remove BASIC (POKE $01,$36 / POKE $01,$37 — LDA #$36/#$37; STA $01) to free $0801-$CFFF (~50K), and VIC-20 video-address limits ($0000-$1FFF, screen at $1E00-$1FFF) and SOB (start-of-BASIC) relocation practices.

## Details

- C64 free block: $C000-$CFFF (decimal 49152–53247) is commonly used by utilities and commercial programs as a 4K scratch/block of RAM. Always check for conflicts before using it.

- Removing BASIC on the C64:
  - BASIC can be removed from the system to reclaim the area from $0801 up to $CFFF (~50K).
  - Typical manipulations in BASIC: POKE 1,54 (decimal) or POKE 1,55 to change the processor port at $0001 and alter ROM/IO banking.
  - Assembly equivalents: LDA #$36 / STA $01 (disable BASIC), LDA #$37 / STA $01 (re-enable BASIC).
  - Caution: With BASIC disabled the machine will not present the normal BASIC prompt or READY text; you must restore configuration or provide your own monitor/loader to interact.

- Moving the Start-Of-BASIC (SOB) pointer to free low memory:
  - It is common across Commodore machines to raise the SOB pointer and use the space below it for machine code or buffers.
  - The area immediately before the new start-of-BASIC must contain a zero byte, and other BASIC pointers must be aligned; typically a NEW from BASIC will rebuild/align internal pointers to the current SOB.
  - Because reconfiguration is needed before loading and often restoration after program execution, this technique is less convenient on the C64 than on the VIC-20, but it remains a valid option.

- VIC-20 video memory constraints (affects where ML and video-effect data can live):
  - The VIC chip can address $0000-$1FFF (0–8191) for video/data used on screen.
  - Within $0000-$1FFF typical usage (may vary with configurations):
    - $0000–$03FF: system usage (including cassette buffers); avoid overwriting unless you know it’s safe.
    - $0400–$0FFF: usually unmapped unless a 3K RAM expansion is present.
    - $1000–$1DFF: BASIC program area on many systems.
    - $1E00–$1FFF: screen memory (character codes) on many standard VIC-20 configurations.
  - The VIC can "see" $8000–$9FFF as well, but on stock VIC-20 there is no RAM there to manipulate.
  - For VIC-20 visual effects you must place dynamic screen/character data within the VIC-addressable window ($0000–$1FFF) or use RAM expansions and remap SOB accordingly.

- Practical notes kept strictly to source content: these techniques are widely used by utilities and ML programs; verify memory use and restore system state when finished.

## Source Code
```asm
; Assembly equivalents for toggling BASIC presence via processor port $0001
; Disable BASIC (example shown in source):
LDA #$36
STA $01

; Re-enable BASIC:
LDA #$37
STA $01
```

```text
; VIC-20 common memory layout (stock, may vary with expansions)
$0000 - $03FF  : system use (cassette buffer, low system vectors)
$0400 - $0FFF  : typically unmapped unless 3K RAM expansion present
$1000 - $1DFF  : BASIC program area (typical)
$1E00 - $1FFF  : screen memory (character codes)
; VIC can address $0000-$1FFF (and sees $8000-$9FFF but usually no RAM there)
```

```basic
10 POKE 1,54   : decimal POKE equivalent to LDA #$36:STA $01 (disable BASIC)
20 POKE 1,55   : decimal POKE equivalent to LDA #$37:STA $01 (re-enable BASIC)
```

## Key Registers
- $C000-$CFFF - RAM - frequently used 4K scratch block on the Commodore 64
- $0801-$CFFF - RAM - range claimed when BASIC/ROM is removed (approximate reclaimed area)
- $0001 - I/O / processor port - memory-configuration control (used by POKE 1,54 / POKE 1,55)
- $0000-$1FFF - VIC (VIC-20 addressable video/data space) - VIC-20 must fetch screen/character data from here
- $1E00-$1FFF - VIC (VIC-20 screen memory area in many configurations)

## References
- "where_to_put_machine_language_programs" — placement of ML in high memory or moving SOB