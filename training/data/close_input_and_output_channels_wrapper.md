# KERNAL: CLRCHN wrapper at $FFCC (JMP ($0322))

**Summary:** KERNAL ROM wrapper at $FFCC performs a JMP ($0322) to the CLRCHN vector to close input/output channels, restore default I/O channels (input=0 keyboard, output=3 screen), and send UNTALK/UNLISTEN on the serial bus when needed.

## Operation
This routine is the KERNAL entry used to "close input and output channels". It restores the default I/O channels and clears any open channels used for I/O. Default channel numbers preserved by the KERNAL are: input device 0 (keyboard) and output device 3 (screen).

When closing a channel that is the serial bus, the routine issues the appropriate IEEE-488-style bus command first:
- Sends UNTALK to clear an active TALK (input) connection.
- Sends UNLISTEN to clear an active LISTEN (output) connection.

Failure to close serial listeners can leave multiple devices listening on the bus; this can be exploited intentionally (for example, commanding the printer to TALK and the disk to LISTEN to copy data directly from disk to printer).

The ROM contains a simple wrapper at $FFCC which JMPs indirectly through the CLRCHN vector stored at $0322; the actual behavior is implemented by the handler pointed to by that vector.

## Source Code
```asm
.,FFCC 6C 22 03 JMP ($0322)     do close input and output channels
```

## Key Registers
- $FFCC - KERNAL ROM - Wrapper: JMP ($0322) to invoke CLRCHN
- $0322 - RAM (KERNAL vector table) - CLRCHN vector (indirect JMP target for channel-closing routine)

## References
- "kernal_vectors_list" — expands on CLRCHN vector at $0322 (KERNAL vector table)

## Labels
- CLRCHN
