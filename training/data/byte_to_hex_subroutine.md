# Disk byte to hex print subroutine (GOSUB 790)

**Summary:** BASIC subroutine that converts a disk-buffer byte value n into two hexadecimal characters appended to a$ using the hx$ lookup string and adds a trailing space (used with GOSUB 790). Searchable terms: hx$, a$, sp$, disk buffer, hex nibble, GOSUB 790.

## Description
Converts an integer byte value n (0–255) into two hex characters and appends them plus a space to the string a$. Implementation:
- Compute the high nibble a1 = INT(n/16).
- Append the corresponding character from hx$ (hex lookup string) using MID$(hx$, a1+1, 1).
- Compute the low nibble a2 = INT(n - 16*a1) (equivalent to n MOD 16).
- Append MID$(hx$, a2+1, 1).
- Append the space string sp$ and RETURN.

Variables used:
- n — disk-buffer byte value (integer).
- a$ — accumulating output string.
- hx$ — lookup string of hex digits (e.g. "0123456789ABCDEF") (hex digits lookup).
- sp$ — space character string (single space).

This subroutine is called from the main loops (GOSUB 790) to format address/byte hex output. It is commonly paired with a byte-to-ASCII conversion subroutine to produce hex+ASCII formatted lines.

## Source Code
```basic
 790 rem******************************
 800 rem* disk byte to hex print     *
 810 rem******************************
 820 a1=int(n/16):a$=a$+mid$(hx$,a1+1,1)
 830 a2=int(n-16*a1):a$=a$+mid$(hx$,a2+1,1)
 840 a$=a$+sp$:return
```

## References
- "read_and_crt_display" — expands on used to format address/byte hex output
- "printer_display_loop_reading_disk_buffer" — expands on used to format address/byte hex output
- "byte_to_ascii_subroutine" — expands on paired with ASCII conversion for full hex/ASCII lines