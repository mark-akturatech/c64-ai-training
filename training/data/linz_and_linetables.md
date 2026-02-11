# KERNAL ROM (editor) — LINZ / LDTB2 per-line base low-byte table

**Summary:** Defines LINZ0..LINZ24 as per-screen-line base addresses (VICSCN + n*LLEN) and stores their low bytes in the LDTB2 table (.BYTE <LINZ0 .. <LINZ24) for the screen editor to compute character memory addresses. Contains nearby data tables (color/CONTRL/TVIC/RUNTB) and the editor library end / start of SERIAL4.0 at $ED09.

**LINZ / LDTB2 — purpose and behavior**

LINZ0..LINZ24 are assembler labels that form a linear sequence of per-screen-line base addresses used by the screen editor. Each LINZn is defined relative to VICSCN with a constant line length LLEN:

- LINZ0 = VICSCN
- LINZ1 = LINZ0 + LLEN
- ...
- LINZ24 = LINZ23 + LLEN

LDTB2 is a table of the low bytes of those per-line base addresses. The editor uses the low byte from LDTB2 together with the high byte (or other base) to compute the character memory address for a given screen line quickly (low byte accessed via "<label" assembler operator). Storing only the low bytes saves space and simplifies address arithmetic when the high byte is invariant or handled separately.

The surrounding assembly block shows supporting data used by the editor (color/CONTRL tables, TVIC sprite/data arrays, and a RUNTB text table). The snippet ends partway through LDTB2 (.BYTE <LINZ0 .. <LINZ10) and indicates the editor library ends and SERIAL4.0 library begins at $ED09 in the original ROM image.

## Source Code

```asm
                                ;.BYT $FF ;END OF TABLE NULL
                                CONTRL
                                ;NULL,RED,PURPLE,BLUE,RVS ,NULL,NULL,BLACK
.:EC78 FF FF FF FF FF FF FF FF  .BYT   $FF,$FF,$FF,$FF,$FF,$FF,$FF,$FF
                                ;NULL, W  ,REVERSE, Y  , I  , P  ,NULL,MUSIC
.:EC80 1C 17 01 9F 1A 13 05 FF  .BYT   $1C,$17,$01,$9F,$1A,$13,$05,$FF
.:EC88 9C 12 04 1E 03 06 14 18  .BYT   $9C,$12,$04,$1E,$03,$06,$14,$18
                                ;NULL,CYAN,GREEN,YELLOW,RVS OFF,NULL,NULL,WHITE
.:EC90 1F 19 07 9E 02 08 15 16  .BYT   $1F,$19,$07,$9E,$02,$08,$15,$16
.:EC98 12 09 0A 92 0D 0B 0F 0E  .BYT   $12,$09,$0A,$92,$0D,$0B,$0F,$0E
.:ECA0 FF 10 0C FF FF 1B 00 FF  .BYT   $FF,$10,$0C,$FF,$FF,$1B,$00,$FF
.:ECA8 1C FF 1D FF FF 1F 1E FF  .BYT   $1C,$FF,$1D,$FF,$FF,$1F,$1E,$FF
.:ECB0 90 06 FF 05 FF FF 11 FF  .BYT   $90,$06,$FF,$05,$FF,$FF,$11,$FF
.:ECB8 FF                       .BYT   $FF             ;END OF TABLE NULL
                                TVIC
                                .BYT   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ;SPRITES (0-16)
                                .BYT   $1B,0,0,0,0,$08,0,$14,0,0,0,0,0,0,0 ;DATA (17-31)
.:ECB9 00 00 00 00 00 00 00 00  .BYT   14,6,1,2,3,4,0,1,2,3,4,5,6,7 ;32-46
                                ;
.:ECE7 4C 4F 41 44 0D 52 55 4E  RUNTB  .BYT 'LOAD',$D,'RUN',$D
                                ;
                                VICSCN = $0400
                                LLEN   = 40
                                LINZ0  = VICSCN
                                LINZ1  = LINZ0+LLEN
                                LINZ2  = LINZ1+LLEN
                                LINZ3  = LINZ2+LLEN
                                LINZ4  = LINZ3+LLEN
                                LINZ5  = LINZ4+LLEN
                                LINZ6  = LINZ5+LLEN
                                LINZ7  = LINZ6+LLEN
                                LINZ8  = LINZ7+LLEN
                                LINZ9  = LINZ8+LLEN
                                LINZ10 = LINZ9+LLEN
                                LINZ11 = LINZ10+LLEN
                                LINZ12 = LINZ11+LLEN
                                LINZ13 = LINZ12+LLEN
                                LINZ14 = LINZ13+LLEN
                                LINZ15 = LINZ14+LLEN
                                LINZ16 = LINZ15+LLEN
                                LINZ17 = LINZ16+LLEN
                                LINZ18 = LINZ17+LLEN
                                LINZ19 = LINZ18+LLEN
                                LINZ20 = LINZ19+LLEN
                                LINZ21 = LINZ20+LLEN
                                LINZ22 = LINZ21+LLEN
                                LINZ23 = LINZ22+LLEN
                                LINZ24 = LINZ23+LLEN
                                ;****** SCREEN LINES LO BYTE TABLE ******
                                ;
                                LDTB2
                                       .BYTE <LINZ0
                                       .BYTE <LINZ1
                                       .BYTE <LINZ2
                                       .BYTE <LINZ3
                                       .BYTE <LINZ4
                                       .BYTE <LINZ5
                                       .BYTE <LINZ6
                                       .BYTE <LINZ7
                                       .BYTE <LINZ8
                                       .BYTE <LINZ9
                                       .BYTE <LINZ10
                                       .BYTE <LINZ11
                                       .BYTE <LINZ12
                                       .BYTE <LINZ13
                                       .BYTE <LINZ14
                                       .BYTE <LINZ15
                                       .BYTE <LINZ16
                                       .BYTE <LINZ17
                                       .BYTE <LINZ18
                                       .BYTE <LINZ19
                                       .BYTE <LINZ20
                                       .BYTE <LINZ21
                                       .BYTE <LINZ22
                                       .BYTE <LINZ23
                                       .BYTE <LINZ24
                                ;****** END OF SCREEN LINES LO BYTE TABLE ******
                                ;
                                ;****** EDITOR LIBRARY END / SERIAL4.0 START ******
                                ;
.:ED09                          ; (Content of SERIAL4.0 library starts here)
```

## References

- "mode_and_control_tables_and_color_table" — expands on color/CONTRL tables used for display attributes
