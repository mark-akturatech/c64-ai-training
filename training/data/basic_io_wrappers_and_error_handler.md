# BASIC I/O wrappers and centralized BASIC I/O error handler (ROM $E0F9–$E129)

**Summary:** KERNAL/BASIC I/O wrapper helpers (JSR to $FFD2/$FFCF/$FFC6/$FFE4 and an internal $E4AD) that check the carry flag and branch to a centralized BASIC I/O error handler at $E0F9. The handler maps error codes ($F0 special-case, $00 → $1E break, otherwise pass error in X) and either restores memory pointers ($37/$38) and clears memory or jumps to the BASIC error/ warm-start routine ($A437). Searchable terms: $E0F9, $FFD2, $FFCF, $FFE4, BCS, JSR, $F0, $1E, $37/$38.

## Description
- All wrapper routines call a KERNAL or ROM service with JSR, then test the carry flag with BCS. If carry is set (error), control branches to the centralized BASIC I/O error handler at $E0F9; otherwise they RTS.
- Error handler behavior:
  - If error = $F0: store Y → $38 (end-of-memory high byte) and X → $37 (end-of-memory low byte) then JMP $A663 to "clear from start to end and return" (restores memory pointers and clears that memory region).
  - Otherwise: copy error to X (TAX). If error is $00, set X = $1E (break error). Then JMP $A437 to "do error #X then warm start" (warm start restarts BASIC interpreter).
- Routines present in this chunk:
  - Output character to current channel: JSR $FFD2
  - Input character from current channel: JSR $FFCF
  - Open channel for output: JSR $E4AD
  - Open channel for input: JSR $FFC6
  - Get character from input device: JSR $FFE4
- Note: Carry set after the JSR indicates the I/O operation reported an error (standard KERNAL convention).

## Source Code
```asm
                                *** handle BASIC I/O error
.,E0F9 C9 F0    CMP #$F0        compare error with $F0
.,E0FB D0 07    BNE $E104       branch if not $F0
.,E0FD 84 38    STY $38         set end of memory high byte
.,E0FF 86 37    STX $37         set end of memory low byte
.,E101 4C 63 A6 JMP $A663       clear from start to end and return
                                error was not $F0
.,E104 AA       TAX             copy error #
.,E105 D0 02    BNE $E109       branch if not $00
.,E107 A2 1E    LDX #$1E        else error $1E, break error
.,E109 4C 37 A4 JMP $A437       do error #X then warm start

                                *** output character to channel with error check
.,E10C 20 D2 FF JSR $FFD2       output character to channel
.,E10F B0 E8    BCS $E0F9       if error go handle BASIC I/O error
.,E111 60       RTS             

                                *** input character from channel with error check
.,E112 20 CF FF JSR $FFCF       input character from channel
.,E115 B0 E2    BCS $E0F9       if error go handle BASIC I/O error
.,E117 60       RTS             

                                *** open channel for output with error check
.,E118 20 AD E4 JSR $E4AD       open channel for output
.,E11B B0 DC    BCS $E0F9       if error go handle BASIC I/O error
.,E11D 60       RTS             

                                *** open channel for input with error check
.,E11E 20 C6 FF JSR $FFC6       open channel for input
.,E121 B0 D6    BCS $E0F9       if error go handle BASIC I/O error
.,E123 60       RTS             

                                *** get character from input device with error check
.,E124 20 E4 FF JSR $FFE4       get character from input device
.,E127 B0 D0    BCS $E0F9       if error go handle BASIC I/O error
.,E129 60       RTS             
```

## References
- "sys_save_load_file_io_parsing" — expands on higher-level BASIC file I/O (OPEN/CLOSE/LOAD/SAVE) that uses these wrappers and the centralized error handler.