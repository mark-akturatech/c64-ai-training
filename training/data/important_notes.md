# VIC-II Memory Banking and Address Configuration Guide

**Summary:** Practical rules for VIC-II bank selection and related addresses: KERNAL screen page pointer $0288 (decimal 648), color RAM $D800-$DBE7, sprite pointer locations (screen_base + $03F8..$03FF), and CIA-2 $DD00 (use read-modify-write to avoid serial-bus disruption).

## VIC-II Memory Banking Notes
- KERNAL screen page pointer: When changing VIC bank or moving screen memory, update the KERNAL pointer at $0288 (decimal 648). Store screen_address / 256 at $0288 so BASIC/KERNAL I/O routines target the correct 256-byte page.
- ROM charset shadowing (banks 0 and 2): In VIC banks 0 and 2 the ROM character set occupies a 4 KB window in the VIC address space. Any data placed at those character-set addresses (custom charset, sprites, or screen bytes) will be invisible to the VIC-II while the ROM charset is mapped there.
- Color RAM independence: Color RAM at $D800-$DBE7 is not affected by VIC bank selection — it remains at those addresses regardless of bank.
- Sprite pointers follow screen memory: The 8 sprite data pointers are stored in the last 8 bytes of the screen memory area (screen_base + $03F8 through screen_base + $03FF). Moving the screen base moves these sprite pointers along with the screen.
- CIA-2 ($DD00) writes: When modifying $DD00 (CIA-2 port/register 0), always perform a read-modify-write to avoid inadvertently disturbing the serial bus or other CIA-2 functions. (Modify only the bits you intend to change.)

## Key Registers
- $0288 - KERNAL - Screen page pointer (store screen_address / 256; decimal 648)
- $D800-$DBE7 - Color RAM - color bytes for screen; independent of VIC bank
- $DD00 - CIA-2 - Port register (modify using read-modify-write to avoid serial-bus disruption)

## References
- "address_calculation_quick_reference" — expands on computing screen_address for KERNAL page pointer
- "bank_selection_registers_and_rw" — expands on bank-selection registers and RMW requirement for $DD00
- "rom_charset_shadows" — expands on visibility issues when ROM charset is mapped into VIC address space
