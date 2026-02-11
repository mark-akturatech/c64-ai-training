# Primary data load loop — STA ($07),Y, XOR checksum, 16-bit end compare, $D020 flash

**Summary:** C64 loader data-read loop that writes A into memory via indirect STA ($07),Y using zero page pointer $07/$08, computes an XOR checksum in $05, increments the 16‑bit destination pointer ($07/$08), toggles the border color via $D020, and does a 16‑bit compare against end pointer $09/$0A to switch to the checksum stage.

## Loop behaviour and mechanics
- Entry: A contains the byte read from tape; Y is set to #$00.
- Store: STA ($07),Y stores A at the 16‑bit address in zero page $07/$08.
- Checksum: The byte is XORed into the running checksum in $05 (EOR $05; STA $05).
- Pointer increment: The low byte $07 is INCed; if it overflows to zero the code INCs the high byte $08.
- Border flash: On high‑byte increment path the code also INCs $D020 to change the VIC‑II border color (simple visual activity indicator).
- 16‑bit end test: The routine performs a 16‑bit compare of the current destination pointer ($07/$08) against the end pointer ($09/$0A):
  - It compares the low bytes (LDA $07; CMP $09).
  - It then loads the high byte (LDA $08) and executes SBC $0A to take the low‑byte compare into account (standard 16‑bit compare using CMP then SBC).
  - If the result indicates the pointer is still less than the end address, a BCC branches back to continue reading.
- Transition to checksum stage: When the end is reached (compare fails to branch), the code patches runtime memory to change a branch target:
  - It loads #$67 and stores it to $036D — this modifies the branch at $036C so execution will jump to the checksum/read‑checksum routine at $03D5.
  - A following BNE uses the Zero flag left from the SBC to decide control flow (the Zero flag from the SBC still influences the branch at 03D3).

**Behavioral notes**
- The write uses indirect indexed addressing (STA ($07),Y) with Y=0, so $07/$08 form the 16‑bit destination pointer.
- Checksum is a simple XOR accumulator in $05.
- The increment and compare form a full 16‑bit pointer increment/compare pair using low‑then‑high byte idioms (INC + BNE on low byte, INC high byte on overflow; CMP low + SBC high for compare).
- $D020 is used here as a low‑cost visual indicator by incrementing the border color (VIC‑II border register).

**[Note: Source may contain an error — the BNE at $03D3 relies on the Zero flag set by the preceding SBC; interpretation requires the SBC/flags sequence to be considered.]**

## Source Code
```asm
; ********************************************
; * Read Data bytes                          *
; ********************************************
03B3  A0 00          LDY #$00
03B5  91 07          STA ($07),Y    ; Load data into memory
03B7  45 05          EOR $05        ; Compute checksum
03B9  85 05          STA $05
03BB  E6 07          INC $07
03BD  D0 05          BNE $03C4
03BF  E6 08          INC $08

03C1  EE 20 D0       INC $D020      ; Change the border flash base colors

03C4  A5 07          LDA $07        ; Check if we finished
03C6  C5 09          CMP $09
03C8  A5 08          LDA $08
03CA  E5 0A          SBC $0A
03CC  90 AB          BCC $0379
03CE  A9 67          LDA #$67
03D0  8D 6D 03       STA $036D      ; Change the branch at $036C, to jump to $03D5
03D3  D0 A4          BNE $0379      ; (6)
; ********************************************
; * Read data bytes.END                      *
; ********************************************
```

## Key Registers
- $05 - Zero page - running XOR checksum accumulator
- $07-$08 - Zero page - 16-bit destination pointer (used by STA ($07),Y)
- $09-$0A - Zero page - 16-bit end/destination end address for compare
- $036C-$036D - RAM - branch/patch area (code at $036C patched via STA $036D to redirect flow)
- $D020 - VIC-II - border color register (incremented to produce border flash)

## References
- "read_checksum_byte" — After data loop completes, loader reads and compares checksum
- "loader_structure" — Maps this read loop to the loader's data layout