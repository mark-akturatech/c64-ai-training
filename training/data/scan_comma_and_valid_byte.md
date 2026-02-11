# Scan for ",valid byte" (C64 ROM $E20E-$E216)

**Summary:** Two-step scanner in the C64 KERNAL/ROM that enforces a comma followed by a valid byte: calls JSR $AEFD to scan for a comma, then JSR $0079 to scan for a valid following byte; branches to syntax-error/warm-start ($AF08) if the byte is missing. Search terms: $E20E, $E211, JSR $AEFD, JSR $0079, BNE, JMP $AF08, "comma-and-byte".

## Description
This routine implements a two-step parse used where an explicit comma and a following byte are required (pattern ",<byte>"). Flow:

- JSR $AEFD: scan for a comma (","). If the comma is not present this JSR performs a syntax error and warm start (per the original ROM behavior).
- JSR $0079: scan memory for a valid following byte (this routine rejects end-of-line and ':' — i.e., it ensures the next token is a byte).
- BNE $E20D: if the scanner finds a valid byte it returns with a non-zero result and execution continues (branch target $E20D is the exit/continue point).
- JMP $AF08: if no valid byte follows the comma, jump to $AF08 which triggers the syntax error and warm start.

This enforces presence of the byte after the comma and handles error recovery via the ROM's syntax-error/warm-start mechanism.

## Source Code
```asm
        *** scan for ",valid byte", else do syntax error then warm start
.,E20E 20 FD AE JSR $AEFD       ; scan for ",", else do syntax error then warm start

        *** scan for valid byte, not [EOL] or ":", else do syntax error then warm start
.,E211 20 79 00 JSR $0079       ; scan memory
.,E214 D0 F7    BNE $E20D       ; exit if following byte
.,E216 4C 08 AF JMP $AF08       ; else do syntax error then warm start
```

## References
- "scan_and_get_byte" — expands on scan_and_get_byte calls; enforces comma and byte presence.
- "get_params_for_open_close" — shows OPEN/CLOSE parameter parsing that uses comma-and-byte scanning.