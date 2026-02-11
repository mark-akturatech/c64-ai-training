# Kernal I/O Vectors ($031A-$0327)

**Summary:** Contains the Commodore 64 Kernal I/O vector table at $031A-$0327 — IOPEN, ICLOSE, ICHKIN, ICKOUT, ICLRCH, IBASIN, IBSOUT — each a 16-bit pointer to a Kernal ROM I/O routine (16-bit little-endian pointer).

## Overview
These RAM locations form the Kernal's indirection table for basic I/O operations. Each entry is a two-byte pointer (low byte first) that points into the Kernal ROM routine implementing the named I/O service. Programs or device drivers can patch these vectors to redirect I/O behavior; the Kernal and software call these vectors rather than hardcoding ROM addresses.

Listed vectors and their current (default) targets as provided:
- $031A-$031B — IOPEN — Vector to Kernal OPEN routine (currently points to 62282 / $F34A)
- $031C-$031D — ICLOSE — Vector to Kernal CLOSE routine (currently points to 62097 / $F291)
- $031E-$031F — ICHKIN — Vector to Kernal CHKIN routine (currently points to 61966 / $F20E)
- $0320-$0321 — ICKOUT — Vector to Kernal CKOUT routine (currently points to 62032 / $F250)
- $0322-$0323 — ICLRCH — Vector to Kernal CLRCHN routine (currently points to 62259 / $F333)
- $0324-$0325 — IBASIN — Vector to Kernal CHRIN routine (currently points to 61783 / $F157)
- $0326-$0327 — IBSOUT — Vector to Kernal CHROUT routine (currently points to 61898 / $F1CA)

Common usage: Kernal callers perform indirect jumps/calls through these addresses so the actual ROM routine can be overridden by writing new low/high bytes into the pair.

## Source Code
```text
Kernal I/O vector table (RAM) — addresses and default targets:

Address    Label   Description                       Default target (decimal / hex)
$031A-$031B  IOPEN   Vector to Kernal OPEN routine   62282 / $F34A
$031C-$031D  ICLOSE  Vector to Kernal CLOSE routine  62097 / $F291
$031E-$031F  ICHKIN  Vector to Kernal CHKIN routine  61966 / $F20E
$0320-$0321  ICKOUT  Vector to Kernal CKOUT routine  62032 / $F250
$0322-$0323  ICLRCH  Vector to Kernal CLRCHN routine 62259 / $F333
$0324-$0325  IBASIN  Vector to Kernal CHRIN routine  61783 / $F157
$0326-$0327  IBSOUT  Vector to Kernal CHROUT routine 61898 / $F1CA

Notes:
- Each vector is stored low byte then high byte (little-endian).
- Targets are Kernal ROM addresses (typically in the $F000–$FFFF range).
```

## Key Registers
- $031A-$0327 - RAM - Kernal I/O vector table: IOPEN, ICLOSE, ICHKIN, ICKOUT, ICLRCH, IBASIN, IBSOUT (16-bit pointers to Kernal ROM routines)

## References
- "kernal_indirect_vectors_overview" — expands on how these I/O vectors fit into the Kernal jump table

## Labels
- IOPEN
- ICLOSE
- ICHKIN
- ICKOUT
- ICLRCH
- IBASIN
- IBSOUT
