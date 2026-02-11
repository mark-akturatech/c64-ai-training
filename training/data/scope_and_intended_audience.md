# NMOS 6510 (Commodore 64 / 128 related CPUs)

**Summary:** This document examines the NMOS MOS6510 CPU used in the Commodore 64/128 systems, focusing on its compatibility with other NMOS 6502-family processors. It highlights differences in undocumented opcodes and RDY line behavior, and notes untested but likely compatible CPUs such as the 7501/8501.

**Scope and Compatibility**

This document addresses the NMOS MOS6510 CPU and its compatibility with second-source NMOS 6502 implementations that share the same manufacturing masks. Behavior is expected to be consistent across these NMOS 6502 family parts.

- **Atari 8-bit "SALLY" (6502C):** This variant behaves similarly to the NMOS 6502 in practice.

- **RDY Line Behavior:** Differences observed in some undocumented opcodes on various machines are attributed to the RDY line not being utilized; the opcode behavior itself remains consistent with NMOS specifications.

- **Excluded Variants:** This document does not cover CMOS or extended 6502-family chips that are not fully compatible, such as the 65C02, 652SC02, 65CE02, and 65816.

**Hardware-Specific Notes:**

- **6507 (Atari 2600 VCS):** This variant shares the same core behavior but has physical limitations, including a 13-bit address bus (with the upper 3 address bits not present on the package) and IRQ/NMI pins that are internally tied to +5V and not exposed. Consequently, the use of these signals is not possible on the 6507.

**Untested but Likely Compatible:**

- **7501/8501 (CBM264 Series):** These CPUs have not been tested in this context but are expected to behave similarly. Confirmation is requested.

**Undocumented Opcodes**

The NMOS 6510, like other NMOS 6502 variants, includes undocumented opcodes that were not officially specified. These opcodes can exhibit varying behaviors across different NMOS implementations. Some undocumented opcodes are known to be unstable and may produce unpredictable results. For example, certain opcodes may cause unintended memory writes or exhibit different behaviors depending on the specific NMOS variant. It is important to exercise caution when utilizing these opcodes, as their behavior is not guaranteed and may vary between different NMOS 6502-family processors.

**Intended Audience**

This material assumes the reader:

- Is experienced with 6502 assembly language.

- Understands standard opcode behavior, CPU flags, and decimal mode operation.

- Should consult a standard 6502 reference for base opcode and flag behavior if uncertain.

(Per source: wording was slightly informal — audience expectation is advanced users.)

**License**

Text in source: free to use informally. (Source quip: "free as in free beer. All rights reversed." — disclaimers humorous, not a formal license.)

**What You Get**

Source notes suggest additional topics available separately:

- "preface" — background on the document

- "processor_flags" — expanded detail on assumed CPU flag behavior

## References

- "preface" — background and document provenance

- "processor_flags" — assumed 6502 flag behavior and details