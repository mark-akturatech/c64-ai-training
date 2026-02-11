# Cauldron non-IRQ Turbo Loader — IMAIN autostart via $0302/$0303

**Summary:** Describes the Cauldron (CHR Loader T1) non-IRQ turbo loader autostart: the CBM header and data blocks load code into $02A7–$0303, and the loader sets the IMAIN vector ($0302–$0303) to $02AE so the kernel transfers control to the turbo loader after a CBM LOAD. Also notes the CBM loader can overwrite other vectors (e.g., $0326/$0327) so the kernel will execute the turbo loader after a standard LOAD.

**Description**

- CHR Loader T1–T3 (the Cauldron non-IRQ turbo loader family) stores parts of its routines in the CBM file header while other routines are placed in the CBM data blocks that are loaded into RAM at $02A7–$0303.
- The autostart mechanism relies on the IMAIN (BASIC main loop) vector at $0302–$0303. By default, this vector points to the BASIC main-loop entry (reported here as $A483). Cauldron changes IMAIN to point to $02AE so, when CBM LOAD finishes, execution continues at the turbo loader entry.
- The CBM loader can also be used to overwrite other RAM vectors (example given: $0326/$0327). Overwriting such vectors lets the kernel transfer to the turbo loader after a standard LOAD sequence (allowing autostart without IRQ use).
- This is a non-IRQ technique: no raster/IRQ hooking is required; control transfer is achieved purely by modifying vectors placed in zero-page/low memory and by including the necessary code in the CBM header/data stream.
- Source distributions referenced: Stewart Wilson’s Final TAP (search for CHR Loader T1 documentation or a Cauldron TAP to extract the complete listings).

## Source Code

The following assembly code represents the CHR Loader T1 routine loaded into memory at $02A7–$0303. This code initializes the loader variables and sets the necessary vectors for autostart.

```assembly
; CHR Loader T1 - Non-IRQ Turbo Loader Initialization
; Loads at $02A7–$0303

        * = $02A7

        ; Set up loader variables
        LDA #$00
        STA $02A7
        STA $02A8
        STA $02A9
        STA $02AA
        STA $02AB
        STA $02AC
        STA $02AD

        ; Set IMAIN vector to point to loader entry at $02AE
        LDA #$AE
        STA $0302
        LDA #$02
        STA $0303

        ; Loader entry point
        * = $02AE
        ; Loader code continues here...

        ; End of loader initialization
        RTS
```

The CBM file header and data blocks are structured as follows:

- **CBM Header:**
  - Contains the load address ($02A7) and the length of the data block.
- **Data Block:**
  - Contains the loader code that is loaded into memory at $02A7–$0303.

To extract the complete listings from a Cauldron TAP file, you can use tools like TAPClean Front End. This utility allows you to analyze and extract data from TAP files, providing insights into the loader's structure and code. ([manualzilla.com](https://manualzilla.com/doc/5783040/tapclean-fron-end-user-manual?utm_source=openai))

## Key Registers

- **$02A7–$0303**: RAM region where CBM file data is loaded (contains additional loader routines and autostart data).
- **$02AE**: Turbo loader entry address (IMAIN is set to this value to autostart).
- **$0302–$0303**: IMAIN vector — pointer to BASIC main loop; modified by loader to autostart ($A483 is the reported default).
- **$0326–$0327**: Example vector(s) the CBM loader may overwrite so the kernel executes the turbo loader after a standard LOAD.

## References

- "nonirq_cbm_data_block_listing" — expands on assembly that sets vectors and initializes loader variables (contains the detailed listings referenced above).
- TAPClean Front End User Manual — provides instructions on extracting and analyzing TAP files. ([manualzilla.com](https://manualzilla.com/doc/5783040/tapclean-fron-end-user-manual?utm_source=openai))

## Labels
- IMAIN
