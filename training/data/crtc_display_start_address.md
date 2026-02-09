# CRTC R12 (Display Start Address High) & R13 (Display Start Address Low)

**Summary:** R12 and R13 form the CRTC/6545 14-bit Display Start Address (start-of-display character pointer). Together, they point to the first character cell shown at the upper-left of the visible display; R12 holds the high-order bits, and R13 the low-order bits of that 14-bit address.

**Display Start Address (R12 / R13)**

These two CRTC registers form a single 14-bit register that selects the character address of the first displayed character (the upper-left character cell) in the display memory. The value is interpreted as a character-cell address (not a raster-line byte offset): the CRTC uses this start address when scanning out character rows to generate the visible display.

- The combined 14-bit value is: (R12 << 8) | R13, where R12 supplies the high-order bits and R13 supplies the low-order 8 bits.
- Changing these registers changes which portion of video memory is mapped to the top-left of the screen; writes while the CRTC is active can cause an immediate visible shift of the displayed contents.
- This address is a character address (index into character memory); how this maps to physical RAM bytes depends on the system's character/memory layout (character generator indexing, interleaving, or bytes-per-character-row used by the host system).

**Bit Allocation within R12:**

- **Bit 7:** Unused
- **Bits 6-0:** Bits 13-7 of the 14-bit Display Start Address

**Bit Allocation within R13:**

- **Bits 7-0:** Bits 6-0 of the 14-bit Display Start Address

**Examples and Timing Considerations:**

- **Horizontal Scrolling:** Incrementing the Display Start Address by 1 shifts the display content to the left by one character position. Decrementing shifts it to the right.
- **Vertical Scrolling:** Incrementing the Display Start Address by the number of characters per row (as defined in R1) shifts the display content up by one row. Decrementing shifts it down.
- **Mid-Frame Updates:** Changing R12/R13 during active display can cause visible artifacts or tearing, as the display memory address changes mid-frame. To avoid this, updates should be synchronized with the vertical retrace period.

**Register Map Entries:**

- **R12 (Display Start Address High):**
  - **Bit 7:** Unused
  - **Bits 6-0:** Bits 13-7 of the Display Start Address

- **R13 (Display Start Address Low):**
  - **Bits 7-0:** Bits 6-0 of the Display Start Address

## Source Code

```text
Register 12 (Display Start Address High)
Bit 7   | Bit 6 | Bit 5 | Bit 4 | Bit 3 | Bit 2 | Bit 1 | Bit 0
--------|-------|-------|-------|-------|-------|-------|-------
Unused  | 13    | 12    | 11    | 10    | 9     | 8     | 7

Register 13 (Display Start Address Low)
Bit 7   | Bit 6 | Bit 5 | Bit 4 | Bit 3 | Bit 2 | Bit 1 | Bit 0
--------|-------|-------|-------|-------|-------|-------|-------
6       | 5     | 4     | 3     | 2     | 1     | 0     | 0
```

## References

- "6545_crtc_concept_and_register_map" — expanded CRTC register set and detailed mapping for R12/R13
- MOS Technology 6545-1 CRT Controller Datasheet
- Motorola MC6845 CRT Controller Datasheet