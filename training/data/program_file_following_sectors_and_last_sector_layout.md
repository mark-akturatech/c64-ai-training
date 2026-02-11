# PRG Sector Format — Continuation Pointer and Last-Sector Layout

**Summary:** Describes the PRG file sector layout on Commodore DOS disks: non-final sectors use bytes $00–$01 as a forward pointer (next-track/next-sector) with bytes $02–$FF carrying 254 bytes of data; the final sector uses byte $00 = $00 (end marker) and byte $01 to indicate how many bytes of the sector are valid program data.

**Sector Format (Concise)**

- **Non-final sector:**
  - Byte 0 = forward pointer (next-track).
  - Byte 1 = forward pointer (next-sector).
  - Bytes 2–255 = 254 bytes of program data (usable payload).

- **Final sector:**
  - Byte 0 = $00 — signals "last sector" (track 0 is reserved, so DOS treats this as end-of-file).
  - Byte 1 = value indicating the number of valid data bytes in this sector (N).
  - Bytes 2–(N+1) = N bytes of program data.
  - Bytes (N+2)–255 = garbage; must be ignored by the loader.

Additional detail: the first byte is normally the track link; setting it to $00 indicates no next-track (end of file). The second byte then instructs DOS how many bytes of the sector should be read as file data.

## Source Code

```text
Diagram illustrating the final sector layout:

+--------+----------------+----------------------+----------------+
| Byte 0 | Byte 1         | Bytes 2–(N+1)        | Bytes (N+2)–255|
+--------+----------------+----------------------+----------------+
| $00    | N (valid bytes)| N bytes of program   | Garbage        |
+--------+----------------+----------------------+----------------+
```

In this layout:

- Byte 0 = $00 indicates this is the last sector.
- Byte 1 = N specifies the number of valid data bytes in this sector.
- Bytes 2–(N+1) contain the N bytes of program data.
- Bytes (N+2)–255 are unused and should be ignored.

This structure ensures that the loader reads exactly N bytes from the final sector, as specified by Byte 1.

## References

- "Inside Commodore DOS" by Immers and Neufeld, page 53.
- "Commodore 1541 Disk Drive User's Guide"