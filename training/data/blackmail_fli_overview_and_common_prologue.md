# NMOS 6510 — Blackmail "FLI Graph v2.2" FLI display trick (overview)

**Summary:** Describes Blackmail's 1989 FLI technique for the VIC‑II where, in the first 3 screen columns, the VIC fetches colour‑RAM data from the open bus; therefore the opcode placed immediately after the STA $D011 determines that colour. Covers per‑line timing/requirements, the common 13‑cycle prologue (LDX zp / LDA #imm / STA $D018 / STX $D011) and the 10‑cycle opcode slot drawn from the $A* row to select colour/background ($D021). Mentions the LAX#imm workaround (use A=$0F..$7F) to support all 16 colours.

## Overview
Blackmail's FLI displayer exploits that, during the first three character columns of a line, the VIC‑II will fetch the colour‑RAM byte from the open CPU bus instead of from colour RAM. Because of this, whatever opcode the CPU places on the bus immediately after writing $D011 will be read by the VIC and used as the colour for those three columns. The displayer arranges the per‑scanline code so that the STA $D011 is executed at a fixed cycle inside a badline; the following opcode therefore controls the fetched colour for the first 3 columns.

The routine must meet strict per‑line timing and state requirements (badline, memory pointers, background colour). The layout used by Blackmail has a fixed prologue (13 cycles) followed by a 10‑cycle opcode/data sequence chosen to produce the desired colour and background ($D021).

## Per‑line requirements
- Total: 23 cycles per line (each line used is a badline).
- Force a badline at a fixed cycle by writing $D011 with an appropriate value.
- Set the video memory base (screen/character pointers) per line via $D018.
- Place a specific opcode immediately after STA $D011 so the VIC fetches that opcode byte as the colour‑RAM value for the first 3 columns.
- Change the background colour ($D021) during the line (value chosen by the subsequent opcode/data sequence).
- The line code is split into a common prologue (same each line, 13 cycles) and a per‑colour tail (10 cycles).

## Common per‑line prologue (13 cycles)
Each line starts with four instructions whose bytes and cycles add to 13 cycles. The sequence:
- Preload X with the value to be stored to $D011 (also used by some variants as an indexed pointer).
- Load A with the value to write to $D018 (VIC memory pointer).
- Write $D018, then write $D011 (the STA $D011 is positioned so the very next byte on the bus will be fetched by VIC as colour‑RAM data for the first 3 columns).

This standard 4‑instruction prologue is:
- LDX zp        ; opcode A6 xx  (3 cycles)
- LDA #<screen> ; opcode A9 xx  (2 cycles)
- STA $D018     ; opcode 8D 18 D0 (4 cycles)
- STX $D011     ; opcode 8E 11 D0 (4 cycles)

Total = 3 + 2 + 4 + 4 = 13 cycles.

Notes:
- Original code used A values in $08..$78 for $D018; using $0F..$7F is recommended if the per‑colour tail uses LAX #imm so that immediate LAX works for all 16 colours.
- The value written to $D011 both triggers the badline and determines which raster timing slot the following opcode occupies.

## Opcode‑based colour selection (10 cycles)
- The byte placed immediately after the STA $D011 is chosen from the $A* opcode row; Blackmail used a variant of load/opcode values from that row so that the VIC will read that opcode byte as colour data for the first 3 columns.
- The opcode choice selects the colour fetched-for‑colour‑RAM; the operand/value fetched by the opcode sequence is used to update $D021 (background) as part of the 10‑cycle tail.
- The per‑colour tail always occupies 10 cycles (prologue 13 + tail 10 = 23 cycles per line).

**[Note: Source may contain an error — the claim "all opcodes in the $A* row are loads" is an overgeneralization; some $A* opcodes are transfers or illegal opcodes on NMOS 6502.]**

## Source Code
```asm
; Common per-line prologue (bytes and cycles)
; (3)  A6 xx        LDX zp        ; 3 cycles
; (2)  A9 xx        LDA #<screen>  ; 2 cycles
; (4)  8D 18 D0     STA $D018      ; 4 cycles
; (4)  8E 11 D0     STX $D011      ; 4 cycles
; Total: 13 cycles

; Notes:
; - The opcode byte immediately following the 8E 11 D0 (STX $D011) is the byte VIC will fetch
;   as colour‑RAM data for the first 3 columns.
; - Per-colour tail follows and always takes 10 cycles (uses an opcode from the $A* row).
;
; Recommendation from source:
; - Use A ($LDA immediate value written to $D018) in range $0F..$7F to make
;   the LAX #imm variant work for all 16 colours.
```

## Key Registers
- $D011 - VIC‑II - Control register 1 / badline-related bits (writing here can force a badline; the STA is placed so the following bus byte is read by VIC as colour data)
- $D018 - VIC‑II - Memory pointer (character/screen base pointers)
- $D021 - VIC‑II - Background colour register

## References
- "blackmail_fli_variants_0_black_to_3_cyan" — opcode sequences and background writes for Variants 0–3 (black, white, red, cyan)
- "blackmail_fli_variants_4_violet_to_7_yellow" — opcode sequences and background writes for Variants 4–7 (violet, green, blue, yellow)
- "blackmail_fli_variants_8_orange_to_9_brown" — opcode sequences and background writes for Variants 8–9 (orange, brown)
- "blackmail_fli_variants_a_lred_to_b_dgrey" — Variants A–B (light red, dark grey) and notes on LAX#imm
- "blackmail_fli_variants_c_mgrey_to_f_lgrey" — Variants C–F (mid‑grey, light green, light blue, light grey), absolute addressing variants