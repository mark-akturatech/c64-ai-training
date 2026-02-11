# LAS (illegal NMOS 6510 opcode $BB)

**Summary:** LAS (opcode $BB) is an undocumented NMOS 6510/6502 instruction commonly listed as LAS (also seen as LAE or LDS in some assemblers). It uses the absolute,Y addressing mode and performs a memory AND with the stack pointer, writing the result into A, X, and the stack pointer (S); N and Z flags are affected.

**Description**
LAS is an unofficial opcode on NMOS 6502-family chips (including the C64's 6510). Documented behavior is:

- **Addressing mode:** absolute,Y (memory operand = M = M[addr + Y])
- **Operation (pseudo):**
  - tmp = M AND S
  - A := tmp
  - X := tmp
  - S := tmp
- **Processor flags:** Negative (N) and Zero (Z) are set according to tmp. Carry and Overflow are unaffected.

Assembler name variants:
- LAS — most common community name
- LAE — seen in some assemblers/listings
- LDS — alternate name in some tools (note: not the documented LDS in some assemblers that means "Load Stack Pointer" — this is an illegal combined op)

Caveats:
- This instruction is unofficial — behavior may differ between NMOS and CMOS 65xx implementations or across revisions; do not rely on it for portable code.
- **Cycle counts:** The LAS instruction in absolute,Y addressing mode takes 4 cycles on NMOS 6502 processors. If a page boundary is crossed during the address calculation (i.e., addr + Y crosses a 256-byte page boundary), an additional cycle is added, making it 5 cycles in total. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

## Source Code
```asm
; Example: machine bytes for LAS abs,Y where address = $2000
; Opcode byte: $BB (illegal)
; Assembler variants may accept 'LAS', 'LAE' or 'LDS' as mnemonic

        .org $0800
test_las:
        .byte $BB, $00, $20    ; LAS $2000,Y  ; bytes: $BB $00 $20

; Pseudo-disassembly / comment:
; LAS $2000,Y
;   tmp = M[$2000 + Y] & S
;   A = tmp
;   X = tmp
;   S = tmp
;   Set N,Z based on tmp
```

## References
- "tas_shs_mnemonics" — expands on TAS/SHS group (related illegal opcodes)
- "lax_lxa_variants" — expands on adjacent LAX / LXA illegal-opcode variants

## Mnemonics
- LAS
- LAE
- LDS
