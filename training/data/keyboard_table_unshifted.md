# Keyboard table (unshifted) — KERNAL keyboard decode

**Summary:** Unshifted keyboard decode table used by the KERNAL; the ASCII code for a pressed key is given by the intersection of the row written to $DC00 and the column read from $DC01. Contains the byte matrix of unshifted key codes and a trailing free byte ($FF).

**Description**
This table is one of the KERNAL keyboard decode tables (unshifted). To resolve a key press, the KERNAL writes a row select to $DC00 and reads the column result from $DC01; the ASCII code for the pressed key is located at the intersection of that row and column in this table. The table separates left and right shift keys.

The dumped data follows below (matrix bytes and a trailing free byte). The source text describes this as an "8x9 byte matrix"; however, the dump shows 8 rows of 8 bytes (64 bytes) plus one free byte ($FF). This discrepancy arises because the Commodore 64 keyboard matrix is an 8x8 grid, corresponding to 64 keys. The additional byte ($FF) serves as a filler or free byte, not representing an extra column. Therefore, the correct description is an 8x8 matrix with an additional free byte, not an 8x9 matrix.

## Source Code
```asm
.; EB81: Keyboard 1 - Unshifted (matrix bytes)
.:EB81 14 0D 1D 88 85 86 87 11
.:EB89 33 57 41 34 5A 53 45 01
.:EB91 35 52 44 36 43 46 54 58
.:EB99 37 59 47 38 42 48 55 56
.:EBA1 39 49 4A 30 4D 4B 4F 4E
.:EBA9 2B 50 4C 2D 2E 3A 40 2C
.:EBB1 5C 2A 3B 13 01 3D 5E 2F
.:EBB9 31 5F 04 32 20 02 51 03
.:EBC1 FF                       ; free byte / filler
```

(Each byte is presented in hexadecimal as in the original dump.)

## Key Registers
- $DC00-$DC01 - CIA 1 - Keyboard row select (write $DC00) and column read (read $DC01) used to index this decode table

## References
- "keyboard_select_vectors" — expands on vectors pointing to this table  
- "keyboard_table_shifted" — shifted keyboard decode table (shift states)  
- "keyboard_table_control" — control-key table (Ctrl keys / special functions)