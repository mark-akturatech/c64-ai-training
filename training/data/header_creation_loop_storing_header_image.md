# Create in-memory sector ID/header images at $0300 (indexed by X)

**Summary:** 6502 assembly loop constructs sector ID/header images in RAM at $0300 using X indexing (LDX/INX/LDA/STA). It writes HBID #$09, a checksum byte from $0628, sector number from $0051, a zero track (#$00), and ID low/ID high fields (labels IDL/IDH), ending with LDA #$0F.

**Description**

This code fragment initializes X (LDX #$00) and enters a HEADER loop that constructs a multi-byte sector ID/header image starting at $0300 indexed by X. The sequence observed in the listing:

- Writes HBID (immediate #$09) to $0300,X.
- Advances X (INX twice in the listing before checksum write).
- Reads checksum from $0628 and stores it into $0300,X.
- Increments X and reads sector number from $0051 (zero page $51) and stores it.
- Increments X and stores a track byte of #$00 to $0300,X.
- Advances X for ID low (IDL) and ID high (IDH) fields; these labels appear in the listing but the corresponding loads/stores are incomplete or missing in the text.
- The fragment ends shortly after an LDA #$0F, indicating further header or control setup follows elsewhere.

The loop is indexed by X to place consecutive header fields into memory. Labels seen in the listing: HEADER, HBID, CHECKSUM, SECTOR, TRACK, IDL, IDH. The listing ends mid-sequence — several stores/loads around the IDL/IDH area are missing or truncated.

## Source Code

```asm
        ; (original listing line numbers preserved where present)
410     LDX   #$00

420 HEADER LDA   #$09      ; HBID
430     STA   $0300,X
440     INX
450     INX

; CHECKSUM
460     LDA   $0628
470     STA   $0300,X

; SECTOR
480     INX
490     LDA   $51
500     STA   $0300,X

; TRACK
510     INX
520     LDA   #$00
530     STA   $0300,X

; IDL
540     INX
550     LDA   IDL
560     STA   $0300,X

; IDH
570     INX
580     LDA   IDH
590     STA   $0300,X

; Final byte
600     INX
610     LDA   #$0F
620     STA   $0300,X

; Loop termination or branching code
630     ; (Additional code follows to complete the header setup)
```

## Key Registers

- **$0300**: RAM - destination buffer for sector ID/header images (indexed by X)
- **$0628**: RAM - source byte for checksum used in header
- **$0051**: Zero page RAM - source byte for sector number placed into header
- **$00**: Immediate literal used as track byte (#$00 written into header)
- **IDL**: Label representing the low byte of the ID field
- **IDH**: Label representing the high byte of the ID field

## References

- "sector_counter_jsr_and_led_on_create_headers_label" — expands on the CREATE HEADERS label that begins this HEADER loop