# C‑64 CPU (6510) — registers, instruction set, memory‑mapped I/O

**Summary:** The C‑64 uses a 6510 CPU (6502 family) with a compact instruction set and three primary programmer-visible registers (A, X, Y); it relies on memory‑mapped I/O (I/O devices accessed via memory addresses) and includes the Program Counter (PC), Stack Pointer (SP), and Status register for control and flow.

**The CPU**

The 6510 in the C‑64 is a 6502 derivative with the same simple, well‑documented instruction set. Key properties relevant to demo coding:

- **Instruction set:** Compact and simple—good for predictable, tightly optimized machine code.
- **Registers:** Three main general-purpose registers visible to programmers: A (accumulator), X, and Y. Additionally, the CPU provides PC (program counter), SP (stack pointer), and the Status register (processor flags).
- **Memory‑mapped I/O:** I/O devices (chips like VIC‑II, SID, CIAs) are mapped into the CPU address space, so reading/writing to device registers is done with normal memory accesses (e.g., STA/LDA to device addresses).
- **Constraints:** The small number of general-purpose registers forces frequent memory use and careful register allocation in tight inner loops; this shapes algorithm choices and code layout for demos.
- **Benefits for demos:** The small, predictable instruction set plus direct memory‑mapped access to graphics/sound hardware simplifies low‑level timing and device control (details for VIC‑II/SID/CIA registers are in separate reference chunks).

**Why C‑64**

The author highlights several reasons for choosing the C‑64 for demo development:

- **Hardware Capabilities:** The C‑64's hardware, particularly the VIC‑II graphics chip and the SID sound chip, offers unique features that can be exploited for creative effects. ([pscarlett.me.uk](https://pscarlett.me.uk/post/c64/vic/vic.html?utm_source=openai))

- **Active Demoscene Community:** The C‑64 has a vibrant and enduring demoscene, providing a rich source of inspiration and collaboration. ([retro8bitshop.com](https://www.retro8bitshop.com/a-journey-into-digital-art-the-universe-of-commodore-64/?utm_source=openai))

- **Challenge of Constraints:** The limitations of the C‑64's hardware encourage innovative programming techniques, fostering creativity through constraint. ([medium.com](https://medium.com/%40megus/creativity-through-limitation-8-bit-demoscene-68266b918e4a?utm_source=openai))

## References

- "learning_machine_language" — expanded 6502 assembly learning advice and techniques