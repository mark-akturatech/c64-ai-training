# Prepare parameters for SAVE: store end address into $AE/$AF, copy index into start pointer, load I/O start addresses into $C1/$C2, then JMP ($0332)

**Summary:** Stores end address (X/Y) into $AE/$AF, copies A (index) into X for indexed zero-page lookup of start address bytes which are written to $C1/$C2, then performs an indirect JMP through the KERNAL vector at $0332 (JMP ($0332)) to the device-specific SAVE implementation (commonly $F685). Searchable terms: $AE, $AF, $C1, $C2, $0332, JMP ($0332), TAX, LDA $00,X, LDA $01,X.

## Operation
This routine prepares the KERNAL SAVE call by storing the end address and resolving the start address pointer from a table indexed by the accumulator:

- Input registers: A = index into a start-address table, X/Y = end address low/high bytes.
- Step 1: STX $AE / STY $AF — save the end address low/high into zero-page variables $AE/$AF so the SAVE implementation knows where to stop.
- Step 2: TAX — copy A into X so X can be used as the pointer index.
- Step 3: LDA $00,X / STA $C1 — load the start-address low byte from zero page base $00 + X and store it into $C1 (I/O start address low).
- Step 4: LDA $01,X / STA $C2 — load the start-address high byte from zero page base $01 + X and store it into $C2 (I/O start address high).
- Step 5: JMP ($0332) — indirect jump through KERNAL vector at $0332 to transfer control to the actual SAVE implementation (device-specific; commonly points to $F685).

Behavioral notes:
- The routine assumes a table of start addresses stored as low/high byte pairs at zero-page addresses beginning at $00 (accessed via $00,X and $01,X).
- $C1/$C2 are used by the subsequent SAVE implementation as the I/O start address (device-dependent).
- $AE/$AF hold the end address for the save operation and are read by the SAVE implementation to determine the byte count/stop condition.
- JMP ($0332) uses the 16-bit vector at $0332; changing that vector redirects all KERNAL SAVE calls.

## Source Code
```asm
.,F5DD 86 AE    STX $AE         ; save end address low byte
.,F5DF 84 AF    STY $AF         ; save end address high byte
.,F5E1 AA       TAX             ; copy index to start pointer
.,F5E2 B5 00    LDA $00,X       ; get start address low byte
.,F5E4 85 C1    STA $C1         ; set I/O start address low byte
.,F5E6 B5 01    LDA $01,X       ; get start address high byte
.,F5E8 85 C2    STA $C2         ; set I/O start address high byte
.,F5EA 6C 32 03 JMP ($0332)     ; go save, usually points to $F685
```

## Key Registers
- $00-$01 - Zero Page - start-address table base (low/high) indexed by X
- $AE - Zero Page - save end address low byte
- $AF - Zero Page - save end address high byte
- $C1-$C2 - Zero Page - I/O start address low/high used by SAVE implementation
- $0332 - KERNAL vector - indirect jump vector for SAVE implementation (JMP ($0332), commonly points to $F685)

## References
- "save_dispatch_and_serial_bus_output" — expands into device-specific SAVE dispatch and serial-bus save implementation

## Labels
- AE
- AF
- C1
- C2
