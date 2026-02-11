# Final Cartridge (C-64 demos)

**Summary:** Advice for C-64 demo development: if a demo behaves differently when a Final Cartridge is present, remove the cartridge to isolate cartridge-related interference; retest with and without the cartridge and report any reproducible differences.

**Advice**

If you suspect a Final Cartridge is affecting a demo, try running the demo with the cartridge physically removed. If the behavior changes when the cartridge is removed, the problem is cartridge-related, and you can focus debugging on cartridge interaction rather than the demo code.

If you can reproduce cartridge-related differences, collect and share details (model, exact symptoms, steps to reproduce) so others can help diagnose the interaction.

**Technical Details**

The Final Cartridge III (FC3) introduces several features that can interfere with demo execution:

- **Interrupt Vector Handling:** FC3 prevents changing the interrupt vector in BASIC direct mode. This restriction can cause compatibility issues with utilities or demos that hook into the interrupt system. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Final_Cartridge_3?utm_source=openai))

- **Memory Banking and ROM Mapping:** FC3 utilizes bank switching to map its 64 KB ROM into the C64's memory space. This process can conflict with demos that assume control over specific memory regions, leading to unexpected behavior. ([c64-wiki.de](https://www.c64-wiki.de/wiki/The_Final_Cartridge_3?utm_source=openai))

- **Fast Loader and Freezer Functions:** The cartridge's fast loader and freezer functionalities modify standard loading routines and memory states. Demos relying on precise timing or custom loading sequences may experience disruptions due to these alterations. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Final_Cartridge_3?utm_source=openai))

Given these potential conflicts, it's advisable to test demos both with and without the Final Cartridge installed to identify and address any compatibility issues.

## References

- ([c64-wiki.com](https://www.c64-wiki.com/wiki/Final_Cartridge_3?utm_source=openai))

- ([c64-wiki.de](https://www.c64-wiki.de/wiki/The_Final_Cartridge_3?utm_source=openai))