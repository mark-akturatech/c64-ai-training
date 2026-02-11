# Read/Set Vectored I/O Wrapper (JMP $FD1A) at $FF8D

**Summary:** Entry point $FF8D (KERNAL ROM) is a one-instruction wrapper (JMP $FD1A) for the read/set vectored I/O routine, which operates on the vectored I/O table starting at $0314. Use the 6502 carry flag to select read (carry set) or write (carry clear) behavior and supply a user list pointer via the X and Y registers.

**Description**

This ROM entry provides an API to read or set the system "vectored I/O" jump-address list stored in RAM (starting at $0314). The implementation at $FF8D is a simple JMP to the real routine at $FD1A.

Behavior as documented:

- If the carry flag is set on entry, the routine stores (writes out) the current system RAM vector contents into the user-supplied list pointed to by the X and Y registers.
- If the carry flag is clear on entry, the routine copies the user list pointed to by the X and Y registers into the system RAM vectors.
- The recommended safe workflow is to first read the entire vector table into your own buffer, modify desired entries, then write the modified table back.

Cautions and notes:

- The user list pointer is specified by loading the X and Y registers with the low and high bytes, respectively, of the target address.
- This entry is a thin wrapper; the real work happens at $FD1A.
- The caller must ensure the user memory area is large enough and properly addressed before calling.
- This routine is intended for modifying runtime vectored jump addresses (software hooks). Improper use can destabilize system KERNAL behavior.

## Source Code

```asm
.; Fully commented snippet from ROM
.; read/set vectored I/O
.; this routine manages all system vector jump addresses stored in RAM. Calling this
.; routine with the carry bit set will store the current contents of the RAM vectors
.; in a list pointed to by the X and Y registers. When this routine is called with
.; the carry bit clear, the user list pointed to by the X and Y registers is copied
.; to the system RAM vectors.
.; NOTE: This routine requires caution in its use. The best way to use it is to first
.; read the entire vector contents into the user area, alter the desired vectors and
.; then copy the contents back to the system vectors.
.,FF8D 4C 1A FD JMP $FD1A       read/set vectored I/O
```

```text
; Disassembly of the routine at $FD1A
FD1A   85 C3      STA $C3       ; Store A in $C3
FD1C   84 C4      STY $C4       ; Store Y in $C4
FD1E   86 C5      STX $C5       ; Store X in $C5
FD20   38         SEC           ; Set carry flag
FD21   A5 C5      LDA $C5       ; Load A with $C5
FD23   E9 14      SBC #$14      ; Subtract $14 from A
FD25   A5 C4      LDA $C4       ; Load A with $C4
FD27   E9 03      SBC #$03      ; Subtract $03 from A
FD29   B0 0B      BCS $FD36     ; Branch if carry set
FD2B   18         CLC           ; Clear carry flag
FD2C   A9 00      LDA #$00      ; Load A with $00
FD2E   85 C3      STA $C3       ; Store A in $C3
FD30   85 C4      STA $C4       ; Store A in $C4
FD32   85 C5      STA $C5       ; Store A in $C5
FD34   38         SEC           ; Set carry flag
FD35   60         RTS           ; Return from subroutine
FD36   18         CLC           ; Clear carry flag
FD37   A5 C3      LDA $C3       ; Load A with $C3
FD39   10 0B      BPL $FD46     ; Branch if positive
FD3B   A0 20      LDY #$20      ; Load Y with $20
FD3D   A2 14      LDX #$14      ; Load X with $14
FD3F   A9 00      LDA #$00      ; Load A with $00
FD41   91 C5      STA ($C5),Y   ; Store A at address in ($C5),Y
FD43   88         DEY           ; Decrement Y
FD44   D0 FB      BNE $FD41     ; Branch if not zero
FD46   A0 00      LDY #$00      ; Load Y with $00
FD48   B1 C5      LDA ($C5),Y   ; Load A from address in ($C5),Y
FD4A   91 C3      STA ($C3),Y   ; Store A at address in ($C3),Y
FD4C   C8         INY           ; Increment Y
FD4D   D0 F9      BNE $FD48     ; Branch if not zero
FD4F   E6 C4      INC $C4       ; Increment $C4
FD51   D0 02      BNE $FD55     ; Branch if not zero
FD53   E6 C3      INC $C3       ; Increment $C3
FD55   A5 C4      LDA $C4       ; Load A with $C4
FD57   C9 03      CMP #$03      ; Compare A with $03
FD59   D0 ED      BNE $FD48     ; Branch if not equal
FD5B   A5 C3      LDA $C3       ; Load A with $C3
FD5D   C9 14      CMP #$14      ; Compare A with $14
FD5F   D0 E7      BNE $FD48     ; Branch if not equal
FD61   60         RTS           ; Return from subroutine
```

## Key Registers

- **$FF8D**: KERNAL ROM entry point wrapper (JMP $FD1A)
- **$FD1A**: KERNAL ROM actual read/set vectored I/O routine (target of JMP)
- **$0314**: RAM start address of the vectored I/O table (list of system vectored jump addresses)

## References

- "restore_default_io_vectors" — related routine that operates on the same vector table