# NMOS 6510 — Alternate 8-line graphics block (A=$20 variant)

**Summary:** Alternate assembly pass for every second 8-line block in the graphics area starting with A=$20; touches VIC-II registers $D011 and $D018 and CIA2 $DD02, and uses undocumented RMW opcodes (SRE, RRA, SLO, SAX). Per-instruction cycle counts and accumulator/effective changes are shown in the listing.

## Description
This chunk is the alternate variant of a repeated 8-line graphics-update block; it begins with the accumulator initialized to $20 and operates on VIC-II registers ($D011, $D018) and CIA2 ($DD02). The code relies on undocumented read-modify-write (RMW) opcodes (SRE, RRA, SLO, SAX, etc.) whose memory accesses produce side-effects on the accumulator and on the device registers. The provided assembly listing includes per-instruction comments showing cycle counts and the effective accumulator values after RMW effects (e.g., "A:20 -> 3B").

The sequence mirrors an initial variant (which starts with A=$A0); every second 8-line block uses this $20-starting variant to produce the alternate pixel/colour/effect pattern across the graphics area.

## Source Code
```asm
; A=$20 $d018=$1f $dd02=$36
STA $D011

;4 20 (20)

SRE $DD02

;6 1b (03) A:20 -> 3B

STY $D011

;4 21 (21)

ASL $D018

;6 3f (38)

SAX $D011

;4 32 (22)

STY $DD02

;4 21 (01)

STA $D011

;4 3B (23)

SRE $D018

;6 1f (18) A:3B -> 24

STA $D011

;4 24 (24)

RRA $DD02

;6 90 (00) A:24 -> B5

STA $D011

;4 B5 (25)

SLO $D018

;6 3f (38) A:B5 -> BF

STX $D011

;4 36 (26)

STX $DD02

;4 36 (02)

STA $D011

;4 BF (27)

SRE $D018

;6 1f (18) A:BF -> A0

; A=$A0 $d018=$1f $dd02=$36

- 100 -
```

## Key Registers
- $D011 - VIC-II - Control register (used here for per-line control writes and side-effect targets)
- $D018 - VIC-II - Memory/graphics control (manipulated via ASL/SRE/SLO)
- $DD02 - CIA 2 - byte used as RMW side-effect target in sequence

## References
- "six_sprites_over_fli_initial_variant" — original variant starting with A=$A0 and core explanation of using undocumented RMW opcodes for side-effects

## Mnemonics
- SRE
- RRA
- SLO
- SAX
