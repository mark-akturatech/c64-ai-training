# SBX mask-index example (NMOS 6510)

**Summary:** Demonstrates using the undocumented SBX opcode to mask the low two bits of a value into X without clobbering A, using LDX/LDA/SBX/LSR/STA/LDA to derive an index for table lookup (e.g. decoding 4 multicolour pixel pairs). Compares to the conventional AND/TAX approach which clobbers A and costs three extra cycles.

## Example and explanation
This example sets up X as an index equal to the low two bits of a byte (mask $03) while preserving A so the same accumulator value can be shifted and stored afterwards. SBX is used here because it produces the masked index into X without destroying A (SBX is an undocumented NMOS 6502/6510 opcode that writes a masked result into X while leaving A usable).

Workflow:
- LDX #$03 prepares the mask ($03).
- LDA val1 loads the byte to inspect into A.
- SBX #$00 applies the mask and places the masked bits into X (A remains intact).
- Two LSRs shift A right twice (preserving A across the SBX), then STA val1 writes the shifted value back.
- LDA colours,x uses X to fetch the colour from a 4-entry table.

This saves cycles compared to the conventional sequence that uses AND #$03 and TAX (which clobbers A and forces you to shift the memory directly).

Use case: decoding 4 multicolour pixel pairs by extracting an index from the lowest two bits and using it to index a 4-entry colour table.

## Source Code
```asm
; SBX method — preserves A, cheaper
    LDX #$03      ; mask
    LDA val1      ; load value
    SBX #$00      ; mask out lower 2 bits -> X (A untouched)
    LSR           ; shift A (A still available)
    LSR
    STA val1
    LDA colours,x ; fetch colour from table

; Conventional method — clobbers A and costs ~3 cycles more
    LDA val1
    AND #$03
    TAX            ; set up index (A clobbered)
    LSR val1       ; must shift memory because A was clobbered
    LSR val1
    LDA colours,x
```

## References
- "sbx_decrement_nibbles_example" — another use of SBX for nibble/bit manipulation and branch detection
- "sbx_toggle_bit_with_carry_example" — shows SBX behaviour with flags useful in tight bit-manipulation loops

## Mnemonics
- SBX
