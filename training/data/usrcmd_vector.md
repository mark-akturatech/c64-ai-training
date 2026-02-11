# USRCMD Vector ($032E-$032F)

**Summary:** $032E-$032F — USRCMD vector (two-byte little-endian pointer) intended as a jump-to-user-defined-command entry; currently initialized to point to the BRK/STOP/RESTORE handler at $FE66 (decimal 65126). Updated by the Kernal VECTOR routine at $FD1A (decimal 64794) but not used for adding new monitor commands on the stock C64.

## Description
USRCMD at $032E-$032F is a two-byte vector (low byte at $032E, high byte at $032F) reserved historically for a user-defined command entry point. On PET-class machines this vector was used by the built-in machine-language monitor: when the monitor encountered an unknown command it would jump via USRCMD, allowing the user to supply additional commands.

On the Commodore 64 the vector is present but effectively a legacy/historical artifact. In the shipped C64 Kernal it is initialized to point to the BRK/STOP/RESTORE handler at $FE66 (decimal 65126). The Kernal's VECTOR update routine (located at $FD1A / decimal 64794) can modify this vector as part of the indirect-vector table maintenance, but in normal C64 operation USRCMD is not used to extend the monitor with custom commands.

Behavioral notes:
- Stored as a standard two-byte little-endian address at $032E (low) / $032F (high).
- Default value points to $FE66 (BRK/STOP/RESTORE/BRK handler).
- Although updated by the Kernal VECTOR routine, practical use for adding monitor commands is not supported on the stock system.

## Key Registers
- $032E-$032F - System Vectors - USRCMD vector (low/high pointer to user-defined command handler; defaults to $FE66)

## References
- "cbinv_brk_vector" — expands on current USRCMD pointing to the BRK/STOP/RESTORE handler
- "kernal_indirect_vectors_overview" — explains how this vector is part of the Kernal jump-table and is updated by VECTOR ($FD1A)

## Labels
- USRCMD
