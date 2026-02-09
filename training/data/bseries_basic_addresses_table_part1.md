# MACHINE - B-Series memory map (B256/B128)

**Summary:** B-series memory map for B256/B128 machines showing 6509 registers ($0000, $0001), bank numbers and hex ranges for BASIC program text, input buffer, variables, arrays, strings and KEY definitions across banks 0–15.

## Overview
This chunk documents where BASIC program text, input buffer, variables, arrays, strings and KEY definitions reside across the B-series banks (B256 and B128 variants where noted). It lists the two 6509 special byte registers at $0000-$0001 (execution and indirection) that control bank selection, and then provides per-bank address ranges and their BASIC-related uses. Bank numbering is the machine's B-series bank numbering; addresses are shown in hex and decimal in the source map.

B256 vs B128 differences called out by the source:
- Bank 2 is used differently on B256 vs B128: on B256 it holds BASIC arrays; on B128 it holds BASIC variables, arrays, strings and KEY definitions.
- Bank 3/4 usage differs on B256 (Bank 3 contains BASIC variables in the high half; Bank 4 holds BASIC strings and KEY definitions).

Do not confuse these bank ranges with VIC/SID/CIA register ranges — these are plain memory-bank address ranges in the B-series machine.

## Bank-specific layout (summary)
- All Banks: $0000-$0001 are the machine's 6509 execution and indirection registers used for bank control.
- Bank 0: marked Unused by the source.
- Bank 1: primary BASIC program text area ($0002-$F000) and input buffer ($FA5E-$FB00).
- Bank 2: on B256 holds BASIC arrays ($0002-$FFFF); on B128 holds BASIC variables, arrays, strings and KEY definitions ($0002-$FFFF).
- Bank 3 (B256): low half $0002-$7FFF unused; high half $8000-$FFFF holds BASIC variables.
- Bank 4 (B256): $0002-$FBFF holds BASIC strings (allocated top-down), $FC00-$FCFF unused (noted “descriptors?”), and $FD00-$FFFF holds current KEY definitions.
- Banks 5–14: unused.
- Bank 15: small fixed locations — $0002-$0004 USR jump vector, $0005-$0008 TI$ output elements (Hours, Mins, Secs, Tenths).

For exact hex/decimal listings see the Source Code section below.

## Source Code
```text
Hex         Decimal       Description
-------------------------------------------------------------------

-All Banks:
0000            0         6509 execution register
0001            1         6509 indirection register

-Bank 0:  Unused

-Bank 1:
0002-F000       2-61439   BASIC program (text) RAM
FA5E-FB00   61440-64512   Input buffer area

-B256 Bank 2:
0002-FFFF       2-65535   BASIC arrays in RAM

-B128 Bank 2:
0002-FFFF       2-65535   BASIC variables, arrays and strings;
                          KEY definitions

-B256 Bank 3:
0002-7FFF       2-32767   Unused RAM
8000-FFFF   32768-65535   BASIC variables in RAM

-B256 Bank 4:
0002-FBFF       2-64511   BASIC strings (top down) in RAM
FC00-FCFF   64512-64767   Unused RAM (descriptors?)
FD00-FFFF   64768-65535   Current KEY definitions

-Banks 5 to 14:  Unused.

-Bank 15:
0002-0004       2-4       USR jump
0005-0008       5-8       TI$ output elements:  Hours, Mins, Secs, Tenths

---
Additional information can be found by searching:
- "bseries_memory_map_banks_overview" which expands on full B-series memory map and vectors (continued)
```

## Key Registers
- $0000-$0001 - 6509/Memory - 6509 execution register and 6509 indirection register (bank control)
- $0002-$F000 - Bank 1 - BASIC program (text) RAM (primary program area)
- $FA5E-$FB00 - Bank 1 - Input buffer area
- $0002-$FFFF - Bank 2 - B256: BASIC arrays in RAM; B128: BASIC variables, arrays, strings and KEY definitions
- $0002-$7FFF - Bank 3 (B256) - Unused RAM (low half)
- $8000-$FFFF - Bank 3 (B256) - BASIC variables in RAM (high half)
- $0002-$FBFF - Bank 4 (B256) - BASIC strings (top-down) in RAM
- $FC00-$FCFF - Bank 4 (B256) - Unused RAM (descriptors?)
- $FD00-$FFFF - Bank 4 (B256) - Current KEY definitions
- $0002-$0004 - Bank 15 - USR jump
- $0005-$0008 - Bank 15 - TI$ output elements (Hours, Mins, Secs, Tenths)
- Banks $0005-$000E (Banks 5–14) - Unused

## References
- "bseries_memory_map_banks_overview" — expands on full B-series memory map and vectors (continued)