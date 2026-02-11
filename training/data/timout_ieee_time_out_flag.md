# TIMOUT ($285) — KERNAL Variable for IEEE Time-Out

**Summary:** TIMOUT is a KERNAL flag at address 645 decimal ($285) used to control IEEE Time-Out behavior for an external IEEE interface card; related KERNAL routine SETTMO is at 65057 ($FE21).

## Description
TIMOUT (decimal 645, $285) is a KERNAL variable/flag used only when an external IEEE interface card is present. The variable controls the IEEE Time-Out behavior that the external card uses. The interface card was not supplied by Commodore at the time of the original documentation.

This location is not otherwise used by the standard C64 hardware and has no effect unless the external IEEE device and its KERNAL support code are installed.

## Details / Cross-reference
- See the KERNAL SETTMO routine at 65057 ($FE21) for the routine that sets or uses this flag.
- Related KERNAL routines and how they are vectored are documented in the KERNAL vector table (see kernal_vector_table_and_vectors).

## References
- "kernal_settmo" — KERNAL SETTMO routine at 65057 ($FE21)  
- "kernal_vector_table_and_vectors" — KERNAL vector table and related vectored routines

## Labels
- TIMOUT
