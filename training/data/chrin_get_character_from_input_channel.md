# CHRIN

**Summary:** CHRIN is the KERNAL input routine at $FFCF (65487) that returns one input byte in A from the current input channel (keyboard by default). Preparatory routines: OPEN and CHKIN; affected registers A, X; stack requirement 7+; keyboard input is line-buffered into the BASIC input buffer (up to 88 chars) until CR.

**Description**
CHRIN (call address $FFCF / decimal 65487) returns a single byte from the current input channel in the accumulator (A). The input channel used is the one defined by CHKIN; if CHKIN has not been used to select another channel, CHRIN reads from the keyboard.

Keyboard-specific behavior:
- When reading from the keyboard, the cursor is enabled and blinks while the user types a line.
- Characters typed are stored in the BASIC input buffer (line-buffered) up to 88 characters.
- Subsequent CHRIN calls return the buffered characters one at a time.
- A carriage return (CR) is also returned as a byte; when the CR is retrieved the entire line has been processed.
- The next CHRIN after the CR begins a new line (cursor flashes again).

Behavior for other devices:
- CHRIN reads from any logical device previously opened and selected as input by OPEN and CHKIN. For non-keyboard devices you must call OPEN and CHKIN first; CHRIN then returns the next byte from that device.
- The channel remains open after the CHRIN call.

Other technical details:
- Call address: $FFCF (hex) / 65487 (decimal).
- Communication register: A (returned byte).
- Preparatory routines: OPEN, CHKIN (when non-keyboard device is used).
- Error returns: 0 (see READST for status reporting).
- Stack requirements: 7+ bytes.
- Registers affected: A, X.

Usage flow (keyboard):
1. Call CHRIN (JSR $FFCF).
2. Read returned byte from A (store as needed).
3. Test for CR (end-of-line).
4. Repeat until CR found.

Usage flow (other devices):
0. OPEN device
1. CHKIN logical file (select input)
2. Call CHRIN (JSR $FFCF)
3. Read returned byte from A
4. Repeat as needed; channel remains open

## Source Code
```asm
; Example 1: loop reading bytes into a buffer using Y as index, stop on CR
        LDY #$00          ; PREPARE Y REGISTER TO STORE THE DATA
RD:     JSR $FFCF         ; JSR CHRIN
        STA DATA,Y        ; STORE THE YTH DATA BYTE IN THE YTH LOCATION
        INY
        CMP #$0D          ; IS IT A CARRIAGE RETURN? (CR = $0D)
        BNE RD            ; NO, GET ANOTHER DATA BYTE

; Example 2: simple single-byte read
        JSR $FFCF         ; JSR CHRIN
        STA DATA
```

## Key Registers
- $FFCF - KERNAL - CHRIN call entry (returns input byte in A)

## References
- "chkin_open_input_channel" — defines which logical file is the input channel used by CHRIN
- "getin_get_a_character" — covers GETIN and differences in keyboard buffering and low-level character retrieval