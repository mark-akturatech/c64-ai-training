# NMOS 6510 undocumented opcodes: LAX ($AB) and ANE ($8B)

**Summary:** NMOS 6510 undocumented instructions LAX ($AB) and ANE ($8B) — semantics shown as bitwise expressions (A,X = ...), immediate/masked operations, and reported flag-effect lines. Search terms: $AB, $8B, LAX, ANE, NMOS 6510, undocumented opcode.

**Description**

This chunk documents two undocumented NMOS 6510 opcodes and their high-level semantics:

- **LAX — opcode $AB**  
  - **High-level semantics:** A, X = (A | CONST) & #{imm}  
  - **Flag effects:**  
    - **Negative (N) flag:** Set if the result is negative (bit 7 set); cleared otherwise.  
    - **Zero (Z) flag:** Set if the result is zero; cleared otherwise.  
  - **Addressing mode:** Immediate.  
  - **Cycle count:** 2 cycles.  
  - **CONST definition:** CONST is a chip- and temperature-dependent constant, commonly observed as $EE, $00, or $FF. Its exact value can vary, making the behavior of LAX #imm unpredictable.  
  - **Operation:** This opcode ORs the accumulator (A) with CONST, ANDs the result with the immediate value, and then stores the result in both A and X.  
  - **Note:** Due to the variability of CONST, the immediate mode of LAX is considered unstable and should be used with caution. ([esocop.org](https://www.esocop.org/docs/MOS6510UnintendedOpcodes-20152412.pdf?utm_source=openai))

- **ANE — opcode $8B**  
  - **High-level semantics:** A = (A | CONST) & X & #{imm}  
  - **Flag effects:**  
    - **Negative (N) flag:** Set if the result is negative (bit 7 set); cleared otherwise.  
    - **Zero (Z) flag:** Set if the result is zero; cleared otherwise.  
  - **Addressing mode:** Immediate.  
  - **Cycle count:** 2 cycles.  
  - **CONST definition:** Similar to LAX, CONST is a chip- and temperature-dependent constant, leading to unpredictable behavior.  
  - **Operation:** This opcode ORs the accumulator (A) with CONST, ANDs the result with the X register and the immediate value, and then stores the result in A.  
  - **Note:** Due to the variability of CONST, the immediate mode of ANE is considered unstable and should be used with caution. ([esocop.org](https://www.esocop.org/docs/MOS6510UnintendedOpcodes-20152412.pdf?utm_source=openai))

## Source Code

```text
; Example usage of LAX #imm
LAX #$FF  ; A, X = (A | CONST) & $FF

; Example usage of ANE #imm
ANE #$FF  ; A = (A | CONST) & X & $FF
```

## Key Registers

- **Accumulator (A):** Affected by both LAX and ANE.
- **X Register (X):** Affected by LAX; used in ANE.
- **Processor Status Register (P):**  
  - **Negative (N) flag:** Set or cleared based on the result.
  - **Zero (Z) flag:** Set or cleared based on the result.

## References

- "stack_and_memory_logical_sha_shy_shx_tas_las" — related undocumented memory/SP-affecting instructions and behaviors
- "nop_and_page_header_continuation" — continues with NOP and multi-byte undocumented NOPs

([esocop.org](https://www.esocop.org/docs/MOS6510UnintendedOpcodes-20152412.pdf?utm_source=openai))

## Mnemonics
- LAX
- ANE
