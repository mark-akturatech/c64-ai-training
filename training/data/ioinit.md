# IOINIT ($FF84) - KERNAL (Real $FDA3)

**Summary:** KERNAL entry IOINIT initializes CIA chips and SID master volume, configures memory mapping, and establishes the system interrupt timer. No input/output parameters; clobbers A and X registers. Real ROM address: $FDA3. See SCINIT for VIC-II init and IOBASE ($FFF3) for CIA base address.

**Description**
IOINIT is a KERNAL initialization routine that performs low-level hardware setup during system bootstrap. Its documented actions are:
- Initialize CIA chips (bring peripheral timers/interrupts and I/O lines into a known state).
- Set SID master volume to a defined startup level.
- Configure memory mapping (bank switching / RAM/ROM I/O configuration).
- Establish the interrupt timer used by the system (set up a repeating interrupt source).

Calling/usage summary:
- No parameters are passed or returned.
- The routine uses (and therefore may modify) registers A and X.
- Real ROM entry point for this routine is $FDA3; the logical KERNAL vector is $FF84.
- Related KERNAL routines: SCINIT (VIC-II initialization) and IOBASE ($FFF3) which returns the CIA base address.

Behavioral details (from source): brief high-level actions only; the routine is part of the KERNAL init sequence that prepares CIA, SID, and memory before higher-level initialization.

## Source Code
```assembly
; IOINIT routine at $FDA3
IOINIT:
    SEI                     ; Disable interrupts
    LDA #$7F
    STA $DC0D               ; Disable all CIA #1 interrupts
    STA $DD0D               ; Disable all CIA #2 interrupts
    LDA #$00
    STA $DC0E               ; Stop CIA #1 Timer A
    STA $DC0F               ; Stop CIA #1 Timer B
    STA $DD0E               ; Stop CIA #2 Timer A
    STA $DD0F               ; Stop CIA #2 Timer B
    LDA #$FF
    STA $DC02               ; Set CIA #1 Data Direction Register A to output
    STA $DC03               ; Set CIA #1 Data Direction Register B to output
    STA $DD02               ; Set CIA #2 Data Direction Register A to output
    STA $DD03               ; Set CIA #2 Data Direction Register B to output
    LDA #$00
    STA $DC00               ; Clear CIA #1 Port A
    STA $DC01               ; Clear CIA #1 Port B
    STA $DD00               ; Clear CIA #2 Port A
    STA $DD01               ; Clear CIA #2 Port B
    LDA #$0F
    STA $D418               ; Set SID volume to 0
    LDA #$35
    STA $01                 ; Set memory configuration: I/O and KERNAL ROM enabled
    LDA #$7F
    STA $DC0D               ; Clear CIA #1 interrupt control register
    LDA #$81
    STA $DC0E               ; Set CIA #1 Timer A control register: continuous mode
    LDA #$4E
    STA $DC04               ; Set CIA #1 Timer A low byte
    LDA #$C4
    STA $DC05               ; Set CIA #1 Timer A high byte
    LDA #$01
    STA $DC0D               ; Enable CIA #1 Timer A interrupt
    CLI                     ; Enable interrupts
    RTS                     ; Return from subroutine
```

## Key Registers
- $FF84 - KERNAL - IOINIT vector (logical entry)
- $FDA3 - KERNAL ROM - IOINIT real address (ROM offset)
- $FFF3 - KERNAL - IOBASE (returns CIA base address; related)

## References
- "scinit" — VIC-II initialization (SCINIT)
- "io_base" — CIA base address returned by IOBASE ($FFF3)

## Labels
- IOINIT
