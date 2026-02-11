# NMOS 6510 — using RRA to simulate extra ROR addressing modes

**Summary:** RRA (undocumented opcode: ROR then ADC) can be used to emulate ROR with addressing modes not normally available to ROR (example: abs,Y, (zp),Y, (zp,X)). RRA performs a ROR on the memory operand (shifting the processor C into the operand MSB), writes the rotated value back, then ADCs that rotated value into A — so memory is rotated like ROR, but A and the processor flags reflect the subsequent ADC.

## Using RRA to emulate ROR addressing modes
RRA executes two sub-operations in sequence:
1. ROR memory — rotate the memory operand right: the current carry is shifted into the memory operand's MSB, and the memory operand's LSB becomes the (intermediate) carry.
2. ADC memory — add the rotated memory value to A (with carry), updating A and the processor flags.

Consequences and caveats:
- The memory operand is rotated and stored just as a true ROR would do for that operand/addressing mode.
- The processor C flag after the instruction is the carry resulting from ADC, not the carry produced by the ROR rotation. Thus RRA does not preserve the ROR carry result.
- A is modified by ADC (so using RRA purely to rotate memory requires accepting that A is clobbered).
- N, V, Z, and C in the status register reflect the ADC result (final A), not the ROR result.
- The carry-in (C) at instruction entry is shifted into the rotated memory operand MSB (as with ROR), so rotation's input is identical; only the final flags/carry differ.
- Use RRA only when clobbering A and flags is acceptable or when the post-ADC A/flags are desired.

Addressing modes this enables (examples):
- RRA abs,Y  ; behaves like ROR abs,Y for the memory rotation, then ADC
- RRA (zp),Y ; behaves like ROR (zp),Y for the memory rotation, then ADC
- RRA (zp,X) ; behaves like ROR (zp,X) for the memory rotation, then ADC

**[Note: This is describing the NMOS 6510 behavior of the undocumented RRA: rotation of memory followed by ADC into A.]**

## Source Code
```asm
; C is shifted into the MSB (rotation happens first)
RRA abs, y
; like ROR abs, y  (memory rotated and written back), then ADC rotated->A

RRA (zp), y
; like ROR (zp), y

RRA (zp, x)
; like ROR (zp, x)

; After any of the above:
; - A was changed (due to ADC)
; - N,V,Z,C were set according to the ADC result (not the rotation)
```

## References
- "rra_opcodes_and_operation" — expands on base semantics of RRA (ROR then ADC)
- "noise_lfsr_example_of_rra" — example usage leveraging RRA rotation behavior
- "ignored_page_15" — footer note referenced after this section

## Mnemonics
- RRA
