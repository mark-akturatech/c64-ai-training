# Receiver/Transmitter Buffer Base Pointers ($00F7 / $00F9)

**Summary:** Zero-page two-byte pointers at $00F7-$00F8 and $00F9-$00FA used by the KERNAL RS-232 OPEN/CLOSE routines to point to 256-byte Receiver and Transmitter buffers; de-allocation is performed by writing zero into the high bytes ($00F8, $00FA).

## Description
- $00F7-$00F8 (REBUF): two-byte zero-page pointer (low byte at $00F7, high byte at $00F8) that holds the base address of the 256-byte Receiver buffer allocated by the KERNAL OPEN routine.
- $00F9-$00FA (ROBUF): two-byte zero-page pointer (low byte at $00F9, high byte at $00FA) that holds the base address of the 256-byte Transmitter buffer allocated by the KERNAL OPEN routine.
- Allocation: The OPEN KERNAL routine sets these pointers so each points to a distinct 256-byte buffer.
- De-allocation: The CLOSE KERNAL entry de-allocates the buffers by writing zero into the high-order bytes ($00F8 and $00FA). Machine-language programs may also allocate or de-allocate these buffers manually (by setting/clearing the two-byte pointers).
- Caution: When a machine-language program manipulates these buffers directly, ensure the system top-of-memory pointers remain correct if BASIC and machine-language code will both run; improper management can corrupt BASIC memory or program execution.

## Key Registers
- $00F7-$00F8 - Zero page - REBUF: Receiver Buffer base pointer (two bytes, low/high)
- $00F9-$00FA - Zero page - ROBUF: Transmitter Buffer base pointer (two bytes, low/high)

## References
- "rs232_zero_page_variables" — expands on zero-page variables used by the routines that operate on these buffers
- "sample_basic_program_pet_ascii" — sample showing OPEN/CLOSE setting and clearing these buffer pointers

## Labels
- REBUF
- ROBUF
