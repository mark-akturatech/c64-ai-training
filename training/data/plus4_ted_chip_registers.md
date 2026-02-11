# TED (Preliminary) — Register Map $FF00–$FF3F

**Summary:** Preliminary TED video/sound I/O register map for $FF00–$FF3F covering Timer 1/2/3 low/high bytes, control bits ($FF06/$FF07), keyboard latch ($FF08), IRQ flags and IER ($FF09/$FF0A), RC/CUR, voice/sound registers, video/color/background matrices, and ROM/RAM select. Field boundaries are approximate; bit-level masks are not fully specified.

**Overview**

This chunk documents a preliminary mapping of the TED chip I/O region at $FF00–$FF3F (PLUS/4 family). It lists grouped registers (timers, control, IRQs, sound/voice, video matrix, color/background registers, ROM/RAM select) and the textual/ASCII layout used by the source. Many field names are preserved literally (ECM, BMM, Blank, Rows, X/Y adjust, PAL/RUS, Freeze, MCM, Columns, etc.). Two short parenthetical clarifications are included where common: ECM (Extended Color Mode), BMM (Bitmap Mode).

Do not rely on this as a definitive bit-mask map — the source repeatedly warns that bit boundaries are approximate. Use this as a starting reference for locating TED registers and groups; obtain authoritative datasheets or hardware schematics for precise bit definitions and behavior.

## Source Code

```text
MACHINE - Preliminary mapping of the 'TED' video chip registers ($FF00–$FF3F). Includes Timer 1/2/3 low/high bytes ($FF00–$FF05), control bits at $FF06/$FF07 (ECM, BMM, Blank, Rows, X/Y adjust, PAL/RUS, Freeze, MCM, Columns), keyboard latch at $FF08, IRQ flags and IER masks at $FF09–$FF0A, RC and CUR registers, voice and sound controls, color and background matrices, ROM/RAM select ($FF3E/$FF3F), and other TED registers. Note: field boundaries approximate.

"TED" Chip, Preliminary
-----------------------

[again, it's pretty difficult to see the exact bit boundaries between the
 fields, so this may be off by a bit or two. :( -wf ]

      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF00 |                                                       Low Byte| 65280
      +- - - - - - - - - - - - - - Timer 1 - - - - - - - - - - - - - -+
$FF01 |                                                      High Byte| 65281
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF02 |                                                       Low Byte| 65282
      +- - - - - - - - - - - - - - Timer 2 - - - - - - - - - - - - - -+
$FF03 |                                                      High Byte| 65283
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF04 |                                                       Low Byte| 65284
      +- - - - - - - - - - - - - - Timer 3 - - - - - - - - - - - - - -+
$FF05 |                                                      High Byte| 65285
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF06 | Test  |  ECM  |  BMM  | Blank | Rows  |       X-Adjust        | 65286
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF07 |Rus Off|  PAL  |Freeze |  MCM  |Columns|       Y-Adjust        | 65287
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF08 |                        Keyboard Latch                         | 65288
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF09 |IRQFlag|Timer 3|///////|Timer 2|Timer 1|LightPn|Raster |///////| 65289
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF0A |IER:   |Timer 3|///////|Timer 2|Timer 1|LightPn|Raster |       | 65290
      +-------+-------+-------+-------+-------+-------+-------+- - - -+
$FF0B |                              RC                               | 65291
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF0C |///////////////////////////////////////////////|               | 65292
      +-------+-------+-------+-------+-------+-------+- - - - - - - -+
$FF0D |                              CUR                              | 65293
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF0E |                            Voice 1                    Low Byte| 65294
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF0F |                            Voice 2                    Low Byte| 65295
      +-------+-------+-------+-------+-------+-------+- - - - - - - -+
$FF10 |///////////////////////////////////////////////|      High Bits| 65296
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF11 |         Sound Select          |            Volume             | 65297
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF12 |///////////////|         BMB           | RBANK |Voice 1    High| 65298
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF13 |                    Character Base             |SCLOCK |STATUS | 65299
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF14 |                 Video Matrix          |///////////////////////| 65300
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF15 |///////|       Luminance       |             Color            0| 65301
      +-------+- - - - - - - - - - - - - - - - - - - - - - - - - - - -+
$FF16 |///////|                       |                              1| 65302
      +-------+- - - - - - - - - - - - - - - - - - - - - - - - - - - -+
$FF17 |///////|                                                      2| 65303
      +-------+- - - - - - - - - - - - - - - - - - - - - - - - - - - -+
$FF18 |///////|                       |                              3| 65304
      +-------+- - - - - - - - - - - - - - - - - - - - - - - - - - - -+
$FF19 |///////|                       |                              4| 65305
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF1A |///////////////////////////////////////////////|               | 65306
      +-------+-------+-------+-------+-------+-------+- - - - - - - -+
$FF1B |                              BRE                              | 65307
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF1C |///////////////////////////////////////////////////////|       | 65308
      +-------+-------+-------+-------+-------+-------+-------+- - - -+
$FF1D |                              VL                               | 65309
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF1E |                               H                               | 65310
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF1F |///////|              BL               |         VSUB          | 65311
      +-------+-------+-------+-------+-------+-------+-------+-------+
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF3E |                          ROM Select                           | 65342
      +-------+-------+-------+-------+-------+-------+-------+-------+
$FF3F |                          RAM Select                           | 65343
      +-------+-------+-------+-------+-------+-------+-------+-------+
```

## Key Registers

- $FF00–$FF05 – TED – Timer 1/2/3 low/high bytes (Timer 1: $FF00/$FF01, Timer 2: $FF02/$FF03, Timer 3: $FF04/$FF05)
- $FF06–$FF07 – TED – Control bits (Test, ECM (Extended Color Mode), BMM (Bitmap Mode), Blank, Rows, X/Y adjust, PAL, Rus Off, Freeze, MCM, Columns)
- $FF08 – TED – Keyboard latch
- $FF09–$FF0A – TED – IRQ flags ($FF09) and IER mask ($FF0A) (Raster, LightPen, Timer1/2/3 bits present)
- $FF0B – TED – RC register
- $FF0D – TED – CUR register
- $FF0E–$FF10 – TED – Voice registers (Voice 1/2 low bytes at $FF0E/$FF0F, high bits at $FF10)
- $FF11–$FF13 – TED – Sound select / Volume / BMB / RBANK / Character base / SCLOCK / STATUS
- $FF14–$FF1F – TED – Video matrix and background/color registers (video matrix, luminance, colors 0–4, BRE, VL, H, BL, VSUB)
- $FF3E–$FF3F – TED – ROM Select ($FF3E) and RAM Select ($FF3F)

## Labels
- RC
- CUR
- BRE
- ROMSELECT
- RAMSELECT
