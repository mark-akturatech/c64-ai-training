# Tape timing adjust & start-bit/save-sync snippet ($F9D5-$F9F8)

**Summary:** Adjusts cassette/tape timing constants ($92, $B0), optionally patches the following opcode with a .BYTE entry, clears the timing-adjust flag, compares saved X ($D7) and branches, checks start-bit detection counters ($A9) and saves the cassette block synchronization number ($96), then toggles $9B via EOR and prepares to exit.

## Description
This code fragment performs timing-tuning and start-bit/synchronization bookkeeping used by the C64 cassette routine:

- Load $92 (timing-adjust flag/byte). If zero, skip timing adjustment. If negative, branch to increment path; otherwise decrement $B0 (the minimum timing byte). A .BYTE $2C is interleaved at $F9DD (see Source Code) to alter the following instruction stream (noted in the original listing).
- If the negative branch is taken the routine instead increments $B0. After adjustment the timing flag $92 is cleared (store #$00 into $92).
- Compare X with $D7 (saved X). If not equal, branch to $F9F7 (continuation elsewhere).
- Transfer X to A (TXA) and test A with BNE-style flow: a BNE follows, branching if A != 0. (This is testing X via flags set by TXA.)
- Load $A9 (start-bit check counter/flag). If negative (BMI) or less than #$10 (CMP #$10; BCC), branch to the start-bit handling continuation at $F9AC. If it passes those checks, store A into $96 — saving the cassette block synchronization number — and branch on carry (BCS) back into the start-bit handler.
- At $F9F7 a TXA is performed again and $9B is toggled with EOR $9B before the routine continues/returns.

All memory operands shown are zero-page variables used by the cassette/tape driver: $92 (timing-adjust flag), $B0 (min timing byte), $D7 (saved X), $A9 (start-bit counter/flag), $96 (saved sync/block number), $9B (toggle byte).

## Source Code
```asm
.,F9D5 A5 92    LDA $92         get timing constant for tape
.,F9D7 F0 07    BEQ $F9E0       
.,F9D9 30 03    BMI $F9DE       
.,F9DB C6 B0    DEC $B0         decrement tape timing constant min byte
.:F9DD 2C       .BYTE $2C       makes next line BIT $B0E6
.,F9DE E6 B0    INC $B0         increment tape timing constant min byte
.,F9E0 A9 00    LDA #$00        
.,F9E2 85 92    STA $92         clear timing constant for tape
.,F9E4 E4 D7    CPX $D7         
.,F9E6 D0 0F    BNE $F9F7       
.,F9E8 8A       TXA             
.,F9E9 D0 A0    BNE $F98B       
.,F9EB A5 A9    LDA $A9         get start bit check flag
.,F9ED 30 BD    BMI $F9AC       
.,F9EF C9 10    CMP #$10        
.,F9F1 90 B9    BCC $F9AC       
.,F9F3 85 96    STA $96         save cassette block synchronization number
.,F9F5 B0 B5    BCS $F9AC       
.,F9F7 8A       TXA             
.,F9F8 45 9B    EOR $9B         
```

## Key Registers
- $0092 - Zero Page - timing-adjust flag / tape timing constant indicator
- $00B0 - Zero Page - minimum timing byte for tape pulse classification
- $00D7 - Zero Page - saved X register value for comparison
- $00A9 - Zero Page - start-bit check counter / flag
- $0096 - Zero Page - saved cassette block synchronization number
- $009B - Zero Page - toggle byte (EOR'd to change state)

## References
- "timer_a_check_clear_phase_and_timing_setup" — continues timing tuning and start-bit checks
- "pulse_classification_and_store_character_calls" — uses the sync/block counters updated here

## Labels
- $0092
- $00B0
- $00D7
- $00A9
- $0096
- $009B
