# Using graphic characters in DATA statements to build a sprite (BASIC)

**Summary:** Example C64 BASIC program that converts printable characters (space and Shift+Q) in DATA strings into sprite bytes by grouping characters in 8-pixel blocks (bit weight 2^(7-j)), POKEs the resulting bytes into sprite memory at 832 ($0340), and sets VIC-II registers (V=$D000 / 53248) and sprite pointer ($07F8 / 2040) to display the sprite.

## Description
This BASIC program lets you draw a sprite visually by using space (blank) and the solid circle character (Shift+Q, shown as "Q" in the DATA lines) in DATA statements. Each DATA line is 24 characters wide and is processed as three 8-pixel groups. For each 8-character group the program:

- Scans characters j = 0..7 (left-to-right).
- Treats "Q" as a set pixel (b = 1), otherwise b = 0.
- Accumulates a byte t by adding b * 2^(7-j) for each j so bit 7 corresponds to the leftmost character of the 8-character group.
- POKEs the computed byte t into sprite image memory at address 832 + i*3 + k (decimal), creating 3 bytes per row for 21 rows (i = 0..20, k = 0..2).
- Prints each numeric byte value as it is computed.

VIC-II and sprite setup performed by the program:
- v = 53248 (decimal) is the VIC-II base ($D000).
- poke v+21,1 — enables sprite(s) (program uses bit settings to enable).
- poke v+39,14 — sets color (sprite color register).
- poke 2040,13 — writes the sprite pointer byte at $07F8 (2040 decimal) so the sprite pointer points to page 13 (13 * 64 = 832) where the sprite data is stored.
- poke v,200 and poke v+1,100 are present in the listing (written to $D000/$D001) as in the original program.

The conversion algorithm makes the bitmap orientation explicit: within each 8-pixel block the leftmost character becomes bit 7 and the rightmost becomes bit 0. Because each sprite row is 24 pixels wide this program stores 3 bytes per row. The example DATA lines define a 21-row sprite.

## Source Code
```basic
start tok64 page181.prg
 10 print"{clear}":fori=0to63:poke832+i,0:next
 20 gosub60000
 999 end
 60000 data"         QQQQQQQ        "
 60001 data"       QQQQQQQQQQQ      "
 60002 data"      QQQQQQQQQQQQQ     "
 60003 data"      QQQQQ   QQQQQ     "
 60004 data"     QQQQQ QQQ  QQQQ    "
 60005 data"     QQQQQ QQQ QQQQQ    "
 60006 data"     QQQQQ QQQ  QQQQ    "
 60007 data"      QQQQQ   QQQQQ     "
 60008 data"      QQQQQQQQQQQQQ     "
 60009 data"      QQQQQQQQQQQQQ     "
 60010 data"      Q QQQQQQQQQ Q     "
 60011 data"       Q QQQQQQQ Q      "
 60012 data"       Q  QQQQQ  Q      "
 60013 data"        Q  QQQ  Q       "
 60014 data"        Q  QQQ  Q       "
 60015 data"         Q  Q  Q        "
 60016 data"         Q  Q  Q        "
 60017 data"          QQQQQ         "
 60018 data"          QQQQQ         "
 60019 data"          QQQQQ         "
 60020 data"           QQQ          "
 60100 v=53248:pokev,200:pokev+1,100:pokev+21,1:pokev+39,14:poke2040,13
 60105 pokev+23,1:pokev+29,1
 60110 fori=0to20:reada$:fork=0to2:t=0:forj=0to7:b=0
 60140 ifmid$(a$,j+k*8+1,1)="Q"thenb=1
 60150 t=t+b*2^(7-j):next:printt;:poke832+i*3+k,t:next:print:next
 60200 return
stop tok64
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II I/O register block (base V = 53248): control, raster, sprite control and color registers.
- $07F8 - $07F8-$07FF - Sprite pointer table (8 bytes) — program pokes 2040 (decimal) = $07F8 with value 13 so sprite data page = 13 (13 * 64 = 832).
- $0340-$037F - RAM range used for sprite image data (decimal 832..895) where the program writes sprite bytes (832 + i*3 + k).

## References
- "sprite_data_encoding_groups_of_eight" — conversion of 'Q' characters to 8-bit sprite bytes
- "spritemaking_chart" — sprite pointer locations and sprite memory placement