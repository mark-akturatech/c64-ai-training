# HIBASE (648, $288)

**Summary:** HIBASE (location 648 decimal / $0288) is the OS pointer that selects the top page (1K page) of screen memory used by the Commodore 64 operating system PRINT routines; multiply the value stored here by 256 to get the screen RAM start address. Relevant hardware registers for relocating the visible screen are the VIC-II range ($D000-$D02E) and CIA#2 ($DD00-$DD0F).

**Description**
Location 648 ($0288) holds the page number (0–255) used by the KERNAL/OS printing routines as the base page of screen RAM. To compute the start address of screen RAM:
- Start address = (value at 648) * 256

On power-up, the default is 4, which gives the usual screen RAM start at 4*256 = 1024 ($0400).

Moving the visible screen involves two separate actions:
- Telling the VIC-II where to fetch the screen matrix (VIC-II bank/memory-pointer register(s), see $D000-$D02E and specifically $D018 for the screen memory location).
- Telling the Operating System where to PRINT by changing HIBASE (648 / $0288).

If you change the VIC-II screen memory location without updating HIBASE, the VIC will display from the new area but OS PRINT (keyboard/PRINT statements) will still write to the old area — you must update HIBASE so PRINTed characters appear on the displayed screen.

Because PRINT essentially POKEs character codes into screen RAM (and also writes to color RAM), you can redirect PRINT to write to other memory areas by temporarily changing HIBASE. Examples:
- PRINTing into the sprite shape data area (to create sprite data without many DATA statements).
- PRINTing into ROM (harmlessly from the VIC display point of view) while changing many screen RAM locations at once (be aware PRINT also affects color RAM).

This entry references details and examples in the VIC bank select entry ($D018 / 53272) and low-level memory control (CIA#2 $DD00-$DD0F). See references below.

**[Note: The original source contained an error mapping the VIC-II memory bank select to 56576 ($DD00). The correct register for selecting the VIC-II's 16K memory bank is at $DD00 (56576), specifically bits 0 and 1 of CIA#2's Port A. The screen memory location within the selected bank is set by $D018 (53272).]**

## Source Code
```basic
10 SP=53248:POKESP,170:POKESP+1,125:POKESP+21,1:POKE 2040,13:PRINT CHR$(147)
20 A$="THIS TEXT WILL BE PRINTED TO THE SPRITE SHAPE DATA AREA AND DISPLAYED"
30 GOSUB 100
40 A$="THIS IS SOME DIFFERENT TEXT TO BE PRINTED TO THE SPRITE SHAPE AREA"
50 GOSUB 100
60 COUNT=COUNT+1:IF COUNT<15 THEN 20
70 END
100 POKE 648,3:PRINT CHR$(19);CHR$(17);SPC$(24);A$;:POKE 648,4:RETURN
```

```basic
10 D$=CHR$(94):FOR I=1 TO 4:D$=D$+D$:NEXT
20 PRINT CHR$(147);:FOR I=1 TO 7:PRINT TAB(10) D$:NEXT:PRINT:PRINT:PRINT:PRINT
30 PRINT TAB(9);CHR$(5);"HIT ANY KEY TO STOP"
40 DIM C(15):FOR I=0 TO 14:READ A:C(I)=A:NEXT:DATA2,8,7,5,6,4,1,2,8,7,5,6,4,1,2
50 POKE 53281,0:POKE 648,212:FOR J=0 TO 6:PRINT CHR$(19);
60 FOR I=J TO J+6:POKE 646,C(I):PRINT TAB(10) D$:NEXT I,J
70 GET A$:IF A$="" THEN 50
80 POKE 648,4:POKE 646,1
```

(These listings are the original BASIC examples showing temporary changes to HIBASE to redirect PRINT output — first writes into sprite shape area, second demonstrates printing to ROM/other areas while affecting color RAM.)

## Key Registers
- $0288 - RAM - HIBASE: top page of screen memory used by OS print routines (multiply by 256 to get start address)
- $D018 - VIC-II - Memory Control Register: selects screen memory location within the current VIC bank
- $DD00 - CIA#2 - Data Port A: bits 0 and 1 select the 16K VIC bank

## References
- "vicscn_video_screen_memory_area" — expands on VICSCN default location ($0400-$07FF) and relation to HIBASE
- "sprite_shape_data_pointers" — expands on pointers to sprite shape data located at end of screen matrix

## Labels
- HIBASE
- D018
- DD00
