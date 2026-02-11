# Actions taken immediately after the C64 tape load finishes

**Summary:** Describes the post-load sequence used by a Turbo tape loader: JSR $03E7 (read closing checksum byte), INY / STY $C0 (set software motor-control flag), CLI / CLC (restore interrupt/CPU state), STA $02A0 (clear loader flag), JSR $FC93 (restore default IRQ routine — turn screen on and stop cassette motor), and JSR $E453 (copy BASIC vector table into RAM to prevent re-execution).

## Post-load sequence (step-by-step)
This code runs immediately after the load loop finishes and performs cleanup and relinking tasks so control can safely return to BASIC or autostart the loaded program:

- JSR $03E7 — Calls the Read-Byte subroutine to fetch the closing checksum byte from the tape stream (checksum validation is handled by that routine).
- INY; STY $C0 — INY increments Y, then STY stores Y into $C0 (a zero-page byte used as a software motor-control flag). Writing $C0 allows software to control the cassette motor state.
- CLI; CLC — Clear the interrupt-disable flag (enable IRQs) and clear the carry flag to restore CPU status to a known state for subsequent operations.
- LDA #$00; STA $02A0 — Clear the byte at $02A0 (loader-specific flag/location), ensuring no leftover state remains that would affect later code.
- JSR $FC93 — Restore the default IRQ vector/routine. This re-enables the normal IRQ handler which turns the screen back on and stops the cassette motor (reversing turbo-loader IRQ modifications).
- JSR $E453 — Copies a table of BASIC vectors to RAM (starting at $0300 per the original comment). This prevents the turbo loader code from being re-executed if control is handed back to the BASIC interpreter (the BASIC entry points are relinked to safe RAM locations).

Order matters: checksum read and motor-flag update occur before IRQs and vectors are restored so the loader can finish tape I/O and then hand control back to the system cleanly.

## Source Code
```asm
        ; --End of Load Loop-----------------

03A8    20 E7 03    JSR $03E7      ; Reads a closing byte (Checksum)

03AB    C8          INY
03AC    84 C0       STY $C0        ; Allows control of the motor
                                 ; via software
03AE    58          CLI
03AF    18          CLC

03B0    A9 00       LDA #$00
03B2    8D A0 02    STA $02A0

03B5    20 93 FC    JSR $FC93      ; Restores the Default IRQ
                                 ; Routine. This subroutine
                                 ; is used to turn the screen
                                 ; back on and stop the cassette
                                 ; motor.

03B8    20 53 E4    JSR $E453      ; Calls this subroutine to copy
                                 ; the table of vectors to
                                 ; important BASIC routines
                                 ; to RAM, starting at location
                                 ; $300. This prevents the Turbo
                                 ; loader is executed again if
                                 ; control is given back to the
                                 ; BASIC interpreter.
```

## References
- "checksum_validation_autostart_and_relink" — expands on checksum handling, autostart behavior, and relinking after restoring IRQ/vectors
- "read_byte_subroutine" — details the Read Byte routine at $03E7 that reads the closing checksum byte