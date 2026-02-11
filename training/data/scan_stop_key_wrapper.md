# ROM wrapper at $FFE1 — scan STOP key (JMP ($0328))

**Summary:** ROM entry at $FFE1 performs an indirect JMP ($0328) to the KERNAL scan/STOP routine. Returns Z set if STOP pressed; otherwise A contains the last keyboard-scan row. Uses JMP indirect vector ($0328).

## Description
This KERNAL wrapper at $FFE1 is a tiny ROM entry that transfers control by performing an indirect jump through the vector located at $0328 (JMP ($0328)). The called routine performs a keyboard scan focused on the STOP key:

- If the STOP key is pressed when the routine is called, the processor Z flag is set; all other processor flags are left unchanged.
- If the STOP key is not pressed, the accumulator (A) will contain a byte representing the last row of the keyboard scan (useful to test for other keys).
- The wrapper is indirect, so the actual handler can be relocated or patched by changing the 16-bit vector at $0328.

This entry is intended as a simple, forwardable entry point to the STOP/key-scan functionality; user code can also examine the returned A or Z to detect specific keys.

## Source Code
```asm
; ROM wrapper at $FFE1
.,FFE1 6C 28 03    JMP ($0328)     ; do scan stop key

; Documentation note:
; if the STOP key on the keyboard is pressed when this routine is called
; the Z flag will be set. All other flags remain unchanged. If the STOP
; key is not pressed then the accumulator will contain a byte representing
; the last row of the keyboard scan. The user can also check for certain
; other keys this way.
```

## Key Registers
- $FFE1 - ROM - KERNAL wrapper entry that JMPs indirectly through $0328
- $0328 - RAM (KERNAL vector table) - 16-bit indirect vector pointing at the actual STOP/keyboard-scan routine

## References
- "kernal_vectors_list" — expands on STOP/scan vector at $0328