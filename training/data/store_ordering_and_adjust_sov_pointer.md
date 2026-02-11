# Start-of-Variables ($002D/$002E) and Commodore Integer Byte Order

**Summary:** Describes Commodore BASIC integer variable byte order (high-order byte first for integer variables), and how to move the Start-Of-Variables (SOV) pointer at $002D/$002E above a machine-language program (example: set SOV to $08C8). Shows monitor .M display format used to view/change $002D/$002E.

## Variable byte order and adjusting SOV
- Integer (16-bit) BASIC variables are stored high-order byte first, then low-order byte (big-endian for variable data). This is the reverse of 6502/CPUs which use little-endian for addresses.
- When writing integer variable bytes back into BASIC variable storage you must store the high byte first and the low byte second — keep the byte order correct.
- Before returning control to BASIC after inserting a machine-language (ML) program, adjust the Start-Of-Variables (SOV) pointer so variables live above the ML block. Choose an address above your ML code (example used here: $08C8).
- The SOV pointer itself (at $002D/$002E) is presented and edited in the monitor as two bytes. In the example below $002D contains C8 and $002E contains 08, which together represent address $08C8 (low byte at $002D, high byte at $002E, i.e. the pointer bytes follow 6502 little-endian order when assembled into an address).
- Use the monitor memory dump command (example shown: .M 002D 002E) to display or confirm the bytes.

## Source Code
```text
Example monitor display (showing SOV set to $08C8):

.M 002D 002E
.:002D  C8 08 .. .. .. .. .. ..
```

## Key Registers
- $002D-$002E - BASIC - Start-of-Variables (SOV) pointer (low-order byte at $002D, high-order byte at $002E); set this to an address above your ML program (example: $08C8 → $002D=C8, $002E=08).

## References
- "double_to_make_times_ten_and_store_back" — expands on code that writes the high/low bytes back into V%
- "disassemble_list_save_and_run_instructions" — expands on checking, disassembling, and returning to BASIC after adjusting SOV

## Labels
- SOV
