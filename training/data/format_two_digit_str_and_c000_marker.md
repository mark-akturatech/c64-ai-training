# BASIC STR$ Helper and Machine-Code Marker (Lines 1290–1330)

**Summary:** This BASIC subroutine formats track (T) and sector (S) numbers as two-character, zero-padded strings using the STR$, RIGHT$, and LEN functions, then returns control to the caller. It is followed by a REM statement indicating that the subsequent DATA block contains machine code intended to be loaded and executed at memory address $C000 on the disk drive.

**Description**

This BASIC fragment serves as a formatting subroutine within the main program, producing two-character track and sector fields for job packets. It performs the following operations:

- **Conversion to String:** The numeric variables T and S are converted to strings using the STR$ function. In Commodore BASIC, STR$ includes a leading space for positive numbers.

- **Removal of Leading Space:** The leading space is removed by extracting the rightmost characters of the string, excluding the first character, using RIGHT$(STR$(X), LEN(STR$(X)) - 1).

- **Zero-Padding:** To ensure a two-character string with leading zeros if necessary, a "0" is prepended to the string, and the rightmost two characters are extracted using RIGHT$("0" + ..., 2).

- **Return to Caller:** The subroutine concludes with a RETURN statement, passing control back to the calling routine.

- **Machine Code Marker:** The REM *C000 statement serves as a marker indicating that the following DATA block contains machine code intended to be loaded and executed at memory address $C000 on the disk drive.

**Behavioral Details:**

- **STR$ Function:** Converts a numeric value into its string representation, including a leading space for positive numbers.

- **RIGHT$ Function:** Extracts a specified number of characters from the right end of a string.

- **LEN Function:** Returns the number of characters in a string.

- **REM Statement:** Used to include comments in the code; in this context, it marks the beginning of a machine code DATA block.

## Source Code

```basic
1290 REM STR$(T,S)  : format track and sector as two-char strings
1300 T$=RIGHT$("0"+RIGHT$(STR$(T),LEN(STR$(T))-1),2)
1310 S$=RIGHT$("0"+RIGHT$(STR$(S),LEN(STR$(S))-1),2)
1320 RETURN
1330 REM *C000
```

## References

- "basic_write_loop_and_completion" — Details the use of STR$ in the main program to format track and sector numbers for job packets.

- "machine_code_data_and_track_skip_table" — Discusses the REM marker indicating the machine code DATA block that implements drive-side routines.
