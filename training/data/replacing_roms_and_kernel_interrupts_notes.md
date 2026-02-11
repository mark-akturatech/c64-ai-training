# ROM swapping — replacing ROMs with RAM-resident OS or applications

**Summary:** Advanced techniques for swapping out C64 ROMs (BASIC, Kernal, Character ROM) by using the processor port ($0001) LORAM/HIRAM/CHAREN bits to give an application access to ROM-overlaid RAM; warns that Kernal contains interrupt vectors ($FFFA-$FFFF) so interrupts must be disabled before removing the Kernal.

**Advanced ROM swapping**
Machine-language applications can replace one or more of the system ROMs by loading their code into RAM and changing the memory map so the RAM image is visible in the usual ROM address ranges. Typical uses described:

- Load an alternate language or runtime into RAM and switch out the BASIC ROM so the new language occupies $A000-$BFFF while continuing to use the OS/Kernal for low-level I/O.
- Load a complete OS or an application (for example, a spreadsheet with its own I/O and screen-editing routines) into RAM and switch out all ROMs to gain use of the RAM beneath those ROMs for program code and data.
- Modify character sets or custom text output by switching out the Character ROM ($D000-$DFFF) and replacing it with a RAM copy (see CHAREN usage).

Important caveat: the Kernal area contains the CPU interrupt vectors (NMI, RESET, IRQ/BRK). Before switching the Kernal ROM ($E000-$FFFF) out of the map, interrupts must be disabled so the CPU does not fetch vectors from the now-unmapped or different memory. (Use SEI to mask IRQ/BRK; NMI must also be considered.) Failure to handle vectors and interrupts will cause crashes or unpredictable behavior.

The same mapping facility (LORAM/HIRAM/CHAREN on $0001) can be used selectively — for example, swapping only BASIC but leaving the Kernal active — allowing a loaded language to coexist with the system Kernal or conversely replacing Kernal routines when the application provides its own low-level services.

The technique has been used to insert new commands into a RAM-resident BASIC by relocating vectors (see references), and to create RAM-based replacements for ROM routines. When designing such swaps, ensure:
- All required ROM services used by the loaded program are either kept mapped in or reimplemented in RAM.
- Interrupt vectors and other fixed-address data are preserved or redirected before disabling the Kernal.
- Character ROM considerations (charset rendering vs. I/O chip access) are handled when changing CHAREN.

## Source Code
```assembly
; Example: Copying BASIC ROM to RAM and switching it out

; Disable interrupts
SEI

; Set up source and destination pointers
LDX #$00
LDA #$A0
STA $FC ; Source high byte
LDA #$00
STA $FD ; Source low byte
LDA #$20
STA $FE ; Destination high byte
LDA #$00
STA $FF ; Destination low byte

; Copy 8 KB from $A000-$BFFF to $2000-$3FFF
CopyLoop:
    LDA ($FC),Y
    STA ($FE),Y
    INY
    BNE CopyLoop
    INC $FD
    INC $FF
    LDA $FD
    CMP #$C0
    BNE CopyLoop

; Switch out BASIC ROM by clearing LORAM (bit 0) in $0001
LDA $01
AND #%11111110
STA $01

; Restore interrupts
CLI
```

## Key Registers
- $0001 - CPU port - LORAM / HIRAM / CHAREN memory-mapping bits (controls whether BASIC, Kernal, Character ROMs are visible)
- $A000-$BFFF - BASIC ROM address range (switchable to RAM)
- $D000-$DFFF - Character ROM / I/O overlay range (CHAREN-controlled)
- $E000-$FFFF - Kernal ROM address range (contains interrupt vectors)
- $FFFA-$FFFF - CPU interrupt/vector addresses (NMI, RESET, IRQ/BRK) — located in Kernal area

## References
- "loram_hiram_and_moving_rom_to_ram_examples" — Practical examples of moving BASIC to RAM and modifying it  
- "charen_bit_and_reading_character_rom_into_ram" — Switching character ROM in/out when doing character-set modifications