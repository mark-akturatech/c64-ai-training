# W65C02 Additional Instructions: BBR/BBS, RMB/SMB, BRA, PHX/PHY/PLX/PLY, STP/WAI, STZ, TRB/TSB

**Summary:** This document details the additional instructions introduced in the W65C02 microprocessor, including the BBR (Branch on Bit Reset) and BBS (Branch on Bit Set) families, RMB (Reset Memory Bit) and SMB (Set Memory Bit) instructions, BRA (Branch Always), PHX/PHY/PLX/PLY (push/pull X & Y registers), STP (Stop) and WAI (Wait) low-power modes, STZ (Store Zero), and TRB/TSB (Test and Reset/Set Bits). It provides opcode listings, addressing modes, and cycle counts for these instructions.

**Overview**

The W65C02 microprocessor introduces several instructions not present in the original NMOS 6502, enhancing functionality and efficiency. This document provides detailed information on these instructions, including their opcodes, addressing modes, and cycle counts.

**BBR / BBS (Branch on Bit Reset / Branch on Bit Set)**

The BBR and BBS instructions test a specified bit in a zero-page memory location and branch if the bit is 0 (BBR) or 1 (BBS). Each family consists of eight instructions, corresponding to bits 0 through 7.

**Addressing Mode:** Zero Page, Relative

**Operation:**

- BBR: If the specified bit is 0, branch to the target address.
- BBS: If the specified bit is 1, branch to the target address.

**Opcode and Cycle Details:**

| Instruction | Opcode | Bytes | Cycles |
|-------------|--------|-------|--------|
| BBR0        | 0F     | 3     | 5      |
| BBR1        | 1F     | 3     | 5      |
| BBR2        | 2F     | 3     | 5      |
| BBR3        | 3F     | 3     | 5      |
| BBR4        | 4F     | 3     | 5      |
| BBR5        | 5F     | 3     | 5      |
| BBR6        | 6F     | 3     | 5      |
| BBR7        | 7F     | 3     | 5      |
| BBS0        | 8F     | 3     | 5      |
| BBS1        | 9F     | 3     | 5      |
| BBS2        | AF     | 3     | 5      |
| BBS3        | BF     | 3     | 5      |
| BBS4        | CF     | 3     | 5      |
| BBS5        | DF     | 3     | 5      |
| BBS6        | EF     | 3     | 5      |
| BBS7        | FF     | 3     | 5      |

**RMB / SMB (Reset Memory Bit / Set Memory Bit)**

The RMB and SMB instructions reset (clear) or set a specified bit in a zero-page memory location. Each family consists of eight instructions, corresponding to bits 0 through 7.

**Addressing Mode:** Zero Page

**Operation:**

- RMB: Reset the specified bit in the zero-page memory location.
- SMB: Set the specified bit in the zero-page memory location.

**Opcode and Cycle Details:**

| Instruction | Opcode | Bytes | Cycles |
|-------------|--------|-------|--------|
| RMB0        | 07     | 2     | 5      |
| RMB1        | 17     | 2     | 5      |
| RMB2        | 27     | 2     | 5      |
| RMB3        | 37     | 2     | 5      |
| RMB4        | 47     | 2     | 5      |
| RMB5        | 57     | 2     | 5      |
| RMB6        | 67     | 2     | 5      |
| RMB7        | 77     | 2     | 5      |
| SMB0        | 87     | 2     | 5      |
| SMB1        | 97     | 2     | 5      |
| SMB2        | A7     | 2     | 5      |
| SMB3        | B7     | 2     | 5      |
| SMB4        | C7     | 2     | 5      |
| SMB5        | D7     | 2     | 5      |
| SMB6        | E7     | 2     | 5      |
| SMB7        | F7     | 2     | 5      |

**BRA (Branch Always)**

The BRA instruction performs an unconditional branch to a target address specified by a relative offset.

**Addressing Mode:** Relative

**Operation:** Branch to the target address.

**Opcode and Cycle Details:**

| Instruction | Opcode | Bytes | Cycles |
|-------------|--------|-------|--------|
| BRA         | 80     | 2     | 3      |

**PHX / PHY / PLX / PLY (Push/Pull X & Y Registers)**

These instructions allow pushing and pulling the X and Y index registers to and from the stack.

**Addressing Mode:** Implied

**Operation:**

- PHX: Push the X register onto the stack.
- PHY: Push the Y register onto the stack.
- PLX: Pull (pop) the X register from the stack.
- PLY: Pull (pop) the Y register from the stack.

**Opcode and Cycle Details:**

| Instruction | Opcode | Bytes | Cycles |
|-------------|--------|-------|--------|
| PHX         | DA     | 1     | 3      |
| PHY         | 5A     | 1     | 3      |
| PLX         | FA     | 1     | 4      |
| PLY         | 7A     | 1     | 4      |

**STP / WAI (Stop / Wait)**

The STP and WAI instructions are used for low-power modes and synchronization with external events.

**Addressing Mode:** Implied

**Operation:**

- STP: Stop the processor and enter a low-power state until a reset occurs.
- WAI: Wait for an interrupt; the processor enters a low-power state until an interrupt is received.

**Opcode and Cycle Details:**

| Instruction | Opcode | Bytes | Cycles |
|-------------|--------|-------|--------|
| STP         | DB     | 1     | 3      |
| WAI         | CB     | 1     | 3      |

**STZ (Store Zero)**

The STZ instruction stores a zero value into a specified memory location.

**Addressing Modes:**

- Zero Page
- Zero Page,X
- Absolute
- Absolute,X

**Operation:** Store zero into the specified memory location.

**Opcode and Cycle Details:**

| Addressing Mode | Opcode | Bytes | Cycles |
|-----------------|--------|-------|--------|
| Zero Page       | 64     | 2     | 3      |
| Zero Page,X     | 74     | 2     | 4      |
| Absolute        | 9C     | 3     | 4      |
| Absolute,X      | 9E     | 3     | 5      |

**TRB / TSB (Test and Reset/Set Bits)**

The TRB and TSB instructions test and reset or set bits in a memory location based on the accumulator's value.

**Addressing Modes:**

- Zero Page
- Absolute

**Operation:**

- TRB: Test and reset bits in memory with the accumulator.
- TSB: Test and set bits in memory with the accumulator.

**Opcode and Cycle Details:**

| Instruction | Addressing Mode | Opcode | Bytes | Cycles |
|-------------|-----------------|--------|-------|--------|
| TRB         | Zero Page       | 14     | 2     | 5      |
| TRB         | Absolute        | 1C     | 3     | 6      |
| TSB         | Zero Page       | 04     | 2     | 5      |
| TSB         | Absolute        | 0C     | 3     | 6      |

**JMP (Absolute,X)**

The JMP (Absolute,X) instruction allows for an indirect jump to an address calculated by adding the X register to a base address.

**Addressing Mode:** Absolute Indexed Indirect

**Operation:** Jump to the address located at (Base Address + X).

**Opcode and

## Mnemonics
- BBR
- BBS
- RMB
- SMB
- BRA
- PHX
- PHY
- PLX
- PLY
- STP
- WAI
- STZ
- TRB
- TSB
- JMP
