# KERNAL: SETLFS (JSR $FFBA / 65466) — Set logical file, device, and secondary address

**Summary:** KERNAL routine SETLFS at $FFBA (65466) sets the logical file number (A), device number (X, 0–31), and secondary address/command (Y, 0–255; use 255 for "no secondary") for subsequent KERNAL I/O calls (OPEN, LOAD, SAVE, etc.). Call with JSR $FFBA, using A/X/Y as inputs; device numbers ≥ $04 refer to CBM serial-bus devices.

## Description
SETLFS initializes the KERNAL's file table key and device addressing for later I/O routines. It does not perform open/load/save actions itself — it only records:

- A (Accumulator): logical file number — used as the key into the file table by OPEN and other routines.
- X (X index): device number (0–31). Common device codes are listed below.
- Y (Y index): secondary address (command / secondary device address). If no secondary address is required, set Y = 255 (decimal, $FF).

Operational details:
- Call address: $FFBA (hex) — decimal 65466. Invoke with JSR $FFBA.
- Communication registers: A, X, Y (inputs only).
- Preparatory routines: None required specifically before SETLFS; however, SETLFS is typically called before OPEN/LOAD/SAVE sequences (those routines then use the logical file/device set here).
- Error returns: None from SETLFS itself.
- Stack requirements: 2 bytes (standard JSR return).
- Registers affected: None documented — SETLFS only stores the passed A/X/Y into the KERNAL file table state.
- Device numbers >= 4 automatically refer to devices on the CBM serial bus (serial bus handshaking will send device number then secondary).

How to use (example): load A with logical file number, X with device number, Y with secondary address (or 255), then JSR $FFBA.

## Source Code
```asm
; Example: logical file 32, device #4, no command
    LDA #$20    ; 32 decimal
    LDX #$04    ; device 4 (serial bus)
    LDY #$FF    ; 255 = no secondary address
    JSR $FFBA   ; JSR SETLFS
```

```text
Device number table (common C64 codes)
ADDRESS  DEVICE
0        Keyboard
1        Datassette
2        RS-232C device
3        CRT display
4        Serial-bus printer
8        CBM serial-bus disk drive

Notes:
- Device numbers 4 or greater are treated as serial-bus devices.
- Secondary address (Y) is sent on the serial bus during the attention/handshake after the device number.
- If no secondary address is needed, set Y = 255 ($FF).
```

## Key Registers
- $FFBA - KERNAL - SETLFS (JSR entry) — set logical file number (A), device number (X), secondary address/command (Y)

## References
- "open_kernal_routine" — covers OPEN and file table usage after SETLFS
- "load_kernal_routine" — covers LOAD usage after SETLFS
- "save_kernal_routine" — covers SAVE usage after SETLFS

## Labels
- SETLFS
