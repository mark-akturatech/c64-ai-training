# ASCII-text region C8–D0: fragments "ITING" and "ANSPORTA"

**Summary:** Sector/file offsets C8–D0 contain ASCII hex bytes (0x49,0x54,0x49,0x4E,0x47,0x20,0xD4,0x52,0x41...) that map to the text fragments "ITING" and "ANSPORTA" with a non-ASCII byte (0xD4) interrupting the string; layout shows how a larger text string is split across these offsets (continuation marked by "do:").

## Byte layout and interpretation
The dump shows eight bytes at C8: followed by eight bytes at the labeled continuation "do:". The values map to ASCII letters except for 0xD4, which is non-printable in a plain ASCII dump (displayed as '.' in the original). Joining the readable bytes in order produces the fragment sequence:

- C8: 49 54 49 4E 47 20 D4 52  → "ITING␠.<non-ASCII>R" (0x20 = space, 0xD4 = non-ASCII)
- do: 41 4E 53 50 4F 52 54 41 → "ANSPORTA"

Taken together across the boundary this yields: "ITING␠<0xD4>RANSPORTA" — a clear split of a longer word(s) where a non-ASCII byte occurs between the fragments. The dump's "do:" label denotes the following block/continuation in the source.

## Source Code
```text
C8:
49  54  49  4E  47  20  D4  52
I   T   I   N   G  ␠  D4  R
(original dump shows: "ITING  .R")

do:
41  4E  53  50  4F  52  54  41
A   N   S   P   O   R   T   A
(shows: "ANSPORTA")
```

## References
- "sector_offset_C0_and_transition_to_text" — expands on preceding transition bytes into ASCII text  
- "ascii_block_D8_E0_callable" — continues ASCII content into D8:/E0: regions (file/record name fragments)
