# KERNAL: Setup channel/device pointer and compute AE:AF offset ($F7D7-$F7E9)

**Summary:** Small KERNAL sequence (JSR $F7D0; $F7D7-$F7E9) that stores X/Y into channel/device pointer bytes $C1/$C2 and computes a two‑byte offset in $AE/$AF by adding #$C0 to the low byte with carry into the high byte (uses TXA/STA, TYA/STA, ADC).

## Description
This routine prepares channel/device pointer bytes and computes a 16‑bit offset across zero page bytes $AE/$AF:

- JSR $F7D0 is called first (external setup; not included here).
- TXA / STA $C1: copy X into accumulator then store to $C1 (channel/device pointer low byte).
- CLC / ADC #$C0 / STA $AE: clear carry, add immediate $C0 to the accumulator (which holds X), store the result to $AE (low byte of the computed offset).
- TYA / STA $C2: transfer Y into A and store to $C2 (channel/device pointer high byte).
- ADC #$00 / STA $AF: add #$00 to A (this ADC includes the carry from the previous ADC) and store to $AF — this propagates the low‑byte carry into the high byte, producing a 16‑bit sum AE:AF = (X + $C0) + (Y << 8).
- RTS returns.

Effectively the code preserves the original X/Y channel pointer in $C1/$C2 and computes AE:AF = (X + $C0) + (Y * 256), where the carry from the low‑byte addition is added into the high byte via ADC #$00.

Cross-references: this setup commonly precedes filename/buffer processing and small checks (see referenced chunks).

## Source Code
```asm
.,F7D7 20 D0 F7    JSR $F7D0
.,F7DA 8A          TXA
.,F7DB 85 C1       STA $C1
.,F7DD 18          CLC
.,F7DE 69 C0       ADC #$C0
.,F7E0 85 AE       STA $AE
.,F7E2 98          TYA
.,F7E3 85 C2       STA $C2
.,F7E5 69 00       ADC #$00
.,F7E7 85 AF       STA $AF
.,F7E9 60          RTS
```

## Key Registers
- $C1 - Zero page - channel/device pointer low byte (stores X)
- $C2 - Zero page - channel/device pointer high byte (stores Y)
- $AE - Zero page - computed offset low byte (result of X + #$C0)
- $AF - Zero page - computed offset high byte (Y + carry from low-byte add)

## References
- "compare_b3_with_two" — expands on small check used before/around setup
- "compare_indirect_buffers" — expands on subsequent filename/buffer processing often follows this setup

## Labels
- C1
- C2
- AE
- AF
