# UDTIM ($FFEA) — Update Time-of-Day and STOP indicator

**Summary:** Updates the Time-of-Day bytes at $00A0-$00A2 and the STOP key indicator at $0091. KERNAL vector $FFEA (real routine at $F69B). Clobbers/uses A and X registers.

## Description
UDTIM is the KERNAL entry used to update the system Time-of-Day area and the STOP-key state stored in zero page. Callers invoke it via the vector at $FFEA (JSR $FFEA); the actual implementation resides at $F69B. The routine updates the three-byte TOD field at $00A0-$00A2 and the STOP key indicator at $0091. The source specifies that A and X registers are used (assume they may be modified).

No parameter details or return values are given in the source excerpt; consult SETTIM ($FFDB) and RDTIM ($FFDE) for routines that set and read the TOD, and STOP ($FFE1) for STOP-key handling.

## Key Registers
- $00A0-$00A2 - Zero Page - Time-of-Day (3-byte field)
- $0091 - Zero Page - STOP key indicator
- $FFEA - KERNAL - UDTIM vector (real routine at $F69B)

## References
- "settim" — expands on setting TOD (SETTIM $FFDB)
- "rdtim" — expands on reading TOD (RDTIM $FFDE)
- "stop" — STOP key state tracked by UDTIM (STOP $FFE1)

## Labels
- UDTIM
