# Print "SAVING <file name>" helper ($F68F-$F698)

**Summary:** Checks the kernel message mode flag ($009D) and, if enabled, indexes to the "SAVING " kernel I/O message (LDY #$51) and calls the kernel message display routine (JSR $F12F), then jumps to the filename print routine (JMP $F5C1).

**Description**
This short kernel helper prints the "SAVING <file name>" status used before a tape write. Sequence of operations:

- LDA $009D — load the kernel message-mode flag from zero page. The helper uses this to decide whether to display control/I/O messages.
- BPL $F68E — branch (to exit) when the negative flag is clear; the code treats this branch as the "messages off" path, so printing is skipped when the condition is met.
- LDY #$51 — set Y to $51, an index into the kernel I/O message table pointing to the "SAVING " text.
- JSR $F12F — call the kernel I/O message display routine which uses Y to select and print the short message.
- JMP $F5C1 — jump to the routine that prints the file name (continuation), then returns to the caller from there.

This helper thus performs a conditional message print (based on $009D) and immediately delegates the filename printing to the standard kernel filename routine at $F5C1.

## Source Code
```asm
.,F68F A5 9D    LDA $9D         get message mode flag
.,F691 10 FB    BPL $F68E       exit if control messages off
.,F693 A0 51    LDY #$51        index to "SAVING "
.,F695 20 2F F1 JSR $F12F       display kernel I/O message
.,F698 4C C1 F5 JMP $F5C1       print file name and return
```

## Key Registers
- $009D - Kernel message-mode flag:
  - Bit 7 (value $80): Controls kernel control messages (e.g., "SEARCHING FOR", "LOADING"). Set to 1 to enable, 0 to disable.
  - Bit 6 (value $40): Controls kernel error messages (e.g., "I/O ERROR #4"). Set to 1 to enable, 0 to disable.
  - Values:
    - $00: Suppress all kernel messages.
    - $40: Enable error messages only.
    - $80: Enable control messages only.
    - $C0: Enable both control and error messages.

## References
- "tape_save_entry_and_device_checks" — expands on checks invoked prior to starting tape write and status display
- "print_file_name" — continuation that actually prints the filename (JMP target $F5C1)