# 6520 PIA — Functional Configuration (Figure I.1)

**Summary:** 6520 PIA (Peripheral Interface Adapter) functional block: two 8-bit peripheral data ports and four control/interrupt lines connected to a 650x microprocessor data/control bus; programmable data-direction per bit and four selectable control modes for each control line.

## Functional overview
The 6520 provides two independent 8-bit peripheral data ports and four control/interrupt lines. The chip sits between the microprocessor data/control bus and peripheral devices (printers, displays, etc.), routing data and control signals.

- Each of the 16 peripheral data lines (two 8-bit ports) is individually programmable as input or output (data-direction programmable per bit).
- There are four control/interrupt lines; each line may be programmed into one of four control modes (selectable behavior per control line).
- The microprocessor programs the data directions and control modes during system initialization, allowing flexible I/O and control schemes for connected peripherals.
- The diagram (Figure I.1) illustrates the conceptual data/control flow: 650x microprocessor ⇄ 6520 PIA ⇄ peripheral devices.

## References
- "6520_pia_overview" — expanded PIA explanation and functions
