# CMD ($AA86) — Perform CMD

**Summary:** Kernal routine at $AA86 (43654) that performs the CMD operation: it calls the Kernal CHKOUT routine ($F250 / 62032) and then calls PRINT to send included text to the currently selected device; unlike PRINT#, it leaves the output channel open for subsequent output.

## Description
This ROM routine implements the CMD operation. Its behavior, as described in the source:

- Calls the Kernal CHKOUT routine (address $F250 / decimal 62032) to set the current output channel/device.
- Calls the Kernal PRINT routine to send any included text to that device.
- Does not close the output channel after sending text — output remains directed to that device for further writes.

The routine is intended for sending text to a previously selected device/channel while keeping that channel open for additional output (contrast with PRINT#, which closes the channel after the transfer).

## Source Code
(omitted — no assembly listing or register maps provided in this source)

## Key Registers
(none)

## References
- "print_hash_print_channel" — covers how PRINT# uses CMD and then closes the channel
- "print_statement" — covers how CMD delegates text handling to PRINT