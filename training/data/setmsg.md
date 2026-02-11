# SETMSG ($FF90 / $FE18)

**Summary:** KERNAL routine SETMSG at $FF90 (real implementation at $FE18) configures the system error-message display. Call with A = switch value (single-byte mode selector).

**Description**

SETMSG is a KERNAL entry that selects how system error and control messages are displayed. The documented entry point is $FF90; the actual routine resides at $FE18 in the KERNAL ROM. The routine reads the switch value from the accumulator (A) and configures the error-message behavior accordingly.

**Call convention:** Load the desired switch value into the accumulator (A) and call via `JSR $FF90` (or `JSR $FE18`).

**Valid switch values:**

- **$00 (0):** Suppress all KERNAL messages.
- **$40 (64):** Display only KERNAL error messages.
- **$80 (128):** Display only KERNAL control messages.
- **$C0 (192):** Display both KERNAL error and control messages.

**Bit meanings:**

- **Bit 6 (value $40):** Controls KERNAL error messages.
  - `0`: Suppress error messages.
  - `1`: Display error messages.
- **Bit 7 (value $80):** Controls KERNAL control messages.
  - `0`: Suppress control messages.
  - `1`: Display control messages.

**Examples:**

- To enable both error and control messages:
- To suppress all messages:

**Side Effects and Preserved Registers**

- **Registers affected:** The accumulator (A) is affected; X and Y registers are preserved.
- **Memory location affected:** The routine sets the message control flag at memory location $9D (157 decimal) to the value in the accumulator.

**Effect on Error Reporting**

- **Scope:** The setting affects all subsequent KERNAL-generated messages, including those from disk operations and other I/O activities.
- **Persistence:** The setting remains in effect until changed by another call to SETMSG or by directly modifying location $9D. It persists across program executions but is reset to the default state upon a system reset or power cycle.
- **Interaction with LIST/PRINT routines:** Suppressing control messages can prevent messages like "SEARCHING FOR" and "LOADING" from appearing during file operations, which is useful for cleaner output during automated processes or when using the LIST or PRINT commands.

## Source Code

  ```assembly
  LDA #$C0
  JSR SETMSG
  ```

  ```assembly
  LDA #$00
  JSR SETMSG
  ```


## References

- "KERNAL function list" — SETMSG entry and real address mapping
- "Readers Feedback: Unwanted Commodore Messages" — COMPUTE! Magazine, October 1985, Page 10
- "KERNAL API | Ultimate Commodore 64 Reference" — pagetable.com

## Labels
- SETMSG
