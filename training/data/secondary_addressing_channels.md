# Secondary Addressing (IEC Serial Bus)

**Summary:** Secondary addresses (0-31) select device "channels" on the Commodore IEC serial bus and may be specified after TALK or LISTEN commands (IEC TALK/LISTEN). For disk drives, bit 4 of the secondary address is ignored, so channels 16–31 map to 0–15.

## Secondary Addressing (Channels)
Secondary addresses are a 0–31 value used to select logical "channels" within an IEC device. A command sequence may supply a secondary address immediately after the TALK or LISTEN command to indicate which channel the following command applies to; using a secondary address is optional.

Important device behavior:
- Range: 0–31 (5 bits).
- Usage: Selects a channel (often called a secondary or sub-address) within a device; provided after TALK or LISTEN.
- Disk-drive quirk: Disk drives ignore bit 4 (the 16s bit) of the secondary address. Consequently, any secondary in the range 16–31 is equivalent to the corresponding value 0–15 (i.e., SA & %01111).

## References
- "named_channels" — expands on using secondary addresses to open/close named channels
