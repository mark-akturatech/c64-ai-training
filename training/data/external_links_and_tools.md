# 6502 Illegal/Undocumented Opcode Behavior, Data-Bus Conflicts, and Pinouts

**Summary:** Analysis of undocumented/illegal 6502 opcodes (LXA, TAS/XAS/SHS $9B, SHA/AHX/AXA, SHX/SHY variants), how competing internal data-bus drivers and addressing-calculation threads produce unstable results (OR/AND/“magic constant”), and a brief NMOS 6502 / WDC 65C02S pinout summary (including pin numbers and positions).

**Undocumented opcode behavior and bus conflicts**
Certain undocumented 6502 opcodes produce results by starting multiple internal micro-operations (threads) that drive outputs or read operands at overlapping times. Examples discussed in the source include:
- LXA: immediate operand and X-register contents compete on the data lines while the accumulator result is also transferred; final transfer goes to A and X.
- TAS (seen as XAS, SHS; opcode $9B): extra cycles for indexed addressing sometimes allow conflicts to resolve without the “magic constant,” but TAS remains unstable.
- SHA (AHX, AXA), SHX (A11, SXA, XAS), SHY (A11, SYA, SAY): involve attempts to put both accumulator and another register on the data bus concurrently while address high-byte calculations for indexed addressing are performed; results are unstable and depend on internal bus contention resolution.

Observed behavior and suggested internal model:
- Competing drivers on internal data lines are effectively AND-ed (zero-dominant) in many observed chips; in some cases an OR-ing with a so-called “magic constant” is seen for certain outputs.
- The source suggests the 6502 uses active-negative internal logic: data lines default high and are pulled low for zero bits; this can explain AND-like outcomes when multiple drivers contend.
- For instructions whose opcode class field c=3 (bits xxxxxx11), the processor may start the threads corresponding to c=1 and c=2 (xxxxxx01 and xxxxxx10) simultaneously; their outputs on internal data lines interact (AND/OR) and the addressing mode is usually taken from the c=1 thread. If one thread stalls/jams, the other can still resolve — hence no dedicated JAM at c=3.
- Final outcomes depend on chip production variations and environmental conditions (timing/race sensitivity), so undocumented instruction behavior is effectively undefined and fragile.

Caveats preserved from the source:
- The described AND/OR behavior and “magic constant” are empirical observations (behavior varies by die revision and conditions).
- SHY can behave like an unimplemented STY abs,X and SHX like STX abs,Y in some chips; SHA can combine LDA abs,X and SHX-like effects.
- These behaviors are undefined by design; they should be treated as hardware-dependent quirks, not reliable operations.

**Pinout summary and datasheet references**
The following are the pin configurations for the NMOS 6502 and WDC 65C02S microprocessors in 40-pin PDIP packages:

**NMOS 6502 Pinout:**

**WDC 65C02S Pinout:**

For detailed information, refer to the original datasheets:

- **NMOS 6502:** MCS6500 Microcomputer Family Hardware Manual, MOS Technology, Inc., 1976.
- **WDC 65C02S:** W65C02S Datasheet, The Western Design Center, Inc.

## Source Code

```text
       +----+--+----+
  VSS  |  1 |  | 40 |  VCC
   RDY |  2 |  | 39 |  PHI2
   Φ1  |  3 |  | 38 |  SO
  IRQ  |  4 |  | 37 |  PHI0
  NMI  |  5 |  | 36 |  SYNC
  SYNC |  6 |  | 35 |  VCC
   VCC |  7 |  | 34 |  R/W
   A0  |  8 |  | 33 |  D0
   A1  |  9 |  | 32 |  D1
   A2  | 10 |  | 31 |  D2
   A3  | 11 |  | 30 |  D3
   A4  | 12 |  | 29 |  D4
   A5  | 13 |  | 28 |  D5
   A6  | 14 |  | 27 |  D6
   A7  | 15 |  | 26 |  D7
   A8  | 16 |  | 25 |  A15
   A9  | 17 |  | 24 |  A14
  A10  | 18 |  | 23 |  A13
  A11  | 19 |  | 22 |  A12
   VSS | 20 |  | 21 |  RES
       +----+--+----+
```

```text
       +----+--+----+
  VPB  |  1 |  | 40 |  RESB
  RDY  |  2 |  | 39 |  PHI2C
 PHI1O |  3 |  | 38 |  SOB
  IRQB |  4 |  | 37 |  PHI2
  MLB  |  5 |  | 36 |  BE
  NMIB |  6 |  | 35 |  NC
  SYNC |  7 |  | 34 |  RWB
   VDD |  8 |  | 33 |  D0
   A0  |  9 |  | 32 |  D1
   A1  | 10 |  | 31 |  D2
   A2  | 11 |  | 30 |  D3
   A3  | 12 |  | 29 |  D4
   A4  | 13 |  | 28 |  D5
   A5  | 14 |  | 27 |  D6
   A6  | 15 |  | 26 |  D7
   A7  | 16 |  | 25 |  A15
   A8  | 17 |  | 24 |  A14
   A9  | 18 |  | 23 |  A13
  A10  | 19 |  | 22 |  A12
  A11  | 20 |  | 21 |  VSS
       +----+--+----+
```

```text
6502 pinout (NMOS) — symbolic signals
VCC       supply voltage (+5 V DC ± 5%, +7 V max.)
VSS       logical ground
Φ0…2      clock
A0 … A15  address bus
D0 … D7   data bus
R/W       read/write (low on write)
RDY       ready
S.O.      set overflow (future I/O interface)
SYNC      sync (goes high on opcode fetch phase)
IRQ       interrupt request (active low)
NMI       non maskable interrupt (active low)
RES       reset (active low)
N.C.      no connection

After: MCS6500 Microcomputer Family Hardware Manual. MOS Technology, Inc., 1976.

WDC 65C02S (40 Pin PDIP) — symbolic signals
VDD       positive supply voltage
VSS       logical ground
Φ1…2      clock
A0 … A15  address bus
D0 … D7   data bus
BE        bus enable
R/W       read/write (low on write)
RDY       ready (bidirectional)
S.O.      set overflow (active low)
SYNC      sync (goes high on opcode fetch phase)
IRQ       interrupt request (active low)
NMI       non maskable interrupt (active low)
RES       reset (active low)
VBP       vector pull
```

## References
- "site_notes_disclaimer_and_tools" — expands on virtual tools and external resources (6502.org, visual6502, WDC, mass:werk)
- "pinouts_and_physical_signals" — expands on datasheets referenced for pinouts

## Mnemonics
- LXA
- TAS
- XAS
- SHS
- SHA
- AHX
- AXA
- SHX
- A11
- SXA
- SHY
- SYA
- SAY
