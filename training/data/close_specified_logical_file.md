# Close a specified logical file (KERNAL ROM disassembly)

**Summary:** KERNAL routine at $F291 that closes a logical file found via JSR $F314 and JSR $F31F, handling device-specific close sequences for RS232 (reclaims buffer memory via $F8/$FA), cassette/tape (writes terminating byte and header), and serial-bus devices (JSR $F642). Uses file-index save/restore (PHA/PLA) and branches by device number ($BA) / secondary address ($B9).

## Operation
- Entry: JSR $F314 — find the logical file (searches open-file table). If not found the routine clears carry and returns OK (CLC; RTS).
- If found: JSR $F31F sets file details from the table using X; TXA/PHA saves the file index on the stack.
- Device dispatch:
  - LDA $BA tests the device number:
    - Device 0 (keyboard) or device 3 (screen): skip device-specific close, restore index and return.
    - Device > 3: branch to the serial-bus close path.
    - Device = 2 (RS232): follow RS232 close sequence.
  - RS232 close sequence:
    - PLA to restore file index.
    - JSR $F2F2 — close file index X (KERNAL close for that file index).
    - JSR $F483 — initialise RS232 output.
    - JSR $FE27 — read top-of-memory (returns top in Y).
    - LDA $F8 — get RS232 input buffer pointer high byte; if nonzero, INY to reclaim that memory (increment Y).
    - LDA $FA — get RS232 output buffer pointer high byte; if nonzero, INY to reclaim that memory.
    - Clear $F8 and $FA (store #$00).
    - JMP $F47D — set new top-of-memory (uses Y to set top to F0xx).
  - Non-RS232 path:
    - LDA $B9 and AND #$0F — mask to get device number from the secondary address. If zero, restore index and return.
    - JSR $F7D0 — get tape buffer start pointer in X,Y (prepares cassette buffer pointer).
    - LDA #$00; SEC — prepare terminating character/$flag for tape.
    - JSR $F1DD — output the character to cassette/RS232 device (uses X,Y).
    - JSR $F864 — initiate tape write; on error BCC checks and returns accordingly.
    - After successful write, check LDA $B9 CMP #$62 — if equal, perform tape logical-end and header write:
      - LDA #$05 — set logical end-of-tape marker.
      - JSR $F76A — write tape header.
    - JMP $F2F1 — restore index and close file.
  - Serial-bus close:
    - JSR $F642 — close serial-bus device (LISTEN/TALK complement cleanup).
- Final steps:
  - PLA — restore the saved file index from the stack before returning (RTS).

Notes:
- The routine distinguishes devices by device number in $BA and by masking the secondary address in $B9 (AND #$0F).
- RS232 buffer reclaim uses high-byte pointers at $F8/$FA and updates top-of-memory via routine at $F47D after reading top via $FE27.

## Source Code
```asm
                                *** close a specified logical file
.,F291 20 14 F3 JSR $F314       find file A
.,F294 F0 02    BEQ $F298       if file found go close it
.,F296 18       CLC             else the file was closed so just flag ok
.,F297 60       RTS             
                                file found so close it
.,F298 20 1F F3 JSR $F31F       set file details from table,X
.,F29B 8A       TXA             copy file index to A
.,F29C 48       PHA             save file index
.,F29D A5 BA    LDA $BA         get the device number
.,F29F F0 50    BEQ $F2F1       if it is the keyboard go restore the index and close the
                                file
.,F2A1 C9 03    CMP #$03        compare the device number with the screen
.,F2A3 F0 4C    BEQ $F2F1       if it is the screen go restore the index and close the
                                file
.,F2A5 B0 47    BCS $F2EE       if > screen go do serial bus device close
.,F2A7 C9 02    CMP #$02        compare the device with the RS232 device
.,F2A9 D0 1D    BNE $F2C8       if not the RS232 device go ??
                                else close RS232 device
.,F2AB 68       PLA             restore file index
.,F2AC 20 F2 F2 JSR $F2F2       close file index X
.,F2AF 20 83 F4 JSR $F483       initialise RS232 output
.,F2B2 20 27 FE JSR $FE27       read the top of memory
.,F2B5 A5 F8    LDA $F8         get the RS232 input buffer pointer high byte
.,F2B7 F0 01    BEQ $F2BA       if no RS232 input buffer go ??
.,F2B9 C8       INY             else reclaim RS232 input buffer memory
.,F2BA A5 FA    LDA $FA         get the RS232 output buffer pointer high byte
.,F2BC F0 01    BEQ $F2BF       if no RS232 output buffer skip the reclaim
.,F2BE C8       INY             else reclaim the RS232 output buffer memory
.,F2BF A9 00    LDA #$00        clear A
.,F2C1 85 F8    STA $F8         clear the RS232 input buffer pointer high byte
.,F2C3 85 FA    STA $FA         clear the RS232 output buffer pointer high byte
.,F2C5 4C 7D F4 JMP $F47D       go set the top of memory to F0xx
                                is not the RS232 device
.,F2C8 A5 B9    LDA $B9         get the secondary address
.,F2CA 29 0F    AND #$0F        mask the device #
.,F2CC F0 23    BEQ $F2F1       if ?? restore index and close file
.,F2CE 20 D0 F7 JSR $F7D0       get tape buffer start pointer in XY
.,F2D1 A9 00    LDA #$00        character $00
.,F2D3 38       SEC             flag the tape device
.,F2D4 20 DD F1 JSR $F1DD       output the character to the cassette or RS232 device
.,F2D7 20 64 F8 JSR $F864       initiate tape write
.,F2DA 90 04    BCC $F2E0       
.,F2DC 68       PLA             
.,F2DD A9 00    LDA #$00        
.,F2DF 60       RTS             
.,F2E0 A5 B9    LDA $B9         get the secondary address
.,F2E2 C9 62    CMP #$62        
.,F2E4 D0 0B    BNE $F2F1       if not ?? restore index and close file
.,F2E6 A9 05    LDA #$05        set logical end of the tape
.,F2E8 20 6A F7 JSR $F76A       write tape header
.,F2EB 4C F1 F2 JMP $F2F1       restore index and close file

                                *** serial bus device close
.,F2EE 20 42 F6 JSR $F642       close serial bus device
.,F2F1 68       PLA             restore file index
```

## Key Registers
- $F8 - KERNAL workspace - RS232 input buffer pointer (high byte)
- $FA - KERNAL workspace - RS232 output buffer pointer (high byte)
- $B9 - KERNAL open-file table field - secondary address (low nibble holds device/subdevice info)
- $BA - KERNAL open-file table field - device number for the open file

## References
- "close_file_index_and_table_compaction" — updates open-file tables and compacts entries after close
- "open_channel_for_input" — open/close symmetry for keyboard/screen/serial/tape devices
- "open_channel_for_output_and_serial_bus_handling" — serial-bus close complements LISTEN/TALK setup