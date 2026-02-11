# CHKOUT — Open channel for output (wrapper at $FFC9)

**Summary:** KERNAL wrapper at $FFC9 that JMPs ($0320) — CHKOUT vector — to open a previously opened logical file as an output channel; mentions OPEN $FFC0, CHROUT $FFD2, and serial LISTEN/secondary behavior. Returns error codes 3, 5, 7.

## Description
This KERNAL entry is a small wrapper whose code at $FFC9 performs an indirect JMP through the CHKOUT vector stored at $0320, so the effective CHKOUT implementation is vectorized and can be replaced by modifying $0320/$0321.

Behavior:
- Defines any logical file that has already been opened by OPEN ($FFC0) as an output channel. The device on that channel must be an output-capable device or the routine aborts with an error.
- If sending output to anything other than the screen, CHKOUT must be called before using CHROUT ($FFD2). If output is only to the screen and no other output channels are open, calling OPEN and CHKOUT is unnecessary.
- For devices on the serial bus, CHKOUT will automatically send the LISTEN address and any secondary address established by OPEN ($FFC0).
- Errors returned by CHKOUT are numeric (in A or on the appropriate error return mechanism — consistent with KERNAL conventions).

Possible errors returned:
- 3 — File not open
- 5 — Device not present
- 7 — File is not an output file

This wrapper exists so user code or cartridges can point the CHKOUT vector ($0320) at alternate implementations while preserving the canonical entrypoint at $FFC9.

## Source Code
```asm
; KERNAL ROM disassembly snippet
; Fully commented: CHKOUT wrapper at $FFC9
; Calls: JMP ($0320)  ; indirect through CHKOUT vector

        .org $FFC9
        6C 20 03     JMP ($0320)    ; do open channel for output

; Notes from documentation:
; - Any logical file already opened by OPEN ($FFC0) can be defined as an output channel.
; - If sending data to devices on the serial bus, this routine sends the listen address
;   and any secondary address specified by OPEN.
; - If sending to screen only and no other output channels are open, OPEN and CHKOUT are not needed.

; Error codes (returned on failure):
; 3 = file not open
; 5 = device not present
; 7 = file is not an output file
```

## Key Registers
- $FFC9 - KERNAL - CHKOUT wrapper (JMP ($0320))
- $0320 - RAM/Vectors - CHKOUT vector (indirect jump target)
- $FFC0 - KERNAL - OPEN (opens logical files/devices)
- $FFD2 - KERNAL - CHROUT (character output routine used after CHKOUT)

## References
- "kernal_vectors_list" — expands on CHKOUT vector at $0320 and other KERNAL vectors

## Labels
- CHKOUT
