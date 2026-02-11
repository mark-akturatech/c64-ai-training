# FREETOP & MEMSIZ — BASIC top-of-memory pointers ($33-$34, $37-$38)

**Summary:** FREETOP ($0033-$0034) is the pointer to the bottom of the string text storage area / top of free RAM; MEMSIZ ($0037-$0038) is the pointer to the highest address usable by BASIC (default 40959 / $9FFF). Use POKE/CLR to reserve top RAM for machine code, sprites, or charset data; lower MEMSIZ below $3FFF if you need VIC-II–addressable data without bank switching.

## Description
- FREETOP ($0033-$0034) points to the current end of string text storage (the top of free RAM). Strings are allocated downward from the top of the string area; adding strings lowers FREETOP, and BASIC's garbage collection raises FREETOP when text is freed.
- On power-on FREETOP is initialized to the top of RAM.
- CLR (BASIC's CLEAR command) resets BASIC internal pointers so string text allocation starts below the safe area defined by MEMSIZ (CLR — clear BASIC workspace).
- MEMSIZ ($0037-$0038) holds the highest address BASIC will use. At power-up it is set to the highest byte of consecutive RAM before BASIC ROM (40959 decimal / $9FFF).
- You can lower MEMSIZ to reserve RAM that BASIC will not touch. After changing MEMSIZ, run CLR so FREETOP and other BASIC pointers are adjusted below the new MEMSIZ.
- Common uses for reserved top-RAM: storing machine language programs, sprite bitmaps, alternate character sets.
- VIC-II addressing limitation: the VIC-II (graphics chip) can only access a 16 KB bank. If you keep the default memory bank (addresses $0000–$3FFF), you must lower MEMSIZ below $3FFF (16383 decimal) if you want your sprite/character data to reside inside the VIC-II–addressable range without switching banks.

## Source Code
```text
Register map (reference lines from source):
FREETOP    $33-$34  Pointer to bottom of string text / top of free RAM
MEMSIZ     $37-$38  Pointer to highest address usable by BASIC (power-up = 40959 / $9FFF)

Power-up behavior:
- MEMSIZ initialized by testing RAM up to BASIC ROM; set to highest consecutive RAM byte (40959 / $9FFF).

Example to reserve 1K at top of BASIC:
POKE 56,PEEK(56)-4:CLR
```

## Key Registers
- $0033-$0034 - BASIC workspace - FREETOP: pointer to bottom of string text / top of free RAM
- $0037-$0038 - BASIC workspace - MEMSIZ: pointer to highest address usable by BASIC (power-up = 40959 / $9FFF)

## References
- "strend_array_free_ram" — expands on FREETOP and STREND defining string text and free RAM boundaries; FRE interacts with STREND during garbage collection
- "vartab_variable_storage_pointer_and_variable_format" — expands on CLR resetting variable/string pointers relative to MEMSIZ; freeing/reserving memory affects variable/storage pointers
- "frespc_temporary_string_pointer" — expands on FRESPC used as a working pointer while modifying the string area bounded by FREETOP and MEMSIZ

## Labels
- FREETOP
- MEMSIZ
