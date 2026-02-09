# CROSS REF / CROSS REF 64 — BASIC Cross-Reference Utility (PET/CBM, Commodore 64)

**Summary:** Disk-based BASIC cross-reference utility for PET/CBM and Commodore 64 that scans a BASIC program and lists cross-references for line numbers and variables. Utilizes a 256-element character classification table and a state-transition table to parse tokens; a machine-language routine invoked by a SYS call prints line numbers using a 6502 binary-to-decimal conversion that employs decimal mode (BCD).

**Description**

This program produces a cross-reference listing for a selected BASIC program stored on disk. It records:

- References to line numbers (GOTO/GOSUB/RESTORE/etc.).
- References to variables and variable occurrences.

**Parsing Technique:**

- **Character Classification Table:** A 256-entry table indexed by the raw 8-bit character value. Each entry maps the character to a small "type" code (e.g., letter, digit, quote, token-start, whitespace). This approach eliminates repetitive conditional logic and speeds up the classification of input characters.

- **State-Transition Table:** A finite-state table that drives the parser. The parser maintains a current state and, for each input character type (from the classification table), consults the state-transition table to decide the next state and any actions (e.g., record a line number, start/end a variable token, treat a following numeric token as a line number after seeing a GOSUB token). For example, after encountering a GOSUB token, the parser transitions into a state that expects a line-number token next.

**Token Handling:**

- BASIC token recognition is table-driven rather than relying on hard-coded string comparisons.
- Variables and numeric tokens are extracted based on transitions and recorded for the cross-reference index.

**Output Routines:**

- The BASIC program contains a SYS call that invokes a machine-language routine to print line numbers for the cross-reference listing. This routine implements a binary-to-decimal conversion using the 6502 processor's decimal (BCD) mode for efficient conversion, utilizing instructions like SED (Set Decimal Mode) and CLD (Clear Decimal Mode).

**Platform Notes:**

- Two target builds are noted: one for PET/CBM ("CROSS REF") and one for Commodore 64 ("CROSS REF 64"). Disk I/O and system-specific entry points differ by platform; however, the algorithmic core (classification table, state machine, and decimal-mode conversion) remains conceptually the same.

**Caveats:**

- The description references table contents (256-element classification table and the state-transition table) and the BASIC listing, but the actual tables and listings are not present in this text. The differences in I/O and entry points between PET/CBM and C64 are implied but not detailed here.

## Source Code

```text
(omitted — original source listing, tables, and BASIC program not included in this chunk)
```

## Key Registers

- (none) — This chunk documents algorithmic and BASIC-level behavior; no specific C64 hardware registers are described.

## References

- "factors_program_overview" — expands on the binary-to-decimal conversion technique and related implementation details.