# CHRGET / CHRGOT (zero page $73-$8A) — Get Next BASIC Text Character

**Summary:** Zero-page BASIC text reader CHRGET at $0073-$008A (copied from ROM $E3A2) increments the TXTPTR pointer ($007A-$007B), returns the next character in A, skips spaces, and sets status flags (Carry/Zero) to indicate ASCII digits and statement terminators; CHRGOT ($0079) reads the current character without advancing. Common wedge insertion points: INC $7A (replace with JMP WEDGE) or CMP #$3A at POINTB ($007C).

## Behavior and flags

- Purpose: CHRGET is the zero-page subroutine BASIC uses to fetch the next character of BASIC source/input. It is copied from the ROM routine MOVCHG ($E3A2) into zero page at cold start so it can update the pointer operand in place for speed.
- Pointer semantics: TXTPTR is stored as two zero-page bytes at $007A (low) and $007B (high). CHRGET advances the low byte ($007A) with INC; if it overflows, it increments the high byte ($007B). The LDA that reads the character uses the two-byte operand (TXTPTR) as its address, so CHRGET must be in RAM to modify that operand.
- CHRGOT entry ($0079): entering at CHRGOT performs the LDA using the current TXTPTR but does not increment TXTPTR — allows re-reading the same character.
- Space skipping: If the read character is ASCII space (0x20), CHRGET loops to fetch the next character (skips spaces).
- Digit detection and status flags:
  - Exit state places the character byte in A.
  - Carry Clear indicates an ASCII digit '0'..'9' (0x30–0x39).
  - Carry Set indicates a non-digit.
  - Zero Set signals a statement terminator: the NUL (0) terminator or ASCII colon ':' (0x3A). Zero Clear otherwise.
- Exact test sequence used by CHRGET (summary):
  1. CMP #$3A ; sets Carry if character >= 0x3A, Zero if exactly 0x3A
     - BCS EXIT (if >= 0x3A, done; Zero set if colon)
  2. CMP #$20 ; if equal (space), branch back to CHRGET to skip it
  3. SEC; SBC #$30; SEC; SBC #$D0 ; arithmetic sequence that yields Carry Clear only for ASCII '0'..'9'
- ROM references: CHRGET in RAM is copied from MOVCHG at $E3A2. The ROM version of POINTB (the CMP #$3A test) is at $E3AB; wedge techniques often jump to/from that ROM entry.
  **[Note: Source may contain an error — the decimal ROM address given (48283) does not match hex $E3AB (58283).]**

## Wedges and interception points

- INC $007A (low byte of TXTPTR) replacement:
  - Replace INC $007A with JMP WEDGE; the wedge updates TXTPTR itself (advancing or changing pointer as desired), then JSR $0079 (CHRGOT) to read the character without further advancing.
  - Typical use: intercept BASIC input to add new keywords/commands. Must update TXTPTR correctly to avoid corrupting parsing.
- CMP #$3A (POINTB at $007C) replacement:
  - Replace the CMP #$3A with JMP WEDGE; wedge performs checks and then returns/exits through the ROM POINTB at $E3AB so normal digit/terminator behavior is preserved.
- Performance considerations:
  - Wedges slow BASIC because CHRGET is executed for every token/character. Commonly wedges are made to run only in immediate/direct mode (not when executing BASIC programs) to reduce overhead.
  - Alternate, less invasive method: use BASIC RAM vectors at $0300-$030B to hook into the parser/input system without patching CHRGET (see BASIC RAM vector documentation referenced below).

## Source Code
```asm
; Disassembly of CHRGET / CHRGOT as stored in zero page ($0073-$008A)
; Addresses shown as in zero page copy

0073  INC $7A        ; CHRGET: increment low byte of TXTPTR
0075  BNE $0079      ; if low byte != 0, skip high-byte increment
0077  INC $7B        ; increment high byte of TXTPTR
0079  CHRGOT LDA ($??) ; load A from address pointed to by TXTPTR (entry here doesn't update TXTPTR)
        ; note: the LDA operand is the two-byte pointer at $7A/$7B (TXTPTR)
007A  TXTPTR .BYTE $07,$02  ; shown in source as $0207 (pointer is the LDA operand)
007C  CMP #$3A       ; POINTB: compare with ':' (0x3A). Carry set if >= 0x3A
007E  BCS $008A      ; if >= ':' (not a numeral < 0x3A), exit
0080  CMP #$20       ; if ASCII space...
0082  BEQ $0073      ; ...ignore and get next character (skip spaces)
0084  SEC
0085  SBC #$30       ; subtract ASCII '0'
0087  SEC
0088  SBC #$D0       ; arithmetic yields Carry clear only for '0'..'9'
008A  EXIT RTS       ; return, A holds character; Carry/Zero reflect tests above

; Comments:
; - TXTPTR pointer points into input buffer (in direct mode, TXTPTR+1 often points to $0200-$0250)
; - On exit: A = character; Carry clear => digit; Zero set => terminator (0 or ':')
```

## Key Registers
- $0073-$008A - Zero page - CHRGET / CHRGOT routine (RAM copy of ROM MOVCHG)
- $0079 - Zero page - CHRGOT entry point (read current char without advancing)
- $007A-$007B - Zero page - TXTPTR low/high (pointer operand used by LDA; incremented by CHRGET)
- $0300-$030B - RAM - BASIC RAM vectors (alternative hooking points mentioned in discussion)
- $E3A2 - ROM - MOVCHG (original ROM source routine copied into zero page at cold start)
- $E3AB - ROM - POINTB (ROM version of CMP #$3A entry used by some wedge techniques)

## References
- "basic_numeric_work_area_and_fac" — expands on TXTPTR use and numeric/text parsing interactions
- "basic_runtime_editor_io_and_screen_pointers" — expands on TXTPTR and editor/input pointers