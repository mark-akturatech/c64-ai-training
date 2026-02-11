# KERNAL power-up activities

**Summary:** Describes the Commodore 64 KERNAL power-up initialization sequence: reset stack pointer and clear decimal mode, autostart ROM check at $8000, I/O and chip initialization (CIAs, SID, serial bus), nondestructive RAM test from $0300 setting top/bottom of RAM and screen/$0400, and transfer to BASIC via indirect at $A000.

## Initialization sequence
1) Reset CPU state
- KERNAL resets the 6502 stack pointer and clears the decimal flag (decimal mode).

2) Autostart ROM check
- KERNAL checks for an autostart ROM cartridge at $8000. If present, normal initialization is suspended and control is transferred to the cartridge code; otherwise initialization continues.

3) I/O and chip initialization
- Serial bus is initialized.
- Both 6526 CIA chips are initialized for keyboard scanning and have the 60‑Hz timer activated.
- SID chip is cleared.
- BASIC memory map is selected.
- Cassette motor is switched off.

4) RAM test and memory pointers
- A nondestructive RAM test begins at $0300 and proceeds upward until the first non-RAM location is found; that point sets the top‑of‑RAM pointer.
- Bottom of memory is set to $0800.
- Screen setup is fixed at $0400.
- Page zero (zero page) is initialized and the tape buffer is set up.

5) Final KERNAL setup and boot to BASIC
- I/O vectors are set to default values.
- The indirect jump table in low memory is established.
- Screen is cleared and all screen-editor variables reset.
- BASIC is started by performing the indirect vector at $A000.

## Key Registers
- $8000 - ROM - autostart ROM entry point (cartridge check)
- $A000 - ROM - BASIC start (used via indirect to transfer control)
- $0300 - RAM - start address for nondestructive RAM test
- $0400 - RAM - screen setup (screen memory base)
- $0800 - RAM - bottom-of-memory pointer

- $DC00-$DC0F - CIA 1 - initialized for keyboard scanning and 60‑Hz timer activation
- $DD00-$DD0F - CIA 2 - initialized for keyboard scanning and 60‑Hz timer activation
- $D400-$D418 - SID - cleared during initialization

## References
- "kernal_overview_and_jump_table_purpose" — overall KERNAL purpose and jump table usage after initialization
- "using_kernal_routines_and_calling_conventions" — how to call KERNAL routines after system initialization