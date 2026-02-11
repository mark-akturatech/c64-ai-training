# Example Program 2 — Multi-voice SID music player (Commodore 64)

**Summary:** Multi-voice music playback for the SID ($D400) using POKE to write frequency low/high, pulse/control and ADSR per voice; decodes compact note encoding (duration/octave/note) from DATA, expands into per-1/16th arrays (h/l/c) for three voices and streams them to SID registers via s = 54272 ($D400).

## Program description
This BASIC program sets s = 54272 ($D400) and clears the SID register block, defines three voice activity arrays (h/l/c for high byte, low byte, and waveform/control), fills a base-frequency table fq(0..11) from DATA, then for each of the three voices reads encoded note values from DATA and decodes them into duration, octave and note fields. Each decoded note is expanded into one or more 1/16th-measure time slots and stored in parallel arrays h(k,i), l(k,i), c(k,i) where k is voice index (0..2) and i is the 1/16th index.

Decoding algorithm (exact operations used by the program):
- nm = DATA byte read
- if nm = 0 → end of score for this voice
- if nm < 0 → convert to rest by nm = -nm and set wa = wb = 0 (no waveform)
- dr% = integer division nm / 128 (duration encoding)
- oc% = integer division (nm - 128*dr%) / 16 (octave encoding)
- nt = nm - 128*dr% - 16*oc% (note index into fq array)
- fr = fq(nt) (base frequency)
- If oc% <> 7 then for j = 6 downto oc% step -1: fr = fr / 2 (shift frequency down per octave)
- hf% = INT(fr / 256) ; lf% = fr - 256*hf%
- The note is expanded for dr% 1..N: first (dr% - 1) slots get waveform value wa (or wa/ wb depending on logic), last slot gets wb. For dr% = 1 special-case handled so only one slot gets wa.

After building the arrays for all voices, the program writes initial ADSR/pulse/filter values to SID registers, then loops over the i = 0..im (maximum used 1/16th index) and for each time slot pokes the low/high frequency bytes and control byte for each voice to the appropriate SID registers, then waits (short delay loops) and repeats (plays the piece).

The program stores its musical data in DATA statements (fq table and the three voice streams).

Caveats and exact behavior:
- The program uses integer arithmetic and BASIC's numeric behavior; octave shifting is implemented by successive division by 2 inside a loop (see code).
- Negative DATA values are interpreted as rests (wa/wb forced to 0).
- oc% == 7 is a special-case that skips octave division (the code jumps to label 200).
- c(k,i) is the control/waveform value written to each voice's control register (initial per-voice v(k) values are used as wa/wb).
- The program writes filter and master volume registers as part of initialization (s+22,s+23, s+24 etc.).

## Source Code
```basic
10 s = 54272 : FOR l = s TO s + 24 : POKE l, 0 : NEXT l
20 DIM h(2,200), l(2,200), c(2,200)
30 DIM fq(11)
40 v(0) = 17 : v(1) = 65 : v(2) = 33
50 POKE s + 10, 8 : POKE s + 22, 128 : POKE s + 23, 244
60 FOR i = 0 TO 11 : READ fq(i) : NEXT i

100 FOR k = 0 TO 2
110   i = 0
120   READ nm
130   IF nm = 0 THEN 250
140   wa = v(k) : wb = wa - 1
     IF nm < 0 THEN nm = -nm : wa = 0 : wb = 0
150   dr% = nm \ 128
160   oc% = (nm - 128 * dr%) \ 16
170   nt = nm - 128 * dr% - 16 * oc%
180   fr = fq(nt)
190   IF oc% = 7 THEN 200
     FOR j = 6 TO oc% STEP -1
200     fr = fr / 2
     NEXT j
210   hf% = INT(fr / 256) : lf% = fr - 256 * hf%
220   IF dr% = 1 THEN
     h(k, i) = hf% : l(k, i) = lf% : c(k, i) = wa : i = i + 1 : GOTO 120
     END IF
230   FOR j = 1 TO dr% - 1
     h(k, i) = hf% : l(k, i) = lf% : c(k, i) = wa : i = i + 1
     NEXT j
240   h(k, i) = hf% : l(k, i) = lf% : c(k, i) = wb
250   i = i + 1 : GOTO 120
260   IF i > im THEN im = i
     NEXT k

500 POKE s + 5, 0 : POKE s + 6, 240
510 POKE s + 12, 85 : POKE s + 13, 133
520 POKE s + 19, 10 : POKE s + 20, 197
530 POKE s + 24, 31

540 FOR i = 0 TO im
550   POKE s + 0, l(0, i) : POKE s + 7, l(1, i) : POKE s + 14, l(2, i)
560   POKE s + 1, h(0, i) : POKE s + 8, h(1, i) : POKE s + 15, h(2, i)
570   POKE s + 4, c(0, i) : POKE s + 11, c(1, i) : POKE s + 18, c(2, i)
580   FOR t = 1 TO 80 : NEXT t
     NEXT i
590 FOR t = 1 TO 200 : NEXT t : POKE s + 24, 0

600 DATA 34334,36376,38539,40830
610 DATA 43258,45830,48556,51443
620 DATA 54502,57743,61176,64814

1000 DATA 594,594,594,596,596,1618,587,592,587,585,331,336
1010 DATA 1097,583,585,585,585,587,587,1609,585,331,337,594,594,593
1020 DATA 1618,594,596,594,592,587,1616,587,585,331,336,841,327
1999 DATA 1607,0

2000 DATA 583,585,583,583,327,329,1611,583,585,578,578,578
2010 DATA 196,198,583,326,578,326,327,329,327,329,326,578,583
2020 DATA 1606,582,322,324,582,587,329,327,1606,583,327,329,587,331,329
2999 DATA 329,328,1609,578,834,324,322,327,585,1602,0

3000 DATA 567,566,567,304,306,308,310,1591,567,311,310,567
3010 DATA 306,304,299,308,304,171,176,306,291,551,306,308
3020 DATA 310,308,310,306,295,297,299,304,1586,562,567,310,315,311
3030 DATA 308,313,297,1586,567,560,311,309,308,309,306,308
3999 DATA 1577,299,295,306,310,311,304,562,546,1575,0
```

## Key Registers
- $D400-$D414 - SID - Voice 1..3 registers: frequency low/high, pulse width low/high, control (waveform), ADSR (attack/decay, sustain/release)
- $D415-$D418 - SID - Filter cutoff low/high, filter resonance/mode and voice routing/master volume

(Program sets s = 54272 decimal = $D400 and uses offsets 0,1,4,5,6,7,8,10,11,12,13,14,15,18,19,20,22,23,24 to initialize and stream voice/fiter/volume data.)

## References
- "note_duration_encoding" — explains compact note encoding and formula (((D*8)+O)*16)+N
- "sid_registers_and_examples_index" — maps SID registers to waveform control, filter and volume usage