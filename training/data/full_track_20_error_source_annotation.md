# Full Track Format Routine (20M) — Annotated

**Summary:** Annotation of the DOS full-track formatting routine: initialization writes drive number to $007F, header/sector values read from $000C/$000D and stored to $0051/$0043, a try counter controls retries, tail-gap fixed to 8 bytes to save ROM duplication, binary→GCR conversion is performed, and a jump/hand-off lets the FDC/ROM finish the format before IP resumes and exits to ENDCMD ($C194).

**Initialization**
- Drive number explicitly initialized to 0 by writing the drive byte to $007F (lines 220–290) instead of relying on a default.
- Track is read from the header table at $000C and stored in $0051. At power-up $000C normally contains $FF to signal "format not started"; the routine replaces that with the active track to avoid the drive doing a BUMP to track 1 at format start (driver previously set up the header table).
- Sector range is read from $000D, incremented to form the sector total for the track, and stored at $0043.
- These writes ensure the drive/FDC see the correct active track and sector count so the formatting sequence proceeds under DOS control.

**Try counter and tail gap**
- A try counter is set (line 300). The driver normally allows about 10 attempts per track; the routine either succeeds on the first attempt or gives up, and the driver pre-erases the track as a safeguard.
- The code prevents the FDC from reattempting the format on its own (that would bypass the custom ML routine and re-enter the standard ROM formatter).
- Tail gap is fixed to 8 bytes (lines 310–330) to avoid duplicating 245 bytes of ROM code (addresses $FB1D–$FC12). This is a RAM/space optimization decision.

**LED, header table and dummy data block creation**
- LED is turned on (cosmetic) at around line 370.
- The routine builds a header table and constructs a dummy data block (lines 410–860). As part of this, the data block identifier is incremented (line 420).
- The constructed header and dummy block are prepared for conversion to GCR and for the FDC job queue.

**Binary → GCR conversion**
- Binary-to-GCR conversion of the prepared block is done in lines 900–1040. The converted data is placed where the FDC/ROM expects to find it for write-format operations.

**Jump trick and IP/FDC handoff**
- Before handing control to ROM/FDC code, the routine resets the track number to 35 (lines 1080–1090) so the FDC/ROM believes it is formatting "the last track" of a normal format sequence. This tricks the ROM routine into performing the remainder of the low-level format operation.
- The indirect buffer pointer is set to the data-block buffer (the prepared block) and a jump to $FCAA is written at $0600. That ensures the data block remains available through the upcoming mode switch.
- The job queue is set up to execute buffer number 3 (the block at $0600), then control is given to the standard ROM/FDC formatter. The system thus operates in both IP (interrupt processor / DOS machine code) and FDC modes during the single-track job.
- The IP monitors the FDC while it reformats the track; the FDC will also verify the track after formatting.

**Termination and resume**
- The IP watches the job code; when bit 7 of the job code ($E0) goes low (indicating the job is complete), the IP regains control from the FDC/ROM.
- The routine then jumps to ENDCMD ($C194) to terminate the formatting command and clean up.

## Source Code
```assembly
; Full Track Format Routine (20M) — Annotated Assembly Listing

; Drive number initialization
LDA #$00        ; Load immediate value 0
STA $007F       ; Store to drive number location

; LED control
JSR $C100       ; Jump to subroutine to turn on LED

; Set up jump to ROM formatter
LDA #$4C        ; Opcode for JMP
STA $0600       ; Store at buffer location
LDA #$C7        ; Low byte of $FCAA
STA $0601       ; Store at buffer location
LDA #$FA        ; High byte of $FCAA
STA $0602       ; Store at buffer location

; Set job code
LDA #$E0        ; Job code for format
STA $0003       ; Store in job code register

; Read track number from header table
LDY $0051       ; Load track number into Y register

; Load ID low byte
LDA $0431,Y     ; Load ID low byte from table
STA $0013       ; Store in ID low byte location

; Load ID high byte
LDA $0454,Y     ; Load ID high byte from table
STA $0012       ; Store in ID high byte location

; Check if track is 35
CPY #$23        ; Compare Y with 35
BNE TABLE       ; Branch if not equal

; Wait for job completion
WAIT:
LDA $0003       ; Load job code
BMI WAIT        ; Branch if bit 7 is set (job not complete)

; Jump to ENDCMD
JMP $C194       ; Jump to command termination routine

TABLE:
; Additional table processing code here
```

## Key Registers
- $007F - RAM/Drive parameter - drive number set to 0 (select drive 8 internal convention)
- $000C - RAM/Header table - source track byte (initially $FF at power-up)
- $000D - RAM/Header table - sector-range byte (incremented to form sector total)
- $0051 - RAM - active track number (written from $000C)
- $0043 - RAM - sector total for current track (written from $000D+1)
- $0600 - RAM - buffer location written with a jump to $FCAA; executed as buffer #3
- $FCAA - ROM - jump target used by the buffer execution (ROM formatter area)
- $FB1D-$FC12 - ROM range referenced (245 bytes avoided by tail-gap choice)
- $C194 - ROM - ENDCMD (DOS command termination entry)

## References
- "formatting_initialization_and_header_building" — expands on header/table setup and counters
- "jump_instruction_and_ip_fdc_handshake" — details why track is reset to 35 and how control is passed to ROM

## Labels
- ENDCMD
