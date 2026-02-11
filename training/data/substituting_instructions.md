# Substituting Instructions: replace LDX var / INX / STX var with INC var

**Summary:** 6502 instruction substitution example for the C-64: replacing the LDX/INX/STX memory increment pattern with a single INC instruction to reduce cycle count (LDX/INX/STX = 10 cycles (absolute) vs INC = 6 cycles (absolute)). Shows cycle-count tradeoffs and addressing-mode variants.

## Substituting Instructions
When you only need to increment a memory byte and do not need the loaded value in X afterwards, the common three-instruction pattern

    LDX var
    INX
    STX var

is slower than a single increment instruction. The example in the source uses absolute addressing cycle counts:

- LDX (absolute) = 4 cycles
- INX (implied)    = 2 cycles
- STX (absolute) = 4 cycles
Total = 4 + 2 + 4 = 10 cycles

A single INC var (read-modify-write) performs the memory increment in fewer cycles:

- INC (absolute) = 6 cycles

So the substitution saves 4 cycles (10 -> 6) in the absolute-addressing case.

Addressing-mode note (common 6502 timings):
- If var is zero-page, the timings change:
  - LDX zpg = 3, INX = 2, STX zpg = 3 → 3 + 2 + 3 = 8 cycles
  - INC zpg = 5 → saves 3 cycles (8 -> 5)
- If var is absolute, use the 10 vs 6 numbers above.

Behavior/flags:
- INC updates N and Z flags (read-modify-write), does not touch C.
- LDX and INX update N and Z for the X register; STX does not affect flags.
- Only use the substitution when the code does not rely on the X register value produced by LDX/INX.

## Source Code
```asm
; original (absolute example from source)
        LDX var      ; 4 cycles (absolute)
        INX          ; 2 cycles
        STX var      ; 4 cycles (absolute)
; total = 10 cycles

; faster replacement
        INC var      ; 6 cycles (absolute) — saves 4 cycles
```

## References
- "removing_instructions" — expands on general advice to drop unnecessary operations

## Mnemonics
- LDX
- INX
- STX
- INC
