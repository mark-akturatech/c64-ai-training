# NMOS 6510 SHX (undocumented) — opcode $9E (abs,Y)

**Summary:** NMOS 6510 undocumented opcode SHX ($9E) using absolute,Y addressing stores (X AND {H+1}) to memory; opcode $9E, size 3 bytes, 5 cycles (abs,Y). Known instabilities: RDY-induced timing/dropoff and a page-boundary anomaly where the high-byte used for the AND is incremented.

## Operation
SHX abs,Y (opcode $9E, 3 bytes, 5 cycles) computes the effective address using the 16-bit absolute operand plus Y, then writes a byte to that address. The value written is the X register masked with a value derived from the effective address high-byte: effectively "store A = X & {H+1}" where {H+1} denotes the high byte of the effective address plus one (as observed in hardware behavior).

Behavioral specifics recorded in the source:
- Opcode: $9E
- Addressing: absolute,Y (3-byte operand)
- Cycles: 5 (observed on NMOS 6510)
- Operation summary: memory[abs + Y] := X & ({high_byte_of_effective_address} + 1)
- Instabilities/anomalies:
  - RDY dropoff: If RDY causes the CPU to pause between particular internal cycles (observed between the 3rd and 4th cycle of SHX), the masking step (the AND with {H+1}) may be skipped or otherwise altered — this is used deliberately in raster-sync tricks.
  - Page-boundary crossing anomaly: when abs+Y crosses a page boundary the high byte used in the mask may be incremented, producing "increment-and-AND" behavior that differs from a simple STX abs,Y. Tests on visual6502 show &{H+1} changing on page crossing.

Practical implication:
- At some addresses (for example $FE00), {H+1} becomes $FF and the mask is effectively $FF, turning SHX into a normal STX abs,Y (i.e., the write becomes memory := X).
- These timing/idiosyncratic behaviors have been exploited for raster synchronization loops (see Source Code).

Equivalent conceptual sequence (descriptive, not single 6502 instruction):
1. EFF = abs + Y  ; compute effective address (16-bit, with page crossing semantics)
2. H = high_byte(EFF)
3. M = H + 1
4. memory[EFF] := X & M

Note: This is a descriptive equivalence of observed behavior. The NMOS 6510 microcode implements this opcode with timing-dependent side effects (RDY and page-boundary effects) that are not captured by a single simple instruction on all hardware.

## Source Code
```asm
; Minimal example: SHX behaves like STX when mask is $FF
; When using $FE00 as address, the value stored would be ANDed by $FF and the SHX turns into a STX:
        SHX $FE00,Y
; equivalent observationally:
;       STX $FE00,Y
```

```asm
; Raster-sync example 1 (requires chosen address so (H+1)&1 = 0 and (H+1)&$10 = $10)
* = $0F00     ; Some address where (H+1) & 1 = 0 and (H+1) & $10 = $10
loop:
cont:
        LDY #$00
        LDX #$11
        SHX cont,Y
        BPL loop
; Uses the fact that SHX ANDs the written value with H+1 unless a badline/RDY pause
; occurs between cycle 3 and 4, which changes control flow timing and drops out
; of the loop at a specific horizontal position (used to sync to the raster).
```

```asm
; Alternate variant requiring A0 <$80 on entry; preserves A0 value:
loop = * + 1
        LDX #$B5
        SBC #$9E
        LDY #$00
        BPL loop

; When assembled differently (showing what executes):
loop:
        .byte $A2        ; LDX opcode (shows alignment in source)
LDA $EB,X             ; (LDA $EB,X reads from zero page address $A0 when X=$B5)
SHX $00A0,Y
BPL loop

; Explanation from source:
; The SBC opcode value $9E becomes data for SBC; LDA $EB,X with X=$B5 ends up reading
; the value previously written by SHX into $A0. SHX does not affect flags, so BPL depends
; solely on the value loaded by LDA, which in turn depends on the previous SHX.
```

Test / simulation links (visual6502 JSSim):
- Readout of behavior: http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=18&d=a27fa0f39e0f11
- RDY dropoff and page-cross &{H+1} increment-and-AND test: http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=20&d=a27fa0f39e0f11&logmore=rdy&rdy0=15&rdy1=16
```

## References
- "unstable_address_high_byte_group" — expands on SHX as part of this group
- "shx_examples_and_sync" — expands on practical examples of SHX used to sync with raster beam

## Mnemonics
- SHX
