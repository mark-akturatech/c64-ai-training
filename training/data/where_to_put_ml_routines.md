# Where to put machine language routines (Commodore 64)

**Summary:** Recommended RAM area $C000-$CFFF for machine language routines under 4K; for larger routines reserve top-of-memory (default $9FFF) via the KERNAL MEMTOP routine or by poking BASIC pointers (POKE 51/52/55/56) and issuing CLR.

## Guidance
- Best default location for small (under 4 KB) machine-language routines is $C000-$CFFF. This block is not used or overwritten by BASIC, so it is safe for resident routines.
- If your routine is larger than 4 KB, reserve a contiguous block at the top of BASIC memory (the BASIC memory top, default $9FFF). You can change the BASIC memory top with the KERNAL MEMTOP routine (see KERNAL documentation), or by directly poking BASIC pointer variables in memory and then executing CLR to reinitialize BASIC.
- The POKE method uses two pointer bytes for the start of BASIC free memory (low/high) plus control bytes. In the examples below H and L denote the high and low bytes of the new top-of-memory address respectively (H = address >> 8, L = address & $FF). After poking the new pointer values, run CLR to make BASIC adopt the new memory top.

## Source Code
```basic
10 POKE 51,L : POKE 52,H : POKE 55,1 : POKE 56,H : CLR
```

Example: reserve $9000-$9FFF (H = $90 = 144 decimal, L = $00 = 0):
```basic
10 POKE 51,0 : POKE 52,144 : POKE 55,1 : POKE 56,144 : CLR
```

(Use H = high byte, L = low byte of the desired top-of-memory address.)

## Key Registers
- $C000-$CFFF - RAM - recommended area for machine language routines (<4K), not disturbed by BASIC
- $9000-$9FFF - RAM - example reserved top-of-memory region when poked (illustrative)
- $0033 ($33 decimal / POKE 51) - RAM/ZP - low byte (L) of new BASIC memory top (used by POKE sequence)
- $0034 ($34 decimal / POKE 52) - RAM/ZP - high byte (H) of new BASIC memory top (used by POKE sequence)
- $0037 ($37 decimal / POKE 55) - RAM/ZP - control byte used in POKE sequence
- $0038 ($38 decimal / POKE 56) - RAM/ZP - additional high-byte pointer used in POKE sequence

## References
- "memtop_kernal_routine" — details on using the KERNAL MEMTOP routine to change BASIC top-of-memory