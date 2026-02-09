# BRK (Warm Start) Routine — $FE66 (65126)

**Summary:** The BRK warm-start routine at $FE66 (65126) is the Kernal entry executed on STOP+RESTORE or via the BRK vector; it calls Kernal initialization routines RESTOR (restores RAM vectors), IOINIT (reinitializes I/O), and part of CINT, then exits through the BASIC warm start vector at $A002 (40962).

**Description**
This Kernal routine is the default target for the BRK/IRQ vector and the code invoked when the user presses STOP+RESTORE. Sequence and behavior:

- **Invocation**
  - Triggered by the STOP/RESTORE key combination.
  - Also the default address supplied by the BRK/IRQ vector ($FFFE-$FFFF) when a BRK instruction is executed.

- **What it does**
  - Calls RESTOR (restores RAM vectors and related RAM-stored pointers).
  - Calls IOINIT (reinitializes I/O subsystems; reinitializes CIAs/SID as part of device reinitialization).
  - Executes part of CINT (console/input initialization).
  - Transfers control to the BASIC warm start vector at $A002 (40962) to continue warm-start processing in BASIC ROM.

- **Exit**
  - Final control flow leaves the Kernal routine by jumping to the address held in the BASIC warm start vector ($A002).

(Parenthetical notes: RESTOR — restores RAM vector table; IOINIT — reinitializes I/O/CIA/SID.)

## Source Code
The disassembly of the BRK (Warm Start) routine at $FE66 is as follows:

```assembly
FE66   20 15 FD   JSR $FD15   ; Call RESTOR to restore RAM vectors
FE69   20 A3 FD   JSR $FDA3   ; Call IOINIT to reinitialize I/O
FE6C   20 18 E5   JSR $E518   ; Call part of CINT for console/input initialization
FE6F   6C 02 A0   JMP ($A002) ; Jump to BASIC warm start vector
```

This sequence performs the following operations:

1. Calls RESTOR to restore RAM vectors.
2. Calls IOINIT to reinitialize I/O subsystems.
3. Calls part of CINT for console/input initialization.
4. Jumps to the address stored at $A002, the BASIC warm start vector.

This information is sourced from the Commodore 64 ROM disassembly. ([cbmitapages.it](https://www.cbmitapages.it/c64/c64rom.htm?utm_source=openai))

## Key Registers
- $FFFE-$FFFF - CPU - BRK/IRQ vector (holds the address invoked for BRK/IRQ; defaults into Kernal BRK at $FE66)
- $FE66 - KERNAL ROM - BRK (Warm Start) routine entry point (65126 decimal)
- $A002 - BASIC ROM - BASIC warm start vector (exit target for Kernal warm-start)

## References
- "restore_and_vector_table_management" — details on RESTOR restoring RAM vectors
- "ioinit_initialize_cia_and_sid" — details on IOINIT reinitialization of CIA and SID components