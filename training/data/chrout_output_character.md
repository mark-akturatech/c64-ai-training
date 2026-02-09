# CHROUT ($FFD2) — KERNAL CHROUT implementation (Magnus Nyman)

**Summary:** CHROUT (vector $FFD2) outputs one character in A using the default output device at $009A (DFLTO). This routine saves A on the stack, dispatches to screen ($E716), serial-deferred send ($EDDD), or RS232 handling (JSR $F017/$F80D/$F864), buffers data via the indirect pointer at $00B2, and returns cleanly.

## Description
Entry state
- A contains the ASCII/ PETSCII character to output (caller responsibility).
- The routine immediately PHAs A to preserve it.

Device selection (reads $009A = DFLTO)
- CMP #$03: If $009A == 3, the character is routed to the screen handler (JMP $E716). The saved A is PLAed before jumping.
- Else (not equal to 3) execution continues:
  - BCC (after CMP) tests Carry: if $009A < 3, the code enters the RS232/serial direct path starting at $F1DB.
  - If $009A > 3 (not equal and not < 3), the code treats this as serial-deferred output: it PLAs the saved A and JMPs $EDDD (serial deferred send).

RS232 / direct-serial path (device < 3)
- Performs LSR on A (the device number), then PLA to pull the saved character back from stack and store it into zero page $009E (PTR1).
- Saves processor registers and index registers by transferring TXA/ PHA / TYA / PHA so the routine can call KERNAL RS232 helper subroutines without clobbering values.
- BCC from the earlier LSR check branches to the RS232 send JSR $F017 at $F208 when appropriate.
- Calls two RS232-related KERNAL subroutines:
  - JSR $F80D
  - If zero returned, JSR $F864
  - The JSR/Bxx results determine whether to perform a buffered write into the indirect buffer at ($B2),Y or follow alternative paths.
- Buffered write into pointer at $00B2:
  - If the tests pass, load A #$02, LDY #$00, STA ($B2),Y ; INY ; STY $00A6 — writes a leading 0x02 then advances Y and saves Y into $00A6.
  - Then LDA $009E ; STA ($B2),Y ; CLC — store the character into the buffer and clear carry.
- Restore registers and indices: PLA -> TAY ; PLA -> TAX ; LDA $009E ; if carry clear/branch, set A=#$00 ; RTS.
- Alternative RS232 send: JSR $F017 at $F208 then jump back into the restore/return path.

Behavioral notes preserved from code
- Uses zero page temporary locations: $009E is used as PTR1 (temporary storage for the character), $00B2 is an indirect pointer to the current RS232 buffer, $00A6 stores the Y index after writes.
- Calls to $F80D and $F864 gate whether buffered writes happen (these are RS232-related KERNAL helpers referenced by the original source).
- The routine returns with an RTS after restoring registers; when going to the screen handler it jumps out immediately to $E716 after PLA.

## Source Code
```asm
.,F1CA 48       PHA             temp store on stack
.,F1CB A5 9A    LDA $9A         DFLTO, default output device
.,F1CD C9 03    CMP #$03        screen?
.,F1CF D0 04    BNE $F1D5       nope, test next device
.,F1D1 68       PLA             retrieve (A)
.,F1D2 4C 16 E7 JMP $E716       output to screen
.,F1D5 90 04    BCC $F1DB       device <3
.,F1D7 68       PLA             retrieve (A)
.,F1D8 4C DD ED JMP $EDDD       send serial deferred
.,F1DB 4A       LSR
.,F1DC 68       PLA
.,F1DD 85 9E    STA $9E         PTR1
.,F1DF 8A       TXA
.,F1E0 48       PHA
.,F1E1 98       TYA
.,F1E2 48       PHA
.,F1E3 90 23    BCC $F208       RS232
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
.,F208 20 17 F0 JSR $F017       send to RS232
.,F20B 4C FC F1 JMP $F1FC       end output
```

## Key Registers
- $FFD2 - KERNAL vector for CHROUT (entry vector)
- $009A - KERNAL (zero page) - DFLTO (default output device number)
- $009E - KERNAL (zero page) - PTR1 (temporary storage for the character)
- $00B2 - KERNAL (zero page) - indirect pointer to output buffer (used as ($B2),Y)
- $00A6 - KERNAL (zero page) - saved Y index after buffered write

## References
- "get_from_serial_rs232" — expands on receiving counterpart for serial/RS232 I/O
- "send_secondary_address" — expands on sends secondary address and filenames when opening serial files