# KERNAL Subroutine (F8E2–F92B) — Compute Device/Disk/Tape Transfer Offsets

**Summary:** This 6502 KERNAL routine (F8E2–F92B) computes transfer offsets for device, disk, or tape operations. It performs arithmetic on zero-page addresses $B0 and $B1, reads values from CIA1 timer registers at $DC06 and $DC07, and writes computed values into $DC04, $DC05, $DC0E, and $DC0D. Temporary values are stored in $02A2 and $02A4. The routine concludes by pushing two bytes onto the stack and either jumping to $FF43 (dispatch) or executing CLI and RTS instructions.

**Description**

This KERNAL subroutine calculates an offset used for device, disk, or tape transfer pointers based on the values in zero-page addresses $B0 and $B1. The computed offset is then stored in specific memory locations and CIA registers. The routine's behavior includes:

- **Arithmetic Operations on $B0 and $B1:**
  - Store the X register value into $B1.
  - Compute 5 times the value in $B0 plus the value in $B1, storing the 8-bit result back into $B1:
    - `STX $B1`
    - `LDA $B0; ASL; ASL; CLC; ADC $B0`  ; (4 * $B0 + $B0) => 5 * $B0
    - `CLC; ADC $B1; STA $B1`

- **Bitwise Operations:**
  - Perform a series of rotates and shifts involving the accumulator and $B1. The exact sequence depends on the most significant bit (bit 7) of $B0:
    - If bit 7 of $B0 is set (1), skip the initial rotate; otherwise, perform an initial rotate.
    - Execute two ASL operations on $B1, each followed by a ROL instruction.
    - Transfer the accumulator value to the X register.
  - This sequence derives an index value stored in the X register.

- **Loop with CIA1 Timer Register:**
  - Load the value from $DC06 (CIA1 Timer B Low Byte) and compare it to #$16.
  - If the value is less than #$16, branch back to reload and compare again.
  - This loop ensures that the value in $DC06 meets the required condition before proceeding.

- **Offset Calculation and Storage:**
  - Add the value in $B1 to the value read from $DC06 and store the result in $DC04 (CIA1 Timer A Low Byte).
  - Transfer the X register value to the accumulator, add the value from $DC07 (CIA1 Timer B High Byte), and store the result in $DC05 (CIA1 Timer A High Byte).

- **Temporary Storage:**
  - Load the value from $02A2 and store it in both $DC0E (CIA1 Control Register A) and $02A4.

- **Conditional Branching:**
  - Load the value from $DC0D (CIA1 Interrupt Control Register) and perform a bitwise AND with #$10.
  - If the result is zero (bit 4 is clear), execute CLI and RTS to return from the subroutine.
  - If bit 4 is set, push #$F9 and #$2A onto the stack and jump to $FF43 (dispatch routine).

## Source Code

```assembly
.,F8E2 86 B1    STX $B1
.,F8E4 A5 B0    LDA $B0
.,F8E6 0A       ASL
.,F8E7 0A       ASL
.,F8E8 18       CLC
.,F8E9 65 B0    ADC $B0
.,F8EB 18       CLC
.,F8EC 65 B1    ADC $B1
.,F8EE 85 B1    STA $B1
.,F8F0 A9 00    LDA #$00
.,F8F2 24 B0    BIT $B0
.,F8F4 30 01    BMI $F8F7
.,F8F6 2A       ROL
.,F8F7 06 B1    ASL $B1
.,F8F9 2A       ROL
.,F8FA 06 B1    ASL $B1
.,F8FC 2A       ROL
.,F8FD AA       TAX
.,F8FE AD 06 DC LDA $DC06
.,F901 C9 16    CMP #$16
.,F903 90 F9    BCC $F8FE
.,F905 65 B1    ADC $B1
.,F907 8D 04 DC STA $DC04
.,F90A 8A       TXA
.,F90B 6D 07 DC ADC $DC07
.,F90E 8D 05 DC STA $DC05
.,F911 AD A2 02 LDA $02A2
.,F914 8D 0E DC STA $DC0E
.,F917 8D A4 02 STA $02A4
.,F91A AD 0D DC LDA $DC0D
.,F91D 29 10    AND #$10
.,F91F F0 09    BEQ $F92A
.,F921 A9 F9    LDA #$F9
.,F923 48       PHA
.,F924 A9 2A    LDA #$2A
.,F926 48       PHA
.,F927 4C 43 FF JMP $FF43
.,F92A 58       CLI
.,F92B 60       RTS
```

## Key Registers

- **$B0–$B1:** Zero-page RAM locations used as input bytes; $B1 is updated with the computed value of 5 * $B0 + $B1 and further shifted.
- **$02A2:** RAM location holding an intermediate value stored to $DC0E and mirrored to $02A4.
- **$02A4:** RAM location receiving the value from $02A2 (mirror).
- **$DC04–$DC07:** CIA1 Timer registers:
  - **$DC04:** Timer A Low Byte (TALO)
  - **$DC05:** Timer A High Byte (TAHI)
  - **$DC06:** Timer B Low Byte (TBLO)
  - **$DC07:** Timer B High Byte (TBHI)
- **$DC0D–$DC0E:** CIA1 Control Registers:
  - **$DC0D:** Control Register A (CRA)
  - **$DC0E:** Control Register B (CRB)

## References

- "initialize_system_and_device_state_for_io" — Details the setup and usage of tables at $DCxx during system initialization.
- "store_c1_c2_into_ad_ac" — Describes helper routines that rearrange pointer bytes for I/O operations, following conventions used elsewhere in the KERNAL.