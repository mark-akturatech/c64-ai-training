# SAX (illegal 6502 mnemonic)

**Summary:** SAX is an illegal 6502 instruction (Kick Assembler mnemonic) that stores A & X to memory; Kick Assembler lists the Zero Page encoding as opcode $87.

**Description**
SAX (also known as AAX) is an undocumented 6502 instruction that stores the bitwise AND of the accumulator (A) and the X register into a specified memory location. The operation can be described as:

- **Assembly syntax:** `SAX operand`
- **Operation:** `M[operand] := A & X`
- **Side-effects:** Does not modify A or X and typically does not affect processor flags.

The SAX instruction supports multiple addressing modes, each with its corresponding opcode and cycle count:

- **Zero Page:** `SAX $zz`
  - **Opcode:** $87
  - **Bytes:** 2
  - **Cycles:** 3

- **Zero Page,Y:** `SAX $zz,Y`
  - **Opcode:** $97
  - **Bytes:** 2
  - **Cycles:** 4

- **Absolute:** `SAX $aaaa`
  - **Opcode:** $8F
  - **Bytes:** 3
  - **Cycles:** 4

- **(Indirect,X):** `SAX ($zz,X)`
  - **Opcode:** $83
  - **Bytes:** 2
  - **Cycles:** 6

These details are consistent with the instruction set documentation. ([vic-20.it](https://www.vic-20.it/wp-content/uploads/2021/07/6502.pdf?utm_source=openai))

## Source Code
```asm
; Example: SAX zero page store (Kick Assembler / generic 6502)
        .org $0800
        LDA #$F0      ; A = %11110000
        LDX #$0F      ; X = %00001111
        SAX $10       ; opcode $87 $10  -> memory $0010 := $F0 & $0F = $00

; Encoding: SAX (Zero Page)
; bytes: $87 <zp>
; example bytes: 87 10
```

```text
Opcode  $87  - SAX   - Zero Page  - bytes: 2  - operation: M := A & X
```

**Behavior on Different 6502 Variants**

The behavior of the SAX instruction varies across different 6502 variants:

- **NMOS 6502:** The SAX instruction is present and functions as described, storing the result of A & X into the specified memory location.

- **CMOS 65C02:** The SAX instruction is removed in the CMOS 65C02. The opcodes corresponding to SAX are repurposed for new instructions or act as NOPs. ([en.wikipedia.org](https://en.wikipedia.org/wiki/WDC_65C02?utm_source=openai))

- **NES (Ricoh 2A03):** The NES's Ricoh 2A03 CPU, a variant of the 6502, lacks support for the decimal mode but retains the SAX instruction with behavior similar to the NMOS 6502.

**Cycle Counts on Specific Hardware**

The cycle counts for the SAX instruction are as follows:

- **Zero Page:** 3 cycles
- **Zero Page,Y:** 4 cycles
- **Absolute:** 4 cycles
- **(Indirect,X):** 6 cycles

These cycle counts are consistent across hardware that supports the SAX instruction. ([vic-20.it](https://www.vic-20.it/wp-content/uploads/2021/07/6502.pdf?utm_source=openai))

## References
- "sre_illegal_mnemonic" — expands on other store/bitwise illegal opcodes
- "xaa_ane_illegal_mnemonics" — expands on other accumulator-affecting illegal mnemonics

## Mnemonics
- SAX
- AAX
