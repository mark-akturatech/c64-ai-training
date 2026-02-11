# UNICOPY64

**Summary:** Machine-language utility for copying files on the Commodore 64; copies file data into RAM during an input phase and writes it out to disk or cassette during an output phase. Single-drive operation, started by a SYS call; copies between disk→disk (same drive) or disk→tape.

**Operation**
UNICOPY64 runs entirely in machine language (except for the SYS that invokes it). It operates in two distinct phases:

- **Input phase:** Selected file(s) are read from the source (disk) and their raw data is copied into RAM buffers.
- **Output phase:** Buffered data in RAM is written out to the selected target (disk or cassette tape).

The program is intended for single-drive use and supports writing the buffered file data to either disk or tape. No BASIC stubs beyond the startup SYS are part of the program; all file I/O and control logic are implemented in the machine-code routine.

## Source Code
```assembly
; UNICOPY64 Assembly Source Code
; (Note: This is a reconstructed example based on typical C64 file copy utilities)

        *=$0801  ; Start address for BASIC stub

        ; BASIC stub to invoke machine code
        .byte $0b, $08, $0a, $00, $9e, $20, $32, $30, $36, $34, $00, $00, $00

        *=$080d  ; Start of machine code

        ; Initialize
        sei             ; Disable interrupts
        ldx #$ff
        txs             ; Set up stack
        cld             ; Clear decimal mode

        ; Set up KERNAL vectors
        lda #<irq
        sta $0314
        lda #>irq
        sta $0315

        ; Main loop
main_loop:
        jsr input_phase
        jsr output_phase
        jmp main_loop

        ; Input phase: Read file from disk into RAM buffer
input_phase:
        ; Open file for reading
        lda #$01        ; Logical file number
        ldx #$08        ; Device number (disk drive)
        ldy #$01        ; Secondary address (command channel)
        jsr $ffba       ; SETLFS

        lda #<filename
        ldx #>filename
        jsr $ffbd       ; SETNAM

        jsr $ffc0       ; OPEN
        bcs error       ; Branch if error

        lda #$01
        jsr $ffc6       ; CHKIN

        ; Read file into buffer
        ldx #$00
read_loop:
        jsr $ffcf       ; CHRIN
        sta buffer, x
        inx
        cpx #$ff
        bne read_loop

        jsr $ffcc       ; CLRCHN
        jsr $ffc3       ; CLOSE
        rts

        ; Output phase: Write RAM buffer to disk or tape
output_phase:
        ; Open file for writing
        lda #$02        ; Logical file number
        ldx #$08        ; Device number (disk drive)
        ldy #$02        ; Secondary address (write)
        jsr $ffba       ; SETLFS

        lda #<outname
        ldx #>outname
        jsr $ffbd       ; SETNAM

        jsr $ffc0       ; OPEN
        bcs error       ; Branch if error

        lda #$02
        jsr $ffc9       ; CHKOUT

        ; Write buffer to file
        ldx #$00
write_loop:
        lda buffer, x
        jsr $ffd2       ; CHROUT
        inx
        cpx #$ff
        bne write_loop

        jsr $ffcc       ; CLRCHN
        jsr $ffc3       ; CLOSE
        rts

        ; Error handling
error:
        jsr $ffcc       ; CLRCHN
        jsr $ffc3       ; CLOSE
        rts

        ; IRQ handler
irq:
        rti

        ; Data
filename:
        .byte "INPUTFILE", 0
outname:
        .byte "OUTPUTFILE", 0
buffer:
        .res $ff, 0
```

## Key Registers
- **$0314-$0315:** IRQ vector
- **$ffba:** SETLFS
- **$ffbd:** SETNAM
- **$ffc0:** OPEN
- **$ffc3:** CLOSE
- **$ffc6:** CHKIN
- **$ffc9:** CHKOUT
- **$ffcc:** CLRCHN
- **$ffcf:** CHRIN
- **$ffd2:** CHROUT

## References
- "unicopy_inst_description" — expands on BASIC instructions file UNICOPY INST (usage and user-level instructions)
- "unicopy_list_and_assy_description" — expands on assembly listing and analysis of UNICOPY (disassembly and code commentary)

## Labels
- SETLFS
- SETNAM
- OPEN
- CLOSE
- CHKIN
- CHKOUT
- CHRIN
- CHROUT
