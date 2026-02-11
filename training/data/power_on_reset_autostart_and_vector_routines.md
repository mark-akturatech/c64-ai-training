# KERNAL Power-On Reset and I/O Routines (Reset $FCE2; VECTOR $FD1A; OPEN/LOAD/SAVE)

**Summary:** Describes the C64 KERNAL power-on reset sequence at $FCE2 (sets IRQ disable, stack pointer, autostart cartridge test), the autostart cartridge check at $FD02/$FD10 (looks for "CBM80"), RESTOR ($FD15) and VECTOR ($FD1A) vector-table restore/set, and documented I/O/file routines (OPEN, LOAD, SAVE, CLALL, CLRCHN) with entry points and required call conventions (SETLFS, SETNAM, A/X/Y usage).

## Power-On Reset ($FCE2)
On reset the KERNAL entry at $FCE2 performs the cold-start sequence:
- Sets Interrupt Disable (SEI) and initializes the Stack Pointer.
- Tests for an autostart cartridge by inspecting the cartridge header (checks for the "CBM80" signature).
  - Cartridge header checks reference $FD02 and $FD10 for the autostart pattern.
  - If an autostart cartridge is detected, the reset routine jumps to the cartridge cold-start vector.
- If no autostart cartridge is present, the KERNAL initializes itself by calling initialization routines in sequence: IOINIT, RAMTAS, RESTOR, and CINT, then continues into the BASIC cold start.

## Autostart Cartridge Check ($FD02 / $FD10)
- The KERNAL tests cartridge header fields for the ASCII pattern "CBM80" to decide whether to transfer control to a cartridge cold-start vector.
- The pertinent cartridge header locations referenced by the reset code are at $FD02 and $FD10.

## RESTOR ($FD15) and VECTOR ($FD1A)
- RESTOR ($FD15) restores RAM vectors to default I/O settings (restores the RAM-based vectors used for device/handler indirection).
- VECTOR ($FD1A) is a routine that writes a RAM vector table from a table pointed to by the .X/.Y registers — this allows saving and restoring the vector table.
  - Calls that use VECTOR are recommended to be bracketed by SEI/CLI to avoid interrupts during vector table modification.

## KERNAL I/O and Logical File Routines
- Find the File in the Logical File Table — $F30F
  - Used by multiple KERNAL routines to locate the logical file entry in the logical file table at $0259 (decimal 601).
- Set Current Logical File / Device / Secondary Address — $F31F
  - Updates KERNAL variables at $00B8-$00BA (decimal 184-186) holding current logical file number, device number, and secondary address.
- CLALL (Close All Logical I/O Files) — $F32F (documented; jump-table entry $FFE7)
  - CLALL jumps through a RAM vector at $032C (decimal 812).
  - Closes all open files by resetting the index to open files at $0098 (decimal 152) to zero.
  - Falls through to restore default I/O devices.
- CLRCHN (Restore Current Input/Output Devices) — $F333 (documented; jump-table entry $FFCC)
  - CLRCHN jumps through a RAM vector at $0322 (decimal 802).
  - Sets current input device to the keyboard and current output device to the screen.
  - If prior current input was a serial device, sends an UNTALK; if prior current output was serial, sends an UNLISTEN.
- OPEN (Open a Logical I/O File) — $F34A (documented; jump-table entry $FFC0)
  - OPEN jumps through a RAM vector at $031A (decimal 794).
  - Requires prior calls to SETLFS (set logical file, device, secondary address) and SETNAM (set filename).
- LOAD (Load RAM from a Device) — $F49E (documented; jump-table entry $FFD5)
  - LOAD jumps through a RAM vector at $0330 (decimal 816).
  - A = 0 for LOAD, A = 1 for VERIFY.
  - Performs an OPEN internally; requires SETLFS and SETNAM (tape LOAD may omit filename).
  - .X/.Y must contain the starting address for the load (unless secondary address = 1, in which case the file header supplies the load address).
  - On return .X/.Y contain the address of the highest RAM location loaded.
- PRINT MESSAGES used by Loader Routines
  - $F5A5 — Print "SEARCHING" if in direct mode.
  - $F5D2 — Print "LOADING" or "VERIFYING".
- SAVE (Save RAM to a Device) — $F5DD (documented; jump-table entry $FFD8)
  - SAVE jumps through a RAM vector at $0332 (decimal 818).
  - Performs an OPEN internally; requires SETLFS and SETNAM (SAVE to cassette may omit filename).
  - Call convention: set a Page-0 pointer to the starting address (low byte first), load A with the Page-0 offset of that pointer, set .X/.Y to the ending address, then call SAVE.

## References
- "kernal_patches_iobase_and_screen_plot_routines" — expands on IOINIT called during reset to initialize CIAs and VIC defaults

## Labels
- RESTOR
- VECTOR
- OPEN
- LOAD
- SAVE
- CLALL
- CLRCHN
- SETLFS
