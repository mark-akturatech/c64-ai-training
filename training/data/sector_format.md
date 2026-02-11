# 256‑Byte Autostart Fast Loader — 1541 Sector Format Notes

**Summary:** 1541 disk sectors are 256 bytes physically, but the filesystem stores the link (next track/sector) in the first two bytes, leaving 254 bytes of payload per sector; this layout is commonly used to pack a single‑sector C64 autostart and to conceal drive code in the sector’s unused area.

**1541 Sector Format and Autostart Packing**

- **Physical sector size on the 1541:** 256 bytes.
- **Filesystem link:** Byte 0 = next track, byte 1 = next sector. The remaining 254 bytes (bytes 2–255) are file payload.
- **End‑of‑file marker:** A next‑track value of $00 marks the final sector of a file (standard 1541 behavior).
- **Directory entries:** Store the starting track/sector for a file; the loader follows the chain using the two‑byte link at the start of each sector.
- **Single‑sector autostart technique:** Place the C64 autostart loader (and any immediate payload) inside a single sector’s 254‑byte payload so the program can be loaded/executed from one block. Because the filesystem only treats the first two bytes as the link, additional code/data can be hidden in bytes that the drive firmware or file layout doesn't otherwise examine — commonly referred to as concealing drive code in the sector’s "unused" area.
- **Practical consequence:** A carefully packed single sector can contain both the machine code entry and additional drive‑side code or data, enabling compact autostart fast loaders that fit within one sector.

## Source Code

```text
+----------------+----------------+----------------+----------------+
| Byte Offset     | Description    | Usage          | Notes          |
+----------------+----------------+----------------+----------------+
| 0              | Next Track     | Filesystem     | Link to next   |
|                |                |                | track          |
+----------------+----------------+----------------+----------------+
| 1              | Next Sector    | Filesystem     | Link to next   |
|                |                |                | sector         |
+----------------+----------------+----------------+----------------+
| 2–255          | Payload        | C64 Loader     | Autostart code |
|                |                |                | and data       |
+----------------+----------------+----------------+----------------+
```

*Note: The first two bytes (Next Track and Next Sector) are used by the filesystem to chain sectors together. The remaining 254 bytes are available for the C64 autostart loader and any additional data or code.*

An example of a single-sector binary (hexdump) demonstrating the packing of both C64 loader and drive code in the 254-byte payload is as follows:
