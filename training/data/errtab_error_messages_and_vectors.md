# ERRTAB: BASIC Error Messages and Error Message Vector Table ($A19E-$A364)

**Summary:** ASCII BASIC error messages stored at $A19E-$A327 (ERRTAB), a two-byte Error Message Vector Table at $A328-$A364 containing pointers to the 30 messages, and miscellaneous BASIC message texts at $A365-$A389. Messages are ASCII; the high-bit (bit 7) on the last character of each message is set to mark the end.

**ERRTAB (ASCII BASIC Error Messages)**
This table contains the ASCII text for BASIC error messages used by the kernel. Each message is stored as plain ASCII characters; the final letter of each message has bit 7 set (high-bit) to indicate the message terminator. The standard BASIC error messages 1–29 are stored consecutively in the ERRTAB block at $A19E–$A327. Message number 30 (BREAK) is located in the Miscellaneous Messages block ($A365–$A389).

Listed error messages:
1. TOO MANY FILES
2. FILE OPEN
3. FILE NOT OPEN
4. FILE NOT FOUND
5. DEVICE NOT PRESENT
6. NOT INPUT FILE
7. NOT OUTPUT FILE
8. MISSING FILENAME
9. ILLEGAL DEVICE NUMBER
10. NEXT WITHOUT FOR
11. SYNTAX
12. RETURN WITHOUT GOSUB
13. OUT OF DATA
14. ILLEGAL QUANTITY
15. OVERFLOW
16. OUT OF MEMORY
17. UNDEF'D STATEMENT
18. BAD SUBSCRIPT
19. REDIM'D ARRAY
20. DIVISION BY ZERO
21. ILLEGAL DIRECT
22. TYPE MISMATCH
23. STRING TOO LONG
24. FILE DATA
25. FORMULA TOO COMPLEX
26. CAN'T CONTINUE
27. UNDEF'D FUNCTION
28. VERIFY
29. LOAD

Notes:
- The kernel uses the Error Message Vector Table to look up the two-byte pointer to the start of each message.
- Terminator convention: set bit 7 in the last character of the message (same convention as other BASIC string tables).
- Message 30 (BREAK) resides in the Miscellaneous Messages area rather than ERRTAB.

## Source Code
```text
; ERRTAB ASCII messages area ($A19E-$A327)
; Each message stored as ASCII; last character has bit 7 set.

1  TOO MANY FILES<hi-bit on final 'S'>
2  FILE OPEN<hi-bit on final 'N'>
3  FILE NOT OPEN<hi-bit on final 'N'>
4  FILE NOT FOUND<hi-bit on final 'D'>
5  DEVICE NOT PRESENT<hi-bit on final 'T'>
6  NOT INPUT FILE<hi-bit on final 'E'>
7  NOT OUTPUT FILE<hi-bit on final 'E'>
8  MISSING FILENAME<hi-bit on final 'E'>
9  ILLEGAL DEVICE NUMBER<hi-bit on final 'R'>
10 NEXT WITHOUT FOR<hi-bit on final 'R'>
11 SYNTAX<hi-bit on final 'X'>
12 RETURN WITHOUT GOSUB<hi-bit on final 'B'>
13 OUT OF DATA<hi-bit on final 'A'>
14 ILLEGAL QUANTITY<hi-bit on final 'Y'>
15 OVERFLOW<hi-bit on final 'W'>
16 OUT OF MEMORY<hi-bit on final 'Y'>
17 UNDEF'D STATEMENT<hi-bit on final 'T'>
18 BAD SUBSCRIPT<hi-bit on final 'T'>
19 REDIM'D ARRAY<hi-bit on final 'Y'>
20 DIVISION BY ZERO<hi-bit on final 'O'>
21 ILLEGAL DIRECT<hi-bit on final 'T'>
22 TYPE MISMATCH<hi-bit on final 'H'>
23 STRING TOO LONG<hi-bit on final 'G'>
24 FILE DATA<hi-bit on final 'A'>
25 FORMULA TOO COMPLEX<hi-bit on final 'X'>
26 CAN'T CONTINUE<hi-bit on final 'E'>
27 UNDEF'D FUNCTION<hi-bit on final 'N'>
28 VERIFY<hi-bit on final 'Y'>
29 LOAD<hi-bit on final 'D'>

; Error Message Vector Table area ($A328-$A364)
; Contains 30 two-byte little-endian addresses (pointer to first letter of each message).
; Note: Message #30 (BREAK) pointer points into Miscellaneous Messages ($A365-$A389).

; Miscellaneous Messages area ($A365-$A389)
; These messages contain cursor movement characters; each ends with a NULL (0).

1) CR, "OK", CR  (ends with $00)
2) "  ERROR"     (two spaces, ERROR, ends with $00)
3) " IN "        (space, IN, space, ends with $00)
4) CR, LF, "READY.", CR, LF  (ends with $00)
5) CR, LF, "BREAK"            (message 30; ends with $00)
```

## Key Registers
- $A19E-$A327 - ERRTAB - ASCII BASIC error messages (messages 1–29; last-char bit7 terminator)
- $A328-$A364 - Error Message Vector Table - two-byte pointers to the 30 messages (little-endian)
- $A365-$A389 - Miscellaneous Messages - cursor/READY/BREAK texts (message 30 = BREAK), null-terminated

## References
- "error_and_omerr_handlers" — expands on how ERROR and OMERR routines use these tables to display messages

## Labels
- ERRTAB
