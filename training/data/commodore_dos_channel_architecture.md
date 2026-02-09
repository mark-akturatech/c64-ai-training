# Commodore DOS — Channel Architecture (IEC Serial Bus)

**Summary:** Commodore DOS implements a 32-channel architecture (0–31) on top of the IEC TALK/LISTEN layer but only uses channels 0–15; channels 0–14 carry file data and channel 15 is the command/status metachannel. Terms: IEC serial bus, secondary address (filename), OPEN/CLOSE, channel 15.

## Channel Architecture
The DOS layer sits above the TALK/LISTEN protocol and defines how disk drives interpret secondary addresses (channels). Although the bus supports 32 secondary addresses (0–31), Commodore DOS firmware uses only 0–15.

- Channels 0–14: file data channels used for sequential or record I/O (OPEN/CLOSE use a channel as the secondary address).  
- Channel 15: command/status metachannel used to send device commands and receive status messages (commands are sent via the OPEN/CLOSE/PRINT/UNPRINT mechanisms).  
- Channels 16–31: present on the bus as possible secondary addresses but not used by Commodore DOS.

## Channel Defaults
- Channel 0 — Default read mode (LOAD)  
- Channel 1 — Default write mode (SAVE)  
- Channels 2–14 — Flexible read/write access (application-defined)  
- Channel 15 — Command/status channel (metachannel)

(Secondary address: the IEC "secondary address" field in OPEN/CLOSE packets, often used to indicate a logical channel or filename — brief definition.)

## References
- "named_channels" — expands on OPEN/CLOSE and use of secondary addresses as filenames  
- "command_channel_15" — expands on sending commands via channel 15