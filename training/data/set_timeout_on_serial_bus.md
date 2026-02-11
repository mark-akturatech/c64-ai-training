# Set serial bus timeout flag (STA $0285, RTS)

**Summary:** Writes the accumulator to RAM location $0285 to set the serial bus timeout configuration (bit 7 = enable/disable timeout). Uses 6502 STA and RTS instructions; see wrapper at $FFA2 ("SETTMO") for calling convention.

**Description**
This routine stores the contents of the accumulator into memory location $0285 to configure the serial bus timeout. The important details are:

- Bit 7 of $0285 is used to enable (1) or disable (0) the serial bus timeout.
- The STA instruction writes the entire A register to $0285, so all bits of that byte are set from A.
- RTS returns to the caller.

No additional behavior (masking or read-modify) is present in this snippet; any required masking or flag preparation must be done by the caller (see wrapper reference).

## Source Code
```asm
.,FE21 8D 85 02 STA $0285       ; save serial bus timeout flag
.,FE24 60       RTS
```

## Source Code

  ```asm
  LDA #%10000000  ; Set bit 7 to enable timeout
  JSR $FFA2       ; Call SETTMO
  ```

## References
- "SETTMO" — KERNAL routine at $FFA2 to set the serial bus timeout flag

**Wrapper Routine: SETTMO ($FFA2)**
The KERNAL provides a wrapper routine at address $FFA2, named SETTMO, which sets the serial bus timeout flag. This routine is called with the following convention:

- **Input:**
  - A register: Contains the value to be stored in $0285. Bit 7 determines the timeout configuration:
    - Bit 7 = 1: Enable serial bus timeout
    - Bit 7 = 0: Disable serial bus timeout

- **Usage:**
  - Load the desired value into the A register.
  - Call the SETTMO routine using a JSR instruction.

- **Example:**

This wrapper routine simplifies setting the serial bus timeout flag by encapsulating the STA $0285, RTS sequence.

## Labels
- SETTMO
