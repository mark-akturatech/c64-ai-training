# KERNAL: CHROUT ($FFD2)

**Summary:** CHROUT is the C64 KERNAL ROM character-output entry point at $FFD2; call with A = byte to write. The call is vectored via the 2-byte pointer at $0326 (RAM vector $0326-$0327) which ultimately jumps to the ROM routine at $F1CA.

**Description**
CHROUT is the standard KERNAL entry used to write one byte to the "default output" device. To invoke it, place the byte to output in the accumulator (A) and JSR to $FFD2 (or JSR to the address held by the vector at $0326). The canonical sequence:

- Put character in A (A = byte to write).
- JSR $FFD2

The KERNAL uses the vector at $0326-$0327 (the CHROUT vector) so programs can redirect output by changing that vector. On an unmodified C64, the vector points into ROM, and the CHROUT implementation in ROM resides at $F1CA.

This entry is strictly for writing a single byte to the configured default output device; the source reference here only specifies the input (A) and the vector indirection ($0326) with the underlying ROM routine address ($F1CA).

**Register Effects:**
- **A (Accumulator):** Altered; contains the output byte upon return.
- **X and Y Registers:** Preserved; their values remain unchanged.
- **Processor Status Flags:** The Carry flag (C) is set to 0 if the operation is successful; set to 1 if an error occurs.

**Default Output Device Selection:**
The default output device is determined by the value at memory location $9A. By default, this is set to 3, corresponding to the screen. To change the output device, use the KERNAL routines `OPEN` ($FFC0) and `CHKOUT` ($FFC9) to open and select the desired output channel. If these routines are not called, CHROUT will output to the default device.

**Control Characters and Device-Specific Handling:**
- **Screen (Device 3):** Control characters such as carriage return (CR, $0D) and line feed (LF, $0A) are interpreted to move the cursor. Other control codes may perform functions like clearing the screen or moving the cursor to a specific position.
- **Printer (Device 4):** Control characters are typically passed directly to the printer, which interprets them according to its own control codes.
- **Serial Devices:** Control characters are transmitted as-is; interpretation depends on the receiving device.

**Error Handling and Side Effects:**
- **Error Status:** After calling CHROUT, the status word at location $90 should be checked for error conditions. A non-zero value indicates an error occurred during the output operation.
- **Interrupts and Timing:** CHROUT may temporarily disable interrupts during its execution to ensure data integrity, especially when dealing with timing-sensitive devices. However, it does not alter the system's interrupt vectors or timing settings permanently.

**Disassembly of CHROUT Routine at $F1CA:**
The CHROUT routine at $F1CA handles the actual output operation. Below is a disassembly of this routine:


This routine first checks the current output device. If it's the screen (device 3), it processes the character accordingly. For other devices, it calls a different routine to handle the output.

## Source Code

```assembly
F1CA: 48        PHA             ; Push A onto stack
F1CB: A5 9A     LDA $9A         ; Load current output device number
F1CD: C9 03     CMP #$03        ; Compare with 3 (screen device)
F1CF: F0 0A     BEQ $F1DB       ; If screen, branch to $F1DB
F1D1: 20 93 F2  JSR $F293       ; Call routine to output to other devices
F1D4: 68        PLA             ; Pull A from stack
F1D5: 60        RTS             ; Return from subroutine
F1D6: 68        PLA             ; Pull A from stack
F1D7: 29 7F     AND #$7F        ; Mask out high bit
F1D9: 20 16 F2  JSR $F216       ; Call routine to output to screen
F1DC: 60        RTS             ; Return from subroutine
```

```assembly
F1CA: 48        PHA             ; Push A onto stack
F1CB: A5 9A     LDA $9A         ; Load current output device number
F1CD: C9 03     CMP #$03        ; Compare with 3 (screen device)
F1CF: F0 0A     BEQ $F1DB       ; If screen, branch to $F1DB
F1D1: 20 93 F2  JSR $F293       ; Call routine to output to other devices
F1D4: 68        PLA             ; Pull A from stack
F1D5: 60        RTS             ; Return from subroutine
F1D6: 68        PLA             ; Pull A from stack
F1D7: 29 7F     AND #$7F        ; Mask out high bit
F1D9: 20 16 F2  JSR $F216       ; Call routine to output to screen
F1DC: 60        RTS             ; Return from subroutine
```

## Key Registers
- **$FFD2:** KERNAL ROM - CHROUT entry point (JSR $FFD2)
- **$0326-$0327:** RAM - KERNAL CHROUT vector pointer (2-byte little-endian pointer to handler)
- **$F1CA:** KERNAL ROM - implementation address of CHROUT on standard ROM
- **$9A:** RAM - Current output device number (default is 3 for screen)

## References
- "CHRIN ($FFCF)" — reading a byte from the default input device (related KERNAL input entry)
- Commodore 64 Programmer's Reference Guide, Chapter 5: BASIC to Machine Language - User Callable KERNAL Routines
- Commodore 64 ROM Disassembly

## Labels
- CHROUT
