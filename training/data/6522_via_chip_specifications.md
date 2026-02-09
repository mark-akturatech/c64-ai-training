# 6522 VIA (Versatile Interface Adapter) — parallel I/O, timers, shift register, interrupts

**Summary:** 6522 VIA registers at $9110-$911F provide two 8-bit parallel ports (Port A, Port B) with data-direction registers and optional handshaking (CA1/CA2, CB1/CB2), two interval timers (T1, T2) with latch/counter semantics and ACR control, an 8-bit shift register (serial I/O), and interrupt control via IFR/IER.

## Port B I/O Register
Port B is an 8-bit programmable I/O port. Each bit can be independently configured as input or output by the Port B Data Direction Register (DDRB). Port B supports:
- Input latching: when the Port B latch-enable bit in the ACR is set, the port’s input pins are latched on the CB1 interrupt event; the CPU reads the latched value until the CB1 flag is cleared.
- Handshaking output: CB2 can be used as a DATA READY signal (driven by the CPU). The external device drives CB1 as DATA ACCEPTED. When CB1 asserts (active transition per PCR), the VIA clears DATA READY (CB2) and sets the CB1 interrupt flag.

Reads/writes to Port B affect CB1/CB2 flags per the PCR configuration (see ACR/PCR in Source Code).

## Port A I/O Register
Port A is an 8-bit programmable I/O port with similar DDR semantics to Port B. Port A supports both read and write handshaking:
- Read handshaking (automatic): CA1 acts as DATA READY input; on an active transition CA1 sets a flag (and optionally an interrupt), CA2 is used as DATA ACCEPTED (output) and can be either pulse or level (controlled by PCR). CA2 is asserted low by the CPU and cleared by the DATA READY signal.
- Write handshaking: CA2 can act as DATA READY (driven on write) and be reset by CA1 transitions (see PCR modes).

When Port A latching is enabled in the ACR, CA1 events latch the input into the port register until the CA1 flag is cleared.

## Data Direction Registers (DDRA, DDRB)
Each port has an 8-bit Data Direction Register. A '1' in a DDR bit configures the corresponding port pin as an output; a '0' configures it as an input. The CPU always reads the register (latched value when latching is enabled), not the pins directly.

## Timer 1 (T1)
T1 is a 16-bit down-counter comprised of two 8-bit latches and a 16-bit counter. The ACR selects T1 modes:
- One-shot or free-running.
- Optional PB7 toggle output on underflow.
Behavior:
- Latches hold values written by the CPU. Writing the high-order latch (Timer 1 high) transfers the latch pair into the counter and resets the T1 interrupt flag (counter begins/decrements).
- After the counter reaches zero the T1 interrupt flag is set and the global IRQ (IFR/IER) may be driven. In free-running mode the latch pair is reloaded automatically; in one-shot mode the counter stops.
- Reading/writing has special semantics (reads can clear the T1 interrupt flag in certain accesses) — see Source Code for exact read/write semantics.

Timer clock: nominally 1 MHz decrement rate (system clock derived).

## Timer 2 (T2)
T2 can operate as:
- One-shot interval timer (counts down internal clock cycles).
- External pulse counter (counts negative pulses on PB6) when selected by ACR.
Behavior:
- T2 is 16-bit (low/high). Writing the high byte loads the counter from latches and clears the T2 interrupt flag.
- Reading the low-order counter clears the T2 interrupt flag (see Source Code).

## Shift Register
8-bit serial shift register can shift in or out through CB1/CB2 under various clock sources selected by ACR bits:
- Disabled, shift-in, shift-out modes.
- Clock sources: Timer 2, system clock (φ2), or external clock (CB2/CB1 depending).
- Modes include free-run and timer-controlled shifts.
Completion of 8 shifts sets the shift interrupt flag (IFR bit).

## Auxiliary Control Register (ACR)
ACR configures:
- Timer 1 mode and PB7 output enable.
- Timer 2 mode (interval or PB6-counting).
- Shift register mode and clock source.
- Port A/B latch enables (CA1/CB1 latch gating for port reads).
Refer to the Source Code block for the full bit-field table and mode combinations.

