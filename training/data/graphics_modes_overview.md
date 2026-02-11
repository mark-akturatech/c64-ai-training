# VIC-II graphics modes (ECM / BMM / MCM) — overview

**Summary:** Describes the VIC-II graphics sequencer and the 8 graphics modes selected by ECM, BMM, and MCM (registers $D011 / $D016), including sequencer operation (8-bit shift register, reload on g-access, XSCROLL 0–7 pixel delay), display vs idle g-access addressing (character generator vs bitmap vs $3FFF idle), and the ECM effect (A9/A10 forced low).

**Graphics-mode selection and mode names**

The VIC-II selects one of 8 possible graphics modes using the three control bits ECM, BMM, and MCM (Extended Color Mode, Bit Map Mode, Multi Color Mode) located in registers $D011 and $D016. The combinations are as follows:

- **Standard Character Mode (ECM=0, BMM=0, MCM=0):** Standard text mode with single-color characters.
- **Multicolor Character Mode (ECM=0, BMM=0, MCM=1):** Text mode with multicolor characters.
- **Standard Bitmap Mode (ECM=0, BMM=1, MCM=0):** High-resolution bitmap graphics.
- **Multicolor Bitmap Mode (ECM=0, BMM=1, MCM=1):** Multicolor bitmap graphics.
- **Extended Background Color Mode (ECM=1, BMM=0, MCM=0):** Text mode with extended background colors.
- **Invalid Mode 1 (ECM=1, BMM=0, MCM=1):** Produces a black screen.
- **Invalid Mode 2 (ECM=1, BMM=1, MCM=0):** Produces a black screen.
- **Invalid Mode 3 (ECM=1, BMM=1, MCM=1):** Produces a black screen.

The three "invalid" combinations (ECM=1 with BMM and/or MCM set) result in a black screen because the VIC-II does not support these configurations, leading to no visible output. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Graphics_Modes?utm_source=openai))

**Sequencer implementation and pixel timing**

- The core of the video data path is an 8-bit shift register.
- The shift register is shifted by 1 bit every displayed pixel across the display columns.
- The shift register is reloaded with newly fetched graphics data after every g-access.
- XSCROLL (in $D016) delays the reload by 0–7 pixels, effectively shifting the displayed pixels 0–7 pixels to the right. The delay value is applied to the reload of the 8-bit shift register.
- When in idle state, the sequencer does not perform c-accesses; it supplies zero bits for the video matrix data (i.e., the sequencer outputs "0" bits while idle).
- Outside the display column, and when the vertical border flip-flop is set (see VIC-II vertical border flip-flop behavior), the last current background color is shown (normally coincides with the border).

**c-access vs g-access addressing**

- c-accesses (character/color matrix fetches) always follow the same address-generation scheme.
- g-accesses (graphics data fetches used to reload the 8-bit shift register) use one of three address-generator behaviors depending on display state and BMM/ECM:
  - **Display state:** BMM=0 → g-accesses read the character generator (character bitmap) area. BMM=1 → g-accesses read bitmap memory (bitmap mode).
  - **Idle state:** g-accesses always reference $3FFF (unless ECM alters A9/A10 — see below). During idle, the fetched data is not used as normal graphics (sequencer outputs zero bits), but the accesses still occur at fixed addresses.
  - **ECM set:** The address generator forces address lines A9 and A10 low for g-accesses (without further changes to the addressing scheme). Example implication: g-accesses that would have gone to $3FFF while idle instead occur at $39FF when ECM=1 (A9/A10 = 0).

**Mode-level summary**

The 8 modes are covered by combinations of ECM/BMM/MCM and determine:

- Whether g-accesses fetch character-generator or bitmap memory (BMM).
- Whether bitmap/character data are interpreted in single-bit (standard) or 2-bit (multicolor) pixel grouping (MCM).
- Whether ECM forces A9/A10 low, changing the effective g-access addresses and enabling the ECM text interpretation.

The following table summarizes the per-mode explicit address lists and byte-interpretation rules for c- and g-accesses for each of the 8 ECM/BMM/MCM combinations:

| Mode                          | ECM | BMM | MCM | c-access Addressing | c-access Data Interpretation | g-access Addressing | g-access Data Interpretation |
|-------------------------------|-----|-----|-----|---------------------|-----------------------------|---------------------|-----------------------------|
| Standard Character Mode       | 0   | 0   | 0   | Video matrix        | Character pointers          | Character generator | 8 pixels (1 bit/pixel)      |
| Multicolor Character Mode     | 0   | 0   | 1   | Video matrix        | Character pointers          | Character generator | 4 pixels (2 bits/pixel)     |
| Standard Bitmap Mode          | 0   | 1   | 0   | Video matrix        | Color information           | Bitmap memory       | 8 pixels (1 bit/pixel)      |
| Multicolor Bitmap Mode        | 0   | 1   | 1   | Video matrix        | Color information           | Bitmap memory       | 4 pixels (2 bits/pixel)     |
| Extended Background Color Mode| 1   | 0   | 0   | Video matrix        | Character pointers          | Character generator | 8 pixels (1 bit/pixel)      |
| Invalid Mode 1                | 1   | 0   | 1   | Video matrix        | Character pointers          | Character generator | 4 pixels (2 bits/pixel)     |
| Invalid Mode 2                | 1   | 1   | 0   | Video matrix        | Color information           | Bitmap memory       | 8 pixels (1 bit/pixel)      |
| Invalid Mode 3                | 1   | 1   | 1   | Video matrix        | Color information           | Bitmap memory       | 4 pixels (2 bits/pixel)     |

In the invalid modes, the VIC-II generates graphics data internally, but the output is black due to unsupported configurations. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Graphics_Modes?utm_source=openai))

**Notes and caveats**

- Idle-state behavior is special: no c-accesses, sequencer outputs zero bits, g-accesses still happen at fixed addresses.
- Vertical border flip-flop affects what is displayed outside the display column (last background color vs normal border).

## Key Registers

- **$D011 - VIC-II Control Register 1:**
  - **Bit 6 (ECM):** Extended Color Mode.
  - **Bit 5 (BMM):** Bitmap Mode.
  - **Bit 4 (DEN):** Display Enable.
  - **Bit 3 (RSEL):** Row Select.
  - **Bits 2-0 (YSCROLL):** Vertical Fine Scrolling.

- **$D016 - VIC-II Control Register 2:**
  - **Bit 4 (MCM):** Multicolor Mode.
  - **Bit 3 (CSEL):** Column Select.
  - **Bits 2-0 (XSCROLL):** Horizontal Fine Scrolling.

## References

- "standard_text_mode" — expands on ECM/BMM/MCM = 0/0/0 address/data interpretation
- "idle_state_mode_details" — expands on g-access behavior while in idle state

## Labels
- D011
- D016
- ECM
- BMM
- MCM
