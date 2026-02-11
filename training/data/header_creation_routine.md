# Constructing Sector Headers in Memory (ID fields and checksum)

**Summary:** This routine constructs a sector header in memory at $0300+X, writing the header ID, track, sector, ID low, ID high, and gap bytes. It computes a checksum by exclusive-ORing bytes from $02FA to $02FD and stores the result at $02F9,X, then increments the checksum byte. The routine references a sector index at $0628.

**Description**

This 6502 assembly routine assembles a sector header in memory at $0300+X and calculates a checksum using the EOR instruction across a set of bytes. The intended flow is as follows:

- Initialize the X register with `LDX #$00` to use as an offset into the header buffer at $0300.
- Store the header ID byte (HBID) with `LDA #$08` and advance X.
- Store the track, sector, ID low, and ID high fields into successive bytes of $0300+X, advancing X after each store.
- Reserve or set additional header bytes, including a gap byte set to `#$0F`.
- After placing the header bytes, accumulate a checksum by EORing bytes from $02FA to $02FD (indexed by X) into the accumulator and store the result into $02F9,X.
- Increment the computed checksum byte at $02F9,X.

The routine appears to be part of a larger sector construction and sector-counter update flow.

## Source Code

```asm
LDX  #$00

HEADER:
    LDA  #$08        ; HBID
    STA  $0300,X
    INX

    LDA  $0628       ; Track number
    STA  $0300,X
    INX

    LDA  $51         ; Sector number
    STA  $0300,X
    INX

    LDA  #$00        ; ID low byte
    STA  $0300,X
    INX

    LDA  #$00        ; ID high byte
    STA  $0300,X
    INX

    LDA  #$0F        ; GAP byte
    STA  $0300,X
    INX

    LDA  #$00
    EOR  $02FA,X
    EOR  $02FB,X
    EOR  $02FC,X
    EOR  $02FD,X
    STA  $02F9,X

    INC  $02F9,X
```

## Key Registers

- **$0300**: RAM address where the sector header is constructed.
- **$02F9**: RAM address where the computed checksum is stored.
- **$02FA–$02FD**: RAM addresses containing bytes used in the checksum calculation.
- **$0628**: RAM address containing the current track number.
- **$51**: RAM address containing the current sector number.

## References

- "sector_counter_and_headers_intro" — expands the header-creation comment and sector-counter setup.
- "checksum_comments_and_increment" — expands on checksum accumulation and final increment of sector index ($0628) that follow this routine.