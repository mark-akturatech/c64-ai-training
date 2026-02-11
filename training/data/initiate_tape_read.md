# Tape read entry (KERNAL $F841) — initiate tape load/verify

**Summary:** Entry at $F841 in the C64 KERNAL initializes a tape read (load/verify) operation: clears serial/tape state ($90,$93,$AA,$B4,$B0,$9E,$9F,$9C), calls helper routines (JSR $F7D7, JSR $F817), disables IRQs (SEI), sets the CA1/tape IRQ index (LDX #$0E) and branches to the common tape read/write handler (BNE $F875). Search terms: $F841, JSR $F7D7, JSR $F817, SEI, CA1, LDX #$0E, BNE $F875.

## Description
This KERNAL entry performs the initial steps required to begin a tape read (LOAD/VERIFY) sequence:

- Clears the accumulator and writes $00 to several zero-page bytes used by the serial/tape subsystem:
  - $90 — serial status byte
  - $93 — load/verify flag
  - $AA, $B4, $B0 — tape state/timing variables (including the tape timing constant minimum byte at $B0)
  - $9E, $9F — tape error/log buffers for pass 1 and pass 2
  - $9C — received-byte flag

- Calls JSR $F7D7 to set up the tape buffer start/end pointers (tape buffer pointer setup is done by that routine).

- Calls JSR $F817 to wait for the user to press PLAY (this routine handles the PLAY prompt/display and waits until PLAY is detected).

- If STOP was pressed during the wait, BCS at $F84D branches to $F86E which later uses another BCS to reach the final exit at $F8DC (early exit path when the user pressed STOP).

- Disables interrupts (SEI) to prevent IRQs during the critical tape setup.

- Loads #$90 into A (value appears intended to enable CA1 interrupt handling in later handler code) and loads #$0E into X to select the tape read IRQ/vector index. The following BNE $F875 is effectively an unconditional branch because LDX #$0E clears the zero flag.

- Execution continues at the common tape read/write handler starting at $F875 (shared code path for read/write operations and IRQ state setup).

No raw timing diagrams or peripheral register writes to the CIA are present in this snippet — the CA1 interrupt enable mentioned is part of the logical setup saved in zero-page and the vector index; the actual CIA register writes (if any) occur in the common tape read/write setup code reached at $F875 or in the called helper routines.

## Source Code
```asm
        ; initiate a tape read
.,F841  A9 00        LDA #$00        ; clear A
.,F843  85 90        STA $90         ; clear serial status byte
.,F845  85 93        STA $93         ; clear the load/verify flag
.,F847  20 D7 F7     JSR $F7D7       ; set the tape buffer start and end pointers
.,F84A  20 17 F8     JSR $F817       ; wait for PLAY
.,F84D  B0 1F        BCS $F86E       ; exit if STOP was pressed (path to $F8DC)
.,F84F  78           SEI             ; disable interrupts
.,F850  A9 00        LDA #$00        ; clear A
.,F852  85 AA        STA $AA
.,F854  85 B4        STA $B4
.,F856  85 B0        STA $B0         ; clear tape timing constant min byte
.,F858  85 9E        STA $9E         ; clear tape pass 1 error log/char buffer
.,F85A  85 9F        STA $9F         ; clear tape pass 2 error log corrected
.,F85C  85 9C        STA $9C         ; clear byte received flag
.,F85E  A9 90        LDA #$90        ; enable CA1 interrupt ?? (logical setup)
.,F860  A2 0E        LDX #$0E        ; set index for tape read vector
.,F862  D0 11        BNE $F875       ; go do tape read/write, branch always
```

## Key Registers
- $0090 - Zero page - serial status byte (cleared)
- $0093 - Zero page - load/verify flag (cleared)
- $009C - Zero page - byte received flag (cleared)
- $009E - Zero page - tape pass 1 error/log buffer (cleared)
- $009F - Zero page - tape pass 2 error/log/ corrected (cleared)
- $00AA - Zero page - tape-related state byte (cleared)
- $00B0 - Zero page - tape timing constant (min) (cleared)
- $00B4 - Zero page - tape-related state byte (cleared)

## References
- "set_tape_buffer_start_and_end_pointers" — expands on JSR $F7D7 which derives I/O and end pointers for the tape buffer
- "wait_for_play_prompt_and_display" — expands on JSR $F817 which waits for PLAY before enabling read
- "tape_read_write_setup_and_irq_save" — expands on the control flow into the shared tape read/write handler beginning at $F875