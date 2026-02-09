# BASIC vectors and startup messages (ROM -> RAM copy)

**Summary:** Copy routine (LDX/LDA/STA/DEX/BPL/RTS) that copies BASIC vector bytes from ROM $E447-$E452 into RAM $0300-$030B (12 bytes / 6 two-byte vectors) and the BASIC startup PETSCII strings stored at $E45F-$E4AB. Contains vector table bytes (little-endian pointers to ROM handlers) and the startup message data.

## Description
This chunk contains:
- A ROM table of BASIC vector bytes at $E447-$E452 (6 vectors × 2 bytes = 12 bytes). Each vector is a little-endian two-byte pointer intended to live in RAM beginning at $0300 (so $0300..$030B receive the bytes).
- A simple decrementing copy loop that moves those 12 bytes from ROM into RAM ($0300,X).
- The BASIC startup messages (PETSCII) stored in ROM immediately after the table ($E45F-$E4AB); these are the banner, “64K RAM SYSTEM”, “READY.” and formatting characters used by the BASIC runtime.

The copy routine:
- LDX #$0B sets up X = 11 so the loop runs for X = 11..0 inclusive (12 iterations).
- LDA $E447,X reads the table byte at ROM address $E447 + X.
- STA $0300,X writes that byte to RAM address $0300 + X.
- DEX / BPL loops until all bytes copied; RTS returns.

No hardware registers are involved; this prepares the in-RAM vectors used by the BASIC runtime so vectors in $0300..$030B point at the corresponding ROM handlers.

## Source Code
```asm
; ROM table of BASIC vector bytes (copied to $0300..$030B in RAM)
.;E447 8B E3    ; error message        -> bytes: $8B,$E3  (pointer $E38B)
.;E449 83 A4    ; BASIC warm start     -> bytes: $83,$A4  (pointer $A483)
.;E44B 7C A5    ; crunch BASIC tokens  -> bytes: $7C,$A5  (pointer $A57C)
.;E44D 1A A7    ; uncrunch BASIC tokens-> bytes: $1A,$A7  (pointer $A71A)
.;E44F E4 A7    ; start new BASIC code -> bytes: $E4,$A7  (pointer $A7E4)
.;E451 86 AE    ; get arithmetic elem. -> bytes: $86,$AE  (pointer $AE86)
; Table occupies $E447..$E452 (12 bytes)

; Copy routine that initialises the BASIC vectors in RAM ($0300..$030B)
.,E453 A2 0B    LDX #$0B        ; set X = 11 (12 bytes: X = 11..0)
.,E455 BD 47 E4 LDA $E447,X     ; read byte from ROM table at $E447 + X
.,E458 9D 00 03 STA $0300,X     ; store byte into RAM at $0300 + X
.,E45B CA       DEX             ; decrement X
.,E45C 10 F7    BPL $E455       ; loop while X >= 0
.,E45E 60       RTS             ; return

; BASIC startup messages (PETSCII strings) located in ROM $E45F..$E4AB
.;E45F 00 20 42 41 53 49 43 20  ; (0x00) ' BASIC '
.;E467 42 59 54 45 53 20 46 52  ; 'BYTES FR'
.;E46F 45 45 0D 00 93 0D 20 20  ; 'EE' 0x0D (CR) 0x00 0x93 0x0D '  '
.;E473 93 0D 20 20 20 20 2A 2A  ; 0x93 0x0D '    **'
.;E47B 2A 2A 20 43 4F 4D 4D 4F  ; '** COMM O'
.;E483 44 4F 52 45 20 36 34 20  ; 'D O R E  6 4 '
.;E48B 42 41 53 49 43 20 56 32  ; 'BASIC V2'
.;E493 20 2A 2A 2A 2A 0D 0D 20  ; ' ****' CR CR ' '
.;E49B 36 34 4B 20 52 41 4D 20  ; '64K RAM '
.;E4A3 53 59 53 54 45 4D 20 20  ; 'SYSTEM  '
.;E4AB 00                         ; string terminator
; These bytes are PETSCII (banner and READY messages used by BASIC).
```

## References
- "basic_warm_and_cold_start_initialisation" — expands on initialising vectors during cold start