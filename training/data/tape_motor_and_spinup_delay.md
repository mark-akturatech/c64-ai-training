# Enable cassette motor and long spin-up delay (ROM)

**Summary:** This routine enables the cassette motor by manipulating the 6510 CPU I/O port at $0001, sets the tape motor interlock flag at $00C0, and executes nested delay loops to allow the motor to reach operational speed before commencing tape I/O operations.

**Description**

This ROM snippet performs the following steps:

1. **Enable Cassette Motor:**
   - Reads the 6510 I/O port at $0001.
   - Applies an AND operation with #$1F to clear bits 5–7, preserving bits 0–4.
   - Writes the modified value back to $0001.
   - Stores the same value into zero-page location $C0, serving as a software flag indicating the motor is enabled.

2. **Delay Loop:**
   - Executes a nested loop using LDX/LDY with DEY/BNE and DEX/BNE to create a delay, allowing the cassette motor to stabilize before initiating tape read/write operations.

**Cycle Count Note:** The source comments indicate a 326,656-cycle delay. Recalculating the loop timing yields 326,654 cycles.

**Cycle Calculation:**

- **Inner Loop (LDY #$FF; DEY/BNE):**
  - DEY: 2 cycles × 255 iterations = 510 cycles
  - BNE (taken): 3 cycles × 254 iterations = 762 cycles
  - BNE (not taken): 2 cycles × 1 iteration = 2 cycles
  - **Total per Inner Loop:** 510 + 762 + 2 = 1,274 cycles

- **Outer Loop (LDX #$FF; DEX/BNE):**
  - LDY #$FF: 2 cycles × 255 iterations = 510 cycles
  - Inner Loop: 1,274 cycles × 255 iterations = 324,870 cycles
  - DEX: 2 cycles × 255 iterations = 510 cycles
  - BNE (taken): 3 cycles × 254 iterations = 762 cycles
  - BNE (not taken): 2 cycles × 1 iteration = 2 cycles
  - **Total:** 510 + 324,870 + 510 + 762 + 2 = 326,654 cycles

**Note:** The original comment indicates 326,656 cycles; however, the recalculated total is 326,654 cycles.

## Source Code

```asm
.,F8AB A5 01    LDA $01         ; read the 6510 I/O port
.,F8AD 29 1F    AND #$1F        ; clear bits 5–7, preserve bits 0–4
.,F8AF 85 01    STA $01         ; write back to 6510 I/O port
.,F8B1 85 C0    STA $C0         ; set tape motor interlock flag
                                ; 326,654-cycle delay to allow motor stabilization
.,F8B3 A2 FF    LDX #$FF        ; outer loop counter
.,F8B5 A0 FF    LDY #$FF        ; inner loop counter
.,F8B7 88       DEY             ; decrement Y
.,F8B8 D0 FD    BNE $F8B7       ; branch if Y ≠ 0
.,F8BA CA       DEX             ; decrement X
.,F8BB D0 F8    BNE $F8B5       ; branch if X ≠ 0
```

## Key Registers

- **$0001**: 6510 CPU I/O Port
  - **Bit 5**: Cassette Motor Control; 0 = On, 1 = Off
- **$00C0**: Zero-page location used as a tape motor interlock flag

## References

- "tape_read_write_setup_and_irq_save" — details setup and IRQ handling for tape operations
- "cassette_sense_return" — discusses cassette sense/read routines and their relation to motor and switch control