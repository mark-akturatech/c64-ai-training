# MACHINE - Commodore 64 memory map — higher regions and ROM/IO mapping

**Summary:** Memory map of C64 high regions and ROM/IO mapping with searchable addresses ($0100, $0400, $A000, $D000, $DC00, $E000), chip names (VIC‑II / 6566, SID, CIA), and named areas (stack, BASIC RAM, screen memory, ROM overlays). Includes vector/cassette buffer area and alternate RAM/ROM plug‑in spaces.

## Memory map overview
This chunk lists the C64 high memory layout: system stack and BASIC workspace ($0100–$02FF), the BASIC vectors and cassette buffer area ($0300–$03FB), screen memory ($0400–$07E7) and sprite pointer area, BASIC RAM region ($0800–$9FFF) and the common ROM/RAM alternatives in the $8000–$FFFF region (BASIC ROM at $A000–$BFFF, OS ROM at $E000–$FFFF). I/O chip regions and video/SID areas are shown in their absolute addresses ($D000 VIC‑II, $D400 SID/register area, $DC00/$DD00 CIAs). The map also notes the common RAM/ROM overlays (plug‑in ROMs or RAM visible via bank switching).

**[Note: Source may contain an error — $D400–$D41C is labeled "Color nybble memory" in the source but $D400 is the SID register area; color RAM is normally at $D800 in standard C64 hardware.]**

## Source Code
```text
02C0-02FE     704-766     (Sprite 7 data area)
02FF          767         [unused  -wf]
0300-0301     768-769     Error message link
0302-0303     770-771     BASIC warm start link
0304-0305     772-773     Crunch BASIC tokens link
0306-0307     774-775     Print tokens link
0308-0309     776-777     Start new BASIC code link
030A-030B     778-779     Get arithmetic element link
030C          780         SYS A-reg save
030D          781         SYS X-reg save
030E          782         SYS Y-reg save
030F          783         SYS status reg save
0310-0312     784-786     USR function jump (default B248)
0313          787         [unused  -wf]
0314-0315     788-789     IRQ vector   (default EA31)
0316-0317     790-791     BRK vector   (default FE66)
0318-0319     792-793     NMI vector   (default FE47)
031A-031B     794-795     OPEN vector  (default F34A)
031C-031D     796-797     CLOSE vector (default F291)
031E-031F     798-799     Set-input vector   (default F20E)
0320-0321     800-801     Set-output vector  (default F250)
0322-0323     802-803     Restore I/O vector (default F333)
0324-0325     804-805     Input vector     (default F157)
0326-0327     806-807     Output vector    (default F1CA)
0328-0329     808-809     Test STOP vector (default F6ED)
032A-032B     810-811     GET vector       (default F13E)
032C-032D     812-813     Abort I/O vector (default F32F)
032E-032F     814-815     USR vector (default FE66)
0330-0331     816-817     LOAD link  (default F4A5)
0332-0333     818-819     SAVE link  (default F5ED)
0334-033B     820-827     [unused  -wf]
033C-03FB     828-1019    Cassette buffer
03FC-03FF    1020-1023    [unused  -wf]
0400-07E7    1024-2023    Screen memory
07E8-07F7    2024-2039    [unused  -wf]
07F8-07FF    2040-2047    [Sprite bitmap pointers  -wf]
0800-9FFF    2048-40959   BASIC RAM memory

                                                                        :191:

8000-9FFF   32768-40959   Alternative:  ROM plug-in area
A000-BFFF   40960-49151   ROM:  BASIC
A000-BFFF   40960-49151   Alternative:  RAM
C000-CFFF   49152-53247   RAM memory
D000-D02E   53248-53294   Video chip (6566)
D400-D41C   54272-56319   Color nybble memory
DC00-DC0F   56320-56335   Interface chip 1, IRQ (6526)
DD00-DD0F   56576-56591   Interface chip 2, NMI (6526)
D000-DFFF   53248-53294   Alternative:  ROM character set
E000-FFFF   57344-65535   ROM:  operating system
E000-FFFF   57344-65535   Alternative:  RAM
```

## Key Registers
- $0100-$01FF - Stack - system stack page
- $0200-$02FF - BASIC input buffer and tables
- $0300-$03FF - BASIC vectors, system links and cassette buffer (vectors and links area)
- $0400-$07E7 - Screen memory - character screen (default text screen addresses)
- $07F8-$07FF - Sprite bitmap pointers (sprite pointer table)
- $0800-$9FFF - BASIC RAM memory (primary BASIC workspace)
- $8000-$9FFF - Alternative: ROM plug-in area (cartridge / expansion ROM space)
- $A000-$BFFF - BASIC ROM (also can be banked out and replaced by RAM)
- $C000-$CFFF - RAM memory (system RAM pages)
- $D000-$D02E - VIC-II (6566) - video chip registers and I/O
- $D400-$D41C - SID (standard SID register range) — labeled "Color nybble memory" in source **[see note above]**
- $DC00-$DC0F - CIA 1 (6526) - Interface chip 1, IRQ
- $DD00-$DD0F - CIA 2 (6526) - Interface chip 2, NMI
- $D000-$DFFF - Alternative: ROM character set (character ROM overlay at $D000-$DFFF)
- $E000-$FFFF - OS ROM (KERNAL) — also commonly banked to allow RAM at same addresses

**[Note: Source may contain an error — $D400-$D41C labeled "Color nybble memory"; this address range corresponds to the SID chip on the C64; color RAM is typically at $D800.]**

## References
- "c64_vic2_sprite_registers" — expands VIC‑II registers located in the $D000 range
- "c64_sid_registers" — expands SID registers in $D400 range