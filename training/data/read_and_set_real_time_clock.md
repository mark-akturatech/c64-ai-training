# Jiffy Clock Read / Set Routines (C64 ROM $F6DD–$F6EC)

**Summary:** Read and set the jiffy clock zero-page bytes $A0–$A2; entry points at $F6DD (read) and $F6E4 (set). Both routines disable interrupts with SEI; the set routine stores A/X/Y into $A2/$A1/$A0, then re-enables interrupts with CLI and returns.

**Description**

- **Read entry ($F6DD):** Disables interrupts (SEI) and loads the current jiffy clock bytes into A/X/Y:
  - LDA $A2 → A = jiffy low byte
  - LDX $A1 → X = jiffy mid byte
  - LDY $A0 → Y = jiffy high byte
  
  The read routine is designed to return the three bytes in A/X/Y with interrupts disabled, ensuring the caller reads a consistent snapshot.

- **Set entry ($F6E4):** Disables interrupts (SEI), stores A/X/Y into the zero-page jiffy bytes, re-enables interrupts (CLI), then returns (RTS):
  - STA $A2 → save jiffy low byte
  - STX $A1 → save jiffy mid byte
  - STY $A0 → save jiffy high byte
  - CLI → enable interrupts
  - RTS → return to caller

- **Zero-page mapping (used by these routines):**
  - $A2 = jiffy low (least-significant) byte
  - $A1 = jiffy mid byte
  - $A0 = jiffy high (most-significant) byte

## Source Code

```asm
                                *** read the real time clock
.,F6DD 78       SEI             disable the interrupts
.,F6DE A5 A2    LDA $A2         get the jiffy clock low byte
.,F6E0 A6 A1    LDX $A1         get the jiffy clock mid byte
.,F6E2 A4 A0    LDY $A0         get the jiffy clock high byte
.,F6E4 60       RTS             return to caller

                                *** set the real time clock
.,F6E5 78       SEI             disable the interrupts
.,F6E6 85 A2    STA $A2         save the jiffy clock low byte
.,F6E8 86 A1    STX $A1         save the jiffy clock mid byte
.,F6EA 84 A0    STY $A0         save the jiffy clock high byte
.,F6EC 58       CLI             enable the interrupts
.,F6ED 60       RTS             return to caller
```

## Key Registers

- $A0–$A2 – Zero page – Jiffy clock high/mid/low bytes

## References

- "increment_jiffy_clock_and_keyboard_sampling" — expands on the increment routine that updates these jiffy clock bytes