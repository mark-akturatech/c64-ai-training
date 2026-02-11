# ROM: Verify/Store Loop — buffer compare, parity handling, pointer advance ($FB08-$FB46)

**Summary:** Compares buffer entries using zero page indexes ($9F/$9E) and two-byte buffer slots at $0100/$0101, conditionally updates saved-byte counter ($9F), inspects load/verify flag ($93) to decide parity handling of RS232 byte ($BD), optionally stores parity via STA ($AC),Y, then calls the pointer-increment routine (JSR $FCDB). Contains conditional status update via JSR $FE1C.

## Description
This routine (starting at $FB08) performs an in-place verify/compare of two-byte records in memory and handles the RS232 parity byte and pointer advancement. Key behaviors:

- Entry/setup
  - FB08: LDX $9F — load index X from zero page $9F.
  - FB0A: CPX $9E / FB0C BEQ $FB43 — if index equals limit ($9E), skip remaining work and go to pointer increment/exit.

- Two-byte compare against buffer entries
  - FB0E: LDA $AC ; FB10: CMP $0100,X — compare zero page $AC (accumulator) with byte at $0100+X.
  - FB15: LDA $AD ; FB17: CMP $0101,X — compare zero page $AD with byte at $0101+X.
  - If either compare fails (BNE to $FB43), the routine jumps to pointer increment/exit without further action.
  - If both comparisons match, the routine increments $9F twice (FB1C–FB1E INC $9F; INC $9F) — effectively advancing the saved-byte counter by two.

- Load/verify flag ($93) and parity handling
  - FB20: LDA $93 ; FB22: BEQ $FB2F — read the load/verify flag from $93. If zero, branch to FB2F (skip the immediate parity-compare path).
  - FB24–FB2A: When $93 ≠ 0, LDA $BD (parity byte), set Y=0, and CMP ($AC),Y — compare parity byte against the memory pointed to by ($AC),Y (indirect indexed). If equal, branch to FB43 (skip storing and proceed to pointer increment).
  - If the parity compare fails, Y is incremented (FB2C C8 INY) and stored to $B6 (FB2D 84 B6) for later use.

- Serial-status update path
  - FB2F–FB38: LDA $B6; if zero, skip. Otherwise set A = #$10 and JSR $FE1C (FB35) — the called routine is annotated as OR-ing this into the serial status byte (sets a status bit). After the JSR, FB38 D0 09 BNE $FB43 branches if non-zero status results (skip storing parity and go to pointer increment).

- Store parity when in "load" mode
  - FB3A–FB3C: LDA $93 ; D0 05 BNE $FB43 — another test of $93; if non-zero branch (skip store).
  - FB3E–FB41: Transfer Y into index (TAY), load parity (LDA $BD) and STA ($AC),Y — store the parity byte into the buffer via indirect-indexed addressing.

- Pointer increment and exit
  - FB43: JSR $FCDB — call routine that increments the read/write pointer.
  - FB46: D0 43 BNE $FB8B — BNE to $FB8B; the original source comments this as "restore registers and exit interrupt, branch always" (see note below).

**[Note: Source may contain an error — the disassembly shows "D0 43" (BNE) at $FB46 but the inline comment says "branch always". BNE is conditional; either the comment is incorrect or the surrounding status ensures this BNE is always taken. Verify in the full ROM context.]**

Behavior summary:
- The routine only advances the saved-byte counter ($9F) when both bytes at $0100+X and $0101+X match $AC/$AD.
- If in a verify mode (value of $93 decides), it compares the RS232 parity byte ($BD) against buffer memory via ($AC),Y; on mismatch it may set a serial-status bit via JSR $FE1C, and possibly store the parity byte into the buffer (STA ($AC),Y) when in "load" mode.
- Always calls JSR $FCDB to advance the read/write pointer before branching to the common exit/restore.

## Source Code
```asm
.,FB08 A6 9F    LDX $9F
.,FB0A E4 9E    CPX $9E
.,FB0C F0 35    BEQ $FB43
.,FB0E A5 AC    LDA $AC
.,FB10 DD 00 01 CMP $0100,X
.,FB13 D0 2E    BNE $FB43
.,FB15 A5 AD    LDA $AD
.,FB17 DD 01 01 CMP $0101,X
.,FB1A D0 27    BNE $FB43
.,FB1C E6 9F    INC $9F
.,FB1E E6 9F    INC $9F
.,FB20 A5 93    LDA $93         ; get load/verify flag
.,FB22 F0 0B    BEQ $FB2F       ; if load ??
.,FB24 A5 BD    LDA $BD         ; get RS232 parity byte
.,FB26 A0 00    LDY #$00
.,FB28 D1 AC    CMP ($AC),Y
.,FB2A F0 17    BEQ $FB43
.,FB2C C8       INY
.,FB2D 84 B6    STY $B6
.,FB2F A5 B6    LDA $B6
.,FB31 F0 07    BEQ $FB3A
.,FB33 A9 10    LDA #$10
.,FB35 20 1C FE JSR $FE1C       ; OR into serial status byte
.,FB38 D0 09    BNE $FB43
.,FB3A A5 93    LDA $93         ; get load/verify flag
.,FB3C D0 05    BNE $FB43       ; if verify go ??
.,FB3E A8       TAY
.,FB3F A5 BD    LDA $BD         ; get RS232 parity byte
.,FB41 91 AC    STA ($AC),Y
.,FB43 20 DB FC JSR $FCDB       ; increment read/write pointer
.,FB46 D0 43    BNE $FB8B       ; restore registers and exit interrupt, branch always
```

## Key Registers
- $0093 - Zero page - load/verify flag (controls parity/store behavior)
- $009E - Zero page - compare/limit index (compare target for $9F)
- $009F - Zero page - current index / saved-byte counter (loaded into X)
- $00AC-$00AD - Zero page pair - used by compares and as indirect pointer for STA/ CMP ($AC),Y
- $00B6 - Zero page - temporary Y-save for parity handling
- $00BD - Zero page - RS232 parity byte
- $0100-$0101 - RAM page 1 - buffer area compared against $AC/$AD (two-byte records)
- $FCDB - KERNAL ROM - routine to increment read/write pointer (called)
- $FE1C - KERNAL ROM - routine used to OR/modify serial status byte (called)
- $FEBC - KERNAL ROM - common exit/restore target referenced in surrounding code (see references)

## References
- "buffer_copy_and_load_store" — continues after copying fetched bytes into buffer memory and handles verify vs. load actions and pointer updates
- "interrupt_restore_and_checksum_validation" — common exit and register-restore target after pointer increment or error handling