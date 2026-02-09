# C64 tape loader: checksum, autostart/chain decision, and return-to-BASIC flow

**Summary:** Describes loader control flow around checksum verification (LDA $F7; EOR $02; ORA $90; BEQ), soft-reset on mismatch (JMP $FCE2), first flag byte at $31 (chain/load more files, JMP $02B9), second flag byte at $32 (autostart via JMP ($002F) vs. return to BASIC via JSR $A533), and the relinking + keyboard-buffer injection sequence that returns control to BASIC (writes into $0276,X, sets $C6, then JMP $02E9).

## Behavior and control flow
- Checksum verification:
  - The loader computes/reads a checksum result in A (from $F7), EORs it with the value at $02 (LDA $F7; EOR $02), then ORs with the byte located at zero page $0090 (ORA $90 — note this is OR with memory, not an immediate). If the final A becomes zero the code branches forward (BEQ $03C6) — otherwise it jumps to $FCE2 which performs a software reset/warm start.
- Wrong checksum:
  - JMP $FCE2 performs a soft reset (KERNAL warm start / error recovery path).
- Flags controlling post-load behavior:
  - First flag (zero page $31): non-zero means other files still need loading; control transfers to $02B9 which continues the loader/file chaining.
  - Second flag (zero page $32): if set, the loader jumps to the loaded program's exec address via the indirect vector at $002F (JMP ($002F)). If clear, it will instead relink the BASIC program in memory and return control to BASIC.
- Returning control to BASIC (no autostart):
  - JSR $A533 is invoked to relink BASIC program lines (rebuild BASIC's internal line pointers so the loaded program is a valid BASIC program in memory).
  - After relink, the loader prepares a synthetic keyboard sequence so BASIC will RUN the relinked program: it sets X = #$03 and stores that value to $C6 (keyboard buffer count), then copies bytes from the source area $02F3,X into $0276,X (keyboard buffer area) — these bytes are the characters "R", "SHIFT+U", "RETURN" (as stored earlier). The loop decrements X until complete. Finally the loader JMPs $02E9 to resume the BASIC input interpreter path (which will process the injected keys).
- Notes:
  - JMP ($002F) uses the 16-bit pointer at $002F as the Exec address (indirect jump).
  - ORA $90 is zero-page memory OR; $90 is not an immediate constant here.
  - The code writes the keyboard characters by STA $0276,X; $0276..$0279 is used as the injected keyboard buffer area in this sequence; the count written to $C6 indicates the number of characters to process (as used by the KERNAL/BASIC input routine).

## Source Code
```asm
03BB  A5 F7      LDA $F7        ; Checks checksum
03BD  45 02      EOR $02
03BF  05 90      ORA $90        ; OR with zero page $0090 (memory)
03C1  F0 03      BEQ $03C6

03C3  4C E2 FC  JMP $FCE2      ; A wrong checksum causes a SOFT Reset

03C6  A5 31      LDA $31        ; First flag byte: other files
03C8  F0 03      BEQ $03CD      ; need to be loaded?
03CA  4C B9 02  JMP $02B9

03CD  A5 32      LDA $32        ; Second flag byte: use the Exec.
03CF  F0 03      BEQ $03D4      ; address or give back control to BASIC?

03D1  6C 2F 00  JMP ($002F)    ; Jumps to Exec. address (indirect)

03D4  20 33 A5  JSR $A533      ; Relinks lines of a BASIC program.

03D7  A2 03      LDX #$03       ; Puts 3 chars in the Keyboard
03D9  86 C6      STX $C6        ; Buffer (store count)

03DB  BD F3 02  LDA $02F3,X    ; Those are "R", "SHIFT+U"
03DE  9D 76 02  STA $0276,X    ; and "RETURN" (copied into KB buffer)
03E1  CA          DEX
03E2  D0 F7      BNE $03DB
03E4  4C E9 02  JMP $02E9      ; Resume BASIC input/interpreter flow
```

## Key Registers
- $F7 - Memory - Checksum/result byte used by loader
- $0002 - Memory - Value EORed with $F7 during checksum check
- $0090 - Memory - Zero-page byte ORed into A (ORA $90)
- $0031 - Memory - First flag: chain/load more files (non-zero -> JMP $02B9)
- $0032 - Memory - Second flag: autostart via Exec vector (non-zero -> JMP ($002F))
- $002F - Memory - Indirect Exec vector (JMP ($002F) jumps to the loaded program's exec address)
- $02B9 - Memory/KERNAL - Loader continuation entry for loading additional files
- $A533 - KERNAL - Relink BASIC program routine (JSR $A533)
- $02F3 - Memory - Source bytes for injected keyboard sequence (characters to copy)
- $0276 - Memory - Keyboard buffer area (destination of STA $0276,X)
- $00C6 - Memory - Keyboard buffer count written by STX $C6
- $02E9 - Memory/KERNAL - Resume BASIC input/interpreter entry (JMP $02E9)
- $FCE2 - KERNAL/System - Soft-reset / warm-start entry point (JMP here on bad checksum)

## References
- "post_load_cleanup_and_irq_restore" — expands on IRQ restore and vector copy performed earlier
- "loader_core_leader_sync_and_header_read" — expands on how flag bytes ($31/$32) were read into the header area and their meaning for autostart/chain behavior