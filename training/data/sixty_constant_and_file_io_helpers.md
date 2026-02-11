# KERNAL: SIXTY, SETNAM, SETLFS, READSS, SETMSG, READST, SETTMO

**Summary:** Defines the SIXTY keyboard-timer constant and small KERNAL helper routines: SETNAM (store filename length & pointer), SETLFS (store logical/file/device parameters LA/FA/SA), READSS (check for RS-232 device and clear RS-232 status byte on read), SETMSG (store message flag), READST (read/OR status byte, update flags), and SETTMO (store timeout). Includes addresses and preserved zero-page/workspace locations ($B7-$BC, $90, $9D, $0285, $0297).

## Description

This chunk contains compact KERNAL helper routines used by higher-level device and file operations.

- SIXTY
  - A constant: SIXTY = 16667. Used as the 60 Hz keyboard timer value (installed during IOINIT to program keyboard timer).

- SETNAM (at $FDF9)
  - Purpose: Store filename length and pointer into KERNAL workspace for subsequent file operations that expect FNLEN/FNADR.
  - Calling convention (implicit): A = filename length, X = filename pointer low, Y = filename pointer high.
  - Stores:
    - A -> $B7 (FNLEN)
    - X -> $BB (FNADR low)
    - Y -> $BC (FNADR high)
  - Returns with RTS.

- SETLFS (at $FE00)
  - Purpose: Set logical file parameters used by device/file operations (LA = logical file number, FA = file access/device number, SA = secondary address).
  - Calling convention (implicit): A = LA, X = FA, Y = SA.
  - Stores:
    - A -> $B8 (LA)
    - X -> $BA (FA)
    - Y -> $B9 (SA)
  - Returns with RTS.

- READSS (at $FE07)
  - Purpose: Determine whether the current input device (FA at $BA) is the RS-232 device (device number #$02). If RS-232, read the RS-232 status byte and clear it when read; otherwise fall through to generic READST.
  - Behavior:
    - Loads FA from $BA and compares with #$02.
    - If equal (RS-232):
      - LDA RSSTAT ($0297), preserving A on stack (PHA/PLA) so the caller's A is unchanged except for the desired read side-effect.
      - Clears RSSTAT by storing #$00 to $0297 (RSSTAT is cleared on read).
      - Return with RTS (A contains RS-232 status).
    - If not RS-232: branch to READST.

- READST / UDST (at $FE1A / $FE1C)
  - Purpose: Generic status read helper for non-RS-232 devices. It reads the STATUS byte (zero-page $90), ORs it with itself, stores it back, and returns—effectively returning STATUS in A and updating processor flags based on STATUS's value.
  - Behavior:
    - LDA $90 ; load STATUS
    - ORA $90 ; OR STATUS with itself (sets processor flags from STATUS)
    - STA $90 ; store back (no net change)
    - RTS

- SETMSG (at $FE18)
  - Purpose: Store the message flag used by higher-level message handling.
  - Stores A -> $9D (MSGFLG).
  - Returns with RTS.

- SETTMO (at $FE21)
  - Purpose: Store timeout value used by I/O wait/timeout handling.
  - Stores A -> $0285 (TIMOUT).
  - Returns with RTS.

Notes on side-effects and usage:
- READSS clears the RS-232 status byte when the RS-232 device is read — this is an explicit side-effect intended by the KERNAL to indicate "status read" semantics.
- READST leaves STATUS unchanged but sets CPU flags (N, Z) according to STATUS, so callers can branch on those flags after calling.
- The routines are tiny store/read helpers; callers place parameters in A/X/Y following KERNAL conventions (implicit parameters in registers/zero page).

## Source Code
```asm
; LDA #$81 ;ENABLE T1 IRQ'S
; STA D1ICR
; LDA D1CRA
; AND #$80 ;SAVE ONLY TOD BIT
; ORA #%00010001 ;ENABLE TIMER1
; STA D1CRA
; JMP CLKLO ;RELEASE THE CLOCK LINE
;
; SIXTY HERTZ VALUE
;
SIXTY  = 16667

.,FDF9 85 B7    STA $B7         SETNAM STA FNLEN
.,FDFB 86 BB    STX $BB         STX    FNADR
.,FDFD 84 BC    STY $BC         STY    FNADR+1
.,FDFF 60       RTS             RTS
.,FE00 85 B8    STA $B8         SETLFS STA LA
.,FE02 86 BA    STX $BA         STX    FA
.,FE04 84 B9    STY $B9         STY    SA
.,FE06 60       RTS             RTS
.,FE07 A5 BA    LDA $BA         READSS LDA FA          ;SEE WHICH DEVICES' TO READ
.,FE09 C9 02    CMP #$02               CMP #2          ;IS IT RS-232?
.,FE0B D0 0D    BNE $FE1A              BNE READST      ;NO...READ SERIAL/CASS
.,FE0D AD 97 02 LDA $0297              LDA RSSTAT      ;YES...GET RS-232 UP
.,FE10 48       PHA                    PHA
.,FE11 A9 00    LDA #$00               LDA #00         ;CLEAR RS232 STATUS WHEN READ
.,FE13 8D 97 02 STA $0297              STA RSSTAT
.,FE16 68       PLA                    PLA
.,FE17 60       RTS                    RTS
.,FE18 85 9D    STA $9D         SETMSG STA MSGFLG
.,FE1A A5 90    LDA $90         READST LDA STATUS
.,FE1C 05 90    ORA $90         UDST   ORA STATUS
.,FE1E 85 90    STA $90         STA    STATUS
.,FE20 60       RTS             RTS
.,FE21 8D 85 02 STA $0285       SETTMO STA TIMOUT
.,FE24 60       RTS             RTS
```

## Key Registers
- $B7-$BC - RAM (KERNAL workspace) - FNLEN ($B7), LA/FA/SA and FNADR pointer bytes (filename length & pointer storage)
- $90 - RAM (zero page) - STATUS (device status byte read by READST)
- $9D - RAM (zero page) - MSGFLG (message flag stored by SETMSG)
- $0285 - RAM - TIMOUT (timeout value stored by SETTMO)
- $0297 - RAM/IO area - RSSTAT (RS-232 status byte; read and cleared by READSS)

## References
- "ioinit_configure_io_devices_and_ports" — expands on SIXTY usage during IOINIT to program the keyboard timer
- "memtop_gettop_settop_and_membot" — expands on SETTMO and related timeout/IO management helpers

## Labels
- SETNAM
- SETLFS
- READSS
- READST
- SETMSG
- SETTMO
- UDST
