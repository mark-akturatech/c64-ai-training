# DISPLAY T & S (dispts.prg)

**Summary:** BASIC program (Commodore 64) to display a disk block (track & sector) to screen or printer; defines program constants and lookup strings: sp$, nl$, hx$ (hex digits), fs$ (field of reversed characters), ss$ (special reversed chars), and arrays a$(15), nb(2).

## Program purpose
This header portion of dispts.prg prints the program title and prepares string constants and arrays used by later routines that format and display a disk buffer (track/sector data). It sets up printable tokens (including reversed-character sequences) and a hex lookup string for nibble-to-hex conversion.

## Constants and lookup strings
- sp$ = " " (single space)
- nl$ = CHR$(0) (null / newline token used by the program)
- hx$ = "0123456789abcdef" — nibble-to-hex lookup (lowercase hex digits)
- fs$ — built by looping i = 64..95 and appending "{reverse on}"+CHR$(i)+"{reverse off}" for each PETSCII character in that range; used as a field filled with reversed characters for visual separators or headers.
- ss$ — initialized to two spaces then built by looping i = 192..223 appending reversed versions of those PETSCII characters; used for special-character mapping (reversed-region variants).
- Arrays: DIM A$(15), NB(2) — string and numeric arrays reserved for later use (program uses these to hold parsed fields and numeric buffers).

Notes:
- The program header REMs identify the purpose: "display any track & sector on the disk to the screen or the printer".
- PRINT lines use tokenized editor sequences such as {clear}, {down*2}, {reverse on}, {reverse off}, and repeated-character tokens like {175*22}; these are preserved exactly in the source (printer/screen token control).

## Source Code
```basic
100 rem******************************
110 rem* display any track $ sector *
120 rem* on the disk to the screen  *
130 rem* or the printer             *
140 rem******************************
150 print "{clear}{down*2}{175*22}"
160 print "display block contents"
165 print "{183*22}"
170 rem******************************
180 rem* set program constant       *
190 rem******************************
200 sp$=" ":nl$=chr$(0):hx$="0123456789abcdef"
210 fs$="":for i=64 to 95:fs$=fs$+"{reverse on}"+chr$(i)+"{reverse off}":next i
220 ss$="  ":for i=192 to 223:ss$=ss$+"{reverse on}"+chr$(i)+"{reverse off}":next i
240 dim a$(15),nb(2)
```

## References
- "device_selection_and_file_opening" — expands on select output device and open channels
- "load_track_sector_into_disk_buffer" — expands on input track/sector and load disk buffer