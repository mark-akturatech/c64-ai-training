# 256‑Byte Autostart Fast Loader — Single‑sector layout

**Summary:** Single‑sector autostart fast loader that places C64-side code in the first half of a 256‑byte disk sector and 1541 drive code in the second half, relying on the 1541's default sector buffer at $0400 and the disk "M-E" (memory‑execute) command to jump into the drive buffer. Uses autostart conventions (catch at $0203) and sector-format constraints (2‑byte link -> 254 usable bytes).

**Description**
This layout packs both the C64 host code and the 1541 drive code inside one disk sector. The key points:

- **Sector placement:** The sector contains C64 code in its first half and 1541 drive code in its second half. The sector is split so the two pieces occupy contiguous, non‑overlapping regions of the same 256‑byte sector.
- **1541 buffer usage:** When the 1541 reads a sector, it places the sector data in its default RAM buffer at $0400. Because the drive already holds the sector in RAM, the C64 can send a disk command that tells the drive to execute code directly from that buffer.
- **Memory‑execute (M‑E):** The C64 issues the disk command "M‑E" (memory execute) with an address that points into the drive buffer ($0400 + offset). The drive then begins executing the drive‑side code from the buffer area.
- **Autostart integration:** The autostart mechanism expects the C64 side to arrange execution so control can be captured (commonly execution is caught at $0203 on the C64 side); full autostart details and stack‑region placement are covered separately.
- **Filesystem constraint:** Standard 1541 sector format reserves 2 bytes for the file/sector link, reducing the sector's usable payload from 256 to 254 bytes; this affects how much room is available for each half and where segment boundaries must be placed.
- **Build/segment mapping:** Source projects commonly use named segments (e.g., LOADADDR, PART2, FCODE) to place host and drive code into the correct parts of the sector — the exact segment-to-offset mapping must match the autostart and M‑E address used.

Operational caveats (from the source):
- The drive buffer at $0400 still contains the sector after read — the M‑E address must point to the drive‑side code within that buffer.
- Because of the 2‑byte link and any required loader metadata, the two code halves typically are not exactly 128 bytes each; the usable sizes depend on the sector format and any required headers.
- Proper stack placement and autostart trap on the C64 ($0203) are part of the autostart mechanism and must be coordinated with the loader code layout.

## Source Code
```assembly
; Example assembly code demonstrating a complete single-sector image

; C64-side code (host)
; This code resides in the first part of the sector

        * = $0801  ; Start address for BASIC program

        ; BASIC program to load and execute the fast loader
        .byte $0b, $08, $01, $00, $9e, $20, $32, $30, $36, $31, $00, $00, $00

        ; Machine language routine to load the sector and execute drive code
        * = $080d

        ; Load the sector containing the fast loader
        lda #$01        ; Track number
        ldx #$00        ; Sector number
        jsr $ffba       ; Call SETLFS
        lda #$01        ; File number
        ldx #$08        ; Device number
        ldy #$01        ; Secondary address
        jsr $ffbd       ; Call SETNAM
        jsr $ffc0       ; Call OPEN
        bcs error       ; Branch if error

        ; Read the sector into memory
        lda #$01        ; File number
        jsr $ffc6       ; Call CHKIN
        jsr $ffcf       ; Call CHRIN
        sta $0400       ; Store byte in drive buffer
        jsr $ffcc       ; Call CLRCHN

        ; Send M-E command to execute drive code
        lda #$08        ; Device number
        ldx #<me_cmd    ; Low byte of command string
        ldy #>me_cmd    ; High byte of command string
        jsr $ffba       ; Call SETLFS
        lda #$02        ; File number
        jsr $ffc0       ; Call OPEN
        bcs error       ; Branch if error
        jsr $ffcc       ; Call CLRCHN

        ; Exit
        rts

error:
        ; Handle error
        rts

me_cmd:
        .byte "M-E", $00, $04  ; "M-E" command with address $0400
```

```text
; Sector layout diagram

+----------------+----------------+
| C64 Host Code  | 1541 Drive Code|
| (First 128 B)  | (Second 128 B) |
+----------------+----------------+
```

## Key Registers
- **$0400**: 1541 drive buffer where the sector is loaded.
- **$0203**: C64 autostart vector.

## References
- "sector_format" — expands on filesystem link bytes and usable sector payload
- "autostart_mechanism" — expands on stack‑region placement and catching execution at $0203
- "code_assembly" — expands on how segments LOADADDR / PART2 / FCODE map into the sector