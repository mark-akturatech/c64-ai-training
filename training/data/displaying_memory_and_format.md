# MACHINE - .M memory display command

**Summary:** Describes the .M memory-display command syntax (.M 1000 1010), the monitor output format (four-digit base address and eight two-digit hex bytes), and behavior that monitors print hexadecimal values and usually show eight bytes per line (some VIC-20 monitors show five) and will fill the rest of a line past the requested end address.

## Displaying Memory Contents
The .M command displays memory in hexadecimal. Syntax example:

.M 1000 1010

Be careful to include exactly one space before each address when issuing the command. The monitor prints addresses and byte values in hex. Each output line begins with a four-digit base address followed by the contents of consecutive memory locations as two-digit hex bytes. Typical monitors show eight bytes per line (some VIC-20 monitors show five because of a narrower screen).

If the end address you request falls partway through a line, the monitor still prints the remainder of that line up to the line boundary (for example, requesting up to $1010 will still show bytes through $1017 on that final line).

Interpretation rules:
- The leading four-digit number is the memory address for the first byte on that line (e.g. $1000).
- Each two-digit value following it is the byte stored at successive addresses ($1000, $1001, ...).
- All numbers and values shown by the monitor are hexadecimal.

## Source Code
```text
.M 1000 1010

.:1000 11 3A E4 00 21 32 04 AA
.:1008 20 4A 49 4D 20 42 55 54
.:1010 54 45 52 46 49 45 4C 44
```

## References
- "editing_memory_and_registers" — expands on editing memory bytes shown by .M using screen editing
- "entering_program_with_mlm" — expands on using .M prior to editing memory to place a program
