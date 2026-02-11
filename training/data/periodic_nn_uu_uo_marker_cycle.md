# Marker cycle interleaved with zero padding (lines 12683–12706)

**Summary:** Block showing the first recurring marker cycle with marker tokens 'nn', 'UU', and 'uo' interspersed with zero padding bytes ('00'); covers lines 12683–12706 and demonstrates periodic embedded marker bytes within a zeroed region.

## Description
This chunk documents a short region (lines 12683–12706) that contains repeated occurrences of marker tokens 'nn', 'UU', and lowercase 'uo' separated by lines of zero padding ('00'). It illustrates the first recurring marker cycle observed after an initial long zero run (see references). The sequence alternates marker lines and 00 padding lines, showing periodic embedded marker bytes within otherwise zeroed space.

Observed tokens (case-sensitive): 
- "nn"
- "UU"
- "uo"
- "00" (zero padding lines)

Pattern: markers appear in small groups with one or more "00" lines between groups; the provided excerpt shows multiple occurrences of 'nn' and 'UU', with 'uo' appearing less frequently.

## Source Code
```text
Lines 12683–12706:

nn 
UU 

uo 

00 

00 

00 

nn 
UU 

00 

00 

00 

nn 

uo 
```

## References
- "long_zero_padding_initial_run" — expands on the contiguous zero block that precedes this marker cycle
- "mixed_marker_block_including_r_star_rfc_anomaly" — expands on the region that follows and contains additional marker variants and anomalies