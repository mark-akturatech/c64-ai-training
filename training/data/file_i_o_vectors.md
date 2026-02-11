# BASIC I/O and channel vectors ($031A-$032D)

**Summary:** Zero-page KERNAL/BASIC I/O and channel function pointers at $031A-$032D (OPEN, CLOSE, CHKIN, CHKOUT, CLRCHN, CHRIN, CHROUT, STOP, GETIN, CLALL) — these addresses hold jump/vector pointers used by the KERNAL/BASIC I/O layer.

## Overview
This zero-page block ($031A-$032D) contains the KERNAL/BASIC I/O channel vectors — 16-bit pointers (low byte, high byte) to the routines that implement file/device open/close, stream assignment, input/output, stop-key checking, and general input dispatch. BASIC and the KERNAL call these vectors so their low-level implementations may be relocated or patched (e.g., to replace cassette, serial, or custom device handlers).

Listed here are the standard vector names and their usual default targets in the stock C64 KERNAL. The vectors are used as indirect entry points; typical usage is to JSR to the address loaded from the vector (LDA/STA/JSR via the vector). For zero-page file parameter details and channel pointer usage, see "zero_page_datasette_and_file_pointers".

## Source Code
```text
$031A-$031B  OPEN       File open routine          (default: $F34A)
$031C-$031D  CLOSE      File close routine         (default: $F291)
$031E-$031F  CHKIN      Input file definition      (default: $F20E)
$0320-$0321  CHKOUT     Output file definition     (default: $F250)
$0322-$0323  CLRCHN     I/O initialization         (default: $F333)
$0324-$0325  CHRIN      Data input routine         (default: $F157)
$0326-$0327  CHROUT     Data output routine        (default: $F1CA)
$0328-$0329  STOP       Stop key check routine     (default: $F6ED)
$032A-$032B  GETIN      General input routine      (default: $F13E)
$032C-$032D  CLALL      Clear all files routine    (default: $F32F)
```

## Key Registers
- $031A-$032D - Zero page - KERNAL/BASIC I/O and channel vectors (OPEN, CLOSE, CHKIN, CHKOUT, CLRCHN, CHRIN, CHROUT, STOP, GETIN, CLALL)

## References
- "zero_page_datasette_and_file_pointers" — expands on zero-page file parameters and channel pointer usage

## Labels
- OPEN
- CLOSE
- CHKIN
- CHKOUT
- CLRCHN
- CHRIN
- CHROUT
- STOP
- GETIN
- CLALL
