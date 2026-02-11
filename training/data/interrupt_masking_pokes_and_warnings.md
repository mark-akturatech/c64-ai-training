# Machine-specific POKEs to disable/enable interrupts (C64, VIC-20, PET)

**Summary:** Machine-specific interrupt-mask POKEs for Commodore 64 ($DC0C), VIC-20 ($912E), and PET/CBM ($E813) that gate interrupts at the system interface adapter (CIA/VIA). Writing the listed values will disable and re-enable interrupts; these POKEs can also disable keyboard and other services and must be used with caution.

**Description**
Most interrupt sources on Commodore machines are delivered through an interface adapter (CIA/VIA). The path can be temporarily blocked by writing specific values to the CIA/VIA interrupt-control locations in the I/O area. The documented values below disable interrupts (first POKE) and restore them (second POKE) for each machine.

Warning: the disable POKE on each system can also disable keyboard input and other system services; do not execute these POKEs as direct commands unless you can restore machine state (for example from machine language).

## Source Code
```basic
REM Commodore 64 (decimal addresses)
POKE 56332,127   : REM $DC0C <- $7F  (disable interrupts, may disable keyboard)
POKE 56332,129   : REM $DC0C <- $81  (re-enable interrupts)

REM VIC-20 (decimal addresses)
POKE 37166,127   : REM $912E <- $7F  (disable interrupts)
POKE 37166,192   : REM $912E <- $C0  (re-enable interrupts)

REM PET/CBM (decimal addresses)
POKE 59411,60    : REM $E813 <- $3C  (disable interrupts)
POKE 59411,61    : REM $E813 <- $3D  (re-enable interrupts)
```

Assembly equivalents (example form; do not execute without understanding system state):
```asm
; Commodore 64
    LDA #$7F
    STA $DC0C      ; disable interrupts
    LDA #$81
    STA $DC0C      ; re-enable interrupts

; VIC-20
    LDA #$7F
    STA $912E
    LDA #$C0
    STA $912E

; PET/CBM
    LDA #$3C
    STA $E813
    LDA #$3D
    STA $E813
```

## Key Registers
- **Commodore 64:**
  - **$DC0C**: CIA 1 Interrupt Control Register. Writing $7F disables all interrupts; writing $81 re-enables them. ([en.wikipedia.org](https://en.wikipedia.org/wiki/MOS_Technology_CIA?utm_source=openai))

- **VIC-20:**
  - **$912E**: VIA 2 Interrupt Enable Register. Writing $7F disables all interrupts; writing $C0 re-enables them. ([retroisle.com](https://retroisle.com/commodore/vic20/Technical/Firmware/VIC_MemoryMap.php?utm_source=openai))

- **PET/CBM:**
  - **$E813**: VIA Interrupt Enable Register. Writing $3C disables all interrupts; writing $3D re-enables them. ([citeseerx.ist.psu.edu](https://citeseerx.ist.psu.edu/document?doi=ac9cfb36d0a2d865c5992539a0a2ee4ecb7d5c11&repid=rep1&type=pdf&utm_source=openai))

## References
- "using_irq_vector_and_masking_interrupts" — expands on machine-specific register writes to gate interrupts