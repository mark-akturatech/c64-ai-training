# MEMBOT routine: read or set the bottom-of-RAM pointer

**Summary:** MEMBOT ($FE34 / decimal 65076) is a documented KERNAL routine (entry via the KERNAL jump table at $FF9C / decimal 65436) that either reads or writes the 16-bit bottom-of-RAM pointer; call with Carry set to read the pointer into X/Y, with Carry clear to store X/Y into the pointer.

**Description**
MEMBOT is the KERNAL entry for accessing the system "bottom of RAM" pointer (16-bit). Behavior is controlled solely by the Carry flag on entry:

- Carry = 1 (set): MEMBOT loads the bottom-of-RAM pointer into the X and Y registers (pointer -> X/Y).
- Carry = 0 (clear): MEMBOT stores the 16-bit value found in X and Y into the bottom-of-RAM pointer (X/Y -> pointer).

The routine is reached via the documented KERNAL jump table entry at address $FF9C (decimal 65436), which vectors to the implementation at $FE34 (decimal 65076). MEMBOT is part of the same pointer-management pair as MEMTOP (manage top-of-RAM pointer) and is used by system initialization code such as RAMTAS.

The bottom-of-RAM pointer is stored at zero-page addresses $0281-$0282 (decimal 641-642). ([pagetable.com](https://www.pagetable.com/c64ref/c64mem/?utm_source=openai))

## Source Code
```assembly
; MEMBOT routine at $FE34
FE34  18        CLC             ; Clear carry flag
FE35  08        PHP             ; Push processor status
FE36  90 06     BCC $FE3E       ; Branch if carry clear (set pointer)
FE38  A5 81     LDA $81         ; Load low byte of bottom-of-RAM pointer
FE3A  A6 82     LDX $82         ; Load high byte of bottom-of-RAM pointer
FE3C  28        PLP             ; Pull processor status
FE3D  60        RTS             ; Return
FE3E  85 81     STA $81         ; Store low byte into bottom-of-RAM pointer
FE40  86 82     STX $82         ; Store high byte into bottom-of-RAM pointer
FE42  28        PLP             ; Pull processor status
FE43  60        RTS             ; Return
```

## Key Registers
- **$0281-$0282**: Bottom-of-RAM pointer (low byte at $0281, high byte at $0282)

## References
- "memtop_read_set_top_of_ram_pointer" — expands on MEMTOP/MEMBOT together managing RAM top/bottom pointers
- "ramtas_ram_test_and_memory_pointers" — covers RAMTAS initializing bottom-of-RAM pointer during system init

## Labels
- MEMBOT
