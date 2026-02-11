# NMOS 6510 ANE (XAA/AXM) undocumented opcode ($8B) — immediate

**Summary:** Undocumented NMOS 6510 opcode ANE $8B #imm: A = (A | CONST) & X & imm. Behavior depends on an unstable chip-/temperature-dependent "magic constant" (commonly but unreliably $EE/$EF/$FF) and shows RDY-related bit instability (bits 0 and 4 may drop during RDY/DMA cycles). Safe usage patterns, equivalences, and example test code included.

## Operation and instability
ANE #imm (opcode $8B imm) performs:
A ← (A | CONST) & X & imm

- CONST is an undocumented, chip- and temperature-dependent "magic constant". Common observed values include $EE, $EF, $FF, but it is not reliable across chips or even across cycles on the same machine.
- RDY-related instability: certain bits of the result can be unstable during RDY cycles (used for bus gating/DMA); bits 0 and 4 are reported to sometimes drop (clear) during such cycles.
- Some real-world uses rely on specific CONST bit patterns; these uses are fragile and can fail on other machines or when RDY timing changes.
- Mastertronic "burner" tape-loader usage (examples: Spectipede, BMX Racer) requires the magic-constant high nibble to be $4, $5, $E, or $F and bit 0 = 1. Bits 3,2,1 are "don't care". This means a commonly assumed $EE will fail there, but $EF will work.
- Turrican 3 (Smash Designs) uses ANE #imm in scrolling code that expects CONST = $EF; it may tolerate $EE in some cases but will break if other bits differ.
- Emulation compromise recommended by practitioners: present CONST = $EF in regular (non-RDY) cycles and CONST = $EE during RDY cycles to maximize compatibility with known software while approximating observed RDY behavior.

## Safe usage patterns and equivalences
- To avoid dependence on CONST, remove CONST from the expression by making either:
  - imm = #$00: ANE #$00 clears A (A becomes 0), because & 0 = 0.
  - A = #$FF before ANE: if A = $FF then (A | CONST) == $FF, removing CONST influence.
- Common equivalences:
  - Clearing A:
    - ANE #$00 (8B 00) is equivalent to LDA #$00 (safe: immediate zero removes CONST).
  - Using X AND immediate into A:
    - With A preloaded to $FF (e.g., LDA #$FF), ANE #imm acts like TXA; AND #imm combination:
      - LDA #$FF
      - ANE #$0F
      yields A = X & $0F (CONST eliminated by A=$FF). Equivalent canonical sequence: TXA; AND #$0F.
- Reading the magic constant (for experimentation only; value may be unstable):
  - LDA #$00
  - LDX #$FF
  - ANE #$FF
  - After this, A contains the current magic constant (theoretical; not reliable across cycles/machines).

**Warning:** Do not rely on the magic constant being stable or matching another machine; software that depends on specific bits of CONST or on RDY timing is fragile.

## Source Code
```asm
; ANE opcode bytes: 8B imm

; Example: clear A (safe because imm=0 removes CONST)
        8B 00        ; ANE #$00
; equivalent to:
        LDA #$00

; Example: A = X AND immediate (safe if A previously set to $FF)
        ; assume A == $FF
        8B 0F        ; ANE #$0F
; A = (A | CONST) & X & $0F  -> with A=$FF => A = X & $0F
; equivalent to:
        TXA
        AND #$0F

; Example: read the 'magic constant' (experimental, unstable)
        LDA #$00
        LDX #$FF
        8B FF        ; ANE #$FF
; A now contains the magic constant (may vary and be unstable)

; ANE machine code listing example (bytes shown inline):
; 8B 00     ; ANE #$00  -> clear A
; 8B 0F     ; ANE #$0F  -> A = (A|CONST) & X & $0F
; 8B FF     ; ANE #$FF  -> experimental read of CONST
```

## References
- "magic_constant_group_overview" — overview of magic-constant unstable opcodes
- "ane_real_world_and_emulation" — real-world usage and emulation recommendations for ANE

## Mnemonics
- ANE
- XAA
- AXM
