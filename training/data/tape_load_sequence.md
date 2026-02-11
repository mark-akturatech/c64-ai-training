# KERNAL: Tape Header Find & Load-Address Setup ($F533–$F5AE)

**Summary:** This KERNAL routine (addresses $F533–$F5AE) handles the process of locating a tape header, validating the device number, setting up load addresses, and initiating the loading of data from tape. It involves device validation, obtaining the tape buffer pointer, waiting for user input (PLAY/STOP), searching for the tape header (either a specific filename or any), checking serial read status, extracting load start and end addresses from the header into $C1/$C2 and $AE/$AF respectively, displaying status messages, and calling the tape read routine. Key terms include: $F533, $F5AE, tape header, tape buffer ($B2), serial status ($90), load end pointer ($AE/$AF).

**Description**

This ROM segment implements the tape-specific load path entry that locates a matching tape header and prepares load/start and end addresses for the actual read operation:

- **Device Validation and Early Return:**
  - Begins with an LSR instruction followed by branch tests; if validation fails, the code jumps to the "illegal device number" handler at $F713.
  - Calls a helper routine (JSR $F7D0) to obtain the tape buffer start pointer, storing it in the zero-page indirect location ($B2). The pointer is returned in registers X and Y. A failure results in a jump to the illegal-device handler.

- **Wait for PLAY/STOP Handling:**
  - Invokes JSR $F817 to wait for the user to press PLAY; if STOP is detected, the routine exits (RTS at $F5AE).

- **Searching for a Header:**
  - Prints "SEARCHING..." (JSR $F5AF).
  - If $B7 (filename length) is zero, it calls the generic header-finder routine (JSR $F72C) to find any header; otherwise, it calls the specific-name finder routine (JSR $F7EA).
  - After the header search, the code checks status flags and may loop back to searching or exit on error.

- **Serial Read Status Check:**
  - Loads the serial status from $90 and ANDs it with #$10 to test the read-error bit. If a read error is reported, the routine exits.

- **Device Secondary-Address/Pointer Selection:**
  - Checks the value in register X for allowed device numbers (compares to #$01 and #$03). If X is neither, it resumes searching.
  - If the secondary address ($B9) is non-zero, it copies two bytes from the header buffer into $C3/$C4, which act as intermediate start address bytes.

- **Compute Load End Pointer and Set I/O Start Addresses:**
  - Reads multiple bytes from the header buffer via indirect ($B2),Y loads and performs SBC sequences to calculate differences; the result is placed into $AE (low byte) and $AF (high byte) — the load end pointer.
  - $C3/$C4 (or other header bytes) are copied into $C1/$C2 to set the I/O start address low/high bytes for the upcoming read.

- **Start Read:**
  - Displays "LOADING" or "VERIFYING" (JSR $F5D2).
  - Calls the tape read routine (JSR $F84A).
  - A small machine-code trick follows (see Source Code comment) which arranges a BIT instruction by emitting a raw opcode byte; the routine then clears the carry (flags success), loads $AE/$AF into X/Y, and returns.

Note: This routine relies heavily on header buffer contents at ($B2) and zero-page temporaries ($B7, $B9, $C1–$C4, $AE, $AF, $90). Several JSR targets are external KERNAL helper routines (header finders, buffer pointer fetch, status display, tape read).

## Source Code

```assembly
.,F533 4A       LSR
.,F534 B0 03    BCS $F539
.,F536 4C 13 F7 JMP $F713       ; Jump to 'illegal device number' handler
.,F539 20 D0 F7 JSR $F7D0       ; Get tape buffer start pointer in XY
.,F53C B0 03    BCS $F541
.,F53E 4C 13 F7 JMP $F713       ; Jump to 'illegal device number' handler
.,F541 20 17 F8 JSR $F817       ; Wait for PLAY
.,F544 B0 68    BCS $F5AE       ; Exit if STOP was pressed
.,F546 20 AF F5 JSR $F5AF       ; Print "SEARCHING..."
.,F549 A5 B7    LDA $B7         ; Get filename length
.,F54B F0 09    BEQ $F556
.,F54D 20 EA F7 JSR $F7EA       ; Find specific tape header
.,F550 90 0B    BCC $F55D       ; If no error, continue
.,F552 F0 5A    BEQ $F5AE       ; Exit if error
.,F554 B0 DA    BCS $F530       ; Branch always
.,F556 20 2C F7 JSR $F72C       ; Find any tape header
.,F559 F0 53    BEQ $F5AE       ; Exit if error
.,F55B B0 D3    BCS $F530       ; Branch always
.,F55D A5 90    LDA $90         ; Get the serial status byte
.,F55F 29 10    AND #$10        ; Mask ...00010000, read error
.,F561 38       SEC             ; Flag fail
.,F562 D0 4A    BNE $F5AE       ; If read error, exit
.,F564 E0 01    CPX #$01
.,F566 F0 11    BEQ $F579
.,F568 E0 03    CPX #$03
.,F56A D0 DD    BNE $F549
.,F56C A0 01    LDY #$01
.,F56E B1 B2    LDA ($B2),Y
.,F570 85 C3    STA $C3
.,F572 C8       INY
.,F573 B1 B2    LDA ($B2),Y
.,F575 85 C4    STA $C4
.,F577 B0 04    BCS $F57D
.,F579 A5 B9    LDA $B9         ; Get the secondary address
.,F57B D0 EF    BNE $F56C
.,F57D A0 03    LDY #$03
.,F57F B1 B2    LDA ($B2),Y
.,F581 A0 01    LDY #$01
.,F583 F1 B2    SBC ($B2),Y
.,F585 AA       TAX
.,F586 A0 04    LDY #$04
.,F588 B1 B2    LDA ($B2),Y
.,F58A A0 02    LDY #$02
.,F58C F1 B2    SBC ($B2),Y
.,F58E A8       TAY
.,F58F 18       CLC
.,F590 8A       TXA
.,F591 65 C3    ADC $C3
.,F593 85 AE    STA $AE         ; Store LOAD end pointer low byte
.,F595 98       TYA
.,F596 65 C4    ADC $C4
.,F598 85 AF    STA $AF         ; Store LOAD end pointer high byte
.,F59A A5 C3    LDA $C3
.,F59C 85 C1    STA $C1         ; Set I/O start address low byte
.,F59E A5 C4    LDA $C4
.,F5A0 85 C2    STA $C2         ; Set I/O start address high byte
.,F5A2 20 D2 F5 JSR $F5D2       ; Display "LOADING" or "VERIFYING"
.,F5A5 20 4A F8 JSR $F84A       ; Perform the tape read
.,F5A8 24       .BYTE $24       ; Opcode for BIT instruction
.,F5A9 18       CLC             ; CLC opcode, executed as BIT $18
.,F5AA A6 AE    LDX $AE         ; Get the LOAD end pointer low byte
.,F5AC A4 AF    LDY $AF         ; Get the LOAD end pointer high byte
.,F5AE 60       RTS
```

**Note:** The sequence at $F5A8–$F5A9 uses a technique where the .BYTE $24 (opcode for BIT) followed by $18 (opcode for CLC) results in the execution of a BIT $18 instruction. This approach allows for a non-destructive test of the accumulator against the memory location $18, effectively preserving the accumulator's value while setting the processor status flags based on the contents of $18.

## Key Registers

- **$B2:** Pointer to the tape buffer start address.
- **$B7:** Filename length.
- **$B9:** Secondary address.
- **$C1/$C2:** I/O start address low/high bytes.