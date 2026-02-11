# DEC $DC0D (R-M-W) to acknowledge Timer A IRQ — example and notes

**Summary:** Demonstrates the use of a read-modify-write (R-M-W) instruction, specifically `DEC`, on the CIA1 Interrupt Control Register (ICR) at $DC0D to acknowledge a Timer A interrupt on the Commodore 64. Discusses ICR write semantics, R-M-W dummy-write behavior, and provides a minimal assembly example.

**Description**

This document details the technique of using a 6502 read-modify-write instruction (such as `DEC`, `INC`, `ASL`, `LSR`, etc.) on a CIA I/O register, causing the CPU to perform an implicit read followed by a write. In the 6526 CIA, the Interrupt Control Register (ICR) at $DC0D has specific write semantics: writing with bit 7 clear will clear any interrupt-flag bits that are written as 1; writing with bit 7 set will set bits. An R-M-W instruction like `DEC $DC0D` causes the CPU to read the ICR and then write back a modified value; this write phase interacts with the CIA's ICR write behavior and can clear the Timer A interrupt flag.

Key points:

- **$DC0D is the CIA1 ICR (Interrupt Control Register).**
- **Writing to the ICR acknowledges/clears interrupt flags: writing a 1 in the bit(s) to clear (with bit 7 clear) acknowledges the corresponding interrupt(s).**
- **An R-M-W instruction (e.g., `DEC $DC0D`) causes the CPU to read the ICR and then write back a modified value; this write phase interacts with the CIA's ICR write behavior and can clear the Timer A interrupt flag.**
- **This technique is compact and useful in interrupt service routines (ISRs), but it depends on the exact bits written by the R-M-W instruction; using an explicit `STA` with a mask value is clearer and less error-prone.**

**Note:** The original text incorrectly referred to $DC0D as the "timer control register." In the 6526 CIA, the Timer A Control Register (CRA) is at $DC0E. $DC0D is the ICR (Interrupt Control Register), which is used to acknowledge interrupts.

## Source Code

```asm
; Minimal example: use DEC (R-M-W) on CIA1 ICR ($DC0D) to cause
; the CIA to see a write and thus acknowledge/clear interrupt flags.
; (This relies on CIA ICR write semantics.)

        sei             ; disable interrupts while we acknowledge
        dec $dc0d       ; R-M-W: read ICR, decrement, write back -> triggers ICR write behavior
        cli             ; re-enable interrupts
        rti             ; return from interrupt handler

; Binary/bit-pattern snippets from source (presented verbatim):
; "%1111111C"
; "%01111111"
```

## Source Code

  ```asm
          sei             ; disable interrupts
          lda #$01        ; bit 0 corresponds to Timer A underflow
          sta $dc0d       ; clear Timer A interrupt flag
          cli             ; re-enable interrupts
          rti             ; return from interrupt handler
  ```


## Key Registers

- **$DC0D**: CIA1 Interrupt Control Register (ICR)
- **$DC0E**: CIA1 Control Register A (CRA) for Timer A

## References

- "read_modify_write_dummy_write_behavior" — expands on using R-M-W to write to I/O registers

**Additional Notes**

- **Bit-level map of CIA1 ICR ($DC0D):**

  - **Bit 0**: Timer A underflow
  - **Bit 1**: Timer B underflow
  - **Bit 2**: Time-of-Day clock alarm
  - **Bit 3**: Serial port full/empty
  - **Bit 4**: Flag line
  - **Bit 5**: Unused
  - **Bit 6**: Unused
  - **Bit 7**: Set/Clear control (1 = set bits, 0 = clear bits)

- **Explanation of R-M-W behavior with `DEC $DC0D`:**

  - The `DEC` instruction reads the current value of $DC0D, decrements it, and writes it back. The write operation interacts with the ICR's write semantics: if bit 7 is clear, writing a 1 to any bit clears the corresponding interrupt flag. However, the exact behavior depends on the value read and the result of the decrement operation, making this method less predictable.

- **Safer alternative to acknowledge Timer A interrupt:**


  This method explicitly writes a value with bit 0 set and bit 7 clear to $DC0D, ensuring that only the Timer A interrupt flag is cleared, making the code more reliable and easier to understand.

## Mnemonics
- DEC
