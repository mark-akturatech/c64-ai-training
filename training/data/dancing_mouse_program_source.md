# Michael's Dancing Mouse (Complete BASIC program, start tok64 page167.prg)

**Summary:** Complete Commodore 64 BASIC program that sets SID registers ($D400) for voice parameters, initializes VIC-II ($D000) sprite registers, loads three 64-byte sprite images into RAM ($3000-$30BE), prints a message, and animates a sprite by poking sprite X low ($D000) and X MSB ($D010) while toggling SID voice control bytes via two BASIC subroutines.

## Description
This BASIC listing (original tokenized export) performs the following actions:

- Initializes a variable s to 54272 ($D400) and uses pokes relative to s to configure SID registers (voice parameters and control bytes). Subroutines at lines 200 and 300 write to s+4 and s+11 respectively (SID control registers for Voice 1 and Voice 2) to toggle control bits (values 129/128).
- Clears the screen and sets v=53248 ($D000) as the VIC-II base address. Several pokes reference v+ offsets to set initial sprite X positions and other VIC-II registers.
- Loads three contiguous blocks of sprite bitmap data from DATA statements into three RAM regions used for sprites:
  - Block 1: decimal 12288–12350 ($3000–$303E)
  - Block 2: decimal 12352–12414 ($3040–$307E)
  - Block 3: decimal 12416–12478 ($3080–$30BE)
- Sets VIC-II registers (via poke v+...) that control sprite enabling/attributes and prints the message "i am the dancing mouse!" with color control in the print string.
- Enters a loop for x from 0 to 347 step 3:
  - Computes rx = INT(x/256) and lx = x - rx*256.
  - Pokes lx into v (low X for sprite 0, $D000) and rx into v+16 (X MSB bits, $D010).
  - Uses a program variable p (cycling 192..194) to call subroutines 200 or 300 which toggle SID voice control bytes — producing changing sound while sprite moves.
  - Pokes address 2040 with p (this is application data in RAM, not a VIC register).
- Subroutines:
  - 200: POKEs s+4 with 129 then 128 and RETURN (toggle Voice 1 control).
  - 300: POKEs s+11 with 129 then 128 and RETURN (toggle Voice 2 control).

Note: The listing includes large DATA blocks for 3 sprite frames and a few DATA entries that appear corrupted (see Incomplete). The program uses direct POKE addressing (s and v variables) rather than symbolic $Dxxx in the BASIC text.

## Source Code
```basic
  5 s=54272:pokes+24,15:pokes,220:pokes+1,68:pokes+5,15:pokes+6,215
  10 pokes+7,120:pokes+8,100:pokes+12,15:pokes+13,215
  15 print"{clear}":v=53248:pokev+21,1
  20 fors1=12288to12350:readq1:pokes1,q1:next
  25 fors2=12352to12414:readq2:pokes2,q2:next
  30 fors3=12416to12478:readq3:pokes3,q3:next
  35 pokev+39,15:pokev+1,68
  40 printtab(160)"{white}i am the dancing mouse!{light blue}"
  45 p=192
  50 forx=0to347step3
  55 rx=int(x/256):lx=x-rx*256
  60 pokev,lx:pokev+16,rx
  70 ifp=192thengosub200
  75 ifp=193thengosub300
  80 poke2040,p:fort=1to60:next
  85 p=p+1:ifp>194thenp=192
  90 next
  95 end
  100 data30,0,120,63,0,252,127,129,254,127,129,254,127,189,254,127,255,254
  101 data63,255,252,31,187,248,3,187,192,1,255,128,3,189,192,1,231,128,1,
  102 data255,0,31,255,0,0,124,0,0,254,0,1,199,32,3,131,224,7,1,192,1,192,0
  103 data3,192,0,30,0,120,63,0,252,127,129,254,127,129,254,127,189,254,127
  104 data255,254,63,255,252,31,221,248,3,221,192,1,255,128,3,255,192,1,195
  105 data128,1,231,3,31,255,255,0,124,0,0,254,0,1,199,0,7,1,128,7,0,204,1
  106 data128,124,7,128,5630,0,120,63,0,252,127,129,254,127,129,254,127,189
  107 data254,127,255,25463,255,252,31,221,248,3,221,192,1,255,134,3,189
  108 data204,1,199,152,1,255,48,1,255,224,1,252,0,3,254,0
  109 data7,14,0,204,14,0,248,56,0,112,112,0,0,60,0,-1
  200 pokes+4,129:pokes+4,128:return
  300 pokes+11,129:pokes+11,128:return
stop tok64
```

## Key Registers
- $D400-$D418 - SID (MOS 6581/8580) — voice registers (Voice 1: $D400-$D406, Voice 2: $D407-$D40D, Voice 3: $D40E-$D414, Filter & global: $D415-$D418). Lines poke s+4 and s+11 toggle voice control bytes (Voice 1 and Voice 2 control registers).
- $D000-$D02E - VIC-II — sprite registers and control. In this program:
  - $D000-$D007 (v+0..v+7) are used for sprite X low bytes (sprite 0 at $D000).
  - $D010 (v+16) is used for sprite X MSB bits (high X bits for sprites).
- $3000-$303E - RAM — sprite bitmap block 1 (loaded by READ loop starting at line 20).
- $3040-$307E - RAM — sprite bitmap block 2 (loaded by READ loop starting at line 25).
- $3080-$30BE - RAM — sprite bitmap block 3 (loaded by READ loop starting at line 30).

## Incomplete
- Missing / Corrupted DATA entries: lines 106–109 contain apparent OCR or transcription errors:
  - Line 106 includes "5630" (invalid as an 0–255 DATA byte).
  - Line 107 contains "25463" and a malformed sequence ("255,25463") — invalid bytes.
  - Line 109 ends with "-1" which is invalid as a BASIC DATA byte (expected 0–255).
- Minor formatting/artifact: line 101 ends with a trailing comma, suggesting a truncated DATA value.
- The tokenized POKE syntax in the listing appears as "pokes" and "pokev+..." without spaces — verify original tokenized BASIC if exact syntax is required.

## References
- "dancing_mouse_program_explanation" — line-by-line explanation and SID poke details
- "sprite_example_multiple_hot_air_balloons_program" — similar techniques for loading sprite byte blocks and moving sprites