# Tape write: bit-cycle completion and byte/synchronisation handling (ROM $FC0C-$FC2E)

**Summary:** Assembly routine in C64 KERNAL ROM ($FC0C-$FC2E) that completes the tape write bit cycle (LSR $BD), updates the zero-page tape write bit count ($A3), handles end-of-byte (parity/next-byte setup via JSR $FB97), re-enables interrupts (CLI), manages cassette synchronisation byte counting ($A5), clears checksum ($D7), and prepares the next synchronisation/write byte using the copy indicator ($BE).

## Description
This ROM fragment is the end-of-bit-cycle handler for tape (cassette) output. On each full bit (two half-cycles) completion it:

- Shifts the just-written bit out of the tape write byte at $BD (LSR $BD).
- Decrements the current byte's bit counter in $A3 (DEC $A3) then tests:
  - If $A3 == 0: the data bits of the byte are complete — branch to parity/send-next (BEQ $FC4E).
  - If $A3 < 0 (negative): bit-count still non-zero — restore registers and exit IRQ (BPL $FC09).
- When a whole byte (start, data bits, parity) is finished it:
  - Calls the "new tape byte setup" routine JSR $FB97.
  - Re-enables interrupts (CLI).
  - Loads the cassette synchronisation character count from $A5 and, if non-zero, continues sync-byte handling.
- Synchronisation bytes:
  - The tape format uses a run of synchronisation bytes before the data block: $09, $08, ... $02, $01, DATA.
  - The system stores two copies: the "load" copy is indicated by sync bytes with bit 7 set (b7=1), the second copy has b7 clear.
  - When preparing a sync byte the code:
    - Clears checksum ($D7 := 0).
    - Decrements $A5 (the sync byte counter).
    - Loads copies indicator from $BE; if $BE == $02 (load block indicator), ORA #$80 to set b7 on the sync byte (making $89..$81).
    - Stores the resulting sync byte into $BD for transmission.
- After storing the sync byte the routine falls through to register restore and IRQ exit.

All behavior and branching decisions are performed exactly as in the ROM listing below.

## Source Code
```asm
                                the bit cycle phase is complete so shift out the just written bit and test for byte
                                end
.,FC0C 46 BD    LSR $BD         shift bit out of tape write byte
.,FC0E C6 A3    DEC $A3         decrement tape write bit count
.,FC10 A5 A3    LDA $A3         get tape write bit count
.,FC12 F0 3A    BEQ $FC4E       if all the data bits have been written go setup for
                                sending the parity bit next and exit the interrupt
.,FC14 10 F3    BPL $FC09       if all the data bits are not yet sent just restore the
                                registers and exit the interrupt
                                do next tape byte
                                the byte is complete. the start bit, data bits and parity bit have been written to
                                the tape so setup for the next byte
.,FC16 20 97 FB JSR $FB97       new tape byte setup
.,FC19 58       CLI             enable the interrupts
.,FC1A A5 A5    LDA $A5         get cassette synchronization character count
.,FC1C F0 12    BEQ $FC30       if synchronisation characters done go do block data
                                at the start of each block sent to tape there are a number of synchronisation bytes
                                that count down to the actual data. the commodore tape system saves two copies of all
                                the tape data, the first is loaded and is indicated by the synchronisation bytes
                                having b7 set, and the second copy is indicated by the synchronisation bytes having b7
                                clear. the sequence goes $09, $08, ..... $02, $01, data bytes
.,FC1E A2 00    LDX #$00        clear X
.,FC20 86 D7    STX $D7         clear checksum byte
.,FC22 C6 A5    DEC $A5         decrement cassette synchronization byte count
.,FC24 A6 BE    LDX $BE         get cassette copies count
.,FC26 E0 02    CPX #$02        compare with load block indicator
.,FC28 D0 02    BNE $FC2C       branch if not the load block
.,FC2A 09 80    ORA #$80        this is the load block so make the synchronisation count
                                go $89, $88, ..... $82, $81
.,FC2C 85 BD    STA $BD         save the synchronisation byte as the tape write byte
.,FC2E D0 D9    BNE $FC09       restore registers and exit interrupt, branch always
```

## Key Registers
- $FC0C-$FC2E - KERNAL ROM - Tape write bit-cycle completion / synchronisation handler (this chunk)
- $FB97 - KERNAL ROM - New tape byte setup subroutine (JSR target)
- $BD - Zero page - Tape write byte (shifting source for output)
- $A3 - Zero page - Tape write bit count (bits remaining in current byte)
- $A5 - Zero page - Cassette synchronisation byte count
- $BE - Zero page - Cassette copies/count indicator (used to detect "load" copy)
- $D7 - Zero page - Checksum byte (cleared at start of block)

## References
- "tape_write_start_bit_and_bit_send_phase" — expands how prior bit-cycle code leads into shifting and byte-completion logic
- "tape_write_block_data_and_checksum" — expands handling once synchronisation bytes are exhausted and block data/checksum processing begins

## Labels
- BD
- A3
- A5
- BE
- D7
