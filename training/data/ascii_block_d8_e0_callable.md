# Continued ASCII/text blocks at D8:, E0:, and E8:

**Summary:** Continued hex-to-ASCII fragments found at offsets D8:, E0:, and E8: showing partial file-name/command text (fragments "BLE  -AS I", "CALL.  .0", "MPUTE. .A") — useful for reconstructing continued record text across blocks.

## Description
This chunk lists three consecutive data-block offsets (D8:, E0:, E8:) and the raw hex bytes found there, with the ASCII/pet-like text fragments as transcribed. The fragments appear to be pieces of words or commands split across records/blocks and therefore should be treated as continued text when reconstructing file names or command strings.

The source contains likely OCR transcription mistakes where the letter "O" was used in place of the digit "0" (see note below). The shown ASCII fragments are reproduced exactly as in the source transcription.

**[Note: Source may contain an error — "EO" and "OD" in the original appear to be OCR substitutions for "E0" and "0D"; this transcription corrects those in the canonical offset labels but preserves the original byte sequences.]**

## Source Code
```text
D8:
42  4C  45  20  C2  41  53  49
(hex) -> (transcribed ASCII fragment)
42='B' 4C='L' 45='E' 20=' ' C2=? 41='A' 53='S' 49='I'
Transcribed ASCII: "BLE  -AS I"

E0:    <- corrected from original "EO" in source
43  0D  41  4C  4C  0D  C3  4F
43='C' 0D=CR 41='A' 4C='L' 4C='L' 0D=CR C3=? 4F='O'
Transcribed ASCII: "CALL.  .0"

E8:
4D  50  55  54  45  0D  CA  41
4D='M' 50='P' 55='U' 54='T' 45='E' 0D=CR CA=? 41='A'
Transcribed ASCII: "MPUTE. .A"
```

## References
- "ascii_block_C8_D0_transport" — expands/continues the ASCII string fragments begun at C8:/D0:
- "ascii_block_F0_F8_trailing" — expands/follows with numeric and trailing filler bytes in F0:/F8: