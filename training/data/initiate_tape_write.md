# ROM: Tape write entry ($F864) — initiate tape write, set leader cycles, wait for PLAY/RECORD

**Summary:** Entry at $F864 for initiating a tape write: calls set-pointer (JSR $F7D7), stores the write-leader cycle count in zero page $AB, waits for PLAY/RECORD (JSR $F838) and exits on STOP (BCS $F8DC). Disables IRQs (SEI), loads an interrupt-enable constant into A (#$82), and sets X=#$08 to select the tape-write leader vector before falling into the shared tape read/write handler.

**Description**
This ROM fragment is the canonical entry sequence to start writing to tape:

- **JSR $F7D7** — Set tape buffer start and end pointers. This prepares the buffer boundaries for the forthcoming write operation.
- **LDA #$14 / STA $AB** — Load the write-leader cycle count (#$14 = 20 decimal) into zero page $AB. This value determines the number of leader cycles before actual data writing begins.
- **JSR $F838** — Wait for the user to press PLAY and RECORD on the tape deck. This routine suspends execution until the tape motor is running.
- **BCS $F8DC** — Branch if the wait routine indicates that the STOP button was pressed. This branch clears the saved IRQ address and exits the write sequence.
- **SEI** — Disable interrupts before entering the shared read/write handler to ensure uninterrupted tape operations.
- **LDA #$82** — Load the value #$82 into the accumulator. This value is used to configure the CIA (Complex Interface Adapter) interrupt control register to enable the FLAG interrupt, which is essential for tape I/O operations.
- **LDX #$08** — Set the index to #$08, selecting the tape-write leader vector. This prepares the system to handle the tape write leader sequence.
- Control then falls into the common tape read/write handler at $F875, which manages the actual data transfer to the tape.

Notes:
- **Zero Page $AB**: Holds the leader cycle count, determining the duration of the leader tone before data writing.
- **Accumulator Value #$82**: Configures the CIA interrupt control register to enable the FLAG interrupt, facilitating tape I/O operations.
- **Index Register X**: Set to #$08 to select the appropriate vector for the tape-write leader sequence.

## Source Code
```asm
                                *** initiate a tape write
.,F864 20 D7 F7 JSR $F7D7       set tape buffer start and end pointers
                                do tape write, 20 cycle count
.,F867 A9 14    LDA #$14        set write lead cycle count
.,F869 85 AB    STA $AB         save write lead cycle count
                                do tape write, no cycle count set
.,F86B 20 38 F8 JSR $F838       wait for PLAY/RECORD
.,F86E B0 6C    BCS $F8DC       if STOPped clear save IRQ address and exit
.,F870 78       SEI             disable interrupts
.,F871 A9 82    LDA #$82        enable FLAG interrupt
.,F873 A2 08    LDX #$08        set index for tape write tape leader vector
.,F875           ; Control falls into the common tape read/write handler
```

## Key Registers
- **$AB**: Zero-page address storing the write-leader cycle count.
- **A (Accumulator)**: Loaded with #$82 to configure the CIA interrupt control register.
- **X (Index Register)**: Set to #$08 to select the tape-write leader vector.

## References
- "set_tape_buffer_start_and_end_pointers" — expands on setting buffer boundaries before writing
- "wait_for_play_or_record_prompt" — expands on waits for RECORD+PLAY before starting a write
- "tape_read_write_setup_and_irq_save" — expands on common setup for read/write that follows

## Labels
- $AB
