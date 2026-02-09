# Commented KERNAL Disassembly: BASIC command handlers and file I/O ($E12A-$E1D1)

**Summary:** Describes BASIC command handlers SYS, SAVE (SAVET), LOAD/VERIFY (VERFYT), OPEN (OPENT) and CLOSE (CLOSET); shows use of KERNAL vectors $AD8A, $FFD8, $FFD5, $FFB7, $FFC0, $FFC3; references BASIC workspace pointers TXTTAB/VARTAB ($002B-$002E), TXTPTR ($007A-$007B), VRECK ($000A) and user-register save area $030C-$030F.

## SYS — perform SYS (execute machine code from BASIC)
Evaluates the numeric expression following SYS by calling the evaluator at $AD8A, converts FAC#1 to an integer, pushes a fake return address ($EAE1? — code sets bytes $E1/$46 on stack) and then saves current user A/X/Y/flags into $030C-$030F before jumping indirect through $0014 to execute the user routine. On return (via the executed routine's RTS) the original user registers are restored from $030C-$030F and execution continues.

Key behaviors:
- JSR $AD8A — evaluate text & confirm numeric
- JSR $B7F7 — convert floating FAC#1 to integer in LINNUM
- Pushes bytes #$E1 and #$46 (return address low/high) then saves SPREG/SAREG/SXREG/SYREG at $030F/$030C/$030D/$030E
- JMP ($0014) to transfer control to user code (user routine expected to RTS back)

## SAVET — perform SAVE
Sets up parameters for saving BASIC program (start/end addresses from VARTAB/TXTTAB) and calls the KERNAL SAVE routine at $FFD8. On return it checks the carry flag for I/O errors and branches to the I/O error handler if set.

Key behaviors:
- JSR $E1D4 — parse SAVE parameters from BASIC text
- Loads start/end from VARTAB ($002D-$002E) and TXTTAB ($002B)
- JSR $FFD8 — KERNAL SAVE
- BCS to error handler if carry set; otherwise RTS

## VERFYT — perform LOAD or VERIFY (shared flow)
Common entry for LOAD and VERIFY. Entry sets VRECK ($000A) to distinguish VERIFY (non-zero) from LOAD (zero). Parses LOAD/VERIFY parameters from text, calls KERNAL LOAD ($FFD5), and checks I/O status via READST ($FFB7). For VERIFY, READST status is ANDed with #$10 to detect data mismatch; for LOAD, READST is masked with #$BF (clearing EOI) to detect errors. On successful LOAD, updates TXTPTR/VARTAB to new program and jumps to CLR/RESTORE/RECHAIN flow to restart BASIC.

