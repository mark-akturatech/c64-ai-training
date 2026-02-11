# Hardware Vectors $FFFA-$FFFF (NMI / Reset / IRQ)

**Summary:** System hardware vectors at $FFFA-$FFFF hold 16-bit little-endian pointers (low byte at the lower address) to the NMI, Reset, and IRQ/BRK handlers in the KERNAL/ROM area; addresses: $FFFA-$FFFB NMI (default $FE43), $FFFC-$FFFD Reset (default $FCE2), $FFFE-$FFFF IRQ/BRK (default $FF48).

## Hardware Vectors
The 6502 vector table for the C64 is located at addresses $FFFA through $FFFF. Each vector is a 16-bit pointer stored little-endian (low byte at the lower address, high byte at the higher address). By default these vectors point into the KERNAL ROM where the system interrupt/exception handlers reside.

- $FFFA-$FFFB — NMI vector: pointer to the Non-Maskable Interrupt handler (default points to $FE43).
- $FFFC-$FFFD — Reset vector: pointer for cold reset entry (power-on reset) (default points to $FCE2).
- $FFFE-$FFFF — IRQ/BRK vector: pointer for IRQ and BRK handlers (default points to $FF48).

IRQ and BRK share the same vector ($FFFE-$FFFF). The vectors contain the low byte first, then the high byte (little-endian 16-bit address).

## Source Code
```text
Hardware vector table (little-endian 16-bit pointers):
Address    Purpose      Default pointer (low byte, high byte)
$FFFA      NMI low      $43   $FE    ; points to $FE43 (NMI handler)
$FFFB      NMI high
$FFFC      RESET low    $E2   $FC    ; points to $FCE2 (cold reset entry)
$FFFD      RESET high
$FFFE      IRQ/BRK low  $48   $FF    ; points to $FF48 (IRQ/BRK handler)
$FFFF      IRQ/BRK high
```

## Key Registers
- $FFFA-$FFFB - 6502 - NMI vector (16-bit little-endian pointer to NMI handler; default $FE43)
- $FFFC-$FFFD - 6502 - Reset vector (16-bit little-endian pointer to cold reset entry; default $FCE2)
- $FFFE-$FFFF - 6502 - IRQ/BRK vector (16-bit little-endian pointer to IRQ/BRK handler; default $FF48)

## References
- "processor_stack_and_error_bytes" — expands on stack usage during vectored interrupts
- "kernal_rom_area" — expands on KERNAL providing default handlers pointed to by these vectors

## Labels
- NMI
- RESET
- IRQ
