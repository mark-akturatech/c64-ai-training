# NMOS 6510 — SHY / SHA Opcode Table Rows (Assembler Variant Bytes: $93, $9C, $9F)

**Summary:** This document details the undocumented NMOS 6510 opcodes SHY and SHA, focusing on their addressing modes, opcode encodings, instruction semantics, and variant behaviors. These opcodes are associated with the hex byte values $93, $9C, and $9F, which correspond to specific assembler encodings and table placements.

**Description**

The NMOS 6510 microprocessor includes several undocumented opcodes, among which SHY and SHA are notable. These opcodes have specific addressing modes and behaviors that vary across different assemblers and CPU revisions. Understanding their exact effects and encodings is crucial for developers working with low-level assembly on the 6510.

### Addressing Modes and Opcode Encodings

- **SHA (also known as AHX or AXA):**
  - **Opcode $93:** Indexed Indirect Addressing Mode ((zp),Y)
  - **Opcode $9F:** Absolute Indexed Addressing Mode (abs,Y)

- **SHY:**
  - **Opcode $9C:** Absolute Indexed Addressing Mode (abs,X)

These opcodes are associated with specific assemblers that recognize and utilize these undocumented instructions. For instance, assemblers like KickAssembler and 64tass support these opcodes with the mentioned encodings. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/apas03s02.html?utm_source=openai))

### Instruction Semantics

- **SHA (AHX/AXA):** Stores the result of A AND X AND the high byte of the target address plus one into memory. This operation can be unstable if the target address crosses a page boundary or if certain DMA conditions occur during execution. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

- **SHY:** Stores the result of Y AND the high byte of the target address plus one into memory. Similar to SHA, this instruction can exhibit instability under specific conditions, such as page boundary crossings or DMA activity. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

### CPU Variant Behavior and Side Effects

These undocumented opcodes are specific to the NMOS 6510 and are not present in CMOS variants like the 65C02. In CMOS versions, these opcodes are either undefined or repurposed for different instructions. Additionally, the behavior of these opcodes can be unpredictable due to their undocumented nature, and they may not affect processor flags in a consistent manner. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

## References

- "sbc2_ahx_sha_group" — expands on related illegal opcode group (SBC2 / AHX / SHA)
- "shx_shx_mnemonic" — expands on the related SHX family of undocumented opcodes

## Mnemonics
- SHA
- AHX
- AXA
- SHY
