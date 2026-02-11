# C64 RAM Map: $0318-$0319 NMINV (Non‑Maskable Interrupt Vector)

**Summary:** $0318-$0319 (decimal 792–793) hold the NMINV RAM vector for the 6510 Non‑Maskable Interrupt (NMI). Default vectors end up in Kernal ROM (typically $FE47 / decimal 65095); NMIs originate from the RESTORE key or CIA #2 (RS‑232), and the ROM checks the source and dispatches appropriate warm‑start or RS‑232 handling. Changing the vector (example: POKE 792,193) can disable the STOP/RESTORE sequence but also disables NMIs used for RS‑232.

## Description
$0318-$0319 contain the two‑byte RAM vector the Kernal ROM uses to find the NMI handler. When an NMI occurs the ROM sets the Interrupt Disable flag and then jumps through this RAM vector. The default vector points to the ROM handler which inspects the NMI source and acts accordingly.

There are two physical sources for NMI on the C64:
- RESTORE key (directly tied to the 6510 NMI line).
- CIA #2 interrupt line (wired to the 6510 NMI), often used for RS‑232 activities.

The default ROM NMI routine:
- Examines the source of the NMI.
- If from CIA #2, checks and optionally calls RS‑232 related routines.
- If from the RESTORE key, checks for a cartridge warm start entry; if absent, tests the STOP key.
  - If STOP+RESTORE are pressed together, Kernal initialization subroutines (RESTOR, IOINIT, parts of CINT) are executed and BASIC is entered via its warm‑start vector (decimal 40962).
  - If RESTORE alone, the handler typically returns silently (no visible effect to the user).

## Changing the Vector
Because the ROM looks up the NMI handler through this RAM vector, replacing it allows changing the behavior of RESTORE and CIA#2 NMI handling. Pointing the vector at an RTI effectively disables the ROM NMI sequence (including the STOP/RESTORE warm‑start behavior). Example BASIC pokes from the original source:

- POKE 792,193 — change low byte of NMINV to point to an RTI (disables STOP/RESTORE sequence and CIA#2 NMIs).
- POKE 792,71  — restore the default low byte (restore original vector).

Caveat: modifying this vector removes all NMIs, which also prevents RS‑232 NMIs from CIA #2.

## Source Code
```basic
10 REM examples from source: change and restore NMINV low byte
20 POKE 792,193  : REM point low byte to RTI (disable NMI handling)
30 REM ... perform tests ...
40 POKE 792,71   : REM restore original low byte
```

## Key Registers
- $0318-$0319 - RAM - NMINV: Non‑Maskable Interrupt vector (points to ROM NMI handler; default entry at $FE47 / decimal 65095)

## References
- "rs232_enabl_flags" — expands on CIA #2 RS‑232 NMI involvement
- "cbinv_brk_vector" — expands on BRK and STOP/RESTORE linkage

## Labels
- NMINV
