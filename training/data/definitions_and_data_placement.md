# Program organization: macros, system definitions, RAM variables, and data placement

**Summary:** Guidelines on structuring a Commodore 64 assembly program, including the use of macro libraries (MACLIB), system definition files (SYSDEF), early definition of RAM variables, and organizing data placement with a jump to the program start. Emphasizes compatibility with the Commodore Macro Assembler and notes that assembler-specific adjustments may be necessary.

**Program-start checklist**

- **Macro Library (MACLIB):** Store commonly used macros in a separate file named `MACLIB`. This approach conserves editor space and prevents storage of unused macros. The macros in `MACLIB` are designed for the Commodore Macro Assembler but may require slight modifications for other assemblers.

- **System Definition File (SYSDEF):** Create a file named `SYSDEF` that assigns symbolic names to the machine's hardware registers. Defining these registers at the outset promotes familiarity with the hardware and provides symbols for use throughout the program.

- **RAM Variables:** Define labels and equates for RAM locations intended for program variables before writing the majority of the program. These definitions can be initially incomplete and expanded as the program develops; it's common to add RAM definitions iteratively during development.

**Data placement and program start address**

- **Data Before Code:** Place program data immediately before the code section. Insert an unconditional jump to the first instruction of your code before the first byte of data. This structure ensures a stable program start address regardless of changes in the size of the preceding data section. The data section should encompass all non-code data, such as tables, strings, and constants.

**Practical notes**

- **SYSDEF References:** The `SYSDEF` file's register names are referenced throughout the source examples in the original material; consult the `SYSDEF` listing when reviewing other code.

- **Assembler Compatibility:** Expect to modify provided macros if switching assemblers, as the `MACLIB` is tailored for the Commodore Macro Assembler.

## Source Code

Below is the complete source listing for the macro library file `MACLIB` (Listing C-1):

```assembly
; MACLIB - Macro Library for Commodore 64 Assembly Programming

; Macro to pull interrupt
.MAC IPULL
    LDA #$FF
    STA VIRQ
    PLA
    TAY
    PLA
    TAX
    PLA
    RTI
.MND

; Macro to kill the operating system
.MAC KILL
    SEI
    LDA #$06
    STA PORT ; Disconnect BASIC
    LDA #$90
    STA CIANT1
    STA CIANT2
    LDA CIANT1
    LDA CIANT2
    LDA #$00
    STA $DC02 ; Joystick enable
    STA $DC03
    STA $DC0E ; Kill timers
    STA $DC0F
    STA $DD9E
    STA $DD0F
    LDA #$01
    STA VIRQM ; Raster interrupt only
    LDA #$FF
    STA VIRQ ; Clear video interrupts
    LDX #$02
    LDA #$00
CLEAR_LOOP:
    STA $00,X ; Clear page 0
    INX
    BNE CLEAR_LOOP
    LDX #$FF
    TXS
    JMP NMINV
.MND

; Macro to load address
.MAC ADRES ; SOURCE, DEST
    LDA #<SOURCE
    STA DEST
    LDA #>SOURCE
    STA DEST+1
.MND

; Macro to increment two-byte value
.MAC DBINC ; TWO BYTE INC
    LDA VALUE
    CLC
    ADC #1
    STA VALUE
    LDA #$00
    ADC VALUE+1
    STA VALUE+1
.MND
```

Below is the complete source listing for the system definition file `SYSDEF` (Listing C-2):

```assembly
; SYSDEF - System Definition File for Commodore 64

; Zero Page Addresses
PORT    = $0001 ; Processor Port
VIRQ    = $0314 ; Vector for IRQ
VIRQM   = $0315 ; Vector for IRQ (MSB)
NMINV   = $0318 ; Vector for NMI

; CIA 1 Registers
CIANT1  = $DC0D ; CIA 1 Timer A Control
CIANT2  = $DC0E ; CIA 1 Timer B Control

; CIA 2 Registers
CIANT1B = $DD0D ; CIA 2 Timer A Control
CIANT2B = $DD0E ; CIA 2 Timer B Control
```

To demonstrate the "jump before data" pattern, consider the following example:

```assembly
; Example of Jump Before Data Pattern

    JMP START ; Unconditional jump to program start

; Data Section
DATA:
    .BYTE $00, $01, $02, $03, $04, $05

; Code Section
START:
    ; Program code begins here
    LDX #$00
LOOP:
    LDA DATA,X
    ; Process data...
    INX
    CPX #6
    BNE LOOP
    RTS
```

In this structure, the `JMP START` instruction ensures that execution begins at the `START` label, bypassing the data section. This arrangement maintains a consistent entry point regardless of changes to the data section's size.

## References

- "program_organization_overview" — expands on macro and system definitions as initial parts of a program

## Labels
- PORT
- VIRQ
- VIRQM
- NMINV
- CIANT1
- CIANT2
- CIANT1B
- CIANT2B
