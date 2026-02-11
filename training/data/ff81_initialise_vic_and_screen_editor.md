# KERNAL $FF81 — Initialise VIC and Screen Editor

**Summary:** KERNAL entry $FF81 initializes the VIC‑II video chip and the ROM screen editor/display subsystem, preparing the video hardware and text-screen state for the system ROM.

**Description**

This routine sets up the 6567 video controller chip in the Commodore 64 for normal operation. The KERNAL screen editor is also initialized. This routine should be called by a Commodore 64 program cartridge. ([scribd.com](https://www.scribd.com/document/218879577/COMMODORE-64-PROGRAMMER-S-REFERENCE-GUIDE?utm_source=openai))

## Source Code

```assembly
; Example of invoking the CINT routine
JSR CINT
JMP RUN ; Begin execution
```

## Key Registers

- **$D000–$D02E**: VIC-II chip registers (graphics, screen control, raster, sprite registers)

## References

- "ffed_return_xy_organization_of_screen" — expands on screen X,Y organization
- "fff3_io_base_address" — expands on memory mapped I/O base for VIC‑II access

## Labels
- CINT
