# Minimal C64 Datasette Loader — Leader and Countdown (get_countdown)

**Summary:** Implements a minimal datasette file-start detector that ignores the leader pulses and verifies the countdown byte sequence $89 down to $81 using get_countdown and calls get_byte to fetch each byte; handles incomplete countdowns followed by complete ones.

## Leader and Countdown
Files begin with a leader of short pulses (ignored by this minimal loader) followed by a 9-byte countdown sequence:
$89, $88, $87, $86, $85, $84, $83, $82, $81.

get_countdown algorithm (as implemented in the listing):
- Read an initial byte with JSR get_byte.
- Initialize tmp_cntdwn to $89 and Y to 9 (count of expected bytes).
- Loop:
  - Compare the last-read byte (A) to tmp_cntdwn.
  - If equal: DEC tmp_cntdwn; DEY; if Y != 0, JSR get_byte and continue; if Y == 0, RTS (full countdown observed).
  - If not equal:
    - If Y == 9 (mismatch occurred on the first comparison after init) — go read another byte (JSR get_byte) without reinitializing tmp_cntdwn (this allows skipping stray bytes during leader).
    - Otherwise — reinitialize tmp_cntdwn to $89 and Y to 9 and continue (restart detection).
- This behavior lets the routine tolerate incomplete or partial countdowns and still detect a later complete countdown.

Control-flow labels in the listing:
- c0: read a byte (JSR get_byte).
- c1: initialize tmp_cntdwn and Y, then branch into the comparison logic.
- cx/c2: comparison loop and decrement logic.
- c4: mismatch handling — decide between reading a new byte or reinitializing.

## Source Code
```asm
; Countdown sequence expected: $89, $88, $87, $86, $85, $84, $83, $82, $81

get_countdown:
c0: jsr get_byte
c1: ldy #$89
    sty tmp_cntdwn    ; start with $89
    ldy #9
    bne c2
cx: jsr get_byte
c2: cmp tmp_cntdwn
    bne c4
    dec tmp_cntdwn
    dey
    bne cx
    rts
c4: cpy #9            ; first byte wrong?
    beq c0            ; then read new byte
    bne c1            ; compare against $89
```

## References
- "get_byte_routine" — expands on the routine used to read countdown bytes
- "get_block" — expands on how data blocks are read after the countdown