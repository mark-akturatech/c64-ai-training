# RS-232: higher-level get-byte loop around Rx buffer (KERNAL $F1B8..$F1C8)

**Summary:** This routine repeatedly calls the RS-232 "get byte" KERNAL routine at $F14E, handles errors indicated by the carry flag, checks for a null (0) return, and if null, polls the RS-232 status byte at $0297 (masking with $60) to decide whether to return null or continue looping. Searchable terms: $0297, RS-232, KERNAL, JSR $F14E, BCS, AND #$60, BNE, BEQ.

**Description**
This snippet implements a high-level loop around the RS-232 receive-buffer retrieval routine. Behavior:

- **JSR $F14E**: Calls the lower-level RS-232 get-byte routine, which returns a byte in the accumulator (A) and sets the carry flag on error.
- **BCS $F1B4**: If the get-byte routine signals an error via the carry flag, branches to an error/cleanup handler at $F1B4 (not included here).
- **CMP #$00 / BNE $F1B3**: If A ≠ 0 (non-null byte), branches to the non-null exit at $F1B3 (not included here).
- If A == 0 (null), reads system variable $0297 (RS-232 status byte) and ANDs with #%01100000 ($60) to test two status bits:
  - **Bit 6 (DSR missing)**: Indicates that the Data Set Ready signal is missing.
  - **Bit 5 (unused)**: This bit is unused and should always be 0.
- **BNE $F1B1**: If the masked bits are nonzero, branches to a handler at $F1B1 (not included here).
- **BEQ $F1B8**: If the masked bits are zero, loops back to retry.

Effectively, this loop continues calling the core RS-232 get-byte routine until a non-null byte is returned or a terminal status/error is detected in $0297 or via the carry flag. The loop short-circuits on carry from the low-level routine or on status bits at $0297.

**Note:** The low-level routine at $F14E sets the carry flag to indicate errors. Specifically, it sets the carry flag if the RS-232 receive buffer is empty or if a framing error occurs during reception. ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Source Code
```asm
.; $F1B8..$F1C8  — higher-level RS-232 get-byte loop
.,F1B8 20 4E F1    JSR $F14E       ; get byte from RS232 device
.,F1BB B0 F7       BCS $F1B4       ; branch if error (carry set)
.,F1BD C9 00       CMP #$00        ; compare with null
.,F1BF D0 F2       BNE $F1B3       ; exit if not null
.,F1C1 AD 97 02    LDA $0297       ; get the RS232 status register (KERNAL variable)
.,F1C4 29 60       AND #$60        ; mask bits $60 (bits 6 and 5 — DSR missing and unused)
.,F1C6 D0 E9       BNE $F1B1       ; if masked bits nonzero, handle/return null
.,F1C8 F0 EE       BEQ $F1B8       ; else (masked bits zero) loop back and retry
```

## Key Registers
- **$0297**: KERNAL RAM/system variable - RS-232 status byte. Bit 6 indicates DSR missing; bit 5 is unused.

## References
- "rs232_get_byte_from_rx_buffer" — expands the core routine that returns bytes from the RS-232 buffer
- "serial_bus_input_check_and_dispatch" — covers serial-bus vs RS-232 device distinctions in input dispatch