# CLOSE ($FFC3)

**Summary:** KERNAL CLOSE routine at $FFC3 — closes a specified logical file. Call convention: A = logical file number; routine uses registers A, X, Y. Entry is indirect via the vector at $031C, which points to $F291.

**Description**

CLOSE is the KERNAL service that closes a previously opened logical file. The calling convention requires the logical file number in the accumulator (A). The routine uses the A, X, and Y registers. The public entry point is $FFC3; this entry performs an indirect call through the vector stored at $031C, whose default target is the ROM implementation at $F291.

**Usage:**

1. Load the accumulator with the logical file number to be closed.
2. Call the CLOSE routine.

**Example:**


**Registers:**

- **Input:**
  - A: Logical file number to be closed.
- **Output:**
  - A: Error code (0 if no error).
  - X, Y: Destroyed.
  - Carry flag: Set if an error occurred; clear otherwise.

**Error Handling:**

After calling CLOSE, check the carry flag:

- **Carry clear (C = 0):** No error occurred.
- **Carry set (C = 1):** An error occurred; the accumulator contains the error code.

To retrieve the error code:


**Side Effects:**

- **Serial Devices:** Sends an UNLISTEN command to the device.
- **RS-232 Devices:** Deallocates receive and transmit buffers, stops all RS-232 transmitting and receiving, and sets the RTS and transmitted data (Sout) lines high.
- **Cassette Devices:** Ensures the last block is written to the cassette, even if it is not a full 192 bytes.
- **Disk Devices:** Performs an End-Of-Information (EOI) sequence to properly close the file.

**Implementation Details:**

The CLOSE routine at $FFC3 performs an indirect jump through the vector at $031C:


By default, this vector points to the ROM routine at $F291. The implementation at $F291 handles the closing of the logical file, including device-specific finalization steps.

**Example Call Sequences:**

- **Using the KERNAL Entry Point:**


- **Using the Vector:**


Calling via the vector allows for customization by modifying the vector at $031C to point to a user-defined routine if needed.

## Source Code

```assembly
LDA #15    ; Logical file number to close
JSR $FFC3  ; Call CLOSE routine
```

```assembly
JSR $FFC3  ; Call CLOSE routine
BCS ERROR  ; Branch if carry set (error occurred)
; Continue processing
ERROR:
; Handle error, error code is in A
```

```assembly
FFC3: 6C 1C 03  JMP ($031C)
```

  ```assembly
  LDA #2      ; Logical file number
  JSR $FFC3   ; Call CLOSE routine
  ```

  ```assembly
  LDA #2      ; Logical file number
  JSR ($031C) ; Call CLOSE routine via vector
  ```


## Key Registers

- **$FFC3:** KERNAL CLOSE entry point; call with A = logical file number (uses A, X, Y).
- **$031C:** RAM vector used by CLOSE; contains address $F291 by default.
- **$F291:** KERNAL ROM routine invoked by the vector at $031C.

## References

- "open" — opens files (context for files that CLOSE will close).
- "clrchn" — CLRCHN closes default I/O files and performs cleanup.