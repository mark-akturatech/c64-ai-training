# NMOS 6510 — 6 sprites over FLI (Darwin) — first full assembly listing

**Summary:** 6510/C64 routine that draws six sprites over an FLI (Flexible Line Interpretation) row using undocumented Read-Modify-Write (illegal) opcodes (SRE, SLO, RRA, SAX) to produce side-effects on A under tight cycle constraints; refers to VIC-II registers ($D000-$D02E) and CIA 2 ($DD00-$DD0F). Initial CPU and hardware state: A=$A0, X=$36, Y=$21, $D018=$1F, $DD00=$3D, $DD02=$36.

## Routine description
This routine is the original "6 sprites over FLI" block used in Darwin. It relies on illegal 6502 opcodes that perform a memory Read-Modify-Write while also producing deterministic side-effects in the accumulator — used to avoid explicit LDA # immediate loads because of severe cycle constraints in the raster line. The variant shown begins with A=$A0, X=$36, Y=$21 and runs through a sequence of writes to VIC-II registers ($D011, $D018) and a CIA 2 location ($DD02), interleaving STA/STX/STY with SRE, SAX, ASL, RRA, SLO illegal opcodes to produce the required accumulator transformations and effective values written to hardware.

Key points:
- Undocumented RMW opcodes used: SRE (LSR then EOR with A), SAX (store A&X with modifications), RRA (ROR then ADC), SLO (ASL then ORA). These are exploited for their A side-effects (the specific side-effect semantics are the illegal-opcode definitions on NMOS 6502).
- The code expects initial hardware and register values as listed in the summary; these influence effective bits actually written to the VIC/CIA registers.
- The comments in the listing show three pieces of information per instruction: cycle count, the actual byte value being written, and the effective bits (mask/visible effect) after hardware masking.
- The listing below is the canonical first-pass variant that starts with A=$A0; an alternate variant beginning with A=$20 exists (see References).

## Instruction trace (A=$A0 start)
Below is a concise step-by-step trace (ordered as executed). Each step shows: instruction — ;cycles actual-value (effective-bits) — if the accumulator changes, the transformation is shown as A:old -> new.

1. STA $D011  
   ;4 A0 (20) — writes A=$A0 to $D011 (VIC-II control). No change to A.

2. SRE $DD02  
   ;6 1B (03) — illegal RMW on $DD02 (CIA 2). A: A0 -> BB

3. STY $D011  
   ;4 21 (21) — write Y=$21 to $D011.

4. ASL $D018  
   ;6 3F (38) — ASL on $D018 (VIC-II); affects memory at $D018.

5. SAX $D011  
   ;4 32 (22) — illegal store (A&X variant) to $D011.

6. STY $DD02  
   ;4 21 (01) — write Y=$21 to $DD02.

7. STA $D011  
   ;4 BB (23) — write A (currently $BB) to $D011.

8. SRE $D018  
   ;6 1F (18) — illegal RMW on $D018 (VIC-II). A: BB -> A4

9. STA $D011  
   ;4 A4 (24) — write A=$A4 to $D011.

10. RRA $DD02  
    ;6 90 (00) — illegal RMW on $DD02; A: A4 -> 35

11. STA $D011  
    ;4 35 (25) — write A=$35 to $D011.

12. SLO $D018  
    ;6 3F (38) — illegal RMW on $D018; A: 35 -> 3F

13. STX $D011  
    ;4 36 (26) — write X=$36 to $D011.

14. STX $DD02  
    ;4 36 (02) — write X=$36 to $DD02.

15. STA $D011  
    ;4 3F (27) — write A=$3F to $D011.

16. SRE $D018  
    ;6 1F (18) — illegal RMW on $D018; A: 3F -> 20

(The listing as stored in Source Code contains the full commented assembly.)

## Source Code
```asm
; A=$A0 X=$36 Y=$21
; $D018=$1F $DD00=$3D $DD02=$36

STA $D011
;4 A0 (20)

SRE $DD02
;6 1B (03) A:A0 -> BB

STY $D011
;4 21 (21)

ASL $D018
;6 3F (38)

SAX $D011
;4 32 (22)

STY $DD02
;4 21 (01)

STA $D011
;4 BB (23)

SRE $D018
;6 1F (18) A:BB -> A4

STA $D011
;4 A4 (24)

RRA $DD02
;6 90 (00) A:A4 -> 35

STA $D011
;4 35 (25)

SLO $D018
;6 3F (38) A:35 -> 3F

STX $D011
;4 36 (26)

STX $DD02
;4 36 (02)

STA $D011
;4 3F (27)

SRE $D018
;6 1F (18) A:3F -> 20
```

## Key Registers
- $D000-$D02E - VIC-II - video control, raster, sprite registers (used here: $D011, $D018)  
- $DD00-$DD0F - CIA 2 - I/O and timer registers (used here: $DD02)

## References
- "six_sprites_over_fli_alternate_and_repetition" — expands on repeating this block down the screen and provides the alternate variant starting with A=$20

## Mnemonics
- SRE
- LSE
- SAX
- AXS
- RRA
- SLO
- ASO
