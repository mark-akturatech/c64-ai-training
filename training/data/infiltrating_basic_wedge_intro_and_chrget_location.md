# MACHINE — The Wedge (CHRGET / CHRGOT)

**Summary:** Describes the BASIC interpreter's zero-page input routine CHRGET/CHRGOT used to fetch and classify characters (numeric, end-of-command, other); typical addresses $0070-$0087 (PET/CBM) and $0073-$008A (VIC-20 / C64). The routine is self-modifying and provides two entry points: CHRGET (get next character) and CHRGOT (recheck last character).

**Description**
BASIC's interpreter uses a small zero-page subroutine to read characters from the in-memory BASIC program text and to classify them (numeric, end-of-command, etc.). The routine is entered at two logical entry points:

- **CHRGET** — Advances the text pointer and returns the next character from the BASIC program.
- **CHRGOT** — Rechecks or reclassifies the last-returned character without advancing the text pointer.

Location varies by machine:
- **PET/CBM family:** Routine typically occupies $0070–$0087.
- **VIC‑20 and Commodore 64:** Routine typically occupies $0073–$008A.

The routine is self-modifying: CHRGET increments the text pointer by modifying the operand of the LDA instruction within CHRGOT. This is achieved by incrementing the low byte of the text pointer (TXTPTR at $7A), and if it overflows, incrementing the high byte (TXTPTR+1 at $7B). Descriptions of the routine are often shown using symbolic labels (CHRGET, CHRGOT, CHRGOT+1) rather than absolute addresses because of the location differences between machines.

## Source Code
```asm
; Full disassembly of CHRGET/CHRGOT for VIC-20 and Commodore 64

; CHRGET: Advance text pointer and get next character
CHRGET:
    INC TXTPTR       ; Increment low byte of text pointer
    BNE CHRGOT       ; If no overflow, jump to CHRGOT
    INC TXTPTR+1     ; Increment high byte of text pointer if low byte overflowed

; CHRGOT: Get current character without advancing text pointer
CHRGOT:
    LDA (TXTPTR),Y   ; Load character at text pointer
    BEQ EXIT         ; If character is null (end of line), exit
    CMP #$3A         ; Compare with colon (':')
    BEQ EXIT         ; If character is colon, exit
    CMP #$20         ; Compare with space (' ')
    BEQ CHRGET       ; If character is space, get next character
    SEC              ; Set carry flag
    SBC #$30         ; Subtract ASCII '0'
    SEC              ; Set carry flag
    SBC #$D0         ; Subtract to set carry if character is '0'-'9'
EXIT:
    RTS              ; Return from subroutine
```

```text
; Typical addresses (by machine)
; PET/CBM:   CHRGET/CHRGOT region at $0070 - $0087
; VIC-20/C64:CHRGET/CHRGOT region at $0073 - $008A
```

## Key Registers
- **TXTPTR ($7A-$7B):** Zero-page pointer to the current position in the BASIC text.
- **Accumulator (A):** Holds the character read from the BASIC text.
- **Status Register (P):** Flags set based on character classification:
  - **Carry Flag (C):** Clear if character is a digit ('0'-'9'), set otherwise.
  - **Zero Flag (Z):** Set if character is a statement terminator (colon ':' or null), clear otherwise.

## References
- [CHRGET - C64-Wiki](https://www.c64-wiki.com/wiki/CHRGET)
- [115-138 - C64-Wiki](https://www.c64-wiki.com/wiki/115-138)
- [ROM Disassembly | Ultimate Commodore 64 Reference](https://www.pagetable.com/c64ref/c64disasm/)
- [Machine Language for the Commodore 64](https://www.scribd.com/document/83494679/Machine-Language-for-the-Commodore-64)

## Labels
- CHRGET
- CHRGOT
- TXTPTR
