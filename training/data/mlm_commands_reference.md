# MACHINE - Machine Language Monitor (MLM) commands

**Summary:** Describes common machine language monitor commands (.X, .M, .R, .G, .S, .L), example address/memory usage ($033C, $1000-$1010), and the relationship/compatibility rules between the MLM and BASIC (SYS4/SYS8/MONITOR to enter MLM).

## MLM Commands
The machine language monitor (MLM) accepts its own commands (prompted with a leading period) and does not recognize BASIC statements. BASIC likewise does not recognize MLM commands.

- .X — Exit the MLM and return to the BASIC monitor. Press RETURN after typing the X. The BASIC monitor will respond READY. Re-enter the MLM with the appropriate entry (e.g., SYS4 for PET/CBM, SYS8 for VIC/64, or MONITOR).
- Entering MLM from BASIC — BASIC ignores spaces in statements (e.g., SYS8 and SYS 8 are equivalent). Use the correct entry number for your machine (4 for PET/CBM; 8 for VIC/64).
- .M start end — Display memory from the first hex address to the second (example: .M 1000 1010 displays memory from $1000 to $1010).
- .R — Display CPU registers (monitor register display).
- .G addr — Go/start execution at the given address (example .G 033C starts execution at $033C). Do not use .G unless you know there is valid code at that address — executing random RAM can crash control.
- .S / .L — Save and Load commands. These are considered tricky and should be avoided until you understand BASIC pointers (see Chapter 6 in the original source).

Behavioral notes:
- If you enter an MLM command while in BASIC, BASIC will typically reply with ?SYNTAX ERROR.
- If you enter a BASIC command while in the MLM, the monitor will usually echo a question mark for the line you typed.
- The monitor prompt includes the leading period; commands shown here include that period.

## Source Code
```text
.X

.M 1000 1010   (display memory from hex 1000 to 1010)
.R             (display registers ... again!)
.G 033C        (go to 033C and start running a program)

SYS4 or SYS8 or MONITOR  (enter machine language monitor from BASIC; use correct number for machine)
.S  (save)   -- advanced, avoid until familiar with BASIC pointers
.L  (load)   -- advanced, avoid until familiar with BASIC pointers
```

## References
- "monitor_register_display" — expands on the register display shown by the MLM
- "entering_program_with_mlm" — expands on using .M and .G when entering and running a program