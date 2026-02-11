# KERNAL CLOSE (part 1) — entry $FFC3

**Summary:** KERNAL CLOSE vector at $FFC3 — assembly flow for closing a logical file (A = file number). Handles device dispatch for keyboard/screen, RS232 (clears RS232 buffers and reinitializes port), and serial-bus devices (UNTALK/UNLISTEN path). Uses JSRs to find file table entry, remove it, reset I/O buffers and adjust MEMTOP.

## Description
This chunk documents the first part of the KERNAL CLOSE routine (vectored at $FFC3). On entry A contains the logical file number to close. The routine:

- Calls the find-logical-file routine (JSR $F314). On failure it exits (no action).
- Fetches file parameters from the file table (JSR $F31F). The file-table position is returned in X.
- Saves A on the stack and loads the current device number from $BA to decide device-specific close behavior:
  - Device $00 (keyboard) and device $03 (screen) follow a simple table-update path (no device disconnect handshake).
  - If device indicates serial-bus (branch via BCS) the serial-bus close path is taken (UNTALK/UNLISTEN sequence later).
  - If device equals $02 (RS232), the RS232 close path runs:
    - Retrieve file number (PLA) and remove entry from file table (JSR $F2F2).
    - Initialize/reset RS232 port using part of RS232OPEN (JSR $F483).
    - Call MEMTOP read routine (JSR $FE27) which returns current MEMTOP in X/Y.
    - Check RS232 input (>RIBUF $F8) and output (>ROBUF $FA) buffer pointers; increment Y if present (indicated by non-zero buffers).
    - Clear >RIBUF and >ROBUF (store 0 to $F8 and $FA).
    - JMP $F47D to set new ROBOT values and MEMTOP.
  - Serial (non-RS232) devices: routines are invoked for serial-bus close handling (JSR $F7D0 and others), and further KERNAL routines are called to reset I/O state (JSR $F1DD, JSR $F864). There is a special-case test for a device code ($62) that triggers JSR $F76A with A=#\$05, then returns.
- The routine updates the active-file tables and decrements open-file counts (the complementary "close_file_table_update" chunk expands on the table update steps).

All code paths eventually return to the caller (RTS) after updating file tables and device-specific shutdown.

## Source Code
```asm
.,F291 20 14 F3    JSR $F314       ; find logical file, (X) holds location in table
.,F294 F0 02       BEQ $F298       ; branch if zero (file not found?)
.,F296 18          CLC
.,F297 60          RTS             ; exit if not found
.,F298 20 1F F3    JSR $F31F       ; get file values from table, position (X)
.,F29B 8A          TXA
.,F29C 48          PHA             ; temp store
.,F29D A5 BA       LDA $BA         ; FA, current device number
.,F29F F0 50       BEQ $F2F1       ; device = $00 (keyboard?) -> update file table
.,F2A1 C9 03       CMP #$03        ; compare with $03 (screen)
.,F2A3 F0 4C       BEQ $F2F1       ; device = $03 -> update file table
.,F2A5 B0 47       BCS $F2EE       ; serial-bus (branch if carry set)
.,F2A7 C9 02       CMP #$02        ; compare with $02 (RS232)
.,F2A9 D0 1D       BNE $F2C8       ; if not RS232, go serial path
.,F2AB 68          PLA             ; retrieve (A)
.,F2AC 20 F2 F2    JSR $F2F2       ; remove entry (A) from file table
.,F2AF 20 83 F4    JSR $F483       ; init RS232 port (uses part of RS232OPEN)
.,F2B2 20 27 FE    JSR $FE27       ; MEMTOP, read top of memory (X/Y)
.,F2B5 A5 F8       LDA $F8         ; >RIBUF, RS232 input buffer
.,F2B7 F0 01       BEQ $F2BA
.,F2B9 C8          INY
.,F2BA A5 FA       LDA $FA         ; >ROBUF, RS232 output buffer
.,F2BC F0 01       BEQ $F2BF
.,F2BE C8          INY
.,F2BF A9 00       LDA #$00        ; Clear RS232 input/output buffers
.,F2C1 85 F8       STA $F8
.,F2C3 85 FA       STA $FA
.,F2C5 4C 7D F4    JMP $F47D       ; Set new ROBOF values and set new MEMTOP
.,F2C8 A5 B9       LDA $B9
.,F2CA 29 0F       AND #$0F
.,F2CC F0 23       BEQ $F2F1
.,F2CE 20 D0 F7    JSR $F7D0
.,F2D1 A9 00       LDA #$00
.,F2D3 38          SEC
.,F2D4 20 DD F1    JSR $F1DD
.,F2D7 20 64 F8    JSR $F864
.,F2DA 90 04       BCC $F2E0
.,F2DC 68          PLA
.,F2DD A9 00       LDA #$00
.,F2DF 60          RTS
.,F2E0 A5 B9       LDA $B9
.,F2E2 C9 62       CMP #$62
.,F2E4 D0 0B       BNE $F2F1
.,F2E6 A9 05       LDA #$05
.,F2E8 20 6A F7    JSR $F76A
.,F2EB 4C F1 F2    JMP $F2F1
```

## References
- "close_file_table_update" — completes close by updating open-file tables and counts
- "open_file_create_and_device_dispatch" — opening reverse: sets up device-specific state when opening files

## Labels
- CLOSE
