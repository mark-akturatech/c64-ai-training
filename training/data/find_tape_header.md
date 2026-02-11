# Find tape header (ROM $F72C)

**Summary:** Scans the tape buffer (via ($B2),Y) for tape headers ($01 reloc, $03 non-reloc, $04 data, $05 end-of-tape), preserves/restores the load/verify flag ($93), calls the tape-read entry ($F841), optionally prints "FOUND " plus the 21-byte filename (uses BIT $9D and CHROUT $FFD2), and waits ~8.5s for any STOP-column key (JSR $E4E0).

## Description
This KERNAL routine locates a tape-record header in the tape buffer and returns with the header loaded in the buffer and the header type copied into X (TAX). Behavior summary and important details:

- Entry/exit:
  - Caller state: not assumed; routine saves/restores the load/verify flag in zero page $93.
  - On successful return, the tape header is left in the tape buffer addressed by ($B2),Y and the header type is in X.
  - On error or end-of-tape, the routine exits early (RTS) with the carry clear (CLC) at $F767, and Y is decremented once (DEY) before RTS.

- Load/verify flag:
  - $93 is loaded and pushed before calling the tape-read starter (JSR $F841) and restored afterward. This preserves the calling load/verify preference across the read.

- Tape read invocation and error handling:
  - JSR $F841 is used to initiate the tape read.
  - If the read sets the carry (BCS at $F735), the routine exits immediately (error).

- Buffer access and header type detection:
  - The routine reads the first byte of the current tape buffer entry using indirect-index addressing LDA ($B2),Y.
  - Compares the byte against these values:
    - $05 = logical end-of-tape → exit (BEQ $F769).
    - $01 = relocatable program header → accept (BEQ $F74B).
    - $03 = non-relocatable program header → accept (BEQ $F74B).
    - $04 = data file header → accept (fall-through to $F74B).
  - Any byte that is not one of these values loops back to the top to try the next buffer entry.

- On found header:
  - TAX stores the header type in X for the caller.
  - BIT $9D checks the kernel message-mode flag (control messages). If messages are disabled (N=0 → BPL), the routine skips the diagnostic output and continues to return.
  - If messages are enabled:
    - Y is loaded with $63 (index to the "FOUND " message) and JSR $F12F displays that message.
    - Y is then loaded with $05 (index to the tape filename within the tape buffer) and a loop outputs 21 bytes ($15) from the tape buffer via JSR $FFD2 (CHROUT).
    - After printing the filename, the routine reads $A1 (jiffy-clock mid byte) and JSR $E4E0 to wait ≈ 8.5 seconds for any key from the STOP key column (allow user to press STOP-column to abort/continue).
  - Finally the routine clears carry (CLC) to indicate no error, DEY to decrement Y, and RTS.

- Notes on Y and buffer indexing:
  - The routine uses Y as the index into the tape buffer for both header detection and filename output. On exit Y is decremented once (DEY) — callers that rely on Y should be aware of this change.

- Registers/flags:
  - X contains the header type after TAX.
  - A/Y are used for buffer reads and output loops.
  - Carry is used for error signalling from the tape-read call and is explicitly cleared ($F767) on success.

## Source Code
```asm
.,F72C A5 93    LDA $93         get load/verify flag
.,F72E 48       PHA             save load/verify flag
.,F72F 20 41 F8 JSR $F841       initiate tape read
.,F732 68       PLA             restore load/verify flag
.,F733 85 93    STA $93         save load/verify flag
.,F735 B0 32    BCS $F769       exit if error
.,F737 A0 00    LDY #$00        clear the index
.,F739 B1 B2    LDA ($B2),Y     read first byte from tape buffer
.,F73B C9 05    CMP #$05        compare with logical end of the tape
.,F73D F0 2A    BEQ $F769       if end of the tape exit
.,F73F C9 01    CMP #$01        compare with header for a relocatable program file
.,F741 F0 08    BEQ $F74B       if relocatable program header, accept
.,F743 C9 03    CMP #$03        compare with header for a non relocatable program file
.,F745 F0 04    BEQ $F74B       if non-relocatable program header, accept
.,F747 C9 04    CMP #$04        compare with data file header
.,F749 D0 E1    BNE $F72C       if not data file, loop to find the tape header
                                (fall-through on $04 -> accept)
.,F74B AA       TAX             copy header type to X
.,F74C 24 9D    BIT $9D         get message mode flag
.,F74E 10 17    BPL $F767       exit if control messages off
.,F750 A0 63    LDY #$63        index to "FOUND "
.,F752 20 2F F1 JSR $F12F       display kernel I/O message
.,F755 A0 05    LDY #$05        index to the tape filename
.,F757 B1 B2    LDA ($B2),Y     get byte from tape buffer
.,F759 20 D2 FF JSR $FFD2       output character to channel (CHROUT)
.,F75C C8       INY             increment the index
.,F75D C0 15    CPY #$15        compare it with end+1 (21 bytes)
.,F75F D0 F6    BNE $F757       loop if more to do
.,F761 A5 A1    LDA $A1         get the jiffy clock mid byte
.,F763 20 E0 E4 JSR $E4E0       wait ~8.5 seconds for any key from the STOP key column
.,F766 EA       NOP             waste cycles
.,F767 18       CLC             flag no error
.,F768 88       DEY             decrement the index
.,F769 60       RTS
```

## Key Registers
- $B2-$B3 - Zero Page - pointer to current tape buffer (used by LDA ($B2),Y reads)
- $93 - Zero Page - load/verify flag (saved/restored around tape read)
- $9D - Zero Page - kernel message-mode flag (BIT $9D controls message printing)
- $A1 - Zero Page - jiffy clock mid byte (read before JSR $E4E0 wait)
- $FFD2 - KERNAL - CHROUT entry (output character to current channel)

## References
- "write_tape_header" — counterpart routine used when saving/writing headers to tape
- "tape_save_entry_and_device_checks" — invokes this logic during LOAD/VERIFY and SAVE flows