# scan_comma_and_get_byte ($E200)

**Summary:** Helper in BASIC ROM at $E200 that scans for a ",byte" parameter (JSR $E20E) and then jumps to the byte-parameter fetch routine ($B79E); if no parameter is present it invokes a memory-scan ($0079) and uses a branch/PLA/RTS sequence to exit appropriately. Contains JSR $E20E, JMP $B79E, JSR $0079, BNE, PLA/PLA and RTS.

## Description
This small ROM helper is used by BASIC's parameter parsing to handle an optional single-byte numeric parameter following a comma. Behavior by step:

- $E200: JSR $E20E — call the comma/byte scanner which looks for a comma and a following (valid) byte token.
- If the scanner indicates a byte parameter is present, execution continues into the JMP:
  - $E203: JMP $B79E — jump to the routine that fetches/validates the byte parameter and returns (byte-parameter fetch lives at $B79E).
- If no comma/byte parameter is found, control flows to the exit/test sequence:
  - $E206: JSR $0079 — call a memory-scan routine (scanner that steps the token stream and sets processor flags according to what it finds).
  - $E209: BNE $E20D — branch to $E20D (RTS) if the memory-scan indicates the condition tested is true (BNE taken).
  - If BNE is not taken, execution falls through to:
    - $E20B: PLA — pull a byte from stack (documented as "dump return address low byte").
    - $E20C: PLA — pull another byte (documented as "dump return address high byte").
    - $E20D: RTS — return; the two PLAs removed the saved return address from the stack before returning.

Notes:
- The two PLA instructions remove two bytes that were pushed (the return address placed by the earlier JSR). This effectively discards that return address before executing RTS; the exact stack effect is intentional to return to a different address on the caller's stack.
- The routine is a tight control-flow helper used by multiple BASIC parser routines (e.g., LOAD/SAVE parameter parsing).

## Source Code
```asm
        ; scan and get byte, else do syntax error then warm start
.,E200 20 0E E2    JSR $E20E       ; scan for ",byte", else syntax error/warm start
.,E203 4C 9E B7    JMP $B79E       ; get byte parameter and return
        ; exit function if [EOT] or ":"
.,E206 20 79 00    JSR $0079       ; scan memory
.,E209 D0 02       BNE $E20D       ; branch if not [EOL] or ":"
.,E20B 68          PLA             ; dump return address low byte
.,E20C 68          PLA             ; dump return address high byte
.,E20D 60          RTS
```

## References
- "scan_comma_and_valid_byte" — expands on the comma scan and validation logic
- "get_params_for_load_save" — describes how LOAD/SAVE parser calls this to fetch optional numeric parameters
