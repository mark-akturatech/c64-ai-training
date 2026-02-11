# C64 Tape Loader — Initialization and Main Load Loop (0389–03A6)

**Summary:** Zeroes checksum storage ($90, $02), repeatedly calls Read-Byte subroutine (JSR $03E7), stores bytes via STA ($F9),Y using the zero-page 16-bit destination pointer ($F9-$FA), updates an XOR checksum in $02, increments the 16-bit destination pointer, and compares it to the End Address in $2D-$2E to decide loop termination.

## Description
This routine implements the core of a tape load loop:

- Initialization: LDY #$00; STY $90 and STY $02 clear checksum-related zero-page locations ($90 used as temporary/index; $02 holds the running XOR checksum).
- Read/store cycle:
  - JSR $03E7 — call the Read-Byte subroutine to receive the next byte from tape.
  - STA ($F9),Y — store the received byte into RAM at the address pointed to by the zero-page pointer in $F9 (low)/$FA (high), indexed by Y (Y is zero here).
  - EOR $02 ; STA $02 — XOR the received byte with the running checksum in $02 and store the new checksum back to $02.
- 16-bit destination pointer increment:
  - INC $F9 ; BNE skip-high ; INC $FA — increment the low byte at $F9; if it wrapped from $FF to $00 the BNE will be false and the high byte in $FA is incremented.
- 16-bit comparison against End Address:
  - LDA $F9 ; CMP $2D — compare low bytes.
  - LDA $FA ; SBC $2E — subtract the high End Address with carry set/cleared by the previous CMP (standard two-byte compare idiom).
  - BCC $038F — branch back to the start of the load loop if the 16-bit destination pointer is still less than the End Address (i.e., not finished).

This loop continues until the destination pointer reaches or exceeds the End Address held in $2D (low) / $2E (high). After exiting, subsequent cleanup/IRQ-restore and final checksum processing occur (see referenced chunks).

## Source Code
```asm
0389  A0 00        LDY #$00        ; Inits locations used to store
038B  84 90        STY $90         ; the Checksum info
038D  84 02        STY $02

--Load Loop------------------------
038F  20 E7 03     JSR $03E7       ; Reads a new byte

0392  91 F9        STA ($F9),Y     ; Stores it into RAM using the
                                 ; Load address locations as
                                 ; destination pointer

0394  45 02        EOR $02         ; computes the XOR Checksum
0396  85 02        STA $02         ; of Data

0398  E6 F9        INC $F9         ; Increases dest. pointer
039A  D0 02        BNE $039E
039C  E6 FA        INC $FA

039E  A5 F9        LDA $F9         ; Checks if dest. pointer (16
03A0  C5 2D        CMP $2D         ; bits) equals End Address
03A2  A5 FA        LDA $FA
03A4  E5 2E        SBC $2E
03A6  90 E7        BCC $038F       ; not yet finished? Restart!
```

## Key Registers
- $F9-$FA - Zero Page - 16-bit load destination pointer (low/high) used by STA ($F9),Y
- $02 - Zero Page - Running XOR checksum accumulator
- $90 - Zero Page - Temporary/initialization location related to checksum handling
- $2D-$2E - Zero Page - 16-bit End Address (low/high) used to terminate the loop

## References
- "post_load_cleanup_and_irq_restore" — expands on final checksum read, cleanup and IRQ restore after the loop finishes
- "read_byte_subroutine" — expands on the Read Byte routine called at $03E7 (how each byte is obtained)

## Labels
- $F9-$FA
- $02
- $90
- $2D-$2E
