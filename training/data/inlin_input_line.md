# INLIN ($A560) — Input a BASIC line to the text buffer

**Summary:** INLIN at $A560 (42336) calls the KERNAL CHRIN routine ($F157 / 61783) to read characters from the current input device into the BASIC text input buffer at $0200 (512). It stores characters until a carriage return or a maximum count (see note) and will generate an error if the line exceeds 80 characters.

## Description
INLIN is a KERNAL subroutine (entry $A560 / decimal 42336) used to obtain a single line of BASIC input. Behavior:

- Calls the KERNAL CHRIN routine (address $F157, decimal 61783) to read characters from the current input device (normally the keyboard).
- Stores received bytes into the BASIC text input buffer starting at $0200 (decimal 512).
- Stops when a carriage return (CR) is received or when a maximum character count is reached.
- The source states the routine stores up to 89 characters before stopping, but notes that the keyboard device will normally never return more than 80 characters before a carriage return; an error is raised if the line exceeds 80 characters. Other input devices can supply longer lines and thus can trigger the error.

**[Note: Source may contain an error — the text mentions both “89 characters” and “80 characters”; the routine enforces an 80-character limit as an error condition while also documenting 89 as a storage cutoff.]**

This routine places the raw input into the BASIC input buffer for later processing (see CRUNCH / crunch_tokenize), and is typically invoked by the main program loop to collect user input.

## Key Registers
- $A560 - KERNAL - INLIN entry point (reads a BASIC input line into the text buffer)
- $F157 - KERNAL - CHRIN routine (reads a character from current input device)
- $0200 - RAM - BASIC text input buffer (start address, decimal 512)

## References
- "main_loop" — MAIN calls this to obtain user input  
- "crunch_tokenize" — CRUNCH processes the line placed in the input buffer by INLIN

## Labels
- INLIN
- CHRIN
