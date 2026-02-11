# 6502: CMP/CPX/CPY, BIT, TSB/TRB, WAI and W65C02 NOPs (practical behavior)

**Summary:** This document details the behavior of the CMP, CPX, and CPY instructions in relation to the processor flags Z, C, and N, and how they map to register relations (<, =, >=, >). It also explores the BIT instruction's functionality for testing bits without altering the accumulator, describes the semantics of the TSB and TRB instructions, explains the WAI instruction, and provides notes on the W65C02 processor, including a list of reserved NOP opcodes.

**Compare instructions (CMP / CPX / CPY)**

The CMP, CPX, and CPY instructions perform a subtraction of the memory operand from the respective register (A, X, or Y) without storing the result; they only update the processor flags. The mapping of flags to unsigned relations is:

- **Carry (C):** Set if (Register >= Memory) (no borrow). After CMP, C = 1 means register >= operand (unsigned).
  - Therefore, BCS can be used as "register >= operand".
  - BCC can be used as "register < operand".
- **Zero (Z):** Set if (Register == Memory).
- **Negative (N):** Set to bit 7 of the subtraction result (Register - Memory), reflecting the sign bit of the two's-complement result.

**Notes on signed comparisons:**

- For signed (two's-complement) comparisons, you cannot rely on C alone; use N and V (overflow) together (e.g., test (N XOR V)) as required for signed < / > tests. The mechanics for signed branch decisions depend on the arithmetic result's N and V flags.

**Practical branches (unsigned):**

- `CMP #value; BCS label`  ; branch if A >= value (unsigned)
- `CMP #value; BCC label`  ; branch if A < value  (unsigned)
- `CMP #value; BEQ label`  ; branch if A == value

**BIT instruction — semantics and uses**

The BIT instruction performs a masked test without modifying the accumulator:

- **Operation:** A AND M -> sets Z (zero flag) based on whether the result is zero.
- In addition, BIT copies two bits from the memory operand into flags:
  - M7 -> N (negative flag)
  - M6 -> V (overflow flag)
- The accumulator (A) is not modified.

**Common uses:**

- Test whether specific bits are set in memory without changing A:
  - `BIT $nn` ; Z=1 if (A & M) == 0, and N/V reflect M bits 7/6.
- Test bit patterns and branch using V or N as direct bit checks (useful for status bits stored in a byte).
- Combine with branches: BIT followed by BEQ/BNE (test masked zero), or BVS/BVC/BMI/BPL to inspect the tested memory's high bits.

**Example patterns (short):**

- `BIT $maskAddr ; BEQ no_bits_set ; ...`  (test mask presence)
- `CMP/# and BCS/ BCC for unsigned comparisons as above`

BIT is especially useful to test device/status registers or flags packed into a byte: you can test several bits at once (via mask in A) and also inspect bit 7/bit 6 without changing accumulator contents.

**TSB / TRB (Test and Set / Test and Reset) — W65C02 extensions**

**TSB (Test and Set Memory Bit):**

- **Behavior:** Sets in memory the bits that are 1 in A (M := M OR A).
- **Zero Flag (Z):** Set if any of the bits in A were previously set in M; otherwise, Z is cleared.
- **Net effects:** A AND M -> Z ; A OR M -> M.

**TRB (Test and Reset Memory Bit):**

- **Behavior:** Clears bits in memory that correspond to ones in A (M := M AND (NOT A)).
- **Zero Flag (Z):** Set if any of the bits in A were previously set in M; otherwise, Z is cleared.
- **Net effects:** A AND M -> Z ; M AND (NOT A) -> M.

**Addressing Modes and Timing:**

- **TSB:**
  - Absolute: Opcode 0C, 3 bytes, 6 cycles.
  - Zero Page: Opcode 04, 2 bytes, 5 cycles.
- **TRB:**
  - Absolute: Opcode 1C, 3 bytes, 6 cycles.
  - Zero Page: Opcode 14, 2 bytes, 5 cycles.

*Note: Early versions of the W65C02 implement TRB and TSB only. Instructions BBR, BBS, RMB, and SMB on the W65C02S are as on the Rockwell R6500/11/12/15 family.*

**WAI (Wait for Interrupt)**

- **Function:** Puts the CPU into a low-power state until an IRQ or NMI occurs. Similar to STP but wakes on IRQ/NMI.
- **Flags:** Unaffected by the instruction (N Z C I D V remain unchanged).
- **Opcode:** CB (implied), 1 byte, 3 cycles.

**Reserved NOPs and opcode notes (W65C02)**

- The W65C02 has no undefined opcodes; reserved opcodes execute as NOPs of various sizes and cycle counts.
- These additional NOPs come at various byte sizes and cycle times, listed by their respective instruction codes:

  - **NOP 1 byte, 1 cycle:**
    - 03, 13, 23, 33, 43, 53, 63, 73,
    - 83, 93, A3, B3, C3, D3, E3, F3,
    - 0B, 1B, 2B, 3B, 4B, 5B, 6B, 7B,
    - 8B, 9B, AB, BB, EB, FB
  - **NOP 2 bytes, 2 cycles:**
    - 02, 22, 42, 62, 82, C2, E2
  - **NOP 2 bytes, 3 cycles:**
    - 44
  - **NOP 2 bytes, 4 cycles:**
    - 54, D4, F4
  - **NOP 3 bytes, 4 cycles:**
    - DC, FC
  - **NOP 3 bytes, 8 cycles:**
    - 5C

**Modified Cycle Times (W65C02):**

- **Cycle Penalty for BCD Arithmetic:**
  - For instructions ADC and SBC, the negative flag (N), the overflow flag (V), and the zero flag (Z) are now set correctly for decimal mode. However, this comes at the general cost of an extra cycle for these instructions in BCD arithmetic.
  - Add 1 to any cycle times stated if the processor is currently in decimal mode (D flag = 1).

- **Read-Modify-Write Instructions with Absolute Indexed Addresses:**
  - Execute in one cycle less when remaining within the same memory page.

## Mnemonics
- CMP
- CPX
- CPY
- BIT
- TSB
- TRB
- WAI
- NOP
