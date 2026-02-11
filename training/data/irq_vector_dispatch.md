# IRQ dispatch entry (FF48-FF58) — detect BRK vs IRQ, jump to $0316/$0314

**Summary:** 6502 interrupt entry code at $FF48 saves A,X,Y and uses TSX + LDA $0104,X to load the stacked processor status (stack page $0100-$01FF) and test bit 4 (BRK flag). If BRK is indicated it JMPs indirect to the BRK vector ($0316), otherwise to the IRQ vector ($0314).

## Description
This routine is the common IRQ/BRK dispatch entry used by the KERNAL to distinguish a BRK (software interrupt) from a hardware IRQ after the CPU has pushed the return PC and status onto the stack. Behavior:

- The routine preserves the accumulator and index registers by pushing A, X, Y onto the stack (PHA/TxA/PHA/TYA/PHA).
- TSX copies the current stack pointer into X so the code can directly read the stacked bytes in page $01 (stack page $0100-$01FF).
- LDA $0104,X reads the byte that 6502 pushed as the processor status on interrupt entry. (On 6502 the pushed status contains a stored B flag in bit 4 when BRK caused the interrupt.)
- AND #$10 masks the BRK flag (bit 4). BEQ branches when the BRK bit is clear.
- If the BRK bit is set the code JMPs indirect via ($0316) — the BRK vector (iBRK). Otherwise it JMPs indirect via ($0314) — the IRQ vector (iIRQ).
- Indirect JMP (6C) reads a 16-bit vector from the two-byte vector address given ($0316 or $0314) and transfers control there.

This sequence is used to dispatch to iBRK/iIRQ handlers without modifying the CPU flags or other registers beyond the explicit saves.

## Source Code
```asm
.,FF48 48       PHA             ; save A
.,FF49 8A       TXA             ; copy X
.,FF4A 48       PHA             ; save X
.,FF4B 98       TYA             ; copy Y
.,FF4C 48       PHA             ; save Y
.,FF4D BA       TSX             ; copy stack pointer
.,FF4E BD 04 01 LDA $0104,X     ; get stacked status register
.,FF51 29 10    AND #$10        ; mask BRK flag (bit 4)
.,FF53 F0 03    BEQ $FF58       ; branch if not BRK
.,FF55 6C 16 03 JMP ($0316)     ; else do BRK vector (iBRK)
.,FF58 6C 14 03 JMP ($0314)     ; do IRQ vector (iIRQ)
```

## Key Registers
- $0100-$01FF - RAM (stack page) — stacked PC and status bytes are stored here; stacked status read via $0104,X
- $0314-$0315 - KERNAL IRQ vector (word address read by JMP ($0314))
- $0316-$0317 - KERNAL BRK vector (word address read by JMP ($0316))

## References
- "kernal_vectors_list" — expands on uses of vectors at $0314/$0316 for IRQ/BRK

## Labels
- IBRK
- IIRQ
