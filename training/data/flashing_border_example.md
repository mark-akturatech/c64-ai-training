# Flashing the Border — INC $D020 loop

**Summary:** Tiny demo that repeatedly increments the VIC-II border colour register $D020 using INC and an infinite JMP loop (assembled with *=$1000). Covers INC semantics vs explicit LDA/ADC/STA sequence and mentions $D021 (background colour).

## Description
A minimal machine-code demo that cycles the C‑64 border through colour values by incrementing the VIC-II border register at $D020 in a tight loop. Assembled origin is set to *=$1000 (Turbo Assembler syntax). The loop uses INC (memory increment) and JMP to repeat forever until reset or RESTORE.

## How it works / semantics
- INC $D020 performs an in-place increment of the byte stored at address $D020 (no affect on the A register). Functionally equivalent to the sequence LDA $D020; ADC #$01; STA $D020, except INC does not set the carry from the increment in the same way as ADC and does not affect the A register.
- JMP loop transfers execution back to the label "loop", creating an endless loop that repeatedly updates the border colour.
- $D020 is a VIC‑II memory‑mapped register (border colour). Changing its low 4 bits selects one of 16 colours; writing values beyond that wraps modulo 256 but only the colour bits are used by the VIC-II hardware.
- $D021 is the background (screen) colour register; writing it will change the background instead of the border.

## Source Code
```asm
* = $1000        ; assemble origin (Turbo Assembler syntax)

loop:
    INC $D020    ; increment VIC-II border colour register
    JMP loop     ; infinite loop
```

Alternative explicit form (behaviourally similar; affects A and flags differently):
```asm
* = $1000

loop:
    LDA $D020
    ADC #$01
    STA $D020
    JMP loop
```

(Use RESTORE or reset to break out when running on real hardware or an emulator.)

## Key Registers
- $D020-$D021 - VIC-II - Border colour ($D020) and background/screen colour ($D021)

## References
- "why_c64_vic" — VIC register $D020 controls border colour
- "using_a_monitor" — how to enter and run short machine code examples

## Labels
- $D020
- $D021

## Mnemonics
- INC
