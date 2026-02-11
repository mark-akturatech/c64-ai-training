# Commented KERNAL: BASIC I/O error handling & simple I/O wrappers

**Summary:** KERNAL/BASIC I/O wrappers and BIOERR error dispatcher for BASIC (routines BCHOUT, BCHIN, BCKOUT, BCKIN, BGETIN) that call CHROUT $FFD2, CHRIN $FFCF, CHKIN $FFC6, CHKOUT $E4AD, GETIN $FFE4 and branch to the BASIC I/O error handler at $E0F9 / vector $A437. Also references BASIC workspace MEMSIZ ($0038) and BASIC pointer bytes at $030E-$030F.

## Description
This chunk documents the BASIC-facing KERNAL routines that wrap lower-level I/O services and dispatch BASIC I/O errors to the BASIC error handler (BIOERR).

- BIOERR ($E0F9): BASIC I/O error dispatcher. If the error code equals #$F0 the routine stores Y and X into BASIC workspace bytes ($0038/$0037, MEMSIZ and related) and jumps to CLR ($A663) to clear without aborting I/O; otherwise the error code from A is transferred to X, if zero X is set to #$1E before jumping to the BASIC error vector at $A437.
- BCHOUT ($E10C): Calls CHROUT (JSR $FFD2) to output the character in A; on carry set (BCS) branches into BIOERR to handle an I/O error; otherwise returns.
- BCHIN ($E112): Calls CHRIN (JSR $FFCF) to input a character into A; on carry set branches into BIOERR; otherwise returns.
- BCKOUT ($E118): Calls CHKOUT (JSR $E4AD) to open an output channel using the logical file number in X; on carry set branches into BIOERR; otherwise returns.
- BCKIN ($E11E): Calls CHKIN (JSR $FFC6) to open an input channel; on carry set branches into BIOERR; otherwise returns.
- BGETIN ($E124): Calls GETIN (JSR $FFE4) to fetch a character from the keyboard buffer into A; on carry set branches into BIOERR; otherwise returns.

Error flow: each wrapper checks the processor carry flag after the JSR to the underlying KERNAL routine; if carry=1 an I/O error occurred and execution jumps (via BCS) to the BIOERR entry point at $E0F9 which performs the BASIC-level error handling (possibly adjusting MEMSIZ and jumping to CLR or forwarding to the error vector $A437).

Behavioral notes preserved from source:
- Special-case error value #$F0 causes storing of Y/X into BASIC MEMSIZ ($0038/$0037) and a JMP to CLR ($A663) rather than invoking the standard BASIC error vector.
- When A==0 at BIOERR, X is set to #$1E before transferring control to the error vector.

## Source Code
```asm
- Commented Commodore 64 KERNAL Disassembly (Magnus Nyman) - BASIC I/O error handling and simple input/output wrappers: BIOERR error dispatcher, BCHOUT (calls CHROUT at $FFD2), BCHIN (calls CHRIN at $FFCF), BCKOUT (CHKOUT wrapper calling $E4AD/$FFC9), BCKIN (CHKIN wrapper). Includes checks for carry and branching to the I/O error handler. Registers and vectors referenced: JSR $FFD2, $FFCF, $FFC6, $E4AD, error vector $A437, MEMSIZ ($38), SPREG/SAREG/SXREG/SYREG at $030F-$030E.

                                *** BIOERR: HANDLE I/O ERROR IN BASIC
                                This routine is called whenever BASIC wishes to call one
                                of the KERNAL I/O routines. It is also used to handle I/O
                                errors in BASIC.
.,E0F9 C9 F0    CMP #$F0        test error
.,E0FB D0 07    BNE $E104
.,E0FD 84 38    STY $38         MEMSIZ, highest address in BASIC
.,E0FF 86 37    STX $37
.,E101 4C 63 A6 JMP $A663       do CLR without aborting I/O
.,E104 AA       TAX             put error flag i (X)
.,E105 D0 02    BNE $E109       if error code $00, then set error code $1e
.,E107 A2 1E    LDX #$1E
.,E109 4C 37 A4 JMP $A437       do error

                                *** BCHOUT: OUTPUT CHARACTER
                                This routine uses the KERNAL routine CHROUT to output the
                                character in (A) to an available output channel. A test is
                                made for a possible I/O error.
.,E10C 20 D2 FF JSR $FFD2       output character in (A)
.,E10F B0 E8    BCS $E0F9       if carry set, handle I/O error
.,E111 60       RTS             else return

                                *** BCHIN: INPUT CHARACTER
                                This routine uses the KERNAL routine CHRIN to input a
                                character to (A) from an available input channel. A test
                                is made for a possible I/O error.
.,E112 20 CF FF JSR $FFCF       input character from CHRIN
.,E115 B0 E2    BCS $E0F9       if carry set, handle I/O error
.,E117 60       RTS             else return

                                *** BCKOUT:SET UP FOR OUTPUT
                                This routine uses the KERNAL routine CHKOUT to open an
                                output channel, and tests for possible I/O error. On entry
                                (X) must hold the the logical file number as used in OPEN.
.,E118 20 AD E4 JSR $E4AD       open output channel via CHKOUT
.,E11B B0 DC    BCS $E0F9       if carry set, handle I/O error
.,E11D 60       RTS             else return

                                *** BCKIN: SET UP FOR INPUT
                                This routine uses the KERNAL routine CHKIN to open an
                                input channel. A test as made for possible I/O error.
.,E11E 20 C6 FF JSR $FFC6       open input channel via CHKIN
.,E121 B0 D6    BCS $E0F9       if carry set, handle I/O error
.,E123 60       RTS             else return

                                *** BGETIN: GET ONT CHARACTER
                                This routine uses the KERNAL routine GETIN to get a
                                character from the keyboard buffer into (A). A test is
                                made for possible I/O error.
.,E124 20 E4 FF JSR $FFE4       GETIN, get character from keyboard buffer
.,E127 B0 D0    BCS $E0F9       if carry set, handle I/O error
.,E129 60       RTS             else return
```

## Key Registers
- $FFD2 - KERNAL - CHROUT (character output routine)
- $FFCF - KERNAL - CHRIN (character input routine)
- $FFC6 - KERNAL - CHKIN (open input channel)
- $FFE4 - KERNAL - GETIN (keyboard-buffer get)
- $E4AD - KERNAL - CHKOUT entry (open output channel)
- $A663 - KERNAL - CLR (jumped to on special #$F0 behavior)
- $A437 - KERNAL - BASIC I/O error vector (error dispatcher entry)
- $0037-$0038 - BASIC workspace - bytes used by BIOERR (STX $37 / STY $38; MEMSIZ at $0038)
- $030E-$030F - System RAM - SPREG / SAREG / SXREG / SYREG (BASIC-related pointer bytes as referenced)

## References
- "parameter_parsing_and_open_close_helpers" — expands on parsing of device/file parameters for OPEN/CLOSE
- "file_io_and_serial_open_close" — expands on higher-level OPEN/CLOSE/CHKIN/CHKOUT semantics

## Labels
- BIOERR
- BCHOUT
- BCHIN
- BCKOUT
- BCKIN
- BGETIN
- MEMSIZ
