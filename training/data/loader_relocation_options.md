# Loader option: Relocate program load address

**Summary:** Loader option to relocate a program's loading address (change the program's load address) so code can be tested in RAM while targeting cartridge or other fixed addresses; useful for cartridge development, testing, and hex-file processing. Relocatable loaders and monitors simplify testing of code intended to run at a different final address.

## Overview
Relocation is a loader feature that changes the address at which a program is loaded and executed, allowing the same binary to be tested in one memory region (for example, free RAM) while being intended to run at another fixed address (for example, a cartridge ROM area). This is important when the target execution address differs between development/test environments and the final deployment (cartridge, firmware area, or other fixed banks).

Common uses:
- Test cartridge-targeted code by loading and running it from RAM without modifying the program’s address constants.
- Avoid conflicts with system vectors or resident memory during development by temporarily relocating code.
- Combine with hex-file loaders that support relocation fields so address fixups are applied automatically at load time.

Relocatable monitors (simple machine-code monitors that support relocation) and hex-file-aware loaders make this workflow straightforward by providing relocation fixups and run-address adjustments during loading.

## References
- "hex_files_and_loader_basics" — expands on relocation as a feature of loaders that process hex files  
- "monitor_functions_and_relocatability_warning" — expands on relocatable monitors simplifying testing of relocated code