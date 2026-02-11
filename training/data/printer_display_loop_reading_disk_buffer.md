# Printer-mode loop — read drive buffer and send formatted lines to printer

**Summary:** BASIC printer-mode loop using GET#2 (drive buffer) and PRINT#4 (printer channel). Initializes k and nb(1) from a$(0), reads up to 16 bytes per line into a$(0..15), formats hex address (GOSUB 790) and ASCII text (GOSUB 850), respects continue prompt (z$ from continue subroutine), and outputs formatted lines to the printer.

**Description**
This routine reads bytes from the drive buffer (channel 2) into a$(i) and builds formatted 16-byte lines for the printer (channel 4). Key behaviors and variables:

- **Initialization:**
  - `k=1` and `nb(1)=asc(a$(0))` — `k` controls whether the first read starts at index 1; `nb(1)` is initialized from the ASCII code of `a$(0)`.
- **Outer loop:**
  - `for j = 0 to 15` — up to 16 lines are produced (commonly to print a 256-byte sector in 16 lines of 16 bytes).
- **Inner read loop:**
  - `for i = k to 15`
    - `get#2,a$(i)` reads a byte into `a$(i)` from device channel 2 (drive buffer).
    - `if a$(i) = "" then a$(i) = nl$` — empty reads are replaced with `nl$` (newline/placeholder).
    - `if k = 1 and i < 2 then nb(2) = asc(a$(i))` — captures the second byte's ASCII code into `nb(2)` on the first pass.
  - `next i` ; then `k` is set to 0 so subsequent outer iterations begin `i=0`.
- **Address and text formatting:**
  - `a$` and `b$` are built per 16-byte line. `n` is seeded with `j*16` (line base address) and passed to `GOSUB 790` (byte-to-hex subroutine) to build a hex address string into `a$`.
  - For each byte `i=0..15`:
    - `n = asc(a$(i))` ; `GOSUB 790` formats the byte's hex into `a$` (or uses `z$` to detect an abort).
    - If the continue subroutine sets `z$ = "n"` then execution branches to the abort (`j` set and `GOTO 571`).
    - `c$ = a$(i)` ; `GOSUB 850` converts the byte into printable ASCII and appends to `b$`.
  - After assembling `a$` (hex address) and `b$` (":" plus ASCII text), the routine prints the formatted line to printer channel 4 when `jj$ = "p"` (printer-mode flag).
- **Control flow:**
  - The code checks `z$` (from the continue subroutine); if `z$ = "n"` the loop is aborted and control jumps to the later routine at line 571.
  - The routine loops `j=0..15` (16 lines) unless the continue subroutine aborts earlier.
- **Subroutines referenced (not included here):**
  - `GOSUB 790` — byte_to_hex_subroutine (builds hex address or byte hex)
  - `GOSUB 850` — byte_to_ascii_subroutine (maps bytes to printable characters)
  - The code relies on other chunks for how `a$(0)` is filled and how continuation is requested.

## Source Code
```basic
 460 rem******************************
 462 rem* read & printer display     *
 464 rem******************************
 466 k=1:nb(1)=asc(a$(0))
 468 for j=0 to 15
 470 for i=k to 15
 472 get#2,a$(i):if a$(i)="" then a$(i)=nl$
 474 if k=1 and i<2 then nb(2)=asc(a$(i))
 476 next i:k=0
 478 a$="":b$=":":n=j*16:gosub 790:a$=a$+":"
 480 for i=0 to 15:n=asc(a$(i)):gosub 790:if z$="n" then j=40: goto 571
 482 c$=a$(i):gosub 850:b$=b$+c$
 484 next i
 486 if jj$="p" then print#4,a$;b$
 488 next j:goto 571
```

## References
- "read_byte0_and_m_r_commands" — expands on uses of a$(0) read from drive before entering this loop
- "screen_continue_subroutine" — expands on printer loop also respects continue prompt (z$)
- "byte_to_hex_subroutine" — expands on GOSUB 790 used for hex formatting
- "byte_to_ascii_subroutine" — expands on GOSUB 850 used for ASCII conversion
- "next_track_sector_prompt_and_loop" — expands on post-print prompting for next track/sector