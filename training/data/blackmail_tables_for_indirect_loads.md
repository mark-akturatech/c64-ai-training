# NMOS 6510 - Tables used by the Blackmail FLI code

**Summary:** Tables stored at $03B0..$03BF containing byte values (b0..bf) read by indirect X-indexed loads and by absolute loads ($03B0 + <background colour>), plus a parallel table of little-endian addresses used by ($ZZ,X) pointer loads. The second half of the address table (entries b8..bf) is also used as $D011 values (VIC-II control/raster bits).

## Description
This chunk documents the two data tables the Blackmail FLI display code reads to produce target colours and $D011 values:

- A byte table at $03B0..$03BF containing values read both via indirect X-indexed loads and by absolute loads computed as ($03B0 + background colour). Entries are labeled b0..bf (placeholders for the actual byte values the code reads).
- A parallel table of 16 little-endian words (pairs) at $03B0..$03BF which form addresses used by indirect X-indexed pointer loads (e.g., LDA ($03B0,X) style; X is the index). The listing shows each word as low-byte, high-byte pairs. Every other value (low bytes) is used for zero-page loads, and the second half (entries b8..bf) doubles as $D011 values written to the VIC-II.
- The layout is organized in two halves: b0..b7 (first half) and b8..bf (second half). The second half's bytes are used both as color/$D011 control data and as high/low bytes for the indirect pointer words.

No code snippets or routines are included here — only the data tables and the pointer-word mapping the Blackmail FLI sequences expect to find.

## Source Code
```text
; values read by indirect x indexed loads
; values read by absolute loads ($03b0 + <background colour>)
03b0

b0 b1 b2 b3

b4 b5 b6 b7

b8 b9 ba bb

bc bd be bf

; addresses for indirect x indexed loads ($03b0...$03bf)
; every other value used for zp loads ($b0,$b1...$bf)
; second half also used as $d011 values ($b8, $b9...$bf)
0059

b0 03

b1 03 b2 03

b3 03 b4 03

b5 03 b6 03 b7 03

0069

b8 03

b9 03 ba 03

bb 03 bc 03

bd 03 be 03 bf 03
```

## Key Registers
- $03B0-$03BF - Memory table - byte values and little-endian address words used by Blackmail FLI for indirect X-indexed loads and absolute background-colour reads
- $D011 - VIC-II - control register / vertical-scroll & raster MSB (second half of table b8..bf used as $D011 values)

## References
- "blackmail_fli_display_trick" — expands on direct data used by the Blackmail FLI instruction sequences