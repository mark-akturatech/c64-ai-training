# Input byte from serial bus (wrapper at $FFA5 -> $EE13)

**Summary:** Wrapper at $FFA5 JMPs to $EE13 to read one byte from the serial bus using full handshaking; returned in A. TALK ($FFB4) must be called first, TKSA ($FF96) for secondary addresses, and errors are reported in the status word readable via READST ($FFB7).

**Description**
This ROM entry is a simple JMP wrapper located at $FFA5 that transfers control to the actual serial-input implementation at $EE13. The called routine performs a full-handshaking serial input and returns the received data in the accumulator (A). Preconditions:
- The device must have been selected with TALK ($FFB4) before calling this routine.
- If the device requires a secondary address/command, TKSA ($FF96) must be used prior to calling this routine.
Error reporting:
- Any errors are recorded in the status word; call READST ($FFB7) to obtain the status.

Implementation detail preserved by the wrapper:
- The wrapper does not alter registers or state other than jumping to $EE13; it simply redirects execution to the full implementation.

## Source Code
```asm
; input byte from serial bus
;
; this routine reads a byte of data from the serial bus using full handshaking. the
; data is returned in the accumulator. before using this routine the TALK routine,
; $FFB4, must have been called first to command the device on the serial bus to
; send data on the bus. if the input device needs a secondary command it must be sent
; by using the TKSA routine, $FF96, before calling this routine.
;
; errors are returned in the status word which can be read by calling the READST
; routine, $FFB7.
.,FFA5 4C 13 EE JMP $EE13       input byte from serial bus

; Full disassembly of the serial input routine at $EE13
.,EE13 78          SEI           ; Disable interrupts
.,EE14 A9 00       LDA #$00      ; Clear A
.,EE16 85 A5       STA $A5       ; Clear retry counter
.,EE18 20 85 EE    JSR $EE85     ; Set serial clock line low
.,EE1B 20 A9 EE    JSR $EEA9     ; Wait for data line to go low
.,EE1E 10 FB       BPL $EE1B     ; Loop until data line is low
.,EE20 A9 01       LDA #$01      ; Set timer A control register
.,EE22 8D 07 DC    STA $DC07     ; Start timer A
.,EE25 A9 19       LDA #$19      ; Set timer A latch value
.,EE27 8D 0F DC    STA $DC0F     ; Load timer A latch
.,EE2A 20 97 EE    JSR $EE97     ; Set serial data line low
.,EE2D AD 0D DC    LDA $DC0D     ; Read timer A low byte
.,EE30 AD 0D DC    LDA $DC0D     ; Read timer A low byte again
.,EE33 29 02       AND #%00000010; Mask bit 1
.,EE35 D0 07       BNE $EE3E     ; Branch if bit 1 is set
.,EE37 20 A9 EE    JSR $EEA9     ; Wait for data line to go low
.,EE3A 30 F4       BMI $EE30     ; Loop until data line is low
.,EE3C 10 18       BPL $EE56     ; Branch if data line is high
.,EE3E A5 A5       LDA $A5       ; Load retry counter
.,EE40 F0 05       BEQ $EE47     ; Branch if no retries
.,EE42 A9 02       LDA #$02      ; Set error code
.,EE44 4C B2 ED    JMP $EDB2     ; Jump to error handler
.,EE47 20 A0 EE    JSR $EEA0     ; Set serial data line high
.,EE4A 20 85 EE    JSR $EE85     ; Set serial clock line low
.,EE4D A9 40       LDA #$40      ; Set error code
.,EE4F 20 1C FE    JSR $FE1C     ; Jump to error handler
.,EE52 E6 A5       INC $A5       ; Increment retry counter
.,EE54 D0 CA       BNE $EE20     ; Retry input sequence
.,EE56 A9 08       LDA #$08      ; Set bit counter
.,EE58 85 A5       STA $A5       ; Store bit counter
.,EE5A AD 00 DD    LDA $DD00     ; Read serial port data
.,EE5D CD 00 DD    CMP $DD00     ; Compare with previous read
.,EE60 D0 F8       BNE $EE5A     ; Loop until stable
.,EE62 0A          ASL A         ; Shift left
.,EE63 10 F5       BPL $EE5A     ; Loop until bit 7 is set
.,EE65 66 A4       ROR $A4       ; Rotate right into A4
.,EE67 AD 00 DD    LDA $DD00     ; Read serial port data
.,EE6A CD 00 DD    CMP $DD00     ; Compare with previous read
.,EE6D D0 F8       BNE $EE67     ; Loop until stable
.,EE6F 0A          ASL A         ; Shift left
.,EE70 30 F5       BMI $EE67     ; Loop until bit 7 is clear
.,EE72 C6 A5       DEC $A5       ; Decrement bit counter
.,EE74 D0 E4       BNE $EE5A     ; Loop until all bits received
.,EE76 20 A0 EE    JSR $EEA0     ; Set serial data line high
.,EE79 24 90       BIT $90       ; Test status register
.,EE7B 50 03       BVC $EE80     ; Branch if no overflow
.,EE7D 20 06 EE    JSR $EE06     ; Handle overflow
.,EE80 A5 A4       LDA $A4       ; Load received byte
.,EE82 58          CLI           ; Enable interrupts
.,EE83 18          CLC           ; Clear carry flag
.,EE84 60          RTS           ; Return from subroutine
```

## References
- "serial_input_sequence" — expands on EE13 serial input implementation (external)