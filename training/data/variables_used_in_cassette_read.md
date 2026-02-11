# Commodore 64 KERNAL — Zero-page variables used by cassette READ routines

**Summary:** This document details the zero-page variables utilized by the KERNAL cassette READ routines in the Commodore 64. Each variable's absolute zero-page address, role, and interaction within the cassette reading process are provided. Additionally, the document includes information on the BAD table format, relevant code routines, RDFLG mode constants, dipole timing thresholds, encoding values, and the PCNTR transition to parity handling.

**Variable roles and how they interact**

- **REZ** ($00A3)
  - **Role:** Counts zero dipoles. Used to detect long runs of zeros, which are essential for sync detection. A value of zero indicates the expected number of zero dipoles has been counted.

- **RER** ($00A4)
  - **Role:** Error flag for bit/byte read routines. A value of zero indicates no error; a nonzero value signifies an error condition at the bit/byte level.

- **DIFF** ($00A5)
  - **Role:** Temporary storage used to preserve SYNO across bit-handling routines, maintaining block-sync status while bit routines may modify working flags.

- **SYNO** ($00A6)
  - **Role:** Block-sync indicator. Set when a block sync pattern is detected (16 zero dipoles), signaling the start of a block.

- **SNSW1** ($00A7)
  - **Role:** Byte-sync indicator. Flags that a byte sync pattern (a long-long sequence or equivalent long marker) has been detected, transitioning from sync detection to byte accumulation.

- **DATA** ($00A8)
  - **Role:** Holds the most recently decoded dipole bit value, representing the instantaneous bit result from dipole timing/decoding. Used by byte-assembly logic to shift into MYCH and compute parity.

- **MYCH** ($00A9)
  - **Role:** Working input byte under construction as bits are decoded. Bits from DATA are shifted/merged into MYCH until a full byte is formed.

- **FIRT** ($00AA)
  - **Role:** Half-dipole state indicator. Marks which half of a dipole the sampler is processing (first or second half), essential for decoding dipole durations into logical bits.

- **SVXT** ($00AB)
  - **Role:** Temporary variable used by the software servo routine for timing adjustment, adapting sampling/timing values to follow tape speed variations.

- **TEMP** ($00AC)
  - **Role:** Holds measured dipole time during type calculations and timing classification, converting measured timing to logical L/L, L/S, S/L, S/S combinations.

- **PRTY** ($00AD)
  - **Role:** Holds the computed parity bit for the current byte, updated as bits are assembled; used to verify/check parity after a byte or at block boundaries.

- **PRP** ($00AE)
  - **Role:** Holds combined error values returned from the bit-level routines, aggregating error states for higher-level byte/block handlers to decide error/retry behavior.

- **FSBLK** ($00AF)
  - **Role:** Indicates the current file/block number being processed. A value of zero signals an exit/stop condition for the read loop.

- **SHCNL** ($00B0)
  - **Role:** Copy of FSBLK used to direct subroutines, preserving the original block ID for routing logic as FSBLK may be modified or an exit path taken.

- **RDFLG** ($00B1)
  - **Role:** Mode/phase flag for the reader state machine, encoding one of the following:
    - **MI** ($00): Waiting for block sync (block sync search)
    - **VS** ($01): Reading data block (active data decoding)
    - **NE** ($02): Waiting for byte sync (awaiting byte alignment)
  - **Interaction:** Controls which handler path (sync search, byte assembly, data block processing) is active.

- **SAL** ($00B2)
  - **Role:** Indirect pointer to the data storage area where decoded bytes are stored, used with zero-page indirect addressing to write received data into the target buffer.

- **SHCNH** ($00B3)
  - **Role:** Leftover/debug variable retained in the code, present but not documented for an active role in the core algorithm (kept for compatibility).

- **BAD table** ($0100-$01FF)
  - **Role:** Area used to record locations (offsets/addresses) of bad read locations, implemented at the bottom of the stack space in memory. Each entry is a single byte representing the page number of the bad block. Used to remember errors for re-read passes.

- **PTR1** ($00B4)
  - **Role:** Pointer/index: count of read locations recorded in BAD (number of bad locations). Points into BAD when appending new error locations. Maximum count noted as 61 in comments.

- **PTR2** ($00B5)
  - **Role:** Pointer/index used during re-read passes: counts re-read locations and points into BAD while performing re-reads.

- **VERCHK** ($00B6)
  - **Role:** Verify-or-load flag. A value of zero indicates LOAD mode; a nonzero value indicates VERIFY mode, controlling whether data is merely read into memory or compared against existing memory contents.

- **CMP0** ($00B7)
  - **Role:** Software servo adjustment register. A signed small adjuster (+/-) used to tweak timing calculations (timing offset correction).

- **DPSW** ($00B8)
  - **Role:** Dipole state/wait flag used to expect dipole combinations that end a byte. A nonzero value indicates routines expect an LL/L (long-long or long) combination that terminates a byte, controlling byte-boundary detection logic.

- **PCNTR** ($00B9)
  - **Role:** Bit counter for the current byte. Counts down from 8 to 0 while assembling data bits, then is set to $FF (255) to indicate the parity phase. Used to know when to switch from data bit collection to parity handling/verification.

- **STUPID** ($00BA)
  - **Role:** Hold indicator for timing interrupt (T1IRQ). A nonzero value indicates no T1IRQ has yet occurred, gating timing capture/initialization until the first timing interrupt fires.

- **KIKA26** ($00BB)
  - **Role:** Storage for the old D1ICR value after it was cleared on read, preserving prior interrupt control/status so it can be restored or inspected later.

**Interaction Summary:**

- **Timing Capture:** Variables such as FIRT, TEMP, SVXT, CMP0, STUPID, and KIKA26 are used to measure dipole durations, adjust sampling windows, and maintain timer/interrupt state.
- **Dipole/Byte Decoding:** DATA, REZ, DIFF, SYNO, SNSW1, DPSW, PCNTR, MYCH, and PRTY coordinate detection of dipole patterns, deciding L/S (long/short) classification, and assembling bytes.
- **Parity and Pass Management:** PRTY, PRP, RER, PTR1/PTR2, BAD, VERCHK, and FSBLK/SHCNL manage parity checks, aggregate errors, record bad locations, and control re-read passes or verify vs load behavior.

## Key Registers

- **RDFLG Modes:**
  - **MI** ($00): Waiting for block sync (block sync search)
  - **VS** ($01): Reading data block (active data decoding)
  -

## Labels
- REZ
- SYNO
- DATA
- MYCH
- PRTY
- PCNTR
- RDFLG
- FSBLK
