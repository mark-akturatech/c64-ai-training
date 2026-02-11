# Compute old two-byte load address from LOW and HIGH bytes (BASIC fragment)

**Summary:** Commodore BASIC fragment that reads HIGH and LOW bytes (GET#15), converts each byte to a two-character hexadecimal string via a conversion subroutine (GOSUB 1010 producing HD$), concatenates them into the old load address (OLA$), prints it, then prompts for a new four-character hex load address (NLA$) and validates its length using LEN/IF/GOTO.

**Description**
This BASIC snippet reconstructs a two-byte load address from a HIGH and LOW byte previously read into string buffers. Steps performed:

- Read HIGH byte from channel 15 using GET#15,HIGH$.
- Convert the HIGH string to a numeric byte with ASC(HIGH$ + CHR$(0)) to produce a numeric HIGH.
- Move the numeric value into D and call GOSUB 1010, which converts the decimal byte in D to a two-character hex string stored in HD$.
- Set OLA$ to the hex string from HIGH (OLA$ = HD$).
- Repeat conversion for the LOW byte and append its hex string to OLA$ (OLA$ = OLA$ + HD$), producing a four-character hex address in big-endian order (HIGH then LOW).
- Print the old load address and prompt the user for a new 4-character hex load address into NLA$.
- Validate that LEN(NLA$) = 4; if true, continue (GOTO 690); otherwise branch to error/reprompt handling (GOTO 960).

Variables used:
- HIGH$, LOW$ — single-character strings read from buffer (GET#)
- HIGH, LOW — numeric byte values (ASC result)
- D — numeric temporary used by conversion subroutine
- HD$ — two-character hex string returned by conversion subroutine
- OLA$ — assembled old load address (four-character hex string)
- NLA$ — new load address entered by the user

The conversion subroutine at 1010 is responsible for taking the decimal byte in D and returning a two-character uppercase hex string in HD$.

## Source Code
```basic
570 GET#15,HIGH$
580 HIGH = ASC(HIGH$ + CHR$(0))
590 D = HIGH
600 GOSUB 1010
610 OLA$ = HD$
620 D = LOW
630 GOSUB 1010
640 OLA$ = OLA$ + HD$
650 PRINT "  <DOWN> OLD LOAD ADDRESS:    "; OLA$
660 INPUT " <DOWN> NEW LOAD ADDRESS"; NLA$
670 IF LEN(NLA$) = 4 GOTO 690
680 GOTO 960
```

## References
- "load_disk_block_into_buffer_and_read_bytes" — preceding chunk that reads LOW and HIGH from the buffer
- "confirm_and_convert_new_address" — follows this fragment; confirms and converts the entered new hex address
- "conversion_subroutines_decimal_to_hex_and_hex_to_decimal" — contains the conversion subroutine(s) used at GOSUB 1010
