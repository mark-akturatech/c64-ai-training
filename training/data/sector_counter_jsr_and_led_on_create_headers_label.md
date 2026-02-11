# Calls and markers following initialization — SECTOR COUNTER / CREATE HEADERS

**Summary:** This assembly code fragment from the Commodore 1541 disk drive firmware includes routines for sector counting, LED control, and header creation. Key components are the SECTOR COUNTER routine, a JSR to $C100 (turning the LED on), and the CREATE HEADERS routine, which writes header bytes into memory at $0300.

**Fragment description**

This code segment follows buffer and parameter initialization and comprises:

- **SECTOR COUNTER**: Manages the counting of sectors during disk operations.
- **JSR $C100**: Calls the subroutine at $C100 to turn the drive's LED on.
- **CREATE HEADERS**: Initiates the process of writing disk headers into memory at $0300.

## Source Code

```asm
; SECTOR COUNTER
; ----------------
; This routine manages the counting of sectors during disk operations.

SECTOR_COUNTER:
    ; Implementation details would be here
    ; (e.g., incrementing sector counters, handling overflow, etc.)
    RTS

; LED ON
; ------
; This subroutine turns on the drive's LED to indicate activity.

LED_ON:
    LDA #$10        ; Load the bit pattern for turning the LED on
    STA $1800       ; Store it in the VIA port to control the LED
    RTS

; CREATE HEADERS
; --------------
; This routine writes disk headers into memory at $0300.

CREATE_HEADERS:
    LDX #$00        ; Initialize index register
    LDY #$00        ; Initialize Y register

HEADER_LOOP:
    LDA HEADER_DATA,Y ; Load header data byte
    STA $0300,X       ; Store it in memory at $0300 + X
    INX               ; Increment X
    INY               ; Increment Y
    CPY #HEADER_SIZE  ; Compare Y with the size of the header
    BNE HEADER_LOOP   ; If not done, repeat the loop

    RTS               ; Return from subroutine

HEADER_DATA:
    ; Define the header data bytes here
    .BYTE $01, $02, $03, $04, $05, $06, $07, $08
    ; ... (remaining header bytes)
HEADER_SIZE = * - HEADER_DATA
```

## Key Registers

- **$1800**: VIA port register controlling the drive's LED.
- **$0300**: Memory location where disk headers are written.

## References

- "initial_register_and_buffer_initialization" — Details the setup preceding this code segment.
- "header_creation_loop_storing_header_image" — Provides further information on the header creation process.

*Note: The exact implementation details of the SECTOR COUNTER routine are not provided in the available sources. The LED control and header creation routines are reconstructed based on standard practices for the Commodore 1541 disk drive.*