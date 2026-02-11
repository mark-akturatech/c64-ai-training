# Interrupt-time tape/serial I/O timing and status handling (C64 ROM $F9FA–$FA5D)

**Summary:** 6502 assembly handling cassette/RS-232 timing and status in the C64 KERNAL: decrements EOI flag ($A3), updates parity/count (LSR $D7 / ROR $BF), computes timer intervals and calls timing setup (JSR $F8E2), enables/disables VIA 1 Timer A interrupt via $DC0D, and saves parity/receiver-bit-count flags into zero-page ($BD/$B6/$A8).

## Description
This ROM interrupt routine services tape and serial I/O timing and status. Key behaviors and control flow:

- Early return path:
  - Tests zero-page flag $B4; if clear, continues; otherwise returns early.
  - Decrements the EOI flag byte at $A3 (DEC $A3). If result negative (BMI), branches to an alternate path.
  - Shifts the receiver bit buffer (LSR $D7) and rotates the parity/count byte (ROR $BF) to update parity/bit-count state (zero-page variables).
  - Loads X with #$DA and calls the timing setup subroutine at $F8E2 (JSR $F8E2) to set the maximum timing value, then jumps to $FEBC to restore registers and exit the interrupt.

- Cassette-block and EOI handling:
  - Reads cassette block synchronization number at $96. If zero, skips to EOI check.
  - If $B4 is nonzero, skip; otherwise further EOI checks occur.
  - Loads EOI flag ($A3); if negative (BMI), branches to routine at $F997 (EOI handling).
  - Uses a computed timing window derived from tape timing constants:
    - Shifts $B1 right (LSR $B1) to form a high timing byte.
    - Uses immediate #$93, sets carry (SEC), subtracts $B1 (SBC $B1) and adds $B0 (ADC $B0), then ASL and TAX to place the computed high timing byte into X.
    - Calls JSR $F8E2 to program the timer using X (timing max byte).
  - Increments $9C (INC $9C) — a per-interrupt counter/index.

- Timer A interrupt enable/disable and synchronization bookkeeping:
  - If $B4==0 and $96 nonzero: stores receiver bit count into $A8, clears A, and clears $96 (cassette sync number).
  - Loads #$81 into A and stores to $DC0D (STA $DC0D) to enable VIA 1 Timer A interrupt (ICR) — saved in zero-page $B4 afterwards.
  - If $96==0 path: stores $96 into $B5 and $B4 as needed, and may load #$01 and store to $DC0D to disable Timer A interrupt.
  - Parity and receiver state saved:
    - Loads parity count from $BF and stores into $BD (save RS-232 parity byte).
    - Loads $A8, ORs with $A9 (start-bit check flag), and stores result into $B6 (save receiver bit count/status).
  - Exits the interrupt via JMP $FEBC (restores registers and returns).

Notes on operands and storage:
- Addresses like $A3, $B1, $B0, $B4, $B5, $96, $9C, $A8, $A9, $BF, $BD, $B6, $D7 are zero-page variables used by the KERNAL (bit/byte counters, flags, timing constants, parity).
- $DC0D is VIA 1 Interrupt Control Register (ICR) — used here to enable/disable Timer A interrupt by storing control values ($81 to enable, $01 to disable).
- Timing setup is centralized in subroutine $F8E2; this routine prepares X with the chosen timing-high byte before calling it.

## Source Code
```asm
.,F9FA 85 9B    STA $9B         
.,F9FC A5 B4    LDA $B4         
.,F9FE F0 D2    BEQ $F9D2       
.,FA00 C6 A3    DEC $A3         decrement EOI flag byte
.,FA02 30 C5    BMI $F9C9       
.,FA04 46 D7    LSR $D7         
.,FA06 66 BF    ROR $BF         parity count
.,FA08 A2 DA    LDX #$DA        set timimg max byte
.,FA0A 20 E2 F8 JSR $F8E2       set timing
.,FA0D 4C BC FE JMP $FEBC       restore registers and exit interrupt
.,FA10 A5 96    LDA $96         get cassette block synchronization number
.,FA12 F0 04    BEQ $FA18       
.,FA14 A5 B4    LDA $B4         
.,FA16 F0 07    BEQ $FA1F       
.,FA18 A5 A3    LDA $A3         get EOI flag byte
.,FA1A 30 03    BMI $FA1F       
.,FA1C 4C 97 F9 JMP $F997       
.,FA1F 46 B1    LSR $B1         shift tape timing constant max byte
.,FA21 A9 93    LDA #$93        
.,FA23 38       SEC             
.,FA24 E5 B1    SBC $B1         subtract tape timing constant max byte
.,FA26 65 B0    ADC $B0         add tape timing constant min byte
.,FA28 0A       ASL             
.,FA29 AA       TAX             copy timimg high byte
.,FA2A 20 E2 F8 JSR $F8E2       set timing
.,FA2D E6 9C    INC $9C         
.,FA2F A5 B4    LDA $B4         
.,FA31 D0 11    BNE $FA44       
.,FA33 A5 96    LDA $96         get cassette block synchronization number
.,FA35 F0 26    BEQ $FA5D       
.,FA37 85 A8    STA $A8         save receiver bit count in
.,FA39 A9 00    LDA #$00        clear A
.,FA3B 85 96    STA $96         clear cassette block synchronization number
.,FA3D A9 81    LDA #$81        enable timer A interrupt
.,FA3F 8D 0D DC STA $DC0D       save VIA 1 ICR
.,FA42 85 B4    STA $B4         
.,FA44 A5 96    LDA $96         get cassette block synchronization number
.,FA46 85 B5    STA $B5         
.,FA48 F0 09    BEQ $FA53       
.,FA4A A9 00    LDA #$00        
.,FA4C 85 B4    STA $B4         
.,FA4E A9 01    LDA #$01        disable timer A interrupt
.,FA50 8D 0D DC STA $DC0D       save VIA 1 ICR
.,FA53 A5 BF    LDA $BF         parity count
.,FA55 85 BD    STA $BD         save RS232 parity byte
.,FA57 A5 A8    LDA $A8         get receiver bit count in
.,FA59 05 A9    ORA $A9         OR with start bit check flag
.,FA5B 85 B6    STA $B6         
.,FA5D 4C BC FE JMP $FEBC       restore registers and exit interrupt
```

## Key Registers
- $DC0D - VIA 1 - Interrupt Control Register (ICR) — Timer A interrupt enable/disable stored here

## References
- "store_tape_character_and_buffer_handling" — main routine that stores decoded tape characters, handles copies/counts, and writes/verifies buffer data