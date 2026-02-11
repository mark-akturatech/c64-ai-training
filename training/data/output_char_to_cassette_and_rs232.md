# Output character to cassette or RS232 (ROM routine $F1DD-$F20B)

**Summary:** ROM routine at $F1DD saves a character to zero page $009E, preserves X/Y, selects cassette vs RS232 by the low bit shifted into the CPU Carry (LSR), handles tape-pointer bump (JSR $F80D), initiates tape write (JSR $F864), handles tape write errors, writes a data-type byte and the character into the tape/IO buffer ($00B2 indirect), and routes RS232 output to the RS232 send routine (JSR $F017). Uses PLA/TXA/TAY/LSR and zero-page buffer operations.

## Routine behaviour and flow

- Entry and early branches
  - Earlier code may PLA and JMP to screen or serial output ($E716 / $EDDD). The path that reaches $F1DD is responsible for directing a saved character to either the cassette device or the RS232 device.
  - The device selection is determined by a bit shifted into the CPU Carry (LSR at $F1DB). The Carry after that selects device:
    - Carry clear -> RS232
    - Carry set -> cassette

- State preservation
  - The output character is stored to zero page $009E (STA $9E).
  - X and Y are preserved by transferring and pushing: TXA / PHA, TYA / PHA.

- Cassette path (Carry = 1)
  - Execute JSR $F80D to "bump the tape pointer" (advance/prepare tape buffer).
  - On return from $F80D, if BNE ($F1E8) branches, the code skips initiating a write and continues to place the saved character into the buffer (labelled "if not end save next byte and exit").
  - If $F80D indicated end-of-block (zero result / BEQ path), the code calls JSR $F864 to initiate a tape write operation.
    - If $F864 returns with Carry set (BCS $F1FD), a tape write error occurred; the code will later clear A (LDA #$00) before returning.
  - On successful initiation, the code writes a data block type byte (#$02) into the tape buffer via indirect indexed store STA ($B2),Y with Y=0, then INY and save Y to $A6 (tape buffer index).
  - After that, the saved character is restored from $009E and stored into the buffer via STA ($B2),Y.
  - CLC is executed to indicate "no error".

- Restore and return handling
  - Y and X are restored from the stack (PLA / TAY / PLA / TAX).
  - A is loaded from $009E (the saved character).
  - A BCC $F207 (branch-if-carry-clear) checks the error flag: if no error (carry clear due to CLC) the routine returns with A unchanged; if carry set (error), A is cleared (LDA #$00) and RTS returns.

- RS232 path (Carry = 0)
  - The RS232 path calls JSR $F017 to send the byte to the RS232 buffer (routine does no setup here).
  - After returning, it JMPs to the no-error exit sequence (JMP $F1FC), which restores Y/X, sets up A from $009E and exits with carry clear.

- Error signalling convention
  - The code uses the processor Carry as an error indicator for the final branch: CLC = no error, Carry set = error. That is why BCC is used to exit early on success.

- Small notes about instructions used
  - LSR at $F1DB shifts the device-selection bit (bit 0) into Carry for the device decision.
  - The zero-page pointers and index handling use indirect indexed addressing STA ($B2),Y to write into the I/O/tape buffer.

## Source Code
```asm
.,F1D1 68       PLA
.,F1D2 4C 16 E7 JMP $E716
.,F1D5 90 04    BCC $F1DB
.,F1D7 68       PLA
.,F1D8 4C DD ED JMP $EDDD
.,F1DB 4A       LSR
.,F1DC 68       PLA

                                *** output the character to the cassette or RS232 device
.,F1DD 85 9E    STA $9E
.,F1DF 8A       TXA
.,F1E0 48       PHA
.,F1E1 98       TYA
.,F1E2 48       PHA
.,F1E3 90 23    BCC $F208
.,F1E5 20 0D F8 JSR $F80D
.,F1E8 D0 0E    BNE $F1F8
.,F1EA 20 64 F8 JSR $F864
.,F1ED B0 0E    BCS $F1FD
.,F1EF A9 02    LDA #$02
.,F1F1 A0 00    LDY #$00
.,F1F3 91 B2    STA ($B2),Y
.,F1F5 C8       INY
.,F1F6 84 A6    STY $A6
.,F1F8 A5 9E    LDA $9E
.,F1FA 91 B2    STA ($B2),Y
.,F1FC 18       CLC
.,F1FD 68       PLA
.,F1FE A8       TAY
.,F1FF 68       PLA
.,F200 AA       TAX
.,F201 A5 9E    LDA $9E
.,F203 90 02    BCC $F207
.,F205 A9 00    LDA #$00
.,F207 60       RTS

                                output the character to the RS232 device
.,F208 20 17 F0 JSR $F017
.,F20B 4C FC F1 JMP $F1FC
```

## Key Registers
- $009E - Zero Page - saved output character buffer
- $00B2 - Zero Page - indirect pointer to tape/IO buffer (used with STA ($B2),Y)
- $00A6 - Zero Page - tape buffer index (stored from Y after INY)
- $F80D - KERNAL ROM - bump the tape pointer (called before tape write)
- $F864 - KERNAL ROM - initiate tape write (returns Carry set on error)
- $F017 - KERNAL ROM - RS232 send routine (send byte to RS232 buffer)
- $E716 - KERNAL/ROM entry used for screen output (jump target in snippet)
- $EDDD - KERNAL/ROM entry used for serial-bus output (jump target in snippet)

## References
- "open_channel_for_output_and_serial_bus" — expands on selecting RS232/tape as output device
- "find_file_and_find_file_A" — expands on file/device selection routines called before output