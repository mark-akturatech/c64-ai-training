# NMOS 6510 — Change note (V0.92, 2017-12-24)

**Summary:** Change-log entry for the NMOS 6510 document (V0.92, 24-Dec-2017) mentioning unusual mnemonics used by the Ataricentric MAD-Assembler, a typography recommendation (use Andale Mono, not Arial Mono), formatting fixes, and a corrected description of the page-crossing anomaly for the "unstable address high byte" group.

**Change Log**
This chunk records editorial and errata changes applied to the NMOS 6510 document in revision V0.92 (2017-12-24):

- Added documentation for a couple of unusual mnemonics used by the Ataricentric MAD-Assembler:
  - **SHX (Store X Register ANDed with High Byte of Address Plus One):** Stores the X register value ANDed with the high byte of the target address plus one.
  - **SHY (Store Y Register ANDed with High Byte of Address Plus One):** Stores the Y register value ANDed with the high byte of the target address plus one.
  
  *Usage Example:*
  *Note:* These instructions can exhibit unstable behavior, especially when the target address crosses a page boundary. ([codebase64.net](https://www.codebase64.net/doku.php?id=base%3Ause_shy_as_sty_x_or_shx_as_stx_y&utm_source=openai))

- Typography recommendation: prefer "Andale Mono" over "Arial Mono" to avoid broken ligatures in assembler listings.
- Several formatting fixes throughout the document.
- Fixed the description of the page-crossing anomaly affecting the "unstable address high byte" group:
  - **Page-Crossing Anomaly:** When the target address crosses a page boundary due to indexing, the instruction may not store at the intended address. Instead, the high byte of the target address may be altered to the value being stored. To mitigate this, ensure that indexing does not cause the target address to cross page boundaries. ([codebase64.net](https://www.codebase64.net/doku.php?id=base%3Ause_shy_as_sty_x_or_shx_as_stx_y&utm_source=openai))

## Source Code

  ```assembly
  LDX #$01
  SHX $0EFF,Y  ; Stores X ANDed with high byte of $0EFF + 1
  ```

This chunk contains no assembly listings, register maps, or code samples.

## References
- "history_2018_v0_93" — expands on chronological revision history (2018)
- "history_2016_v0_91" — expands on chronological revision history (2016)

## Mnemonics
- SHX
- SHY
