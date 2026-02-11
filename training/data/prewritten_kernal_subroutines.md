# MACHINE

**Summary:** Commodore "kernal" ROM routines — persistent system subroutines stored in ROM on PET, CBM, Commodore 64, PLUS/4, and VIC-20; called from user code with JSR/RTS (6502 subroutine call/return). Routine entry addresses are fixed across Commodore machines; full details are in the Commodore reference manuals.

## Prewritten Subroutines
A standard set of system subroutines is permanently stored in the machine ROM and is available on all Commodore computers listed above. These routines provide system-level services (keyboard, screen, I/O control, and other platform services) and are located at fixed ROM addresses so user programs can call them directly.

- Location and portability: Kernal routines live in ROM and appear at the same addresses on the various Commodore models, so programs can rely on consistent entry points across PET, CBM, C64, PLUS/4, and VIC-20.
- Invocation: Call with 6502 JSR and return with RTS (see referenced material for calling conventions and parameter passing).
- Documentation: Behavior, exact addresses, parameter expectations, and side effects are documented in the official Commodore reference manuals and the specific kernal routine tables.

Note on terminology: Commodore uses the spelling "kernal" for its ROM-level OS routines (historical acronym/usage). The more common computing term is "kernel."

## References
- "calling_subroutines_concept" — expands on JSR/RTS calling and return conventions
- "common_kernal_subroutines_table" — lists several important kernal routines and their addresses