# IEC Serial Bus — Named Channels and OPEN/CLOSE Semantics

**Summary:** Commodore extends IEEE-488 to associate secondary addresses 0–15 with filenames for named channels; OPEN and CLOSE use LISTEN/UNLISTEN sequences with filename bytes sent on OPEN. Searchable terms: IEEE-488, IEC, secondary addresses 0-15, OPEN, CLOSE, LISTEN, UNLISTEN, filename bytes.

## Named Channels (OPEN/CLOSE)
Commodore added a layer to the IEEE-488/IEC serial protocol that allows secondary addresses (0–15) to be associated with filenames so that drives and devices can open named channels.

Sequence details:
- OPEN sequence:
  - LISTEN
  - OPEN command
  - send filename bytes
  - UNLISTEN
- CLOSE sequence:
  - LISTEN
  - CLOSE command
  - UNLISTEN

The OPEN sequence transmits the filename bytes following the OPEN command while still in the LISTEN phase; CLOSE does not send filename bytes (it is LISTEN -> CLOSE -> UNLISTEN).

## References
- "secondary_addressing_channels" — expands on SA ranges and disk drive behavior  
- "commodore_dos_channel_architecture" — expands on how DOS treats channel numbers
