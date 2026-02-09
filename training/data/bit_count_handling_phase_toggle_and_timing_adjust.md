# Tape bit-count bookkeeping (C64 ROM, snippet F98B–F9AA)

**Summary:** Processes tape receiver bit-count bookkeeping and timing update: reads bit count ($B4), saves it to $A8, updates a start-bit-check flag ($A9) via INC/DEC, computes a timing adjustment into $92 (SEC; SBC #$13; SBC $B1; ADC $92), toggles the tape bit-cycle phase in $A4 (EOR #$01), and conditionally stores X into $D7 for later comparison.

## Description
This ROM fragment handles bookkeeping after a detected tape pulse (bit classified). Flow and effects:

- LDA $B4 / BEQ $F9AC
  - Loads the received bit count from zero page $B4. If zero, control branches to $F9AC (no further bookkeeping required).
- STA $A8
  - Saves the receiver bit count into zero page $A8 for later use.
- INC $A9 / BCS $F999 / DEC $A9
  - Intended to update a start-bit-check flag at $A9 (increment or decrement depending on a branch). Note: INC and DEC modify N/V/Z flags but do not affect the carry flag; the BCS between them therefore appears inconsistent with 6502 semantics (see note below).
- Timing adjustment into $92
  - SEC
  - SBC #$13       ; subtract immediate 0x13
  - SBC $B1        ; subtract tape timing constant (max) from $B1
  - ADC $92        ; add current timing constant in $92
  - STA $92        ; store adjusted timing constant back to $92
  - This sequence computes an adjusted timing value (signed/offset arithmetic) and stores it in $92 for subsequent timing use.
- Toggle tape bit-cycle phase ($A4)
  - LDA $A4
  - EOR #$01
  - STA $A4
  - BEQ $F9D5
    - Toggles the phase bit (0/1) in $A4. If the result becomes zero the routine branches to $F9D5; otherwise execution continues.
- Conditional store of X into $D7
  - STX $D7
  - Executed only if the BEQ after the EOR did not branch (i.e., A4 toggled to a non-zero value). $D7 is used later for comparison.

**[Note: Source may contain an error — the BNE at $F991 and the BCS at $F993 are inconsistent with preceding flag-setting instructions. Specifically:**
- The BNE at $F991 uses the Z flag set by the earlier LDA $B4; because LDA set Z, the BNE will always mirror the earlier BEQ decision, making the INC/DEC sequence unreachable as listed.
- The INC instruction does not affect the carry flag, so the subsequent BCS $F999 is suspicious; it suggests an OCR/disassembly error or an incorrect opcode in the listing.]

## Source Code
```asm
.,F98B A5 B4    LDA $B4         get the bit count
.,F98D F0 1D    BEQ $F9AC       if all done go ??
.,F98F 85 A8    STA $A8         save receiver bit count in
.,F991 D0 19    BNE $F9AC       branch always
.,F993 E6 A9    INC $A9         increment ?? start bit check flag
.,F995 B0 02    BCS $F999       
.,F997 C6 A9    DEC $A9         decrement ?? start bit check flag
.,F999 38       SEC             
.,F99A E9 13    SBC #$13        
.,F99C E5 B1    SBC $B1         subtract tape timing constant max byte
.,F99E 65 92    ADC $92         add timing constant for tape
.,F9A0 85 92    STA $92         save timing constant for tape
.,F9A2 A5 A4    LDA $A4         get tape bit cycle phase
.,F9A4 49 01    EOR #$01        
.,F9A6 85 A4    STA $A4         save tape bit cycle phase
.,F9A8 F0 2B    BEQ $F9D5       
.,F9AA 86 D7    STX $D7         
```

## Key Registers
- $B4 - Zero page - received bit count (input)
- $A8 - Zero page - saved receiver bit count (backup)
- $A9 - Zero page - start-bit-check flag (increment/decrement here)
- $B1 - Zero page - tape timing constant (max byte used in SBC)
- $92 - Zero page - timing constant/adjusted timing value
- $A4 - Zero page - tape bit-cycle phase (0/1)
- $D7 - Zero page - temporary store for X (for later comparison)

## References
- "pulse_classification_and_store_character_calls" — expands on bookkeeping after a classified pulse
- "timer_a_check_clear_phase_and_timing_setup" — expands on subsequent checks that clear phase or set timing and may exit the IRQ