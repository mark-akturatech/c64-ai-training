# NMOS 6510 — Unstable Opcodes (address-high-byte group)

**Summary:** Describes five "unstable address high byte" undocumented 6502/NMOS 6510 opcodes (SHA/TAS/SHY/SHX variants) that do not modify A/X/Y/P but can mis-store their result when an indexed target crosses a page boundary or when RDY stops the CPU (DMA/bad line). Advises avoiding page crossings and DMA and choosing tolerant target high bytes (e.g., $FE00).

**Overview**

Five undocumented opcodes form the "unstable address high byte" subgroup. They do not change A, X, Y, or the processor status, but have two failure modes you must guard against:

- **Page-crossing effect:**
  - When the effective address is computed with an index that crosses a 0x100 page boundary, the low byte wraps as normal and the high byte is incremented. For these opcodes, the incremented high byte is then ANDed with the value being stored — producing an unexpected store address (the stored value is used as a mask against the incremented high byte).
  - *Practical consequence:* Keep indexed addresses so they do not cross page boundaries when using these opcodes, unless the AND behavior is acceptable.

- **RDY / DMA timing effect:**
  - If RDY is asserted low to stop the CPU during the instruction (examples: VIC-II badline handling or sprite DMA starting late in the penultimate cycle), the AND-with-(addrhi+1) step may be skipped, and the raw value written directly (behaving like a normal STA/STX/STY store rather than an ANDed store).
  - The skipping does not appear to occur when the screen is blanked or when C128 2 MHz mode is enabled (i.e., scenarios that avoid the particular RDY/DMA timing window).
  - *Practical consequence:* Ensure no DMA/bad-line RDY events can occur during the instruction, or choose store addresses whose high byte tolerates being ANDed or not (see examples).

*Advice:* Avoid page crossings for indexed addressing, avoid conditions that will assert RDY during the instruction, and choose target addresses whose high byte produces safe results when ANDed (or is invariant under the AND mask). Example safe targets:

- **$FE00:** AND with $FF (addrhi+1 == $FF) equals no change, so unaffected by AND step.
- If the mask is benign for your data (e.g., values all $00–$7F), using an address whose incremented high byte AND yields $7F is acceptable (example below).

**Examples**

- **SHY $7E00,X:** If the incremented high byte becomes $7F, ANDing with $7F leaves values $00–$7F unchanged, so no difference whether the AND step runs or is skipped.
- **$FE00 target:** Since AND with $FF is a no-op, the resulting store address is safe regardless of whether the AND step occurs.

**Affected Opcodes and Modes**

The following five opcodes are part of the "unstable address high byte" group:

- **SHA (zp),Y**: Opcode $93
- **TAS abs,Y**: Opcode $9B
- **SHY abs,X**: Opcode $9C
- **SHX abs,Y**: Opcode $9E
- **SHA abs,Y**: Opcode $9F

*Note:* The opcode $93 is used for SHA (zp),Y, and $9F is used for SHA abs,Y.

## Source Code

```text
Opcode table:
SHA (zp),Y    - $93
TAS abs,Y     - $9B
SHY abs,X     - $9C
SHX abs,Y     - $9E
SHA abs,Y     - $9F
```

Additional guidance:

- "None of these opcodes affect the accumulator, the X register, the Y register, or the processor status register."
- "If the target address crosses a page boundary because of indexing, the instruction may not store at the intended address. Instead, the high byte of the target address will get incremented as expected, and then ANDed with the value stored."
- "Sometimes the actual value is stored in memory, and the AND with <addrhi+1> part drops off (e.g., SHY becomes true STY). This happens when the RDY line is used to stop the CPU (pulled low), i.e., either a 'bad line' or sprite DMA starts in the second last cycle of the instruction."
- "For $FE00 there's no problem, since ANDing with $FF is the same as not ANDing."

## References

- "jam_opcodes_cpu_lockup" — JAM/KIL opcodes that lock the CPU (related unstable/jam behavior)

## Mnemonics
- SHA
- TAS
- SHY
- SHX
