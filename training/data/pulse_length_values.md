# Minimal C64 Datasette Loader — pulse length constants

**Summary:** Pulse length constants used by a minimal C64 datasette program loader, given in the loader's measurement units (units of 8 PAL clock cycles): length_short $30, length_medium $42, length_long $56. Searchable terms: datasette, pulse lengths, PAL clock cycles, loader constants.

## Pulse length values
The loader measures pulse durations in units of 8 PAL clock cycles. The constants below are the raw values used by the loader (hex), with their decimal unit counts and the equivalent number of PAL clock cycles.

- length_short  = $30  → 48 units  → 48 × 8 = 384 PAL clock cycles  
- length_medium = $42  → 66 units  → 66 × 8 = 528 PAL clock cycles  
- length_long   = $56  → 86 units  → 86 × 8 = 688 PAL clock cycles  

(Conversion to seconds: divide the PAL clock cycle count by the PAL clock frequency to obtain seconds.)

## Source Code
```text
Pulse lengths in units of 8 PAL clock cycles:

    length_short  = $30
    length_medium = $42
    length_long   = $56
```

## References
- "pulse_thresholds" — expands on thresholds derived from these length values
