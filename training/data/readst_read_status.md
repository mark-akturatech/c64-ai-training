# READST — Read status (KERNAL, vectored from $FFB7)

**Summary:** KERNAL READST (vector $FFB7) checks zero-page device number $BA; if device = $02 (RS232/ACIA 6551) it returns RSSTAT ($0297) in A and clears RSSTAT. Otherwise, it returns STATUS (zero page $90). Uses PHA/PLA to preserve A while clearing RSSTAT.

**Behavior**
This KERNAL snippet implements the RS232 branch of READST. Flow:
- Entry is vectored from $FFB7 (KERNAL vector for READST).
- Read current device number from zero page $BA and compare with #$02 (RS232).
- If equal (device is RS232/ACIA 6551):
  - Load RSSTAT from $0297 into A.
  - PHA to save A on stack.
  - Clear RSSTAT by storing #$00 to $0297.
  - PLA to restore the saved RSSTAT value into A.
  - RTS returns with RSSTAT in A.
- If not equal, the code branches (BNE) to the non-RS232 path which reads STATUS from zero page $90.

The routine therefore both returns and clears the ACIA status when servicing device 2. PHA/PLA are used only as a temporary store while writing zero to the RSSTAT location.

## Source Code
```asm
; READST: READ STATUS (vectored from $FFB7)
; If device number in $BA == $02 (RS232), return RSSTAT ($0297) and clear it.
; Otherwise, return STATUS ($90).

        .org $FE07
FE07:   A5 BA        LDA $BA        ; read current device number from $BA
FE09:   C9 02        CMP #$02       ; device = RS232?
FE0B:   D0 0D        BNE $FE1A      ; no -> go read STATUS
FE0D:   AD 97 02     LDA $0297      ; RSSTAT (ACIA 6551 status)
FE10:   48           PHA            ; push A (temp store)
FE11:   A9 00        LDA #$00
FE13:   8D 97 02     STA $0297      ; clear RSSTAT
FE16:   68           PLA            ; restore saved RSSTAT into A
FE17:   60           RTS            ; return with A = RSSTAT

; Non-RS232 branch: Return STATUS ($90)
FE1A:   A5 90        LDA $90        ; load STATUS
FE1C:   60           RTS            ; return with A = STATUS
```

## Key Registers
- $FFB7 - KERNAL vector - READST entry (vectored call target)
- $BA - zero page - current device number (devicenumber)
- $90 - zero page - STATUS (returned for non-RS232 devices)
- $0297 - ACIA 6551 - RSSTAT (RS232 status byte; read and cleared by READST for device 2)

## References
- "open_rs232" — RS232 open/read paths, RSSTAT ($0297) usage

## Labels
- READST
- RSSTAT
- STATUS
