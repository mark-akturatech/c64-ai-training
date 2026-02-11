# Koala Pad picture: loading, relocating and displaying (DISPLAY PIC / MVIT)

**Summary:** This document details the process of loading, relocating, and displaying Koala Pad graphics on the Commodore 64. It includes the DISPLAY PIC program, which loads the MVIT machine-language routine to display a Koala-format picture until the SHIFT key is pressed.

**Procedure and behavior**

- **File Structure:** Koala Pad disk files store bitmap and color data in locations optimized for minimal file size, which may not be ideal for runtime placement. Therefore, it's necessary to relocate the graphics and color data to convenient addresses, preferably on page boundaries, before using them in a program.

- **Memory Relocation:** Move the color memory areas to the beginning of a page boundary to facilitate easier and faster manipulation. The background color can be stored at any convenient location in your data.

- **Display Settings:** Koala files utilize multicolor bitmapped mode. Ensure the VIC-II multicolor bit is set before displaying the picture. Note that the Koala file does not store the border color; set it explicitly to the desired value (DISPLAY PIC sets it to black).

- **DISPLAY PIC Program:** This program performs the following steps:
  - Loads the MVIT machine-language routine.
  - Relocates and places the picture data appropriately.
  - Sets the border color to black.
  - Displays the picture until the SHIFT key is pressed.
  - Prompts for the picture filename upon execution; the filename must have been previously converted using the KO-COM utility.

- **Execution Steps:** From the BASIC prompt, execute the following commands:
  - `LOAD"DISPLAY PIC",8` then press RETURN.
  - `RUN`
  - Enter the Koala-format picture filename when prompted.

- **File Integrity:** DISPLAY PIC will fail to display the picture if the internal data layout in the file has been altered from the expected Koala-file layout (e.g., if data within the file was manually moved without updating the program's expectations).

## Source Code

```basic
10 REM DISPLAY PIC PROGRAM
20 REM LISTING C-14
30 PRINT "ENTER PICTURE FILENAME:"
40 INPUT A$
50 IF A$="" THEN END
60 REM LOAD MVIT MACHINE-LANGUAGE ROUTINE
70 LOAD "MVIT",8,1
80 REM RELOCATE AND DISPLAY PICTURE
90 SYS 49152
100 END
```

```assembly
; MVIT MACHINE-LANGUAGE ROUTINE
; LISTING C-15
; RELOCATES AND DISPLAYS KOALA PICTURE
*=$C000
  LDA #$00
  STA $D020      ; SET BORDER COLOR TO BLACK
  STA $D021      ; SET BACKGROUND COLOR TO BLACK
  LDA #$18
  STA $D011      ; SET VIC-II CONTROL REGISTER
  LDA #$10
  STA $D016      ; SET MULTICOLOR MODE
  LDA #$08
  STA $D018      ; SET VIC-II MEMORY CONTROL
  LDA #$00
  STA $D015      ; DISABLE SPRITES
  LDA #$FF
  STA $D01A      ; ENABLE RASTER INTERRUPTS
  LDA #$01
  STA $D019      ; CLEAR INTERRUPT FLAG
  LDA #$00
  STA $D012      ; SET RASTER LINE
  LDA #$1B
  STA $D011      ; ENABLE SCREEN
  RTS
```

```text
; PIC A CASTLE - EXAMPLE KOALA-FORMAT PICTURE DATA
; LISTING C-16
; (BINARY DATA REPRESENTING THE IMAGE)
```

## Key Registers

- **$D011:** VIC-II Control Register
- **$D016:** VIC-II Multicolor Mode Register
- **$D018:** VIC-II Memory Control Register
- **$D020:** Border Color Register
- **$D021:** Background Color Register
- **$D015:** Sprite Enable Register
- **$D01A:** Interrupt Enable Register
- **$D019:** Interrupt Flag Register
- **$D012:** Raster Line Register

## References

- "koala_filename_utils_and_memory_map" — expands on where Koala stores graphics and color data in memory and KO-COM usage
- "sprite_maker_utility" — utilities for generating graphics (sprites)

## Labels
- $D011
- $D016
- $D018
- $D020
- $D021
- $D015
- $D01A
- $D019
- $D012
