# TKSA (KERNAL)

**Summary:** KERNAL routine TKSA at $FF96 (65430) sends a secondary address (0–31) on the IEC serial bus for a device previously commanded to TALK; accumulator A holds the secondary address. Must be called after TALK (not LISTEN). Errors returned via READST.

## Description
Purpose: Transmit a secondary address command to a device already in TALK state on the IEC serial bus.

Call address: $FF96 (hex) — 65430 (dec).  
Function name in KERNAL listing: TKSA (B-35).

Input: A = secondary address (0–31).  
Precondition: A device must have been selected with the TALK routine. This routine does not work after LISTEN.  
Error reporting: READST (KERNAL read status) returns any error condition.  
Stack requirement: 8 bytes.  
Registers affected: A only.

How it works: The routine packages the value in A as the secondary address command and transmits it over the serial bus to the device previously instructed to TALK. Typical use is to request a specific logical function or data channel from a peripheral (e.g., a CBM disk drive).

**[Note: Source may contain an error — example uses the label "TALKSA" instead of the documented "TKSA".]**

## Usage
1. Call TALK for the desired device number (select device to TALK).  
2. Load A with the secondary address (0–31).  
3. JSR TKSA (or JSR $FF96) to send the secondary address.

Example brief steps (from source):
- LDA #device_number
- JSR TALK
- LDA #secondary_address
- JSR TKSA

## Source Code
```asm
; KERNAL TKSA (secondary address for TALK device)
; Call: JSR TKSA        ; TKSA = $FF96 (65430)
; A = secondary address (0-31)
;
; EXAMPLE:
; TELL DEVICE #4 TO TALK WITH COMMAND #7
    LDA #4
    JSR TALK
    LDA #7
    JSR TKSA

; Alternate explicit call by address:
;    JSR $FF96
```

## References
- "talk_kernal_routine" — expands on TALK and the requirement that TKSA must follow TALK

## Labels
- TKSA
