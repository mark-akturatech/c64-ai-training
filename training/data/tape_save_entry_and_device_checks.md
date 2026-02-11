# SAVING to tape / device checks (ROM $F659-$F68E)

**Summary:** Disassembly of the C64 KERNAL SAVE-to-tape entry at $F659–$F68E; shows device-type testing via LSR/BCS, illegal-device handling (JMP $F713), obtaining the tape buffer pointer (JSR $F7D0), waiting for PLAY/RECORD (JSR $F838), printing the "SAVING <filename>" message (JSR $F68F), selecting and writing the tape header (LDX/TXA, JSR $F76A), invoking the tape write (JSR $F867), and handling the logical end-of-tape header bit using zero page $B9.

**Description**
This routine performs the high-level SAVE-to-tape flow and error checks:

- **Device-type test (at $F659–$F65F):** The routine checks the device number stored in the accumulator (A) to determine if the operation is targeting the tape device. The device number is loaded into A before this routine is called. The LSR instruction at $F659 shifts the bits of A to the right, effectively dividing the device number by 2. The BCS instruction at $F65A then checks the carry flag, which will be set if the original device number was odd. Since the tape device number is 1 (an odd number), the carry flag will be set, and the routine proceeds. If the carry flag is not set (indicating an even device number), the routine jumps to the illegal-device handler at $F713.

- **Tape buffer pointer acquisition (JSR $F7D0 at $F65F):** Calls the routine that returns the tape buffer start pointer (reported as returned in X/Y in the original comment). The next instruction (BCC $F5F1) branches on carry to signal an invalid buffer (pointer < $0200) and dispatch the illegal-device/parameter handling.

- **Wait for PLAY/RECORD (JSR $F838 at $F664):** Blocks until the user presses PLAY/RECORD on the tape device; if STOP is pressed the routine exits (BCS $F68E).

- **Status message (JSR $F68F at $F669):** Prints "SAVING <filename>".

- **Header selection:** Loads X with header type: #$03 for non-relocatable by default, but tests zero page $B9 masked with #$01; if that bit is clear it sets LDX #$01 (relocatable program file). The chosen header type is moved to A via TXA for the write-header call.

- **Write tape header (JSR $F76A at $F677):** Writes the header (first header write). If error (BCS) the routine exits.

- **Tape write (JSR $F867 at $F67C):** Performs the actual tape write operation (the listing notes a "20 cycle count" for this call). On error it exits.

- **Logical end-of-tape handling:** After successful write the code checks $B9 masked with #$02; if set it writes a logical end-of-tape header by setting A=#\$05 and calling the same header-write routine (JSR $F76A).

- **Finalization:** A single byte $24 is emitted (comment: "makes next line BIT $18 so Cb is not changed"), then CLC and RTS to return with carry clear (success).

Behavioral notes preserved from the listing:
- The routine uses zero page $B9 as the secondary address/flags byte; bit masks #$01 and #$02 are tested to select relocatability and logical end-of-tape handling.
- Errors from header-write and data-write routines cause early exit via BCS to $F68E (RTS returned with carry set).

## Source Code
```asm
.,F659 4A       LSR         ; Shift device number right to check if it's odd (tape device is 1)
.,F65A B0 03    BCS $F65F   ; If carry set (odd device number), proceed
.,F65C 4C 13 F7 JMP $F713   ; Otherwise, jump to illegal-device handler
.,F65F 20 D0 F7 JSR $F7D0   ; Get tape buffer pointer
.,F662 90 8D    BCC $F5F1   ; If buffer pointer < $0200, handle error
.,F664 20 38 F8 JSR $F838   ; Wait for PLAY/RECORD
.,F667 B0 25    BCS $F68E   ; If STOP pressed, exit
.,F669 20 8F F6 JSR $F68F   ; Print "SAVING <filename>"
.,F66C A2 03    LDX #$03    ; Default to non-relocatable header
.,F66E A5 B9    LDA $B9     ; Load flags
.,F670 29 01    AND #$01    ; Check relocatable flag
.,F672 D0 02    BNE $F676   ; If set, skip next instruction
.,F674 A2 01    LDX #$01    ; Set relocatable header
.,F676 8A       TXA         ; Transfer header type to A
.,F677 20 6A F7 JSR $F76A   ; Write tape header
.,F67A B0 12    BCS $F68E   ; If error, exit
.,F67C 20 67 F8 JSR $F867   ; Write data to tape
.,F67F B0 0D    BCS $F68E   ; If error, exit
.,F681 A5 B9    LDA $B9     ; Load flags
.,F683 29 02    AND #$02    ; Check logical end-of-tape flag
.,F685 F0 06    BEQ $F68D   ; If not set, skip next instructions
.,F687 A9 05    LDA #$05    ; Set logical end-of-tape header
.,F689 20 6A F7 JSR $F76A   ; Write logical end-of-tape header
.,F68C 24       .BYTE $24   ; NOP (BIT $18) to preserve carry flag
.,F68D 18       CLC         ; Clear carry flag (success)
.,F68E 60       RTS         ; Return
```

## Key Registers
- $B9 - Zero page - secondary address / flags (bitmask #$01 used to select relocatable vs non-relocatable header; bitmask #$02 used for logical end-of-tape flag)

## References
- "serial_output_loop_and_close_device" — lower-level serial output/close used for serial devices
- "print_saving_message" — prints the 'SAVING <file name>' status
- "write_tape_header" — routine invoked to write the tape header