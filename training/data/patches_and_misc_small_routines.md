# KERNAL patches at $E4AD–$E4EB (Preserve A across CHKOUT, RS232 parity init, colour reset, tape pause)

**Summary:** KERNAL v3 / JiffyDOS small patches at ROM addresses $E4AD–$E4EB: CHKOUT preserve-(A) patch ($E4AD-$E4B6), padding bytes ($E4B7-$E4CF), RS232 input parity init ($E4D3-$E4D9) setting RIPRTY ($00AB), reset character colour routine writing COLOR ($0286) into screen via ($F3),Y ($E4DA-$E4DF), and a tape-file pause loop to continue loading without pressing C= ($E4E0-$E4EB).

## Description
- CHKOUT preserve-(A) patch ($E4AD-$E4B6): Saves the caller's A on the stack, JSRs CHKOUT ($FFC9), moves CHKOUT's return A into X (TAX), restores the original A (PLA). If CHKOUT returned no error (carry clear), the original A is left intact; if an error occurred (carry set), TXA restores CHKOUT's A (error value) into A before RTS. This ensures BASIC calls to CHKOUT (used by early PRINT#/CMD) do not clobber the caller's A on successful calls.

- Padding ($E4B7-$E4CF): Unused bytes filled with $AA; reserved/align space following the CHKOUT patch.

- RS232 input parity init ($E4D3-$E4D9): On detecting a start bit (RINONE at $00A9), the routine stores #$01 into RIPRTY ($00AB) to initialize parity accumulation for the incoming RS232 byte, then returns. This prevents parity state leakage between frames.

- Reset character colour ($E4DA-$E4DF): Loads COLOR from $0286 and stores it into the current screen position via indirect Y addressing (STA ($F3),Y). Called by the "clear a screen line" path to fix incorrect colour codes on cleared characters.

- Pause after finding tape file ($E4E0-$E4EB): A small loop that advances an accumulator, uses Y ($0091) and compares to $A1 to delay/hold execution so tape loading can continue automatically when a file is found (avoids requiring pressing the C= key). Loop exits with RTS.

## Source Code
```asm
.,E4AD 48       PHA             temp store (A)
.,E4AE 20 C9 FF JSR $FFC9       CHKOUT
.,E4B1 AA       TAX
.,E4B2 68       PLA             retrieve (A)
.,E4B3 90 01    BCC $E4B6
.,E4B5 8A       TXA
.,E4B6 60       RTS

.:E4B7 AA AA AA AA AA AA AA AA
.:E4BF AA AA AA AA AA AA AA AA
.:E4C7 AA AA AA AA AA AA AA AA
.:E4CF AA AA AA AA

.,E4D3 85 A9    STA $A9         RINONE, check for start bit
.,E4D5 A9 01    LDA #$01
.,E4D7 85 AB    STA $AB         RIPRTY, RS232 input parity
.,E4D9 60       RTS

.,E4DA AD 86 02 LDA $0286       get COLOR
.,E4DD 91 F3    STA ($F3),Y     and store in current screen position
.,E4DF 60       RTS

.,E4E0 69 02    ADC #$02
.,E4E2 A4 91    LDY $91
.,E4E4 C8       INY
.,E4E5 D0 04    BNE $E4EB
.,E4E7 C5 A1    CMP $A1
.,E4E9 D0 F7    BNE $E4E2
.,E4EB 60       RTS
```

## Key Registers
- $E4AD-$E4B6 - KERNAL ROM - CHKOUT(A) preserve patch
- $E4B7-$E4CF - KERNAL ROM - padding ($AA) bytes
- $E4D3-$E4D9 - KERNAL ROM - RS232 parity init
- $E4DA-$E4DF - KERNAL ROM - reset character colour routine
- $E4E0-$E4EB - KERNAL ROM - tape-file pause loop
- $00A9 - Zero Page - RINONE (start-bit detection / RS232 input flag)
- $00AB - Zero Page - RIPRTY (RS232 input parity accumulator)
- $00F3 - Zero Page - indirect screen pointer low byte used by STA ($F3),Y
- $0091 - Zero Page - Y index used in tape-file pause loop
- $00A1 - Zero Page - compared in tape pause loop
- $0286 - RAM - COLOR (character colour byte to write to screen)

## References
- "serial_bus_protocol_and_io" — RS232 parity and NMI behavior

## Labels
- RINONE
- RIPRTY
- COLOR
