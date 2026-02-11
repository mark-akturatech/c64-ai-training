# 6525 Tri-Port Interface (TPI)

**Summary:** 6525 Tri-Port Interface (TPI) — three 8-bit ports (PRA, PRB, PRC) with a Control Register (CR), Active Interrupt Register (AIR), and Data Direction Register C (DDRC) usable as an interrupt mask when MC=1; CA/CB outputs support handshake, pulse and manual modes; PRC supports a priority-interrupt/handshake mode.

## Concept
The 6525 provides two dedicated 8-bit I/O ports (A and B) and a third 8-bit port (C) that is either a general I/O port or a mixed-purpose port for handshaking and priority interrupt inputs depending on CR.MC. In interrupt mode (MC=1) PRC, DDRC and AIR implement five prioritized interrupt inputs (I0–I4), associated handshake outputs (CA, CB), and an active-interrupt register. CA/CB outputs behave similarly to the CA2/CB2 outputs of the 6520.

## CA, CB Functional Description
CA and CB are configurable outputs controlled via the Control Register (CR) bits CA1/CA0 and CB1/CB0. Modes:

- Handshake modes: CA and CB can be used to signal peripheral devices on read/write transitions (CA for Read A Data, CB for Write B Data).
- Pulse Output modes: CA or CB generate a ~1 ms pulse on a CPU read/write action.
- Manual Output modes: CA/CB can be forced low or high by control bits.

(The CA/CB lines follow the same functional patterns as CA2/CB2 on the 6520.)

## Interrupt Mask Register Description
When MC = 1 (Interrupt Mode), DDRC serves as the interrupt mask register (bits M4..M0 correspond to I4..I0). If a mask bit Mx = 0, that corresponding interrupt input Ix is disabled — latched interrupts on that input will not be transferred to AIR and will not cause IRQ to go low. An interrupt latch can be cleared by writing a zero to the corresponding I bit in PRC.

## Port Register C Description
Port C functions depend on MC:

- MC = 0: PRC is a standard parallel I/O port (PC7..PC0).
- MC = 1: PRC is mapped as follows: CB, CA, /IRQ, I4, I3, I2, I1, I0 (bit 7..0). /IRQ is the aggregated interrupt request output (active low). I0–I4 are the priority interrupt inputs (latched).

When MC=1, DDRC bits (M4..M0) are used to mask (enable/disable) the corresponding I inputs as described above.

## Interrupt Edge Control
Bits IE4 and IE3 in CR select the active edge (rising/falling as implemented) that the interrupt latch recognizes for the corresponding inputs (I4 and I3). (The source specifies IE4 and IE3 are used to determine the active edge; other IE bits are not listed.)

## Source Code
```text
Register Map (RS2 RS1 RS0 -> Register)
+----+----+----+-----+------+-----------------------------------------------+
|RS2 |RS1 |RS0 |REG  |NAME  | DESCRIPTION                                   |
+----+----+----+-----+------+-----------------------------------------------+
| 0  | 0  | 0  |R0   |PRA   | Port Register A                               |
| 0  | 0  | 1  |R1   |PRB   | Port Register B                               |
| 0  | 1  | 0  |R2   |PRC   | Port Register C                               |
| 0  | 1  | 1  |R3   |DDRA  | Data Direction Register A                      |
| 1  | 0  | 0  |R4   |DDRB  | Data Direction Register B                      |
| 1  | 0  | 1  |R5   |DDRC  | Data Direction Register C / Interrupt Mask Reg |
| 1  | 1  | 0  |R6   |CR    | Control Register                               |
| 1  | 1  | 1  |R7   |AIR   | Active Interrupt Register                      |
+----+----+----+-----+------+-----------------------------------------------+
```

```text
6525 Control Registers (bit layouts)

CR (Control Register)
+-----+-----+-----+-----+-----+-----+-----+-----+
| CB1 | CB0 | CA1 | CA0 | IE4 | IE3 | IP  | MC  |
+-----+-----+-----+-----+-----+-----+-----+-----+

AIR (Active Interrupt Register)
           | A4  | A3  | A2  | A1  | A0  |
           +-----+-----+-----+-----+-----+

DDRC (When MC=1)
           | M4  | M3  | M2  | M1  | M0  |
           +-----+-----+-----+-----+-----+

PRC (When MC=1)
+-----+-----+-----+-----+-----+-----+-----+-----+
| CB  | CA  | /IRQ| I4  | I3  | I2  | I1  | I0  |
+-----+-----+-----+-----+-----+-----+-----+-----+
```

```text
PRC When MC = 0
+-----+-----+-----+-----+-----+-----+-----+-----+
| PC7 | PC6 | PC5 | PC4 | PC3 | PC2 | PC1 | PC0 |
+-----+-----+-----+-----+-----+-----+-----+-----+
```

```text
CA Output Modes
CA1 CA0   MODE         DESCRIPTION
0   0     Handshake    CA set high on an active transition of the I3
                     interrupt signal and set low by a microprocessor
                     "Read A Data" operation (positive control of data flow).
0   1     Pulse Output CA goes low for 1 ms after a "Read A Data" operation.
1   0     Manual       CA set low.
1   1     Manual       CA set high.
```

```text
CB Output Modes
CB1 CB0   MODE         DESCRIPTION
0   0     Handshake    CB set low on microprocessor "Write B Data"
                     operation and set high by an active transition of
                     the I4 interrupt input signal (positive control of data flow).
0   1     Pulse Output CB goes low for 1 ms after a microprocessor "Write B Data"
                     operation.
1   0     Manual       CB set low.
1   1     Manual       CB set high.
```

Notes from source:
- In interrupt mode, DDRC bits Mx = 0 disable the corresponding interrupt input Ix; a latched Ix will not transfer to AIR nor assert IRQ.
- Interrupt latch can be cleared by writing a zero to the corresponding I bit in PRC.
```

## References
- (none)

## Labels
- PRA
- PRB
- PRC
- DDRA
- DDRB
- DDRC
- CR
- AIR
