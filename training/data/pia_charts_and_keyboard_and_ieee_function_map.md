# PIA (6520) Port Maps — PIA1 $E810-$E813 (Keyboard/Cassette) and PIA2 $E820-$E823 (IEEE-488)

**Summary:** Port mapping and per-bit function overview for 6520 PIAs used in this system: PIA1 at $E810-$E813 (keyboard matrix row select, keyboard input, tape sense, cassette motor, retrace latch, interrupt controls) and PIA2 at $E820-$E823 (IEEE-488 signals: /ATN, /SRQ, /NDAC, NRFD, IEEE input/output lines). Contains original printed PIA charts (bit-field diagrams) — note some bit assignments in the source are unclear.

**Port mapping and notes**

- **PIA1 ($E810-$E813):** Handles keyboard and cassette/tape interface functions.
  - **Registers:**
    - **$E810:** Diagnostic sense/uncrash, EOI input, tape sense #1/#2, keyboard row select.
    - **$E811:** Tape #1 input latch, screen blank (original ROM), EOI out, DDRA access, tape #1 input control.
    - **$E812:** Keyboard input for selected row.
    - **$E813:** Retrace latch, cassette #1 motor output, DDRB access, retrace interrupt control.
  - **Functions:**
    - Diag Sense/Uncrash
    - EOI In
    - Tape Sense #1/#2
    - Keyboard Row Select
    - Tape #1 Input
    - Tape #1 Latch
    - Screen Blank (original ROM)
    - EOI Out
    - Keyboard Input (selected row)
    - Retrace Latch
    - Cassette #1 Motor Output
    - Retrace Interrupt Control
    - DDRA/DDRB access markers
  - **Note:** The printed chart is hard to read; exact per-bit assignments are uncertain.

- **PIA2 ($E820-$E823):** Manages IEEE-488 (GPIB) interface signals.
  - **Registers:**
    - **$E820:** IEEE-488 input.
    - **$E821:** /ATN interrupt, /NDAC out, DDRA access, /ATN interrupt control.
    - **$E822:** IEEE-488 output.
    - **$E823:** /SRQ interrupt, cassette #1 motor output, DDRB access, /SRQ interrupt control.
  - **Functions:**
    - /ATN Int
    - /SRQ Int
    - /NDAC Out
    - NRFD
    - /DAV
    - Cassette #1 Motor Output
    - DDRA/DDRB access markers
  - **Note:** DDRA/DDRB access and interrupt control annotations are present for the PIA2 registers.

- **6522/VIA Excerpt ($E840-$E844):** Shows additional bus/IEEE and tape-related signals.
  - **Registers:**
    - **$E840:** /DAV in, /NRFD in, retrace in, tape #2 motor, tape output, /ATN out, NRFD out, /NDAC in.
    - **$E841:** Unused (See $E84F).
    - **$E842:** Data Direction Register B (for $E840).
    - **$E843:** Data Direction Register A (for $E84F).
    - **$E844:** (Incomplete in source).
  - **Note:** Some registers are unused, and separate Data Direction Registers control the ports.

- **Implementation Caveat:** The original printed diagrams were noted as difficult to read; some bit-to-function mappings may be off by one or two bit positions. Treat these charts as a reference to likely signal-to-pin relationships rather than guaranteed bit-level definitions.

## Source Code
```text
                                                                  6520
      +-------+-------+-------+-------+-------+-------+-------+-------+
      | Diag  |       |  Tape Switch  |                               |
$E810 |Sense/ |EOI In |     Sense     |      Keyboard Row Select      | 59408
      |Uncrash|       |  #1      #2   |                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
      |Tape #1|       |    (Screen Blank--    | DDRA  | Tape #1 Input |
$E811 |  In   |       |     Original ROM)     |Access |   L Control   | 59409
      | Latch |       |        EOI Out        |       |               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
      |                                                               |
$E812 |                Keyboard Input for Selected Row                | 59410
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
      |Retrace|       |   Cassette #1 Motor   | DDRB  |    Retrace    |
$E813 | Latch |       |        Output         |Access |   Interrupt   | 59411
      |       |       |                       |       |    Control    |
      +-------+-------+-------+-------+-------+-------+-------+-------+

 Figure C.1
 PIA 1 Chart
```

```text
                                                                  6520
      +-------+-------+-------+-------+-------+-------+-------+-------+
      |                                                               |
$E820 |                        IEEE-488 Input                         | 59424
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
      | /ATN  |       |                       | DDRA  |   /ATN Int    |
$E821 |  Int  |       |       /NDAC Out       |Access |    Control    | 59425
      |       |       |                       |       |               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
      |                                                               |
$E822 |                        IEEE-488 Output                        | 59426
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
      | /SRQ  |       |   Cassette #1 Motor   | DDRB  |   /SRQ Int    |
$E823 |  Int  |       |        Output         |Access |    Control    | 59427
      |       |       |                       |       |               |
      +-------+-------+-------+-------+-------+-------+-------+-------+

 Figure C.2
 PIA 2 Chart
```

```text
                                                                        :173:

                                                                  6522
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E840 | /DAV  | /NRFD |Retrace|Tape #2| Tape  | /ATN  | NRFD  | /NDAC | 59456
      |  In   |  In   |  In   | Motor |Output |  Out  |  Out  |  In   |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E841 |                       Unused (See E84F)                       | 59457
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E842 |             Data Direction Register B (for E840)              | 59458
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E843 |             Data Direction Register A (for E84F)              | 59459
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E844 |                                                               | 59460
```

## Key Registers
- **PIA1 ($E810-$E813):**
  - **$E810:** Diagnostic sense/uncrash, EOI input, tape sense #1/#2, keyboard row select.
  - **$E811:** Tape #1 input latch, screen blank (original ROM), EOI out, DDRA access, tape #1 input control.
  - **$E812:** Keyboard input for selected row.
  - **$E813:** Retrace latch, cassette #1 motor output, DDRB access, retrace interrupt control.

- **PIA2 ($E820-$E823):**
  - **$E820:** IEEE-488 input.
  - **$E821:** /ATN interrupt, /NDAC out, DDRA access, /ATN interrupt control.
  - **$E822:** IEEE-488 output.
  -