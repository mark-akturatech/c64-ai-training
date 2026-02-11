# Compute and prepare tape timing thresholds; save into CIA1 timers and CRA shadow

**Summary:** This routine computes timing thresholds for tape operations, configures the CIA1 timers accordingly, and updates the Control Register A (CRA) and its shadow. It processes tape timing constants stored in zero-page addresses $B0 and $B1, performs arithmetic operations to determine the appropriate timer values, and sets up the timers to manage tape read/write operations.

**Operation**

- **Entry Assumption:** The X register contains the tape timing constant maximum byte, which is saved into zero-page address $B1.

- **Compute Timing Constant:**
  - Load the tape timing constant minimum byte from $B0.
  - Multiply this value by 5:
    - ASL (Arithmetic Shift Left) twice to multiply by 4.
    - Add the original $B0 value to achieve multiplication by 5.
  - Add the value from $B1 (initially set from X) to the result.
  - Store the final result back into $B1.

- **Prepare for Multi-Byte Addition:**
  - Clear the accumulator.
  - Test the sign bit of $B0 using the BIT instruction.
  - If the sign bit is set (negative), skip the next instruction; otherwise, perform a ROL (Rotate Left) on the accumulator.
  - Perform two ASL operations on $B1, each followed by a ROL on the accumulator.
  - Transfer the accumulator to the X register.

- **Poll CIA1 Timer B:**
  - Continuously read the low byte of Timer B ($DC06) until its value is greater than or equal to #$16.

- **Set CIA1 Timer A:**
  - Add the value in $B1 to the accumulator and store the result in the low byte of Timer A ($DC04).
  - Transfer the X register to the accumulator, add the high byte of Timer B ($DC07), and store the result in the high byte of Timer A ($DC05).

- **Update Control Registers:**
  - Load the shadow copy of Control Register B (CRB) from $02A2.
  - Store this value into Control Register A ($DC0E) and its shadow copy at $02A4.

This sequence effectively schedules CIA1 Timer A to trigger at a future point determined by the computed timing offset, facilitating precise tape operation timing.

## Source Code

```assembly
.,F8E2 86 B1    STX $B1         ; Save tape timing constant max byte
.,F8E4 A5 B0    LDA $B0         ; Load tape timing constant min byte
.,F8E6 0A       ASL             ; Multiply by 2
.,F8E7 0A       ASL             ; Multiply by 4
.,F8E8 18       CLC             ; Clear carry for addition
.,F8E9 65 B0    ADC $B0         ; Add min byte to achieve *5
.,F8EB 18       CLC             ; Clear carry for addition
.,F8EC 65 B1    ADC $B1         ; Add max byte
.,F8EE 85 B1    STA $B1         ; Store result in $B1
.,F8F0 A9 00    LDA #$00        ; Clear accumulator
.,F8F2 24 B0    BIT $B0         ; Test sign bit of $B0
.,F8F4 30 01    BMI $F8F7       ; If negative, skip next instruction
.,F8F6 2A       ROL             ; Rotate left accumulator
.,F8F7 06 B1    ASL $B1         ; Shift $B1 left
.,F8F9 2A       ROL             ; Rotate left accumulator
.,F8FA 06 B1    ASL $B1         ; Shift $B1 left
.,F8FC 2A       ROL             ; Rotate left accumulator
.,F8FD AA       TAX             ; Transfer accumulator to X
.,F8FE AD 06 DC LDA $DC06       ; Load CIA1 Timer B low byte
.,F901 C9 16    CMP #$16        ; Compare with #$16
.,F903 90 F9    BCC $F8FE       ; Loop if less
.,F905 65 B1    ADC $B1         ; Add $B1 to accumulator
.,F907 8D 04 DC STA $DC04       ; Store in CIA1 Timer A low byte
.,F90A 8A       TXA             ; Transfer X to accumulator
.,F90B 6D 07 DC ADC $DC07       ; Add CIA1 Timer B high byte
.,F90E 8D 05 DC STA $DC05       ; Store in CIA1 Timer A high byte
.,F911 AD A2 02 LDA $02A2       ; Load CRB shadow copy
.,F914 8D 0E DC STA $DC0E       ; Store in CIA1 Control Register A
.,F917 8D A4 02 STA $02A4       ; Store in CRA shadow copy
```

## Key Registers

- **$B0**: Zero-page address storing the tape timing constant minimum byte.
- **$B1**: Zero-page address storing the tape timing constant maximum byte (computed as 5 * $B0 + initial X).
- **$02A2**: Zero-page address holding the shadow copy of CIA1 Control Register B (CRB).
- **$02A4**: Zero-page address for the shadow copy of CIA1 Control Register A (CRA).
- **$DC04-$DC05**: CIA1 Timer A low and high bytes, respectively.
- **$DC06-$DC07**: CIA1 Timer B low and high bytes, respectively.
- **$DC0E**: CIA1 Control Register A (CRA).

## References

- "check_flag_interrupt_and_invoke_irq" — This setup is invoked via JSR from the interrupt pre-check.
- "irq_routine_read_t2c_and_compute_difference" — The IRQ routine reads timer values that depend on these timing thresholds.