# 256‑byte Autostart Fast Loader — IEC Handshake Timing

**Summary:** This document details the IEC bus handshake protocol for a 256‑byte autostart fast loader. The drive signals readiness by pulling CLK low, and the C64 signals readiness by pulling both CLK and DATA low. Precise timing is crucial to ensure the drive's polling loop completes before the C64 begins reading. Instruction cycle counts (LDX, BNE, PHA/PLA/BIT $00) are used to achieve this synchronization.

**Handshake Protocol**

Both devices utilize the IEC serial lines to signal readiness and prevent data collisions:

- **Drive to C64:** The drive pulls CLK low when ready to send a byte.
- **C64 to Drive:** The C64 pulls both CLK and DATA low when ready to receive a byte.
- **Line Release:** After each byte transfer, both devices release the lines to their idle (not‑ready) state.

Precise timing ensures the drive's readiness check loop completes before the C64 samples DATA. The following sequences illustrate the drive's polling mechanism and the C64's fixed delay to achieve synchronization.

**Timing Example**

- **Drive Check Loop (Polling for C64 Readiness):**

  The drive continuously checks for the C64's readiness using the following loop:


  **Timing Analysis:**

  - **LDX $1800:** Executes in 4 cycles.
  - **BNE wait_c64:** Executes in 2 cycles if the branch is taken (when the zero flag is clear), and 3 cycles if not taken (when the zero flag is set).

  **Maximum Delay Calculation:**

  In the worst-case scenario, the sequence executes as follows:

  1. **LDX $1800** reads the value (4 cycles).
  2. **BNE wait_c64** is taken (2 cycles).
  3. **LDX $1800** reads the updated value (4 cycles).
  4. **BNE wait_c64** is not taken (3 cycles).

  Total maximum delay: 4 + 2 + 4 + 3 = 13 cycles.

  This analysis corrects the previous assumption of a 10-cycle maximum delay. The actual maximum delay is 13 cycles, accounting for the instruction execution times and branch behavior.

- **C64 Fixed Delay After Signaling Readiness:**

  To ensure synchronization, the C64 introduces a fixed delay after signaling readiness:


  **Total Delay:** 3 + 4 + 3 = 10 cycles.

  This sequence provides a deterministic 10-cycle delay, allowing the drive's polling loop to complete before the C64 begins reading data.

## Source Code

  ```assembly
  wait_c64:
      LDX $1800       ; 4 cycles (LDX absolute)
      BNE wait_c64    ; 2 cycles if branch is taken, 3 cycles if not taken
  ```

  ```assembly
      PHA             ; 3 cycles
      PLA             ; 4 cycles
      BIT $00         ; 3 cycles
  ```


```assembly
; Drive-side poll example
wait_c64:
    LDX $1800       ; 4 cycles (LDX absolute)
    BNE wait_c64    ; 2 cycles if branch is taken, 3 cycles if not taken

; C64-side fixed 10-cycle delay
    PHA             ; 3 cycles
    PLA             ; 4 cycles
    BIT $00         ; 3 cycles  ; total = 10 cycles
```

## Key Registers

- **$1800:** IEC bus data register used for communication between the C64 and the drive.

## References

- "sending_code_1541" — expands on drive readiness and encoded transfers
- "receiving_code_c64" — expands on C64-side delay and exact-timing reads

## Mnemonics
- LDX
- BNE
- PHA
- PLA
- BIT
