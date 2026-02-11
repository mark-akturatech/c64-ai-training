# NMINV (792-793 / $0318-$0319) — Non-Maskable Interrupt Vector

**Summary:** RAM vector at $0318-$0319 (decimal 792–793) holds the address jumped to on a 6510 Non-Maskable Interrupt (NMI). Sources: RESTORE key (direct to 6510 NMI) and CIA #2 (used for RS‑232). Default vector points to ROM ($FE47); it can be redirected (e.g. to RTI) with POKE, but this disables all NMIs including RS‑232.

## Behavior and usage
This two‑byte RAM vector (NMINV) is used by the Kernal ROM when an NMI occurs. On NMI the ROM sets the Interrupt Disable flag and then JSRs through the address stored at $0318-$0319.

Sources of NMIs:
- RESTORE key — wired directly to the 6510 NMI pin.
- CIA #2 interrupt line — connected to the 6510 NMI; used by CIA #2 for RS‑232 handling.

Default handling (Kernal ROM):
- The ROM routine reached via the NMI vector inspects the cause of the NMI.
- If CIA #2 caused the NMI, the routine checks whether RS‑232 service routines should be called.
- If the RESTORE key caused the NMI, the routine:
  - Checks for a cartridge; if present, enters the cartridge warm‑start entry point.
  - If no cartridge, tests the STOP key. If STOP+RESTORE were pressed simultaneously, several Kernal initialization routines (RESTOR, IOINIT and part of CINT) run and BASIC is entered through its warm start vector at decimal 40962 ($A002).
  - If RESTORE alone was pressed, the ROM handler may return without visible effect to the user.

Disabling the STOP/RESTORE sequence:
- Because the RESTORE handling is dispatched through this RAM vector, pointing the vector to an RTI (or another safe return) address prevents the normal STOP/RESTORE warm‑start sequence.
- Example single‑byte pokes are commonly used to change the low byte of the vector (see Source Code). Warning: changing the NMI vector in this way disables all NMIs, including those required for RS‑232 I/O.

## Source Code
```text
; Vector location (RAM)
; Decimal addresses: 792 (low), 793 (high)
; Hex addresses: $0318 (low), $0319 (high)

; Typical default contents (little-endian) — points to Kernal ROM routine:
; low byte = $47  (71 decimal)
; high byte = $FE (254 decimal)
; => Address = $FE47  (65095 decimal)

; Example POKE usage (as referenced in source text):
POKE 792,193   ; set low byte to 193 (0xC1) — commonly used to point vector to an RTI-containing ROM address
POKE 792,71    ; restore low byte to 71 (0x47) — restore default low byte

; Notes:
; - The ROM NMI handler sets the Interrupt Disable flag before jumping through this vector.
; - Changing the vector only requires modifying the two bytes at $0318/$0319.
; - Be aware: redirecting the vector will affect all NMI sources (RESTORE and CIA#2/RS‑232).
```

## Key Registers
- $0318-$0319 - 6510 - NMINV: two‑byte RAM vector (little‑endian) containing the address jumped to on NMI

## References
- "m51cdr_rs232_command_register" — expands on CIA #2 NMIs used for RS‑232 handling

## Labels
- NMINV
