# 6520 Peripheral A — CA1 / CA2 control (CRA bits)

**Summary:** CA1 is an input-only interrupt line that sets CRA bit 7 on an active transition (polarity chosen by CRA bit 1). CA2 can be either an interrupt input (CRA bit 5 = 0) that sets CRA bit 6 on an active transition (polarity chosen by CRA bit 4), or an output (CRA bit 5 = 1) with pulse, handshake, or simple set/reset modes (pulse: CRA bit 4 = 0 and CRA bit 3 = 1; simple output: CRA bit 4 = 1, CRA bit 3 selects level). Interrupts are routed through /IRQA when CRA bit 0 = 1.

## Operation

- CA1
  - Input-only interrupt line.
  - An active transition on CA1 sets bit 7 (interrupt flag) of Control Register A (CRA) to 1.
  - Polarity selection: CRA bit 1 selects which transition is "active" (CRA bit 1 = 0 → negative transition; CRA bit 1 = 1 → positive transition).
  - If CRA bit 0 = 1 (IRQA enable), setting the CRA bit 7 flag can generate an interrupt on /IRQA.

- CA2 (general)
  - CA2 can function either as an interrupt input or as a peripheral-control output depending on CRA configuration.
  - When CA2 is configured as an input (CRA bit 5 = 0), an active transition (polarity selected by CRA bit 4) sets bit 6 of CRA (the CA2 interrupt flag) to 1. If enabled, this flag may cause /IRQA to assert (see CRA bit 0).
  - When CA2 is configured as an output (CRA bit 5 = 1), multiple output modes are available:
    - Pulse-on-read mode: configured by CRA bit 4 = 0 and CRA bit 3 = 1 — CA2 generates a short pulse each time the processor reads the Peripheral A data port (useful to clock counters/shift registers that present sequential data).
    - Handshake mode: described as a second output mode (used with CA1). In this scheme CA1 notifies the CPU that data is available; the CPU reads the data and then drives CA2 low to signal the peripheral it may present new data. (The source documents this behavior but does not give the explicit CRA bit combination for this handshake mode.)
    - Simple output mode: when CRA bit 4 = 1, CA2 becomes a simple output whose logical level is set by CRA bit 3 (CRA bit 3 = 1 → CA2 high; CRA bit 3 = 0 → CA2 low).

- Interrupt routing
  - CA1 sets CRA bit 7; CA2 (when input) sets CRA bit 6. These flags are the peripheral-side interrupt flags.
  - CRA bit 0 controls whether the set interrupt(s) will generate /IRQA to the processor (if CRA bit 0 = 1, the corresponding flag can cause an interrupt).

**[Note: Source may contain OCR artifacts such as "CRA, bit 51" which is interpreted here as "CRA, bit 5 = 1".]**

## Source Code
```text
Control Register A (CRA) — bit summary (from source)
Bit 7  - CA1 interrupt flag: set to 1 on CA1 active transition
Bit 6  - CA2 interrupt flag: set to 1 on CA2 active transition (when CA2 is input)
Bit 5  - CA2 direction/mode: 0 = CA2 as input interrupt; 1 = CA2 as output
Bit 4  - CA2 transition/pulse/simple-output selector:
           - When CA2 is input: selects active transition (polarity) for CA2 interrupt
           - When CA2 is output: 0 selects pulse/handshake output modes; 1 selects simple output mode
Bit 3  - CA2 output control:
           - In pulse-on-read mode: bit 3 = 1 (with bit 4 = 0) selects pulse generation on each read of Port A
           - In simple output mode (bit 4 = 1): bit 3 = 1 => CA2 high; bit 3 = 0 => CA2 low
Bit 2  - (no detail in source)
Bit 1  - CA1 transition/polarity selector: 0 = negative transition triggers CA1 flag; 1 = positive transition
Bit 0  - IRQA enable: if 1, setting CA1/CA2 interrupt flags may cause /IRQA

Mode examples (as stated in source)
- CA1 interrupt polarity: CRA bit 1 = 0 → negative, = 1 → positive.
- CA2 as input interrupt: CRA bit 5 = 0; active transition chosen by CRA bit 4; sets CRA bit 6.
- CA2 pulse-on-read output: CRA bit 5 = 1, CRA bit 4 = 0, CRA bit 3 = 1.
- CA2 simple output: CRA bit 5 = 1, CRA bit 4 = 1, CRA bit 3 sets level (1=high, 0=low).

Behavioral notes from source:
- CA1 is strictly input-only and only sets CRA bit 7 on its active transition.
- CA2 input mode mirrors CA1 behavior for CRA bit 6 and uses CRA bit 4 for active transition selection.
- Handshake mode (CA1 + CA2) is described: CA1 interrupts CPU when data ready; CPU reads data and then CA2 is driven low to allow peripheral to prepare next data.
```

## Key Registers
- (None — this chunk documents 6520 PIA control lines; per schema non-C64 chips omit Key Registers.)

## References
- "control_of_irqa" — expands on CRA bit interactions and how reads clear flags