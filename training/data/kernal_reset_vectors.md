# KERNAL RESET VECTORS ($FD30-$FD4E)

**Summary:** Table of default KERNAL vector addresses stored in ROM at $FD30-$FD4E (searchable addresses), which RESTOR copies into RAM vectors at $0314-$0333. Contains interrupt and core I/O vectors (CINV, CBINV, NMINV, IOPEN, ICLOSE, ICHKIN, ICKOUT, ICLRCH, IBASIN, IBSOUT, ISTOP, IGETIN, ICLALL, USRCMD, ILOAD, ISAVE) and their handler addresses.

## KERNAL reset vectors
These ROM locations ($FD30-$FD4E) contain the KERNAL's default vectors. When RESTOR is executed the 16 word vectors here are copied into the RAM vector table at $0314-$0333. Each vector is a two-byte little-endian address pointing to the KERNAL routine used for interrupts and core I/O services.

List of vectors (ROM address -> vector name -> target address):
- $FD30: CINV   VECTOR — hardware interrupt handler -> $EA31
- $FD32: CBINV  VECTOR — software interrupt handler -> $FE66
- $FD34: NMINV  VECTOR — non-maskable interrupt handler -> $FE47
- $FD36: IOPEN  VECTOR — KERNAL open routine -> $F34A
- $FD38: ICLOSE VECTOR — KERNAL close routine -> $F291
- $FD3A: ICHKIN VECTOR — KERNAL CHKIN routine -> $F20E
- $FD3C: ICKOUT VECTOR — KERNAL CHKOUT routine -> $F250
- $FD3E: ICLRCH VECTOR — KERNAL CLRCHN routine -> $F333
- $FD40: IBASIN VECTOR — KERNAL CHRIN routine -> $F157
- $FD42: IBSOUT VECTOR — KERNAL CHROUT routine -> $F1CA
- $FD44: ISTOP  VECTOR — KERNAL STOP routine -> $F6ED
- $FD46: IGETIN VECTOR — KERNAL GETIN routine -> $F13E
- $FD48: ICLALL VECTOR — KERNAL CLALL routine -> $F32F
- $FD4A: USRCMD VECTOR — user-defined (default points to $FE66) -> $FE66
- $FD4C: ILOAD  VECTOR — KERNAL load routine -> $F4A5
- $FD4E: ISAVE  VECTOR — KERNAL save routine -> $F5ED

## Source Code
```asm
.:FD30 31 EA    CINV VECTOR: hardware interrupt ($ea31)
.:FD32 66 FE    CBINV VECTOR: software interrupt ($fe66)
.:FD34 47 FE    NMINV VECTOR: hardware nmi interrupt ($fe47)
.:FD36 4A F3    IOPEN VECTOR: KERNAL open routine ($f34a)
.:FD38 91 F2    ICLOSE VECTOR: KERNAL close routine ($f291)
.:FD3A 0E F2    ICHKIN VECTOR: KERNAL chkin routine ($f20e)
.:FD3C 50 F2    ICKOUT VECTOR: KERNAL chkout routine ($f250)
.:FD3E 33 F3    ICLRCH VECTOR: KERNAL clrchn routine ($f333)
.:FD40 57 F1    IBASIN VECTOR: KERNAL chrin routine ($f157)
.:FD42 CA F1    IBSOUT VECTOR: KERNAL chrout routine ($f1ca)
.:FD44 ED F6    ISTOP VECTOR: KERNAL stop routine ($f6ed)
.:FD46 3E F1    IGETIN VECTOR: KERNAL getin routine ($f13e)
.:FD48 2F F3    ICLALL VECTOR: KERNAL clall routine ($f32f)
.:FD4A 66 FE    USRCMD VECTOR: user defined ($fe66)
.:FD4C A5 F4    ILOAD VECTOR: KERNAL load routine ($f4a5)
.:FD4E ED F5    ISAVE VECTOR: KERNAL save routine ($f5ed)
```

## Key Registers
- $FD30-$FD4E - KERNAL ROM - Reset vector table (copied into $0314-$0333 by RESTOR)

## References
- "vector_kernal_move" — expands on how VECTOR/RESTOR restore these KERNAL vectors

## Labels
- OPEN
- CLOSE
- CHKIN
- CHKOUT
- CHRIN
- CHROUT
- GETIN
- LOAD
