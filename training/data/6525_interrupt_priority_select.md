# MACHINE - Interrupt Priority Select (IP)

**Summary:** Single-bit Interrupt Priority Select (IP) control (6525 family). IP = 0 selects No Priority mode; IP = 1 selects Interrupts Prioritized mode.

## Description
The Interrupt Priority Select (IP) is a single-bit control that selects how the device resolves multiple interrupt requests. The source enumerates two states only:

- IP = 0 — No Priority  
- IP = 1 — Interrupts Prioritized

The original text does not specify the containing control register or the bit position for IP; consult the referenced chunks for detailed behaviour and the exact register/bit mapping.

**[Note: Source does not specify the register address or bit position for IP.]**

## Source Code
```text
                          Interrupt Priority Select
                          -------------------------
                           +----+       IP = 0  No Priority
                           | IP |
                           +----+       IP = 1  Interrupts Prioritized
```

## References
- "6525_functional_description_IP0_no_priority" — expands on behavior when IP = 0  
- "6525_functional_description_IP1_intro_priority_order" — expands on behavior when IP = 1