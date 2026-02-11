# byRiclianll - Sets drive/IEC hardware registers and runs the write-sync loop

**Summary:** Drive-side 6502 write loop that loads the overflow-area start into Y (LDY «*BB), streams bytes from $0100+Y, waits for the IEC/drive write window using a WRITESYNC loop (BVC / CLV / ... / BNE), and writes bytes to the drive output register ($1C01). Mentions earlier manipulation of drive control registers ($1C03, $1C0C) with AND/ORA to set required lines.

**Description**
This chunk contains the overflow-area write loop used by the drive code:

- **LDY «*BB** initializes Y to the overflow-area start (the low byte referenced by *BB). The symbol « denotes loading the low byte of the address stored in *BB.
- The **OVERFLOW** loop reads a byte from the overflow buffer at $0100,Y (LDA $0100, Y).
- The routine then enters a write-sync spin loop to synchronize with the drive's write window. The loop uses **BVC** (branch if overflow clear) and **CLV** (clear overflow flag) surrounding the write to test and clear the overflow flag used as a timing/synchronization marker.
- When synchronized, the byte is stored to the drive output register ($1C01) with **STA $1C01**.
- Y is incremented and the loop repeats until Y wraps to zero (**BNE OVERFLOW** ends when Y becomes zero).

**Note:** The description references a WRITESYNC sequence involving **DEX** (decrement X), but the provided listing shows **INY** (increment Y). This discrepancy suggests a possible error in the source material.

## Source Code
```asm
    530  LDY  «*BB

    540  OVERFLOW  LDA  $0100, Y    ; WRITE OUT OVERFLOW BUFFER

    550  WAIT1   BVC  WAIT1

    560  CLV

    570  STA  $1C01

    580  INY

    590  BNE  OVERFLOW
```

## Key Registers
- **$1C01**: Port A Data Register. In write mode, data to be written to the disk is placed here.
- **$1C03**: Port A Data Direction Register. Setting this to $FF configures all bits of Port A as outputs, enabling write operations.
- **$1C0C**: Auxiliary Control Register. Bit 5 controls the head operation mode: 0 = Read, 1 = Write. Bit 1 enables the Byte Ready signal to set the 6502's overflow flag.

## References
- "find_header_and_wait_gap" — expands on synchronization after header/gap detection
- "write_overflow_and_buffer_write_loops" — expands on subsequent GCR writes from overflow and main buffers
