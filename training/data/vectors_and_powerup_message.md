# Commented Commodore 64 KERNAL Disassembly — BASIC KERNAL vectors & power-up message

**Summary:** Describes the BASIC KERNAL vector table at $E447-$E451 (copied to $0300-$030B), the INIT copy routine at $E453-$E45E (LDX/LDA/STA/DEX/BPL/RTS), and the BASIC power-up message string table at $E45F-$E4AB (PETSCII bytes and separators).

## Vectors and INIT behavior
This ROM block provides the BASIC entry-point vectors (IERROR, IMAIN, ICRNCH, IQPLOP, IGONE, IEVAL) stored at $E447-$E451 and an INIT routine that copies those 6 vectors (12 bytes) into RAM at $0300-$030B on startup. The copy loop uses LDX #$0B and moves bytes from $E447+X to $0300+X, decrementing X until complete, then RTS.

Vector table (word values are little-endian 2-byte addresses):
- IERROR  (table at $E447) → $E38B
- IMAIN   (table at $E449) → $A483
- ICRNCH  (table at $E44B) → $A57C
- IQPLOP  (table at $E44D) → $A7A1
- IGONE   (table at $E44F) → $A7E4
- IEVAL   (table at $E451) → $AE86

INIT routine behavior:
- Sets X = $0B (index of last byte)
- Copies LDA $E447,X → STA $0300,X
- DEX / BPL loop repeats until X underflows past 0
- RTS returns after copying all 12 bytes

Power-up message:
- Stored as a zero-separated PETSCII string table at $E45F-$E4AB.
- Contains the "COMMODORE 64 BASIC V2" startup text and related lines (includes control bytes such as $0D and PETSCII control codes).
- Strings are terminated/segmented by zero bytes.

## Source Code
```asm
.; VECTORS table (source)
.:E447 8B E3                    IERROR VEC, print basic error message ($e38b)
.:E449 83 A4                    IMAIN VECTOR, basic warm start ($a483)
.:E44B 7C A5                    ICRNCH VECTOR, tokenise basic text ($a57c)
.:E44D 1A A7                    IQPLOP VECTOR, list basic text ($a7a1)
.:E44F E4 A7                    IGONE VEXTOR, basic character dispatch ($a7e4)
.:E451 86 AE                    IEVAL VECTOR, evaluate basic token ($ae86)

.; INIT VECTORS copy routine
.,E453 A2 0B    LDX #$0B        ; 6 vectors to be copied
.,E455 BD 47 E4 LDA $E447,X
.,E458 9D 00 03 STA $0300,X
.,E45B CA       DEX             ; next byte
.,E45C 10 F7    BPL $E455       ; loop
.,E45E 60       RTS             ; return
```

```text
.; WORDS: POWER UP MESSAGE (bytes shown as in ROM)
.:E45F 00 20 42 41 53 49 43 20  ; " basic"
.:E467 42 59 54 45 53 20 46 52  ; "BYTES FR"
.:E46F 45 45 0D 00 93 0D 20 20  ; "EE" + $0D + $00 + $93 + $0D + spaces
.:E473 93 0D 20 20 20 20 2A 2A  ; $93 $0D + spaces + "**" (clr) **** commodore 64 basic v2 ****
.:E47B 2A 2A 20 43 4F 4D 4D 4F  ; "** COMM O"
.:E483 44 4F 52 45 20 36 34 20  ; "DORE 64 "
.:E48B 42 41 53 49 43 20 56 32  ; "BASIC V2"
.:E493 20 2A 2A 2A 2A 0D 0D 20  ; " ****" + $0D $0D space
.:E49B 36 34 4B 20 52 41 4D 20  ; "64K RAM "
.:E4A3 53 59 53 54 45 4D 20 20  ; "SYSTEM  "
.:E4AB 00                         ; terminator
.:E4AC 5C                         ; trailing byte
```

## Key Registers
- $0300-$030B - RAM - BASIC vectors area (IERROR, IMAIN, ICRNCH, IQPLOP, IGONE, IEVAL)
- $E447-$E451 - ROM - source vector table copied into $0300-$030B
- $E453-$E45E - ROM - INIT copy routine (LDX/LDA/STA/DEX/BPL/RTS)
- $E45F-$E4AB - ROM - BASIC power-up message string table (PETSCII)
- $E4AC - ROM - single byte $5C following string table

## References
- "basic_startup_and_init" — expands on INIT using these vectors and printing the power-up message

## Labels
- IERROR
- IMAIN
- ICRNCH
- IQPLOP
- IGONE
- IEVAL
