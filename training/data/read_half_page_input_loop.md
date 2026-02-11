# Read half-page from disk into memory — CHRIN loop (L00P2)

**Summary:** Assembly loop that reads a half-page (129 bytes) via KERNAL CHRIN and stores into memory using STA (POINT),Y with LDY #$00 ... CPY #$81; uses JSR CLRCHN and RTS. Searchable terms: CHRIN, CLRCHN, LDY #$00, CPY #$81, (POINT),Y.

## Description
This routine reads a contiguous block of 129 bytes (half-page) from the currently selected input channel into memory starting at the address pointed to by the zero-page pointer SYMBOL "POINT". Preconditions: the input channel must be opened and prepared for input (e.g. channel 15 via LDX #$0F; JSR CHKIN — see referenced chunk). Operation details:
- LDY #$00 initializes the Y index to 0.
- Each iteration calls JSR CHRIN; CHRIN returns the next input byte in A (KERNAL).
- STA (POINT),Y stores A at the destination address formed by the zero-page pointer POINT plus offset Y (indirect indexed addressing).
- INY increments the destination offset.
- CPY #$81 compares Y to $81; BNE loops back while Y != $81.
- Because Y begins at 0 and the loop exits when Y == $81, the loop stores 129 bytes (decimal 129 = $81).
- After the loop the code calls JSR CLRCHN to clear/close the input channel, then RTS to return.

Notes:
- POINT must be a valid zero-page pointer (two-byte little-endian address) set before calling this routine.
- CHRIN and CLRCHN are KERNAL entry points (JSR to vectors); channel setup (CHKIN) is performed separately.

## Source Code
```asm
        ; Read half-page (129 bytes) into memory at (POINT),Y
        LDY #$00

L00P2   JSR CHRIN        ; read a byte into A from current input channel
        STA (POINT),Y     ; store A at (POINT)+Y
        INY
        CPY #$81
        BNE L00P2

        JSR CLRCHN        ; CLEAR THE CHANNEL
        RTS
```

## References
- "prepare_channel_15_for_input" — channel 15 setup for input (LDX #$0F; JSR CHKIN)

## Labels
- CHRIN
- CLRCHN
