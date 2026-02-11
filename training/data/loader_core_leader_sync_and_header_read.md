# C64 Tape Loader — Core Entry, Bit Alignment, Leader/Sync and Header Acquisition

**Summary:** SEI; set threshold via STA $DD06 (CIA2 Timer B latch); initial X/Y setup; alignment loop using JSR $02D4 and ROL/LDA/CMP on $F7 to detect a lead-in byte ($63); LDY #$64 then use JSR $03E7 (read-byte subroutine) to capture leader and sync train; verify post-sync check byte and, if valid, store a 10-byte header into $002B,Y and $00F9,Y (load, end, exec addresses plus two flag bytes).

## Loader core flow and purpose
This chunk documents the loader core that performs: disabling interrupts, setting a tape threshold, bit-alignment of the incoming bitstream, scanning the lead-in and sync trains, checking a post-sync byte, and finally reading and storing the 10-byte header used by the rest of the loader.

Sequence summary:
- SEI disables IRQ/NMI (interrupt masking) while sampling the tape.
- STA $DD06 writes a threshold to the CIA timer latch used here as an analog/threshold comparator for tape pulse timing (source uses $DD06).
- X is initialized to #$01 (often used as a flag/bit counter for alignment).
- Alignment loop:
  - JSR $02D4 is the bit-alignment routine (attempts to align the sampled bit stream).
  - ROL $F7 shifts the bit-buffer at $F7 so MSb is repositioned.
  - LDA $F7 / CMP #$63 detects the lead-in byte value $63; loop repeats until found.
- After lead-in found, LDY #$64 sets the start value for reading a fixed-length sync train.
- The loader uses JSR $03E7 (the Read-Byte subroutine) to fetch bytes from the tape bitstream.
  - A loop reads the leader bytes until another $63 is encountered.
  - CPY $F7 then checks that the current $F7 value matches the expected Y-derived sync value; if not, alignment restarts.
  - A second read loop (with INY/BEQ) consumes the full sync train bytes.
- Post-sync check:
  - CMP #$00 checks the check byte immediately after the sync train. If it equals $00, the loader triggers a reload (restarts at SEI).
- Header acquisition:
  - After passing the post-sync check, the code reads 10 bytes via JSR $03E7 and stores them with STA $002B,Y and STA $00F9,Y while INY increments Y.
  - The 10-byte header contains: Load address (2 bytes), End address (2 bytes), Execution address (2 bytes), and two flag bytes that mark turbo/load completion status and what action to take on finish (as described by the inline comments).

Behavioral notes (as derived from code):
- The alignment loop uses bit-rotation and comparison against $63 to locate the leader pattern.
- The use of $DD06 as a latch implies the loader programs the CIA timer register to tune time thresholds for the tape read hardware (sensitivity/bit-length detection).
- The header is duplicated/stored into two buffers/pages ($002B+Y and $00F9+Y) — consult follow-up chunks (load_loop_store_and_checksum) for how these locations are used to initialize checksums and enter the main load loop.

## Source Code
```asm
; Loader's Core
00351  78          SEI

00352  A9  07      LDA #$07       ; Sets a Threshold value via
00354  8D  06  DD  STA $DD06      ; Timer B countdown
00357  A2  01      LDX #$01

00359  20  D4  02  JSR $02D4      ; Tries to align bits of leader
0035C  26  F7      ROL $F7        ; with MSbF until...
0035E  A5  F7      LDA $F7
00360  C9  63      CMP #$63       ; ... a Lead-in byte is found.
00362  D0  F5      BNE $0359
00364  A0  64      LDY #$64       ; Sync train start value

00366  20  E7  03  JSR $03E7
00369  C9  63      CMP #$63       ; Reads the whole leader
0036B  F0  F9      BEQ $0366

0036D  C4  F7      CPY $F7
0036F  D0  E8      BNE $0359
00371  20  E7  03  JSR $03E7
00374  C8          INY            ; Reads the whole Sync train
00375  D0  F6      BNE $036D

00377  C9  00      CMP #$00       ; After Sync there's a Check byte
00379  F0  D6      BEQ $0351      ; if it is $00 then Reload

0037B  20  E7  03  JSR $03E7
0037E  99  2B  00  STA $002B,Y    ; Loads a 10 bytes header
00381  99  F9  00  STA $00F9,Y    ; The following code (at $0392,
00384  C8          INY              ; $039E, $03D1, $03C6) tells us
00385  C0  0A      CPY #$0A         ; us they consist in: Load
00387  D0  F2      BNE $037B       ; address, End address,
                                   ; Execution address and 2 flag
                                   ; bytes, which state if all
                                   ; turbo files were loaded and
                                   ; what to do once done
```

## Key Registers
- $DD06 - CIA 2 - Timer B latch / threshold for tape timing

## References
- "load_loop_store_and_checksum" — expands on initialization of checksum locations and entering the Load Loop after header read
- "read_byte_subroutine" — details the Read-Byte routine at $03E7 used to fetch bits/bytes during leader/sync/header reads