## Peripheral Control Register (PCR)
PCR configures CA2 and CB2 functions and CA1/CB1 polarity:
- CA2/CB2: select among interrupt input, independent interrupt input, input, independent input, handshake output, pulse output, manual output (force low), manual output (force high).
- CA1/CB1: select edge polarity that sets their respective interrupt flags (active negative or active positive).
PCR bit combinations determine whether reads/writes to ports clear corresponding IFR bits (some modes are "independent" and avoid clearing).

Full enumerations for CB2, CA2, CB1, CA1 behaviors are included in Source Code.

## Interrupts (IFR / IER)
- IFR: interrupt flags for Timer 1, Timer 2, CB1, CB2, shift completion, CA1, CA2, plus a global IRQ status bit that reflects (flag & enable) conditions. Flags are set by events listed in Source Code and cleared by the CPU via specified read/write operations or by clearing IER bits.
- IER: interrupt enable register. Writes to IER use a control bit to set or clear selected bits. Individual bits enable Timer1, Timer2, CB1, CB2, shift, CA1, CA2 interrupts (see Source Code for bit mapping).

## Source Code
```text
Register Map (addresses and descriptions)
+---------+---------------------------+----------+
| ADDRESS |        DESCRIPTION        | REGISTER |
+---------+---------------------------+----------+
|  $9110  | Port B                    | AAAAAAAA |
|  $9111  | Port A (with handshaking) | BBBBBBBB |
|  $9112  | Data Direction B          | CCCCCCCC |
|  $9113  | Data Direction A          | DDDDDDDD |
|  $9114  | Timer 1 (L)               | EEEEEEEE |
|  $9115  | Timer 1 (H)               | FFFFFFFF |
|  $9116  | Timer 1 latch (L)         | GGGGGGGG |
|  $9117  | Timer 1 latch (H)         | HHHHHHHH |
|  $9118  | Timer 2 (L)               | IIIIIIII |
|  $9119  | Timer 2 (H)               | JJJJJJJJ |
|  $911A  | Shift Register            | KKKKKKKK |
|  $911B  | Auxiliary Control         | LLMNNNOP |
|  $911C  | Peripheral Control        | QQQRSSST |
|  $911D  | Interrupt Flags           | UVWXYZab |
|  $911E  | Interrupt Enable          | cdefghij |
|  $911F  | Port A (no handshaking)   | kkkkkkkk |
+---------+---------------------------+----------+

Timer 1 read/write semantics
- Write:
  E ($9114): write Timer1 low-order latch (latch L)
  F ($9115): write Timer1 high-order latch and transfer latches into counter,
             and reset Timer1 interrupt flag (counter is loaded)
  G ($9116): same as E (write low-order latch)
  H ($9117): write Timer1 high-order latch and reset Timer1 interrupt flag
- Read:
  E ($9114): read Timer1 low-order counter and reset Timer1 interrupt flag
  F ($9115): read Timer1 high-order counter
  G ($9116): read Timer1 low-order latch
  H ($9117): read Timer1 high-order latch

Timer 2 read/write semantics
- Write:
  I ($9118): write Timer2 low-order latch
  J ($9119): write Timer2 high-order counter, transfer low-order latch to counter,
            and clear Timer2 interrupt flag
- Read:
  I ($9118): read Timer2 low-order counter and clear Timer2 interrupt flag

Shift register ($911A)
- Controlled by ACR bits 2-4.
- Modes (ACR bits 4-2):
  000 shift disabled
  001 shift-in from CB1 under Timer2 control
  010 shift-in under system clock pulses
  011 shift-in under external clock pulses
  100 free-run (rate by Timer2)
  101 shift-out under Timer2 control
  110 shift-out under system clock pulses
  111 shift-out under external clock pulses

Auxiliary Control Register (ACR) bit fields (LLMNNNOP)
- Bits 7-6 (L): Timer1 control
  00 one-shot mode (PB7 output disabled)
  01 free-running (PB7 output disabled)
  10 one-shot (PB7 output enabled)
  11 free-running (PB7 output enabled)
- Bit 5 (M): Timer2 control
  0 = Timer2 interval one-shot mode
  1 = Timer2 counts pulses on PB6
- Bits 4-2 (N): Shift register control (see shift register modes above)
- Bit 1 (O): Port B latch enable
  0 = Port B register reflects pins
  1 = Port B inputs latched on CB1 interrupt flag set
- Bit 0 (P): Port A latch enable
  0 = Port A register reflects pins
  1 = Port A inputs latched on CA1 interrupt flag set

Peripheral Control Register (PCR) bit fields (QQQRSSST)
- Bits 7-5 (Q): CB2 control (three-bit encoding)
  000 Interrupt Input Mode (CB2 flag set on negative transition; cleared on Port B read/write)
  001 Independent Interrupt Input Mode (negative transition; not cleared by Port B access)
  010 Input Mode (CB2 flag set on positive transition; cleared on Port B access)
  011 Independent Input Mode (positive transition; not cleared by Port B access)
  100 Handshake Output Mode (CB2 set low on Port B write; reset high on CB1 active transition)
  101 Pulse Output Mode (CB2 low for one cycle after Port B write)
  110 Manual Output Mode (CB2 held LOW)
  111 Manual Output Mode (CB2 held HIGH)
- Bit 4 (R): CB1 control (edge polarity)
  0 = CB1 flag set on negative transition (high-to-low)
  1 = CB1 flag set on positive transition (low-to-high)
- Bits 3-1 (S bits 3-1): CA2 control (three-bit encoding)
  000 Interrupt Input Mode (CA2 flag set on negative transition; cleared on Port A access)
  001 Independent Interrupt Input Mode (negative transition; not cleared by Port A access)
  010 Input Mode (CA2 flag set on positive transition; cleared on Port A access)
  011 Independent Input Mode (positive transition; not cleared by Port A access)
  100 Handshake Output Mode (CA2 low on Port A write; reset high on CA1 active transition)
  101 Pulse Output Mode (CA2 low for one cycle after Port A write)
  110 Manual Output Mode (CA2 held LOW)
  111 Manual Output Mode (CA2 held HIGH)
- Bit 0 (T): CA1 control (edge polarity)
  0 = CA1 flag set on negative transition (high-to-low)
  1 = CA1 flag set on positive transition (low-to-high)

Interrupt Flag Register (IFR) — UVWXYZab
- U: IRQ Status (set if any flag AND its IER bit are set)
- V: Timer1 time-out (set on T1 underflow)
  Cleared by: reading Timer1 low-order counter and writing Timer1 high-order latch
- W: Timer2 time-out (set on T2 underflow)
  Cleared by: reading Timer2 low-order counter and writing Timer2 high-order counter
- X: CB1 active transition (per PCR polarity)
  Cleared by: reading or writing Port B (unless PCR independent mode)
- Y: CB2 active transition (per PCR polarity)
  Cleared by: reading or writing Port B (unless PCR independent mode)
- Z: Completion of 8 shifts (shift register)
  Cleared by: reading or writing shift register
- a: CA1 active transition (per PCR polarity)
  Cleared by: reading or writing Port A (unless PCR independent mode)
- b: CA2 active transition (per PCR polarity)
  Cleared by: reading or writing Port A (unless PCR independent mode)

Interrupt Enable Register (IER) — cdefghij
- Bit 7 (c): control for set/clear on write:
  - If bit 7 = 0 then bits 0-6 '1's clear corresponding IER bits
  - If bit 7 = 1 then bits 0-6 '1's set corresponding IER bits
- Bits mapping (bits 6..0 -> d..j):
  d = Timer1 time-out enable
  e = Timer2 time-out enable
  f = CB1 interrupt enable
  g = CB2 interrupt enable
  h = Shift interrupt enable
  i = CA1 interrupt enable
  j = CA2 interrupt enable

Notes on latching behavior
- When Port A/B latch-enable bits in ACR are set, the corresponding CA1/CB1 flag sets will cause the input pins to be sampled and latched. The CPU reads the latched data; the pins may change without affecting the latched contents until the flag is cleared.

Hardware pins referenced
- CA1, CA2 — Port A control pins (handshake / interrupt)
- CB1, CB2 — Port B control pins (handshake / interrupt)
- PB6 — optionally used as external pulse input for Timer2
- PB7 — optional Timer1 toggle output (when enabled in ACR)

```

## Key Registers
- $9110-$911F - 6522 VIA - Port B, Port A (with/without handshaking), DDRB, DDRA, Timer1 (low/high/latches), Timer2 (low/high), Shift Register, Auxiliary Control Register (ACR), Peripheral Control Register (PCR), Interrupt Flags (IFR), Interrupt Enable (IER)