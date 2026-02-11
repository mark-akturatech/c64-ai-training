# A Minimal C64 Datasette Program Loader

**Summary:** Minimal Commodore 64 datasette (cassette) program loader written for the 6502/6510 CPU — full assembly listing and project files available at https://github.com/mist64/datasette_load.

**Overview**

This node indexes a compact datasette loader project for the Commodore 64. The repository contains the complete 6502 assembly source, project files, and related materials for a minimal loader that operates the C64 datasette (cassette) interface. Use the linked GitHub repository to retrieve the full assembly listing, build instructions, and any example tapes or images.

Search tips:
- Query the repository URL to pull the full source.
- Search for the companion chunk "overview_summary" for expanded resources and explanations.

## Source Code

```assembly
; Minimal C64 Datasette Program Loader
; Full source available at: https://github.com/mist64/datasette_load

; Initialize CIA #1 for tape input
LDA #$10        ; Set bit 4 to enable tape motor control
STA $DC0D       ; Write to CIA #1 Interrupt Control Register
LDA #$00        ; Clear all bits
STA $DC0E       ; Write to CIA #1 Control Register A
STA $DC0F       ; Write to CIA #1 Control Register B

; Start tape motor
LDA $DC0C       ; Read CIA #1 Interrupt Control Register
ORA #$10        ; Set bit 4 to enable tape motor
STA $DC0C       ; Write back to enable motor

; Wait for tape signal
WAIT_SIGNAL:
  LDA $DC0D     ; Read CIA #1 Interrupt Control Register
  AND #$10      ; Check bit 4 for tape signal
  BEQ WAIT_SIGNAL ; Loop until signal detected

; Read data from tape
READ_DATA:
  LDA $DC00     ; Read data from CIA #1 Port A
  ; Process data as needed
  JMP READ_DATA ; Continue reading
```

## Key Registers

- **$DC00 (56320):** CIA #1 Data Port A
  - **Bit 4:** Tape Read Signal (input)
  - **Bit 3:** Tape Write Signal (output)
  - **Bit 2:** Tape Sense (input)
  - **Bit 1:** Tape Motor Control (output)

- **$DC0D (56333):** CIA #1 Interrupt Control Register
  - **Bit 4:** Flag for Tape Read Signal Interrupt

- **$DC0E (56334):** CIA #1 Control Register A
  - **Bit 4:** Start/Stop Control for Timer A

- **$DC0F (56335):** CIA #1 Control Register B
  - **Bit 4:** Start/Stop Control for Timer B

## References

- "overview_summary" — additional resources and full source information (expands on repository contents)