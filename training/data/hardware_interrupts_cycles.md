# NMOS 6510 — Cycle sequence for hardware interrupts (IRQ, NMI, RESET) and abs,X / abs,Y extra-read behavior

**Summary:** Describes NMOS 6510 / 6502 interrupt entry sequence (dummy fetches of PC/PC+1, stack pushes, vector reads) and the extra-read (3a) behavior for absolute,X / absolute,Y addressing where a byte is read from the "pre-corrected" address; notes that RESET does not perform stack writes (R/W remains read). Contains example instruction addressing modes and a cycle-by-cycle table.

**Interrupt entry and dummy-fetch behavior**

- On IRQ / NMI (and BRK/IRQ-like software interrupts), the NMOS 6502 performs dummy fetches of the next PC bytes, pushes the return address and processor status to the stack, then fetches the vector low/high bytes from the appropriate vector addresses. The low/high vector order is low byte first, then high byte.

- RESET differs: the CPU fetches the reset vector but does not perform stack writes during reset entry—the bus remains in read state (R/W high) for the cycles where IRQ/NMI would have written to the stack.

- BRK (software interrupt) and IRQ share the same vector ($FFFE/$FFFF), but BRK pushes the PC+1 and sets the B flag in the pushed status differently—see referenced "stack_software_interrupts_brk" for BRK-specific stack behavior and vector details.

- Visual6502 simulation illustrates these cycles:

  - Interrupt handling sequence:

    - The 6502 performs an interrupt as a 7-cycle instruction sequence which starts with an instruction fetch. The fetched instruction is substituted by a BRK in the IR.

    - IRQ during INC showing the latest point at which an IRQ will affect the next instruction.

    - IRQ during SEI which does take effect before the I bit is set.

    - IRQ one half-cycle later during SEI which does not take effect: I has been set and masks the interrupt.

  - Interrupts colliding:

    - This simulation shows a lost NMI. NMI is brought low when doing an IRQ acknowledge. Specifically, 1/2 cycle before fetching the IRQ vector (cycle 13 phase 2). NMI remains low for 2.5 cycles. NMI returns high on cycle 16 phase 1.

    - The NMI is never serviced. This might be due to #NMIP being automatically cleared after fetching PC high during any interrupt response.

  - Interrupts and changes to I mask bit:

    - Instructions such as SEI and CLI affect the status register during the following instruction, due to the 6502 pipelining. Therefore, the masking of the interrupt does not take place until the following instruction is already underway. However, RTI restores the status register early, and so the restored I mask bit already is in effect for the next instruction.

    - IRQ during CLI (IRQ has no effect on following instruction, interrupt occurs on the one after that.) Described as "effect of CLI is delayed by one opcode."

  - Interrupts during branches:

    - Late NMI (NMI during IRQ handling, causing NMI vector to be fetched and followed.)

    - However, in the last cycle of BNE (branch taken, no page cross), although the IRQ has been asserted and 'do IRQ' has been set true (cycle 6), the 'normal' and INTG lines are not updated. So the CPU continues with the next instruction, also BNE. Again 'do IRQ' is examined and the 'normal' and INTG are updated, but not during the last cycle of the instruction (as per MOS Tech specs) but actually during the next-to-last cycle (see cycle 13). Note if the branch were not taken, it would be the last cycle of the instruction.

    - Perhaps the designers considered cycle 2 of any branch instruction to be the 'natural' end and check 'do IRQ' there... and only there... unless a page boundary is crossed.

    - Now that I think of it, the fact that INTG is set on the second cycle of any branch instruction (regardless if branch is taken or not), means this line is set 1 cycle earlier than normal if the branch does get taken, and 2 cycles earlier than normal if the branch crosses a page boundary.

    - (The above commentary, as a pastebomb, should be revisited and tidied up and reconciled with other sources. If we fail to explain, we can remove our explanations and leave only our evidence.)

  - Resources:

    - Back to parent page Visual6502wiki/6502Observations

    - A taken branch delays interrupt handling by one instruction forum thread on 6502.org

    - A Taken branch before NMI delays NMI execution by one full instruction forum thread on AtariAge

    - CLI - My 8502 is defective ??? forum thread on commodore128.org

    - Effects of SEI and CLI delayed by one opcode? forum thread on 6502.org

    - How can POKEY IRQ Timers mess up NMI timing? forum thread on AtariAge (missed NMI)

    ([nesdev.org](https://www.nesdev.org/wiki/Visual6502wiki/6502_Timing_of_Interrupt_Handling?utm_source=openai))

**abs,X / abs,Y extra-read (cycle 3a) behavior**

- For instructions using absolute indexed addressing (abs,X or abs,Y), the CPU fetch sequence is:

  1. Opcode fetch (PC)

  2. Fetch absolute address low (PC+1)

  3. Fetch absolute address high (PC+2)

  3a. If an index causes a page-crossing, the 6502 performs an extra read from the address formed by the original high byte and (low + index)—i.e., the byte at the target address before the high byte is corrected—this is a read cycle (does not write).

  4. Final read of the data from the corrected (AAH with possible carry-adjusted high byte, AAL+index) effective address.

- The 3a prefetch/read explains observed spurious reads on the bus when a page boundary is crossed by the index. This happens before the high byte is incremented to correct the effective address.

## Source Code

```text
Example addressing-mode instruction list:
LDY abs,x
NOP abs,x
ORA abs,x
ADC abs,y
ORA abs,y
AND abs,y
SBC abs,y
CMP abs,y
SHA abs,y
EOR abs,y
TAS abs,y
LAS abs,y
SHX abs,y
LAX abs,y
STA abs,y
LDA abs,y
LDX abs,y

Cycle timing table (absolute indexed sequence with extra 3a read on page-cross):

Cycle | Address Bus          | Data Bus                            | R/W
1     | PC                   | Opcode fetch                        | R
2     | PC + 1               | Absolute Address Low                | R
3     | PC + 2               | Absolute Address High               | R
3a (*)| < AAH, AAL + IL >    | Byte at target address before high byte corrected | R
4     | AA (corrected addr)  | Data                                | R

Notes:
- (*) cycle 3a occurs when the indexed addition to the low byte overflows, causing a page-cross; the 6502 performs a read from the pre-corrected address before correcting the high byte.
- RESET: during reset entry the CPU does not write to the stack; the bus remains in read state for those cycles.
```

## Key Registers

- $FFFA-$FFFB - CPU - NMI vector (low/high byte)

- $FFFC-$FFFD - CPU - RESET vector (low/high byte)

- $FFFE-$FFFF - CPU - IRQ/BRK vector (low/high byte)

- $0100-$01FF - CPU - Hardware stack page (push/pop operations use $0100 + S)

## References

- "stack_software_interrupts_brk" — expands on BRK stack behavior and vector fetches

- Visual6502 simulation of 6502 interrupt handling:

  - https://www.nesdev.org/wiki/Visual6502wiki/6502_Timing_of_Interrupt_Handling

- Visual6502 simulation of 6502 interrupt hijacking:

  - https://www.nesdev.org/wiki/Visual6502wiki/6502_Interrupt_Hijacking

- Visual6502 simulation of 6502 interrupt recognition stages and tolerances:

  - https://www.nesdev.org/wiki/Visual6502wiki/6502_Interrupt_Recognition_Stages_and_Tolerances