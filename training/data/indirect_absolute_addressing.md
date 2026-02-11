# 6502 Indirect Absolute Addressing (format (aaaa))

**Summary:** Indirect Absolute addressing (format (aaaa)) on the 6502 is used by JMP; the operand is a 2‑byte memory address whose low byte and high byte (at consecutive memory locations) form the target PC. Example: JMP ($3418) uses the word at $3418/$3419 as the jump vector.

## Description
Only one 6502 instruction uses the simple indirect absolute addressing mode: JMP. The instruction operand is a 2‑byte memory address (aaaa). The processor reads the low byte of the target address from memory at aaaa and the high byte from memory at aaaa+1, then transfers control to the assembled 16‑bit address.

Example from source:
- If $3418 contains $55 and $3419 contains $29, then:
  - JMP ($3418) transfers execution to $2955.

(The operand itself is the address of the 2‑byte vector; the vector's low byte is at the given address, high byte at the following byte.)

## Source Code
```asm
; Example: indirect absolute vector at $3418/$3419
; $3418 = $55
; $3419 = $29

        JMP ($3418)    ; will jump to $2955
```

## References
- "indexed_indirect_x" — expands on other indirect forms using zero page
- "indirect_indexed_y" — expands on other indirect forms using zero page

## Mnemonics
- JMP
