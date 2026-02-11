# KERNAL ISOUR / ISR Serial-send Routines ($ED47-$EDAC)

**Summary:** KERNAL serial-bus send routine and ISR sequence that implements EOI handling, clocks and drives DATA via CLK/DATA subroutines ($EE85/$EE8E/$EE97/$EEA0/$EEA9), debounces the PIA/CIA inputs, programs a 1 ms CIA1 timer ($DC07/$DC0F/$DC0D), and detects framing/device-present errors (FRMERR, NODEV). Searchable terms: $ED47, $ED5A, $EEA9 (DEBPIA), DEBPIA, D2PRA ($DD00), D1T2H ($DC07), D1CRB ($DC0F), D1ICR ($DC0D), FRMERR, NODEV.

**Operation**

This code fragment is the ISOUR/ISOURA path in the KERNAL that transmits a buffered byte stream on the serial bus with optional EOI (End-Or-Instruction/EOM) signaling and framing error detection.

High-level flow:

- Entry begins at $ED47. If device-not-present flag is set, the code branches to NODEV (device error).
- The clock line is first set high via JSR CLKHI ($EE85).
- BIT $A3 inspects the EOI flag (symbolic name R2D2 in the comments). If EOI is set, the EOI sequence is executed:
  - DEBPIA ($EEA9) is repeatedly called to debounce and wait for DATA transitions (wait for DATA high, then DATA low).
- If no EOI, the routine still calls DEBPIA and then forces the clock low (JSR CLKLO at $EE8E) to prepare for bit transmission.
- Transmission setup:
  - A byte bit-count of 8 is loaded into COUNT ($A5).
  - ISR01 loop polls CIA2 port A ($DD00, commented D2PRA) to debounce the bus until a stable read (loop ISR01).
  - An ASL A is used to set flags (shifts the read byte into the carry); BCC branches to FRMERR if the required data bit condition is not met (data must be high).
  - ROR $95 rotates the BSOUR byte (source buffer) right to put the next bit into carry. If the carry is set, branch to ISRHI which calls DATAHI; otherwise, call DATALO.
  - CLK is pulsed high (JSR CLKHI at $EE85) and a small NOP delay sequence follows.
  - After the clock high and a short delay, $DD00 is read, modified (AND/ORA) to set DATA high / CLOCK low bits in the CIA port A value, and stored back to $DD00 to physically drive the lines (STA D2PRA).
  - The bit counter ($A5) is decremented and the loop repeats until all 8 bits are sent.
- After 8 bits, the routine programs CIA1 Timer 2 for a nominal 1 ms interval: store 1ms into D1T2H ($DC07), trigger the timer via D1CRB ($DC0F), then poll/clear interrupt flags in D1ICR ($DC0D).
  - If the timer indicates a framing error condition, branch to FRMERR.
  - Otherwise, DEBPIA is used to wait for the expected DATA line state; interrupts are re-enabled (CLI) and the routine RTS returns.
- NODEV is the device-not-present error return path (loads $80 into A and then a .BYTE $2C placeholder appears, likely an error-code byte or padding). FRMERR label exists but its handler is not included in this fragment.

Important behavioral details preserved from the code:

- DEBPIA ($EEA9) is used frequently to debounce the PIA/CIA inputs; loops use BCC/BCS to wait for the required polarity changes.
- Clock and data are manipulated via separate subroutines (CLKHI/CLKLO/DATAHI/DATALO at $EE85/$EE8E/$EE97/$EEA0).
- CIA1 Timer 2 is used to implement a 1 ms framing/timing window (writes to $DC07, $DC0F, and polling $DC0D).
- Framing error test is performed after timing: branch to FRMERR on timer or data-state failures.
- Zero page variables referenced: $A3 (EOI flag / R2D2), $A5 (COUNT), $95 (BSOUR) — their symbol-to-address mapping is not contained in this fragment.

## Labels
- ISOUR
- ISOURA
- DEBPIA
- D2PRA
- D1T2H
- D1CRB
- D1ICR
