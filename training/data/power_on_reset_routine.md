# Power-On RESET routine (vector at $FFFC)

**Summary:** Describes the 6510 Power-On RESET routine invoked via the CPU RESET vector at $FFFC ($FFFC/$FFFD), including setting the interrupt disable flag, stack pointer and decimal flag, autostart cartridge test and jump to the cartridge cold-start vector at $8000, and the alternate Kernal initialization sequence (IOINIT, RAMTAS, RESTOR, CINT) followed by entering BASIC via the cold-start vector at $A000.

## Power-On RESET behavior
On power-up the 6510 reads the RESET vector at $FFFC/$FFFD and jumps to the KERNAL RESET entry (commonly at $FCE2). The routine performs the following sequence:

- Sets the Interrupt Disable flag (I) to mask IRQ/NMI (interrupts disabled during init).
- Initializes the processor stack pointer (SP) to its startup value (implementation detail in ROM).
- Clears the Decimal Mode flag (D) to ensure binary arithmetic.
- Tests for an autostart cartridge; if an autostart cartridge is detected the routine transfers control to the cartridge cold-start vector at $8000 (32768).
  - The autostart test verifies the cartridge signature/conditions required for a cold-start jump (see referenced autostart_cartridge_check_and_signature_text).
- If no autostart cartridge is present, the KERNAL performs its initialization sequence:
  - IOINIT — initialize I/O subsystems (CIA, SID, etc.; see ioinit_initialize_cia_and_sid).
  - RAMTAS — RAM test and setup of memory pointers (see ramtas_ram_test_and_memory_pointers).
  - RESTOR — restore vectors and RAM pointers as needed (see restore_and_vector_table_management).
  - CINT — final console/interrupt-related initialization.
- After KERNAL init, the Interrupt Disable flag is cleared to re-enable normal interrupts.
- Finally the system jumps to the BASIC cold-start vector at $A000 (40960) to enter BASIC (cold start).

This routine is executed only on power-on (cold reset) via the hardware RESET vector; cartridge presence short-circuits the KERNAL init by jumping through the cartridge vector.

## Key Registers
- $FFFC-$FFFD - CPU (6510/6502) - Reset vector (points to KERNAL Reset entry, commonly $FCE2)
- $FCE2 - KERNAL ROM - Typical entry point/address of the Power-On RESET routine
- $8000 - Cartridge ROM - Cartridge cold-start vector (autostart jump target at $8000 / 32768)
- $A000 - BASIC ROM - BASIC cold-start vector (cold start entry at $A000 / 40960)

## References
- "autostart_cartridge_check_and_signature_text" — expands on autostart cartridge test and required signature text
- "ioinit_initialize_cia_and_sid" — expands on CIA/SID initialization called during RESET
- "ramtas_ram_test_and_memory_pointers" — expands on RAM test and pointer setup called during RESET
- "restore_and_vector_table_management" — expands on RESTOR called from RESET to restore RAM vectors

## Labels
- RESET
- IOINIT
- RAMTAS
- RESTOR
- CINT
