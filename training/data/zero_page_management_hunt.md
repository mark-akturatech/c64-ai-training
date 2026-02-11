# Zero-page scarcity and pointer strategies on Commodore (e.g., $00FC-$00FF)

**Summary:** Zero-page ($00-$FF) is scarce on Commodore machines; indexed-indirect addressing (needs two zero-page bytes per pointer) requires finding or creating free zero-page locations such as $00FC-$00FF on the VIC/Commodore 64, using documented "work areas"/utility pointers, or temporarily relocating zero-page contents (avoid interrupt-used bytes).

## Zero-page scarcity and why it matters
Indexed, indirect addressing is the gateway to reaching any 16-bit address from a single instruction, but each indirect pointer consumes two consecutive zero-page bytes (a 16-bit address). Commodore ROMs and system routines reserve much of zero-page, leaving only a few free bytes on stock systems.

On the VIC and Commodore 64, four commonly available zero-page bytes are at $00FC–$00FF — enough to hold two full indirect pointers. If you need more indirect pointers you must find other zero-page slots or temporarily free/relocate existing ones.

## Strategies to obtain indirect pointers
- Find unused zero-page locations documented for the machine (example: $00FC–$00FF on VIC/64). These are the safest immediate slots for temporary pointers.
- Use memory-map "work areas" or "utility pointers" if the platform documentation shows such locations; these are intended for temporary use by programs.
- Temporarily relocate zero-page contents to other RAM and reuse the freed zero-page space, but be careful:
  - Restore original contents before returning to BASIC (or before other code expects them).
  - Do NOT relocate values used by interrupt service routines (screen, keyboard, RS-232, etc.). Interrupts can occur while your machine-language code runs and will read/modify zero-page values; moving or clobbering those will cause unstable behavior.
  - If you must move interrupt-related zero-page values, ensure interrupts are disabled while relocating and restore both data and interrupt state reliably.

## Key Registers
- $00FC-$00FF - Zero Page - four free bytes commonly available on VIC and Commodore 64 (suitable for up to two indirect pointers)

## References
- "indirect_indexed_addressing" — expands on needing two zero-page bytes per indirect pointer and usage details
