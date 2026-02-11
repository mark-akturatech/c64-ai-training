# KERNAL SECOND ($FF93)

**Summary:** SECOND is a KERNAL call at $FF93 (65427) that sends a secondary address to an I/O device after LISTEN; uses A (accumulator) for the secondary address and, for serial-bus devices, the secondary address must be ORed with $60.

## Description
Purpose: Send a secondary address to an I/O device that has been commanded to LISTEN.

- Call address: $FF93 (hex) / 65427 (decimal)
- Communication register: A (accumulator holds the secondary address)
- Preparatory routine: LISTEN must be called first
- Cannot be used after TALK
- Typical use: provide setup or command information to a device before I/O
- Serial-bus requirement: when addressing a device on the serial bus, the secondary address must first be ORed with $60
- Error returns: see READST (status/error reporting routine)
- Stack requirements: 8
- Registers affected: A

How to use:
1. Load the accumulator with the secondary address to be sent (OR with $60 first if sending on the serial bus).
2. JSR $FF93 (JSR SECOND).

Example usage is provided in the Source Code section.

## Source Code
```asm
; ADDRESS DEVICE #8 WITH COMMAND (SECONDARY ADDRESS) #15
    LDA #8
    JSR LISTEN
    LDA #15
    JSR SECOND
```

## Key Registers
- $FF93 - KERNAL - SECOND: Send secondary address for LISTEN (call $FF93 / 65427)

## References
- "listen_kernal_routine" — expands on LISTEN; SECOND must be used after LISTEN
- "READST" — describes error/status returns for KERNAL I/O routines

## Labels
- SECOND
