# KERNAL TALK ($FFB4 / $ED09)

**Summary:** Sends a TALK command on the IEC serial bus to a device number in A; KERNAL vector $FFB4 (real routine $ED09) implements it. Input: A = device number; uses A register.

**Description**

TALK issues the IEC "TALK" command to a peripheral on the Commodore serial bus. The caller must place the target device number in the A register before invoking the KERNAL vector $FFB4. The documented real (ROM) entry point for this vector is $ED09.

- **Purpose:** Send TALK command to the device whose number is in A.
- **Calling convention:** A contains device number; the routine uses A.
- **Implementation mapping:** Vector $FFB4 → ROM routine at $ED09.

**Return Status Semantics:**

- The success of the operation is indicated by the value in the serial status flag upon return. This status can be read using the READST routine ($FFB7).

**Register Preservation:**

- The TALK routine affects the A register. Other registers (X, Y, status) are preserved across the call.

**Timing/Handshake Details and Error Conditions:**

- If the target device is not present or does not respond, the serial status flag will reflect the error condition. Specific error codes can be obtained by calling the READST routine ($FFB7).

**Example Call Sequence:**

To command device #4 to TALK, send a secondary address, and read a byte:


In BASIC:


**Full ROM Disassembly of Routine at $ED09:**

## Source Code

```assembly
    LDA #4        ; Device number
    JSR TALK      ; Send TALK command
    LDA #7        ; Secondary address
    JSR TKSA      ; Send secondary address
    JSR IECIN     ; Read byte from device
```

```basic
    OPEN 1,4,7    : REM Open channel to device 4 with secondary address 7
    GET#1, A$     : REM Read byte into A$
    CLOSE 1       : REM Close the channel
```

```assembly
ED09   09 40      ORA #$40        ; Set TALK bit
ED0B   2C
ED0C   20 11 ED   JSR $ED11       ; Send command on serial bus
ED0F   58         CLI             ; Clear interrupt disable
ED10   60         RTS             ; Return from subroutine
```



## References

- "talksa" — sending a secondary address after TALK (TALKSA $FF96)
- "iecin" — reading data after TALK via IECIN ($FFA5)

## Labels
- TALK
