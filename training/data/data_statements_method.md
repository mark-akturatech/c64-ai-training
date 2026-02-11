# Enter machine code via BASIC DATA / READ / POKE

**Summary:** Enter machine code bytes using BASIC DATA statements, READ them into a variable and POKE into RAM (uses RESTORE, READ, POKE). Simple and portable method (BASIC), but memory‑hungry and slow — suitable only for small routines. Example writes bytes to address 12*4096 + X (page 12 = $C000).

## Method
Put the machine‑code bytes as comma‑separated values in DATA lines. Use RESTORE to reset the DATA pointer, then a FOR/READ/POKE loop to transfer each byte into memory. Address arithmetic is done in BASIC (e.g. page*4096 + offset) — on the C64 page 12*4096 = 49152 ($C000). This technique requires BASIC program space to hold all DATA statements and is much slower than loading a block file or using direct memory loaders; it is therefore suited to small routines only.

Typical steps:
- Add one or more DATA lines with the machine code bytes (decimal values 0–255).
- Use RESTORE (optional if DATA pointer is already at the start) to point READ to the first DATA item.
- Loop with FOR ... READ var: POKE address, var: NEXT to write each byte.
- Compute addresses in BASIC (e.g. POKE page*4096 + offset, byte).

## Source Code
```basic
10 RESTORE: FOR X = 1 TO 9: READ A: POKE 12*4096 + X, A: NEXT
1000 DATA 161,1,204,204,204,204,204,204,96
```

## References
- "where_to_put_ml_routines" — Choose memory area to POKE in when using DATA method