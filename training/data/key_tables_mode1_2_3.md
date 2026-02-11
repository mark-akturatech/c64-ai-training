# KERNAL KEYCOD / MODE1-MODE2 Keyboard Tables (KEYTAB mapping)

**Summary:** The `KEYCOD` table at $EB79 is a list of pointers selecting the `MODE1`, `MODE2`, `MODE3`, and `CONTRL` tables. `MODE1` and `MODE2` are byte arrays mapping raw keyboard matrix codes to PETSCII character codes, each terminated by $FF. The dispatch routine copies a selected pointer from `KEYCOD` into `KEYTAB` ($F5/$F6) and then jumps to the `REKEY` routine. The tables include unshifted (`MODE1`) and shifted (`MODE2`) mappings.

**Keyboard Mode Tables**

This disassembly fragment shows the KERNAL keyboard dispatch data and the two mode translation tables present in this chunk:

- **KEYCOD (pointer table):** Contains `.WORD` entries pointing to `MODE1`, `MODE2`, `MODE3`, and `CONTRL`. The running code loads a word from `KEYCOD+1,X` into $F6 and $F5 (`KEYTAB+1`/`KEYTAB`) to select the active key translation table used by the keyboard handler.
- **MODE1:** Unshifted (normal) mapping—a sequence of `.BYT` values mapping raw key codes to PETSCII character codes, terminated with $FF.
- **MODE2:** Shifted mapping—same layout as `MODE1` but with shifted PETSCII codes. Also terminated with $FF.
- **MODE3:** Mapping for keys pressed simultaneously with the Commodore key.
- **CONTRL:** Mapping for keys pressed simultaneously with the Control key.

The code sequence at $EB6F–$EB76 stores the selected table pointer into `KEYTAB` ($F5/$F6), then jumps to `REKEY` ($EAE0). The `SHFOUT` and `REKEY` routines themselves are referenced but not included in this chunk.

The tables map keyboard matrix positions (as produced by the scanning routine) into PETSCII character codes used by later KERNAL input processing. Each `.BYT` value corresponds to a PETSCII code for that key in the given mode; $FF marks the end of the table.

## Labels
- KEYCOD
- KEYTAB
- REKEY
- MODE1
- MODE2
- MODE3
- CONTRL
