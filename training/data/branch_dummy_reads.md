# NMOS 6510 RMW (Absolute) Read-Modify-Write Dummy-Read/Write Sequence

**Summary:** Cycle-by-cycle sequence for an NMOS 6510 absolute addressing RMW instruction (opcode fetch, PC+1 low, PC+2 high, read old data, dummy write of old data, write new data). Searchable terms: RMW, dummy write, opcode fetch, PC+1, PC+2, $D019, VIC-II, INC, STA.

**Description**

This chunk documents the per-cycle memory accesses for an absolute-addressing read-modify-write (RMW) instruction on the NMOS 6510 (e.g., `INC $HHLL`). The sequence includes the opcode fetch, two operand-byte reads (low/high), a read of the target address (old data), a dummy write that writes the unmodified original data back, and the final write of the modified data.

**Note:** The original heading mentioned "branch instruction dummy-read behaviour," but the body describes the absolute RMW read/dummy-write sequence. The content below follows the body (RMW) rather than branch behavior.

Behavior summary (per-cycle):

- **Cycle 1:** Opcode fetch from PC (read).
- **Cycle 2:** Read operand low byte from PC+1.
- **Cycle 3:** Read operand high byte from PC+2.
- **Cycle 4:** Read from Absolute Address (AA) — old data.
- **Cycle 5:** Write to AA — dummy write of the unmodified old data (some devices observe this as a write).
- **Cycle 6:** Write to AA — the new (modified) data.

Purpose of the dummy write: Hardware or peripherals that latch on writes can be acknowledged by the dummy write. Many I/O acknowledge/handshake sequences rely on this behavior.

Common usages:

- **Acknowledge VIC-II interrupt by writing back the interrupt register ($D019):** Typical non-RMW sequence `LDA $D019` / `STA $D019`, or using an RMW like `INC $D019`, which performs a read-modify-write and thus produces the dummy write cycle(s).

## Source Code

```text
1   PC        Opcode fetch           R
2   PC + 1    Absolute Address Low   R
3   PC + 2    Absolute Address High  R
4   AA        Old Data               R
5 (*1) AA     Old Data               W
6       New Data                   W AA

(*1) Unmodified original data is written back to memory
```

```asm
; Example: acknowledge VIC-II interrupt (non-RMW)
LDA $D019
STA $D019

; Example: use RMW to acknowledge (and possibly trigger dummy-write behavior)
INC $D019
```

## Key Registers

- **$D019**: VIC-II Interrupt Register (read/acknowledge via write)

## References

- "indexed_instructions_dummy_read_on_page_cross" — page-crossing causes and dummy reads for indexed addressing modes

## Notes

- **Branch-instruction dummy-read behavior details:** The original title referenced branch behavior, but no branch-specific cycle table is present. For branch instructions, the cycle counts are as follows:

  - **Branch not taken:** 2 cycles.
  - **Branch taken without crossing a page boundary:** 3 cycles.
  - **Branch taken and crossing a page boundary:** 4 cycles.

  This behavior is detailed in the Synertek 6502 Programming Manual: [MCS6500 Microcomputer Family Programming Manual](https://syncopate.us/books/Synertek6502ProgrammingManual.html)

- **Details or code for "acknowledge and disable timer interrupt":** The original source mentioned this line but provided no further text. To acknowledge and disable a timer interrupt, you typically:

  1. **Acknowledge the interrupt:** This is done by writing a logic 1 to the corresponding bit in the Interrupt Flag Register (IFR) of the device. For example, with the MOS 6522 VIA, you would write a logic 1 to the appropriate bit in the IFR to clear the interrupt flag.

  2. **Disable the interrupt:** This is done by writing a logic 0 to the corresponding bit in the Interrupt Enable Register (IER) to disable the specific interrupt source.

  Example for MOS 6522 VIA:

  ```asm
  ; Acknowledge the Timer 1 interrupt
  LDA #$40        ; Bit 6 corresponds to Timer 1 interrupt
  STA VIA_IFR     ; Write to Interrupt Flag Register to clear the interrupt

  ; Disable the Timer 1 interrupt
  LDA #$C0        ; Bit 7 set to enable modification, Bit 6 clear to disable Timer 1 interrupt
  STA VIA_IER     ; Write to Interrupt Enable Register to disable the interrupt
  ```

  Replace `VIA_IFR` and `VIA_IER` with the actual addresses of the Interrupt Flag Register and Interrupt Enable Register, respectively. The bit positions correspond to the specific interrupt sources as defined in the MOS 6522 VIA documentation.