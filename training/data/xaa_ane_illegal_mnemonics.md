# Kick Assembler: illegal mnemonics XAA / ANE ($8B)

**Summary:** Kick Assembler lists the illegal 6502 mnemonics XAA and ANE mapped to opcode $8B; these are unofficial, accumulator-affecting opcodes in the 6502 illegal-opcode set.

**Description**

Kick Assembler's illegal-6502 mnemonic table shows two alternate illegal mnemonics, "xaa" and "ane", that assemble to opcode $8B. The source labels these as accumulator-affecting unofficial operations (illegal opcodes). The chunk contains only the mnemonic names and the single-byte opcode encoding $8B (hex).

No operational semantics, addressing modes, timing, or variant/CPU-specific behavior are provided in the listing — the entry is a name-to-opcode mapping in the assembler's illegal mnemonic catalogue.

**Functional Description**

Opcode $8B, associated with the mnemonics XAA and ANE, performs an operation where the accumulator (A) is loaded with the result of a bitwise AND between the X register and an immediate operand. The operation can be described as:


Here, `CONST` is a constant value that varies depending on the specific 6502 implementation and environmental factors, making the behavior of this opcode unpredictable. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

**Supported Addressing Modes and Operand Encodings**

Opcode $8B supports the immediate addressing mode:

- **Immediate:** XAA #$nn (Opcode: $8B, Bytes: 2)

In this mode, the operand is a constant value provided directly in the instruction.

**Cycle Counts, Timing, and Side Effects**

- **Cycle Count:** 2 cycles
- **Flags Affected:**
  - **Negative (N):** Set if the result in the accumulator has bit 7 set; otherwise cleared.
  - **Zero (Z):** Set if the result in the accumulator is zero; otherwise cleared.

Other processor flags remain unaffected.

**Test Vectors and Examples**

Due to the unpredictable nature of the XAA/ANE opcode, consistent test vectors cannot be reliably provided. The operation's outcome may vary across different hardware and environmental conditions. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

**CPU Variant Notes and Compatibility Caveats**

The behavior of opcode $8B (XAA/ANE) is highly unstable and varies between different NMOS 6502 implementations. Factors such as the specific CPU model, temperature, and electrical characteristics can influence its operation. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

In CMOS versions of the 6502, such as the 65C02, this opcode is undefined and should not be used, as its behavior is not guaranteed and may differ significantly from NMOS versions.

## Source Code

```
A ← (A | CONST) & X & #immediate
```


## References

- "sax_illegal_mnemonic" — expands on other accumulator/store combined illegal mnemonics
- "nop_standard_nop" — context: table mixes standard and unofficial opcodes
- "6502 'Illegal' Opcodes Demystified" — detailed analysis of undocumented 6502 instructions ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))
- "Programming with unofficial opcodes" — NESdev Wiki article on unofficial 6502 opcodes ([nesdev.org](https://www.nesdev.org/wiki/Programming_with_unofficial_opcodes?utm_source=openai))

## Mnemonics
- XAA
- ANE
