# Repeated-token patterns — track filler/marker region

**Summary:** This section provides a raw dump of repeated-token patterns (e.g., nn, UU, riri, ou, nri) observed in a track's filler/marker region. These patterns alternate in clusters and are occasionally interspersed with '00' bytes. The block precedes the terminal zero padding that concludes the track (refer to the "trailing_zero_padding" section).

**Pattern description**

This chunk presents a verbatim dump of repeated marker/filler tokens used in a track region. Observed characteristics include:

- **Common tokens:** nn, UU, riri, ou, nri. Also present are Ari, KJKJ, iiri, firi, and mixed-case variants (OU, UU, Ari).
- **'00' tokens:** These act as separators or short runs of zero bytes interleaved with the patterns.
- **Alternating sequences:** Patterns exhibit alternating sequences (e.g., nn / UU / riri clusters) and multi-instance tokens (e.g., KJKJ).
- **Mixed-case tokens and non-alphanumeric characters:** Some tokens contain mixed-case letters and non-alphanumeric characters, which may be artifacts from optical character recognition (OCR) errors.
- **Terminal zero padding:** This block precedes an extended run of '00' bytes that terminates the track (see the "trailing_zero_padding" section for details).

The exact byte encodings corresponding to these tokens are not provided in the source.

## Source Code

```text
nn 
00 

UU 

riri 

UU 

00 

nn 
00 

00 

ou 

riri 

nri 

nn 

UU 

UU 

riri 

riri 

nn 

riri 
00 

00 

riri 
ou 

Ari 

nn 
riri 

KJKJ 

firi 

riri 

nri 

nn 

iiri 

nn 

nn 

ou 

riri 
00 

nn 

nn 

OU 

UU 

nri 
00 

nn 
00 

nn 
00 

UU 

riri 

UU 

riri 
ou 

nn 

nn 
ou 
```

## References

- "repeated_token_patterns_region1" — expands on previous repeated-token region
- "trailing_zero_padding" — details the extended run of '00' bytes that conclude the track