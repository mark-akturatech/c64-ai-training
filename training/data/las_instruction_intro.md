# LAS (LAR) — Undocumented opcode $BB (abs,Y)

**Summary:** Undocumented 6510/6502 opcode $BB (mnemonics LAS or LAR), absolute,Y addressing. Performs A = M AND S and loads the stack pointer (S) from that result; sets N and Z flags.

**Description**
LAS (sometimes shown as LAR) is an undocumented NMOS 6510/6502 instruction using absolute,Y addressing. It combines a memory read with a logical AND against the current stack pointer (S), then loads that result into A and into S.

**Operation (pseudocode):**
- addr = abs + Y
- M = Read(addr)
- temp = M AND S
- A = temp
- S = temp
- Set N,Z according to A (N = bit7, Z = (A==0))
- C, V, I, D, B unaffected

**Common assembly form:**
- LAS abs,Y
- Opcode: $BB
- Bytes: 3
- Cycles: 4 (+1 if page crossed) [standard absolute,Y timing on NMOS 6502]

**Notes:**
- Mnemonics encountered in various documents: LAS, LAR (both refer to same opcode).
- Effectively performs (A ← M & S) then (S ← A). This can be useful for contrived stack-pointer manipulations (undocumented/unstable behavior — may differ on other 6502-family variants).

## Source Code
```asm
; Opcode encoding:
; BB LL HH   ; LAS $HHLL,Y   (absolute,Y)

; Example sequence (illustrative):
        LDX #$3C        ; X = $3C
        TXS             ; S = $3C
        LDY #$00        ; Y = 0
        ; Memory $2000 contains %10101010 ($AA)
        .byte $BB, $00, $20   ; LAS $2000,Y
        ; After LAS:
        ;   temp = $AA AND $3C = $28
        ;   A == $28
        ;   S == $28
        ;   N,Z updated from A

; Notes: this is an illustrative example; assembler/linker placement not shown.
```

## References
- "sbc_opcode_entry" — expands on previous undocumented opcode entry ($EB SBC #imm) in the document

## Mnemonics
- LAS
- LAR
