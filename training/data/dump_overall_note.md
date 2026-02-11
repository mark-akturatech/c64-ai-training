# Concluding note — side-sector #0 raw dump

**Summary:** Single-line concluding note for a side-sector #0 raw dump that highlights the initial 16 bytes as the most relevant data; references pointer-list expansions "label_80_pointers" and "label_f8_pointers".

**Description**
This chunk is a short concluding remark emphasizing that the first 16 bytes of the side-sector #0 raw dump are of primary interest for analysis. It is a single-line instruction intended to direct the reader to inspect those initial bytes first. The chunk also points to two separate pointer-list expansions for additional context: one at the start of the pointer listing (80:) and one at the end (F8:).

## Source Code
```text
; Side-sector #0 raw dump (first 16 bytes)
; Track/Sector pointers and side-sector number
00: 12 04 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

```text
; label_80_pointers
; Pointer list starting at offset 80
80: 12 04 00 00 00 00 00 00 00 00 00 00 00 00 00 00
90: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
A0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
B0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
C0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
D0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
E0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
F0: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```

```text
; label_f8_pointers
; Pointer list starting at offset F8
F8: 00 00 00 00 00 00 00 00
```

## References
- "label_80_pointers" — expands on start of the pointer listing (80:)
- "label_f8_pointers" — expands on end of the pointer listing (F8:)