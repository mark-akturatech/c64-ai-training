# MACHINE - B-Series Tri Port Adapter 6525 (Tri Port 2) register usage ($DF00-$DF07)

**Summary:** Register map for B-Series 6525 Tri Port 2 adapter at $DF00-$DF07: keyboard matrix input ($DF00), select lines ($DF01), CRT mode and keyboard-read control ($DF02), and data-direction registers for those ports ($DF03-$DF05). Includes decimal addresses (57088–57094) and note of unused register(s).

**Overview**
This chunk documents the B-Series "Tri Port 2" 6525 mapping as provided: three functional ports (keyboard, select, CRT/keyboard-read) and three corresponding data-direction registers. The source gives only port-level assignments (which port is used for what) and absolute addresses; it does not include bit-level assignments inside each port, signal polarities, or timing.

- $DF00 — Keyboard (port data)
- $DF01 — Select (row/column selection lines)
- $DF02 — CRT Mode + Keyboard Read control
- $DF03 — Data Direction Register for $DF00 (program as outputs where needed)
- $DF04 — Data Direction Register for $DF01 (program as outputs where needed)
- $DF05 — Data Direction Register for $DF02 (program as inputs where needed)
- $DF06 — Unused
- $DF07 — (address in the stated range $DF00-$DF07 but no mapping provided in source)

Use these ports when interfacing the B-Series keyboard matrix and CRT mode control. Because the source is a high-level mapping, consult hardware schematics or the companion "bseries_6525_triport1" chunk for interrupt and other tri-port mappings.

## Source Code
```text
B-Series 6525 Tri Port 2
------------------------

      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF00 |                           Keyboard                            | 57088
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF01 |                            Select                             | 57089
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF02 |   CRT Mode    |                 Keyboard Read                 | 57090
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF03 |            Data Direction Register for $DF00 (out)            | 57091
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF04 |            Data Direction Register for $DF01 (out)            | 57092
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF05 |            Data Direction Register for $DF02 (in)             | 57093
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DF06 |                            Unused                             | 57094
      +-------+-------+-------+-------+-------+-------+-------+-------+
```

## References
- "bseries_6525_triport1" — other tri port mapping and interrupt registers

## Labels
- KEYBOARD
- SELECT
- CRT_MODE
- DATA_DIR_DF00
- DATA_DIR_DF01
- DATA_DIR_DF02