Key behaviors and values:
- VRECK ($000A) = 1 for VERIFY, 0 for LOAD
- JSR $E1D4 — parse parameters (filename, device, etc.)
- JSR $FFD5 — KERNAL LOAD
- BCS to I/O error handler if carry set after LOAD
- For VERIFY:
  - JSR $FFB7 — READST
  - AND #$10 — test bit %00010000 (data mismatch)
  - If mismatch, set error $1C (LDX #$1C) and jump to error
  - If match, print "OK" via A/Y string output
- For LOAD:
  - JSR $FFB7 — READST
  - AND #$BF — test all bits except EOI (clear bit 6)
  - If zero (no error), continue
  - If non-zero, set error $1D (LDX #$1D) and jump to error
  - On success, update VARTAB/TXTPTR from >TXTPTR ($007A/$007B), call chain/restore routines (JSR $A68E, $A533, JMP $A677) to rechain lines and restart BASIC

## OPENT / CLOSET — wrappers for KERNAL OPEN/CLOSE
OPENT:
- Parses OPEN parameters from text (JSR $E219), then JSR $FFC0 (KERNAL OPEN).
- BCS to I/O error handler on carry set; otherwise RTS.

CLOSET:
- Parses CLOSE parameters (JSR $E219), loads logical file number from $49, then JSR $FFC3 (KERNAL CLOSE).
- If carry set, branch to common I/O error handler; otherwise return.

Common error handling:
- Both OPEN and CLOSE BCS/BCC into the same error jump ($E0F9 / BIOERR flow).

## Source Code
```asm
.,E12A 20 8A AD JSR $AD8A
.,E12D 20 F7 B7 JSR $B7F7
.,E130 A9 E1    LDA #$E1
.,E132 48       PHA
.,E133 A9 46    LDA #$46
.,E135 48       PHA
.,E136 AD 0F 03 LDA $030F
.,E139 48       PHA
.,E13A AD 0C 03 LDA $030C
.,E13D AE 0D 03 LDX $030D
.,E140 AC 0E 03 LDY $030E
.,E143 28       PLP
.,E144 6C 14 00 JMP ($0014)
.,E147 08       PHP
.,E148 8D 0C 03 STA $030C
.,E14B 8E 0D 03 STX $030D
.,E14E 8C 0E 03 STY $030E
.,E151 68       PLA
.,E152 8D 0F 03 STA $030F
.,E155 60       RTS

.,E156 20 D4 E1 JSR $E1D4
.,E159 A6 2D    LDX $2D
.,E15B A4 2E    LDY $2E
.,E15D A9 2B    LDA #$2B
.,E15F 20 D8 FF JSR $FFD8
.,E162 B0 95    BCS $E0F9
.,E164 60       RTS

.,E165 A9 01    LDA #$01
.:E167 2C       .BYTE $2C
.,E168 A9 00    LDA #$00
.,E16A 85 0A    STA $0A
.,E16C 20 D4 E1 JSR $E1D4
.,E16F A5 0A    LDA $0A
.,E171 A6 2B    LDX $2B
.,E173 A4 2C    LDY $2C
.,E175 20 D5 FF JSR $FFD5
.,E178 B0 57    BCS $E1D1
.,E17A A5 0A    LDA $0A
.,E17C F0 17    BEQ $E195
.,E17E A2 1C    LDX #$1C
.,E180 20 B7 FF JSR $FFB7
.,E183 29 10    AND #$10
.,E185 D0 17    BNE $E19E
.,E187 A5 7A    LDA $7A
.,E189 C9 02    CMP #$02
.,E18B F0 07    BEQ $E194
.,E18D A9 64    LDA #$64
.,E18F A0 A3    LDY #$A3
.,E191 4C 1E AB JMP $AB1E
.,E194 60       RTS
.,E195 20 B7 FF JSR $FFB7
.,E198 29 BF    AND #$BF
.,E19A F0 05    BEQ $E1A1
.,E19C A2 1D    LDX #$1D
.,E19E 4C 37 A4 JMP $A437
.,E1A1 A5 7B    LDA $7B
.,E1A3 C9 02    CMP #$02
.,E1A5 D0 0E    BNE $E1B5
.,E1A7 86 2D    STX $2D
.,E1A9 84 2E    STY $2E
.,E1AB A9 76    LDA #$76
.,E1AD A0 A3    LDY #$A3
.,E1AF 20 1E AB JSR $AB1E
.,E1B2 4C 2A A5 JMP $A52A
.,E1B5 20 8E A6 JSR $A68E
.,E1B8 20 33 A5 JSR $A533
.,E1BB 4C 77 A6 JMP $A677

.,E1BE 20 19 E2 JSR $E219
.,E1C1 20 C0 FF JSR $FFC0
.,E1C4 B0 0B    BCS $E1D1
.,E1C6 60       RTS

.,E1C7 20 19 E2 JSR $E219
.,E1CA A5 49    LDA $49
.,E1CC 20 C3 FF JSR $FFC3
.,E1CF 90 C3    BCC $E194
.,E1D1 4C F9 E0 JMP $E0F9
```

## Key Registers
- $000A - BASIC - VRECK (LOAD/VERIFY flag)
- $002B-$002E - BASIC - TXTTAB/VARTAB (start of BASIC text / variables)
- $0049 - BASIC - logical file number used by CLOSE (referenced as $49)
- $007A-$007B - BASIC - TXTPTR (pointer to current BASIC text)
- $030C-$030F - BASIC - SAREG/SXREG/SYREG/SPREG (user A/X/Y registers and flags saved by SYS)

## References
- "basic_io_error_and_simple_io" — expands on I/O error handling (BIOERR) used by these routines
- "parameter_parsing_and_open_close_helpers" — expands on parameter extraction (SLPARA/OCPARA) used by OPEN/CLOSE/SAVE/LOAD