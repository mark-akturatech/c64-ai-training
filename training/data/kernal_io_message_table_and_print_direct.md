# KERNAL I/O Messages table and PRINT MESSAGE IF DIRECT ($F0BD / $F12B)

**Summary:** KERNAL I/O message strings live at $F0BD and are terminated by a character with bit 7 set; the PRINT MESSAGE IF DIRECT routine at $F12B prints a selected message in direct mode (tests MSGFLG $009D) using CHROUT ($FFD2).

## I/O messages table and printing routine
- Message storage: The KERNAL stores human-readable I/O messages (e.g. "I/O error", "loading", "saving", "press play on tape") starting at ROM address $F0BD. Each message is a sequence of ASCII bytes; the final byte of each message has bit 7 set (high bit) as the terminator marker.
- Message selection: The PRINT MESSAGE IF DIRECT routine expects the string offset in Y (index into the table at $F0BD). It is typically called with Y set to an offset selecting which message to print.
- Direct vs program mode: The routine begins with BIT $009D (MSGFLG). BIT sets the Negative flag from bit 7 of that memory location; BPL is then used to detect program mode. If bit 7 of MSGFLG is clear (program mode), the routine returns without printing. If bit 7 is set (direct mode), it proceeds to output the message.
- Output loop and terminator handling:
  - The loop loads bytes from $F0BD,Y into A. The Negative flag (N) will reflect bit 7 of the loaded character.
  - PHP is used to push the current processor flags (so the N flag set by the LDA is preserved across CHROUT and INY which clobber flags).
  - The high bit is cleared with AND #$7F before calling CHROUT ($FFD2) so the printed character is plain ASCII.
  - After CHROUT and INY, PLP restores the flags pushed earlier (restoring the N flag that reflected the original byte's bit 7). BPL loops while N=0 (i.e. until a byte with bit 7 = 1 was encountered).
  - On exit CLC is executed to indicate no error, then RTS returns to caller.
- Behavior summary: In direct mode the routine prints characters until it encounters the terminator (high-bit set) and then returns with carry clear. In program mode the routine does nothing and returns immediately.

## Source Code
```text
                                *** TABLE OF KERNAL I/O MESSAGES 1
                                This is a table of messages used by the KERNAL in
                                conjunction with its I/O routines. Bit 7 is set in the
                                last character in each message as a terminator.
.:F0BD 0D 49 2F 4F 20 45 52 52  I/O error
.:F0C5 4F 52 20 A3
.:F0C9 0D 53 45 41 52 43 48 49  searching for
.:F0D1 4E 47 A0 46 4F 52 A0
.:F0D8 0D 50 52 45 53 53 20 50  press play on tape
.:F0E0 4C 41 59 20 4F 4E 20 54
.:F0E8 41 50 C5
.:F0EB 50 52 45 53 53 20 52 45  press record and play on tape
.:F0F3 43 4F 52 44 20 26 20 50
.:F0FB 4C 41 59 20 4F 4E 20 54
.:F103 41 50 C5
.:F106 0D 4C 4F 41 44 49 4E C7  loading
.:F10E 0D 53 41 56 49 4E 47 A0  saving
.:F116 0D 56 45 52 49 46 59 49  verifying
.:F11E 4E C7
.:F120 0D 46 4F 55 4E 44 A0     found
.:F127 0D 4F 4B 8D              ok
```

```asm
; PRINT MESSAGE IF DIRECT
; Entry: Y = offset into message table at $F0BD
.;F12B 24 9D    BIT $009D         ; MSGFLG, test direct (bit7)
.;F12D 10 0D    BPL $F13C         ; program mode -> skip printing
.;F12F B9 BD F0 LDA $F0BD,Y       ; load byte from messages
.;F132 08       PHP               ; save flags (preserve N from LDA)
.;F133 29 7F    AND #$7F          ; clear bit7 before printing
.;F135 20 D2 FF JSR $FFD2         ; CHROUT (KERNAL) -> output character
.;F138 C8       INY               ; next character
.;F139 28       PLP               ; restore flags (N indicates original bit7)
.;F13A 10 F3    BPL $F12F         ; loop while bit7 was clear
.;F13C 18       CLC               ; indicate no error
.;F13D 60       RTS
```

## Key Registers
- $009D - KERNAL/zero page - MSGFLG (message flag; bit 7 = direct mode indicator)
- $FFD2 - KERNAL ROM - CHROUT (output character routine; expects character in A)
- $F0BD-$F127 - KERNAL ROM - I/O message strings table
- $F12B-$F13D - KERNAL ROM - PRINT MESSAGE IF DIRECT routine

## References
- "basic_file_commands_sys_save_load_verify_open_close" — expands on messages used by save/load/verify routines

## Labels
- CHROUT
- MSGFLG
- PRINT_MESSAGE_IF_DIRECT
