# Screen-mode loop: read disk buffer and display hex/ASCII (BASIC)

**Summary:** C64 BASIC loop that reads the remainder of a disk buffer from channel 2 using GET#2, builds hex address and ASCII columns via GOSUB 790 and GOSUB 850, and prints formatted lines; initializes k and nb(1) from a$(0) and calls a screen-continue prompt at GOSUB 710 halfway through.

**Description**
This BASIC fragment displays up to 64 lines (4 bytes per line) taken from a disk-sector buffer read on channel 2. Key behaviors and control flow:

- **Initialization:** `k` is set to 1 and `nb(1)` is set to `ASC(a$(0))` — `a$(0)` is expected to contain a previously-read byte used to seed `nb(1)`.
- **Outer loop:** `FOR j = 0 TO 63` iterates 64 logical lines. At `j = 32`, the routine calls `GOSUB 710` (a screen-continue prompt). If that subroutine sets `z$ = "n"`, the loop is aborted by forcing `j=80` and `GOTO 458`.
- **Inner read loop:** `FOR i = k TO 3` performs `GET#2,a$(i)` to read up to four bytes per line from channel 2. If `GET#` returns an empty string, the code substitutes `nl$`.
  - On the very first pass (`k = 1`) and for `i < 2`, `nb(2)` is set to `ASC(a$(i))` (captures the next byte when starting mid-buffer).
  - After the first read pass, `k` is set to 0 so subsequent lines read `i = 0..3`.
- **Line formatting:**
  - `n` is set to `j*4` (base address offset) and `a$` / `b$` are built as the hex address and ASCII representation.
  - `GOSUB 790` is used to produce hex formatting from `n` or byte values (address/byte-to-hex).
  - For each byte read: `n = ASC(a$(i))` then `GOSUB 790` (adds hex byte to `a$`); `c$ = a$(i)`; `GOSUB 850` converts or validates ASCII displayable character and `b$ = b$ + c$`.
- **Output:** If `jj$ = "s"`, the routine `PRINT`s the combined `a$ + b$` line.
- **Exit:** After completing `j` loop, the code `GOTO 571` (control continues elsewhere).

This chunk references subroutines and variables that are external to this listing (see References).

## Source Code
```basic
432 rem* read & crt display         *
433 rem* rest of the disk buffer    *
434 rem******************************
436 k=1:nb(1)=asc(a$(0))
438 for j=0 to 63:if j=32 then gosub 710:if z$="n" then j=80:\
     goto 458
440 for i=k to 3
442 get#2,a$(i):if a$(i)="" then a$(i)=nl$
444 if k=1 and i<2 then nb(2)=asc(a$(i))
446 next i:k=0
448 a$="":b$=":":n=j*4:gosub 790:a$=a$+":"
450 for i=0 to 3:n=asc(a$(i)):gosub 790
452 c$=a$(i):gosub 850:b$=b$+c$
454 next i:if jj$="s" then print a$b$
458 next j:goto 571
```

## References
- "read_byte0_and_m_r_commands" — expands on uses of `a$(0)` read from drive before entering this loop
- "screen_continue_subroutine" — expands on calls `GOSUB 710` at mid-page to prompt user continue
- "byte_to_hex_subroutine" — expands on `GOSUB 790` formats hex for printing
- "byte_to_ascii_subroutine" — expands on `GOSUB 850` converts bytes to displayable characters
- "next_track_sector_prompt_and_loop" — expands on control flow after this display to prompt for next track/sector
