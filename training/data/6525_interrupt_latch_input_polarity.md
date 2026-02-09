# 6525 Tri‑Port Interface — Interrupt latch polarity vs Interrupt Enable (IE) bits

**Summary:** Describes 6525 Tri‑port interface behavior: I4 and I3 interrupt latches follow their IE bits (IE4/IE3) — set on negative edges when IE=0 and on positive edges when IE=1; I2, I1, I0 latches are always set on negative transitions. Mentions ILR (Interrupt Latch Register) and AIR (Active Interrupt Register).

## Behavior
- I4 and I3 latches are polarity‑selected by their corresponding Interrupt Enable bits:
  - If IE4 (IE3) = 0, the I4 (I3) latch is set on a negative transition of the I4 (I3) input.
  - If IE4 (IE3) = 1, the I4 (I3) latch is set on a positive transition of the I4 (I3) input.
- All other interrupt latches (I2, I1, I0) are set on negative transitions of their respective inputs.
- "Set" here means the input is recorded in the Interrupt Latch Register (ILR) (Interrupt Latch Register), and latched inputs are then considered by the Active Interrupt Register (AIR) (Active Interrupt Register).

## Source Code
```text
Behavior table — 6525 interrupt latch triggers

Input | IE bit | Latch trigger
------|--------|-----------------------------
I4    | IE4=0  | set on negative transition
I4    | IE4=1  | set on positive transition
I3    | IE3=0  | set on negative transition
I3    | IE3=1  | set on positive transition
I2    | n/a    | set on negative transition
I1    | n/a    | set on negative transition
I0    | n/a    | set on negative transition
```

```text
Pseudocode (reference)

# on any input transition:
if input == I4:
    if IE4 == 0 and transition == negative:
        ILR.I4 = 1
    elif IE4 == 1 and transition == positive:
        ILR.I4 = 1

if input == I3:
    if IE3 == 0 and transition == negative:
        ILR.I3 = 1
    elif IE3 == 1 and transition == positive:
        ILR.I3 = 1

# I2, I1, I0 always latch on a negative transition:
for input in [I2, I1, I0]:
    if transition == negative:
        ILR.<input> = 1
```

## References
- "6525_interrupt_latch_register_ILR" — how latched inputs are recorded in ILR
- "6525_active_interrupt_register_AIR" — how latched interrupts become active in AIR