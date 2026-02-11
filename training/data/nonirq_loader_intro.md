# Analyzing C64 tape loaders — Non-IRQ 'CHR Loader T1-T3' introduction

**Summary:** Introduction to a "non-IRQ" C64 tape loader walkthrough (CHR Loader T1–T3) that requires knowledge of CIA timers and the Commodore 64 Programmer's Reference; references CIA register extracts and CBM header/data block listings.

**Introduction**
This packet documents the scope and prerequisites for a step‑by‑step walkthrough of a "non‑IRQ based" tape loader (CHR Loader T1–T3). "Non‑IRQ" here denotes using polled CIA timers instead of relying on the IRQ vector (polling model).

Prerequisites:
- Solid understanding of CIA timers (Timer A/B operation, control, and interrupts).
- Commodore 64 Programmer's Reference for peripheral, KERNAL and tape I/O conventions.

The original material referenced MAPC6410.TXT (extracts from "Mapping The Commodore 64") for CIA usage; those extracts were reportedly edited and included as Appendix A and B in the source. The loader walkthrough also refers to CBM-format block examples (header and data blocks) used by the non‑IRQ loader.

This chunk is an index/intro only — detailed assembler listings, block examples and full loader core are provided by other files referenced below.

## Key Registers
- $DC00-$DC0F - CIA 1 - Timer A/B low/high, control, interrupt control/status, ports A/B (used for timing/polling)
- $DD00-$DD0F - CIA 2 - Timer A/B low/high, control, interrupt control/status, ports A/B (alternative timing/IO)

## References
- "nonirq_cbm_data_block_listing" — expands on CBM data block example for the non‑IRQ loader
- "nonirq_cbm_header_block_listing" — expands on CBM header block and loader core listing
