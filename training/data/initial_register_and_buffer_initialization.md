# Initialization sequence (runtime pointers and buffers)

**Summary:** 6502 assembly initialization that clears and seeds runtime pointers/buffers using LDA/STA/LDX/INX; writes zero-page locations ($000C, $0043, $0051, $0080, $007F) and absolute RAM locations ($0620, $0626, $0628). Sets sector counter ($0620), tail gap parameter ($0626), and a checksum/related byte ($0628).

**Description**

This fragment initializes runtime variables and pointers before main disk/IO routines run. Actions performed (in order):

- Clear a workspace byte with LDA #$00 / STA $007F.
- Load X from zero page $000C and store X into zero page destinations $0051 and $0080 (copies a pointer/index).
- Load X from zero page $000D, increment X, and store into zero page $0043 (sets/offsets an index).
- Set the sector counter initial value to $01 by storing to $0620.
- Set a tail-gap parameter to $08 by storing to $0626 (labeled "TAIL GAP" in source).
- Clear a checksum/related byte by storing $00 to $0628.

This is purely data/runtime initialization (no hardware register writes). Parentheticals: zero page = $0000-$00FF; absolute RAM addresses shown explicitly.

## Source Code

```asm
; INITIALIZATION
        ; (line numbers from source shown as comments where present)
; 210
; 220
        LDA #$00            ; 230
        STA $007F           ; 230

        LDX $000C           ; 240
        STX $0051           ; 250
        STX $0080           ; 260

        LDX $000D           ; 270   ; OCR showed "OD" — interpreted as 0D
        INX                 ; 280
        STX $0043           ; 290

        LDA #$01            ; 300
        STA $0620           ; 310   ; sector counter initial value

        LDA #$08            ; 320
        STA $0626           ; 330   ; TAIL GAP parameter

        LDA #$00            ; 340
        STA $0628           ; 350   ; checksum / related byte
```

## Key Registers

- $000C - RAM (zero page) - source pointer/index (read into X)
- $000D - RAM (zero page) - source pointer/index (read into X, incremented)
- $0043 - RAM (zero page) - stored X after INX (index/offset)
- $0051 - RAM (zero page) - stored X (runtime pointer copy)
- $007F - RAM (zero page) - cleared workspace byte
- $0080 - RAM - stored X (runtime pointer copy)
- $0620 - RAM - sector counter initial value ($01)
- $0626 - RAM - tail-gap parameter ($08)
- $0628 - RAM - checksum / related byte ($00)

## References

- "file_header_and_assembler_directives" — expands file header and assembler directives that precede this fragment
- "sector_counter_jsr_and_led_on_create_headers_label" — expands next steps (JSR call, LED toggle, header creation)