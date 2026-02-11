# Save logical file and load device/secondary from tables ($F322–$F32E)

**Summary:** Stores the logical file number from A into zero page $00B8, then loads device and secondary address bytes from tables at $0263,X and $026D,X into zero page $00BA/$00B9 respectively; returns to caller (STA/LDA/STA/RTS). ROM addresses $F322–$F32E.

## Description
This short KERNAL helper saves a caller-supplied logical file number and fetches the corresponding device number and secondary address indexed by X from two tables in low memory.

- Inputs:
  - A = logical file number to save (stored to $00B8).
  - X = index into the device/secondary tables.
- Outputs (zero page temporaries):
  - $00B8 ← logical file number (from A)
  - $00BA ← byte from $0263 + X (device number table)
  - $00B9 ← byte from $026D + X (secondary address table)
- Behavior:
  - Performs three stores/loads and returns with RTS; no stack or flags guarantees beyond those implied by the executed instructions.
  - Caller must set A and X appropriately before invoking.
- Usage note:
  - These zero-page values are later used by higher-level routines that open files (see referenced "open_logical_file").

## Source Code
```asm
.,F322 85 B8    STA $B8         save the logical file
.,F324 BD 63 02 LDA $0263,X     get device number from device number table
.,F327 85 BA    STA $BA         save the device number
.,F329 BD 6D 02 LDA $026D,X     get secondary address from secondary address table
.,F32C 85 B9    STA $B9         save the secondary address
.,F32E 60       RTS             
```

## Key Registers
- $00B8 - Zero Page - saved logical file number (temporary)
- $00BA - Zero Page - saved device number (temporary)
- $00B9 - Zero Page - saved secondary address (temporary)
- $0263 - RAM - base of device number table (indexed by X)
- $026D - RAM - base of secondary address table (indexed by X)

## References
- "open_logical_file" — uses the saved logical file ($00B8) and the device/secondary in $00BA/$00B9 when opening files