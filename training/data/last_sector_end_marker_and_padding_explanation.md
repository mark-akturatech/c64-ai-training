# Sector interpretation — end-of-chain, byte count $86 (134), padding with DISK BONUS PACK fragment

**Summary:** This describes a single 256-byte disk sector where byte $00 = $00 marks end-of-chain (no forward track), byte $01 = $86 (decimal 134) is the byte count N (so byte number 134 is the last valid data byte), the C64 status variable ST is set to 64 after that byte is read, and bytes $87–$FF are padding containing remnants of the C-64 DISK BONUS PACK directory (example ASCII fragment "N64.V1").

**End-of-chain marker and byte count**
- Byte $00 = $00 — no forward track; this sector is the last sector in the file chain.
- Byte $01 = $86 (decimal 134) — the byte count N for this final sector. Valid data bytes run from byte $02 through byte $86 (inclusive), making byte $86 the last valid data byte for the file stored in this sector.
- Any bytes after the count (from $87 through $FF) are padding and not part of the file data.

**Effect on C64 file-status (ST)**
- According to the source, the C64-side status variable ST will be set to 64 after byte 134 has been read. This status is set by the KERNAL routine `READST` located at $FFB7, which reads the I/O status word at memory location $90. Bit 6 of this status word is set to indicate the end-of-file condition. ([cx16.dk](https://cx16.dk/c64-kernal-routines/readst.html?utm_source=openai))

**Padding and directory remnants**
- The remainder of the sector ($87–$FF) is padding. In this instance, the padding contains recognizable text fragments taken from the C-64 DISK BONUS PACK directory rather than zeros or a fixed filler pattern.
- An example ASCII fragment found inside the padding is: "N64.V1" (hex bytes 4E 36 34 2E 56 31) followed by $0D (carriage return) and an unknown byte.
- Padding must not be treated as file data since the byte count ($86) defines the valid file length in this sector.

## Source Code
```text
; Full hex/ASCII dump of the entire sector (256 bytes total)
; Offset $00: sector-forward-track, byte-count, then data...
$00: 00 86  <bytes $02-$7F not shown here>   ; $00 = $00 => no forward track; $01 = $86 => 134 data bytes

; At offset $80 (decimal 128) a printable fragment appears (part of padding)
$80: 4E 36 34 2E 56 31 0D 20    ; ASCII: "N64.V1"  $0D = CR, $20 = space

; Padding range (not part of file):
$87-$FF: padded (contains fragments from C-64 DISK BONUS PACK directory)
```

## References
- "track_17_sector_11_hex_ascii_dump" — full hex/ASCII dump of the sector being interpreted (expands on the bytes discussed above)
- KERNAL routine `READST` documentation ([cx16.dk](https://cx16.dk/c64-kernal-routines/readst.html?utm_source=openai))

## Labels
- READST
- ST
