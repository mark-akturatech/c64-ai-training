# Display "LOADING" or "VERIFYING" (ROM $F5D2..$F5DA)

**Summary:** The ROM routine at $F5D2–$F5DA selects a message index for either "LOADING" or "VERIFYING" based on the load/verify flag in zero page $93, then jumps to the kernel I/O message display routine at $F12B, which uses Y as the message index.

**Description**

This small ROM fragment chooses which status message to show during file transfer operations:

- Entry at $F5D2: `LDY #$49` — default to the message index for "LOADING".
- It reads zero page $93 (`LDA $93`), which holds the load/verify flag.
- `BEQ $F5DA`: if $93 == 0 (zero flag set), the branch is taken, and the default "LOADING" index remains in Y.
- If $93 != 0, execution falls through to `LDY #$59`, which selects the message index for "VERIFYING".
- Finally, it jumps to $F12B (`JMP $F12B`), the kernel I/O message display routine, which uses Y as the message index and performs the display when in direct mode, then returns.

Behavior note: $93 is treated as a boolean load/verify flag — zero = load ("LOADING"), non-zero = verify ("VERIFYING"). Y contains an index/offset ($49 or $59) into the kernel message table consumed by the display routine at $F12B.

**Kernel Message Table**

The kernel message table is located in the ROM and contains various system messages. The offsets $49 and $59 correspond to the messages "LOADING" and "VERIFYING", respectively. These offsets are used by the display routine at $F12B to fetch and display the appropriate message.

**Display Routine at $F12B**

The routine at $F12B is responsible for displaying kernel I/O messages based on the index provided in the Y register. It retrieves the message from the kernel message table using the index in Y and outputs it to the current output device. This routine ensures that the correct status message ("LOADING" or "VERIFYING") is displayed during file operations.

## Source Code

```asm
.,F5D2 A0 49    LDY #$49        ; point to "LOADING"
.,F5D4 A5 93    LDA $93         ; get load/verify flag
.,F5D6 F0 02    BEQ $F5DA       ; branch if load (flag==0)
.,F5D8 A0 59    LDY #$59        ; point to "VERIFYING"
.,F5DA 4C 2B F1 JMP $F12B       ; display kernel I/O message (direct mode) and return
```

## References

- "serial_bus_load_and_receive" — expands on status messages during serial-bus file transfers
- "tape_load_sequence" — expands on status before starting tape read
- "print_searching_and_file_name" — complements the 'Searching...' output flow