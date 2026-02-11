# VARTAB ($2D-$2E) — Pointer to BASIC Variable Storage Area

**Summary:** VARTAB at $2D-$2E is a two‑byte pointer (low byte then high byte) to the start of the non‑array BASIC variable storage area; variables use 7‑byte descriptors (name bytes with high‑bit type flags, plus 5 bytes whose layout depends on type: floating point, integer, string, FN). Covers descriptor layout, type bit patterns, variable creation/search order, array interaction, pointer reset behavior (CLR/NEW/RUN/LOAD), program chaining caveats, and SAVE behavior.

## Description

- Purpose: VARTAB ($2D-$2E) points to the address immediately after the BASIC program text — the start of the nonarray variable descriptor area. This is the base where BASIC stores all nonarray variables and string descriptors (the actual string text may be stored in program text or in the string text area pointed to by location $33).

- Pointer format: two bytes at $2D (low) and $2E (high) forming a 16‑bit address (little‑endian) that marks the first byte of the variable descriptor area. SAVE uses this pointer as the address of the byte after the last byte to SAVE.

- Descriptor size and order: each nonarray variable occupies a fixed 7‑byte descriptor. Descriptors are appended in the variable area in the order variables are created. BASIC searches for variables starting at the beginning of this area (i.e., earlier‑created variables are found first).

- Name bytes and type flags:
  - Bytes 1–2: ASCII of the first two letters of the variable name. If the variable name is a single letter, the second byte is zero.
  - The high bit (bit7, value 128) of these name bytes encodes the variable type:
    - neither byte high bit set: floating point variable
    - first byte high bit set only: string variable
    - second byte high bit set only: defined function (FN)
    - both bytes high bit set: integer variable

- Per‑type layout of the remaining five bytes (bytes 3–7):
  - Floating point variable:
    - Bytes 3–7: 5‑byte floating point value (BASIC FP format)
  - Integer variable:
    - Bytes 3–4: 2‑byte integer value, high byte first (big‑endian within the descriptor)
    - Bytes 5–7: unused
  - String variable:
    - Byte 3: length byte
    - Bytes 4–5: 16‑bit pointer to the actual string text (address can be inside program text or in the string text area pointed at by $33)
    - Bytes 6–7: unused
  - Defined function (FN):
    - Bytes 3–4: 16‑bit pointer to the function definition start in BASIC program text
    - Bytes 5–6: 16‑bit pointer to the dependent variable (e.g., the X of FN A(X))
    - Byte 7: unused

- Behavior and implications:
  - Creation/search performance: Because variables are stored in creation order and searches start at the area beginning, frequently referenced variables should be defined early for faster lookups.
  - Persistence during execution: Once created, variables persist for the duration of the program run; unused variables still occupy space and slow searches.
  - Arrays interaction: Arrays are stored in a separate area whose base starts at the end of the nonarray variable area. When a new nonarray variable is created, arrays are moved upward by 7 bytes to make room. Therefore, defining nonarray variables after arrays causes expensive memory moves — avoid creating many nonarray variables after arrays for performance.
  - Pointer resets: VARTAB is reset to one byte past the end of BASIC program text when CLR, NEW, RUN, or LOAD are executed; editing BASIC text (adding/modifying lines) has the same effect because program text relocation can overwrite the variable area.
  - Exception — LOAD from a program (chaining): If LOAD is issued from within a running program, BASIC intentionally does not reset VARTAB so a loaded program can be chained and share variables with the loader. Caveats:
    - Some string descriptors and FN descriptors contain pointers into the program text; loading a new program replaces that text and invalidates those pointers, causing errors if referenced.
    - If the newly loaded program text is larger than the previous, it can overwrite variable descriptors and values.
    - This chaining behavior is a compatibility holdover; with the C64's memory size, chaining is generally unnecessary.
  - SAVE behavior: The VARTAB pointer marks the first free byte after the last byte to be saved — used by SAVE to determine how much to write.

## Source Code
```text
Register
$2D-$2E: VARTAB - 2-byte pointer (low byte, high byte) to start of BASIC nonarray variable descriptor area

Variable descriptor (7 bytes total)
Byte 1: name letter 1 (ASCII). Bit7=type flag.
Byte 2: name letter 2 (ASCII) or 0 if single-letter. Bit7=type flag.

Type flags (bit7 of name bytes)
  - 0/0 : floating point variable
  - 1/0 : string variable       (bit7 set in byte1 only)
  - 0/1 : FN (defined function) (bit7 set in byte2 only)
  - 1/1 : integer variable      (bit7 set in both bytes)

Bytes 3-7 layout by type:

Floating point variable (type = FP)
  Byte 3-7: 5-byte FP value (BASIC floating point format)

Integer variable (type = integer)
  Byte 3: high byte of 16-bit integer value
  Byte 4: low  byte of 16-bit integer value
  Bytes 5-7: unused

String variable (type = string)
  Byte 3: length (N)
  Byte 4: pointer low  (to string text)
  Byte 5: pointer high (to string text)
  Byte 6-7: unused
  Note: string text may reside in program text or in the string text area pointed to by $33.

FN (defined function) variable (type = FN)
  Byte 3: pointer low  (to FN definition in program text)
  Byte 4: pointer high
  Byte 5: pointer low  (to dependent variable descriptor)
  Byte 6: pointer high
  Byte 7: unused

Notes:
- Each nonarray variable consumes 7 bytes; arrays live in a separate area immediately after the nonarray variable area and are relocated if nonarray area grows.
- SAVE uses VARTAB as the address of the first byte after the last byte to be saved.
```

## Key Registers
- $2D-$2E - BASIC - VARTAB pointer to start of the nonarray BASIC variable storage area (2-byte pointer, low/high)
- $33 - BASIC - pointer to string text storage area (referenced for actual string text addresses)

## References
- "array_storage_arytab" — expands on array storage area start and how arrays move when nonarray variables are added
- "strend_array_free_ram" — defines the boundary between array storage and free RAM; variable creation moves this pointer
- "memsiz_top_basic_memory" — expands on CLR resets pointers relative to MEMSIZ; SAVE/LOAD interactions

## Labels
- VARTAB
