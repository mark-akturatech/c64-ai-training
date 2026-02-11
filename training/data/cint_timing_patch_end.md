# End-of-routine patch bytes for 1/60s IRQ ($FF6E)

**Summary:** Patch bytes at address 65390 ($FF6E) appended to the end of the CINT initialization routine to compensate for the routine's increased length and ensure correct PAL/NTSC prescaler selection for the 1/60s IRQ timer setup.

**Description**

This chunk documents a single end-of-routine patch value recorded at decimal 65390 (hex $FF6E). The patch was added because the updated CINT routine grew in size; the extra length would otherwise offset subsequent timer-setup code that selects PAL or NTSC prescaler values. The appended byte(s) at $FF6E restore/adjust the end of the routine so the timer is configured for a one-sixtieth-of-a-second IRQ (1/60s) as intended.

Key points preserved from the source:

- **Location:** decimal 65390 = $FF6E.
- **Purpose:** compensate for extra routine length to keep timer setup and PAL/NTSC prescaler selection correct.
- **Context pointer:** part of the CINT initialization flow that finalizes screen/editor and VIC-II related setup and then chooses prescaler values for the timer.

## Key Registers

- **CIA #1 Timer A Control Register:** $DC0E (56334)
- **CIA #1 Timer A Low Byte:** $DC04 (56324)
- **CIA #1 Timer A High Byte:** $DC05 (56325)

## References

- "cint_initialize_screen_editor_and_vic_ii_chip" — expands/continues the CINT initialization and PAL/NTSC timer setup
