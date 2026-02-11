# Write tape leader IRQ routine (ROM $FC6A-$FC91)

**Summary:** KERNAL ROM IRQ handler at $FC6A sets tape bit time constant (#$78 via JSR $FBAF), toggles the cassette output, decrements leader/cycle counters ($A7, $AB) and, when finished, installs the tape write vector (JSR $FCBD) and reenables interrupts (CLI). Interacts with routines $FB97 (new byte setup), $FB8E (copy I/O start to buffer) and $FBAF (write time constant / toggle tape); uses zero page variables $A5/$B6 for sync-count and $BE for block count.

## Description
This KERNAL IRQ entry implements the cassette "leader" write timing and transition into the block write sequence:

- Load the low byte time constant #$78 and JSR $FBAF to program the timer and toggle the tape output bit for a leader pulse.
- If the tape bit readback indicates the bit is high (BNE $FC54), the handler restores registers and exits the IRQ.
- Otherwise the code decrements $A7 (per-bit cycle counter). If $A7 is still non-zero the handler exits — $A7 holds the remaining bit-cycle count for the current leader bit.
- When $A7 reaches zero the routine calls $FB97 to prepare the next tape byte.
- It then decrements $AB (leader block count). If $AB is still >= 0 (BPL), the handler exits — $AB counts leader blocks; when it underflows (becomes $FF) the leader is finished.
- On leader completion the code:
  - Loads X with #$0A and JSR $FCBD to install the tape write vector (set up the IRQ entrypoint for writing data blocks).
  - Executes CLI to re-enable maskable interrupts.
  - INCs $AB to clear the leader counter (restores $AB from $FF to $00).
  - Loads $BE (cassette block count); if zero the routine branches to the STOP restore sequence.
  - Otherwise it calls $FB8E to copy the I/O start address into the buffer address and sets $A5/$B6 to #$09 (nine sync bytes) to prepare for block sync
  - Finally branches to the code that starts emitting the next tape byte.

Notes on zero page variables used by this handler (from this code):
- $A7 — per-bit cycle counter for current leader bit.
- $AB — cassette leader count (decremented until underflow indicates leader finished).
- $A5/$B6 — synchronization byte count (set to #$09 for block sync).
- $BE — cassette block count (blocks remaining in transfer).

Flow summary (addresses and key calls):
- $FC6A: LDA #$78; JSR $FBAF — set time constant / toggle tape
- if tape bit high -> exit IRQ ($FC54)
- DEC $A7; if not zero -> exit
- JSR $FB97 — new tape byte setup
- DEC $AB; if still >=0 -> exit
- LDX #$0A; JSR $FCBD — set tape write vector
- CLI; INC $AB (clear leader $FF -> $00)
- LDA $BE; BEQ stop
- JSR $FB8E; set $A5/$B6 = #$09; branch to start next byte

## Source Code
```asm
.,FC6A A9 78    LDA #$78        set time constant low byte for bit = leader
.,FC6C 20 AF FB JSR $FBAF       write time constant and toggle tape
.,FC6F D0 E3    BNE $FC54       if tape bit high restore registers and exit interrupt
.,FC71 C6 A7    DEC $A7         decrement cycle count
.,FC73 D0 DF    BNE $FC54       if not all done restore registers and exit interrupt
.,FC75 20 97 FB JSR $FB97       new tape byte setup
.,FC78 C6 AB    DEC $AB         decrement cassette leader count
.,FC7A 10 D8    BPL $FC54       if not all done restore registers and exit interrupt
.,FC7C A2 0A    LDX #$0A        set index for tape write vector
.,FC7E 20 BD FC JSR $FCBD       set the tape vector
.,FC81 58       CLI             enable the interrupts
.,FC82 E6 AB    INC $AB         clear cassette leader counter, was $FF
.,FC84 A5 BE    LDA $BE         get cassette block count
.,FC86 F0 30    BEQ $FCB8       if all done restore everything for STOP and exit the
                                interrupt
.,FC88 20 8E FB JSR $FB8E       copy I/O start address to buffer address
.,FC8B A2 09    LDX #$09        set nine synchronisation bytes
.,FC8D 86 A5    STX $A5         save cassette synchronization byte count
.,FC8F 86 B6    STX $B6         
.,FC91 D0 83    BNE $FC16       go do the next tape byte, branch always
```

## Key Registers
- $FC6A-$FC91 - KERNAL ROM - write tape leader IRQ routine (entry + handler code)
- $FBAF - KERNAL ROM - write time constant and toggle cassette output
- $FB97 - KERNAL ROM - prepare/setup next tape byte (new byte setup)
- $FCBD - KERNAL ROM - set/install tape write IRQ/vector (tape write vector setup)
- $FB8E - KERNAL ROM - copy I/O start address to buffer address (prepare block write)
- $A7 - Zero Page - per-bit cycle counter for leader bit
- $AB - Zero Page - cassette leader block counter
- $A5-$B6 - Zero Page - cassette synchronization byte count (A5 and B6 hold sync count)
- $BE - Zero Page - cassette block count (blocks remaining)

## References
- "tape_write_irq_routine" — expands on leader writing performed after block copy operations
- "set_tape_vector" — expands on sets IRQ vector for tape routines (JSR $FCBD)

## Labels
- A7
- AB
- A5
- B6
- BE
