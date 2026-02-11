# KERNAL ROM Disassembly: Start of EDITOR.1 (VIC-40 KERNAL) at $E500

**Summary:** Start of the EDITOR.1 library in the VIC-40 KERNAL ROM located at $E500. Defines editor constants (MAXCHR=80, NWRAP=2), includes commented pseudo-code for the "undefined function" message routine, and a short note about the 6526 return address; prepares for editor/VIC-40 routines and the io_base_routine that returns VIC/6526 base.

**Start of EDITOR.1 / Header Notes**

This chunk is the header for the EDITOR.1 library placed at ROM address $E500 (VIC-40 KERNAL). It defines two assembler constants used by the editor routines:

- MAXCHR = 80 (maximum characters per line)
- NWRAP = 2 (maximum number of physical lines per logical line)

The source contains a fully commented pseudo-code listing for an "UNDEFINED FUNCTION" entry that prints an error message from the string label UNMSG and returns. The UNMSG data bytes (message string) are present in the header.

A short comment line indicates a "RETURN ADDRESS OF 6526" (the 6526 is the MOS 6526 CIA), but the details are not present here — see the referenced io_base_routine for how the editor determines VIC/6526 base addresses.

This header prepares the code and constants used by subsequent editor and VIC-40 routines starting at $E500; the actual routines are not included in this chunk.

## Source Code

```asm
*=$E500                ;START OF VIC-40 KERNAL

.LIB   EDITOR.1
MAXCHR=80
NWRAP=2                ;MAX NUMBER OF PHYSICAL LINES PER LOGICAL LINE
;
;UNDEFINED FUNCTION ENTRY
;
; UNDEFD LDX #0
; UNDEF2 LDA UNMSG,X
; JSR PRT
; INX
; CPX #UNMSG2-UNMSG
; BNE UNDEF2
; SEC
; RTS
;
; UNMSG .BYT $D,'?ADVANCED FUNCTION NOT AVAILABLE',$D
; UNMSG2
;
;RETURN ADDRESS OF 6526
;
```

## References

- "io_base_routine" — routine that returns VIC/6526 base address and expands on the first editor routine at $E500