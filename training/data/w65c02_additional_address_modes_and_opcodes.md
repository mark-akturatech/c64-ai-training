# W65C02: (zeropage) indirect addressing and (absolute,X) JMP — additional opcodes and modes

**Summary:** Describes WDC W65C02(S) extensions: the (zeropage) indirect addressing mode (syntax: (oper)) and the (absolute,X) indirect mode for JMP; lists opcodes/bytes/cycles for several accumulator and zeropage-indirect forms (ADC (oper), AND (oper), BIT variants, CMP (oper), DEC A, ROR variants). Mentions the 2004 datasheet cycle-count error for JMP (oper,X).

**Additional address modes (W65C02)**
The W65C02 adds two address modes beyond NMOS 6502:

- (zeropage) / (oper)
  - Operand is a zeropage address LL; the effective 16-bit target is the word stored at addresses (LL) and (LL+1).
  - Provides zeropage indirection without indexing (equivalent to other indirect modes with index = 0).
  - Extends several accumulator instructions so they accept memory via zeropage indirection: ADC, AND, CMP, EOR, LDA, ORA, SBC, STA.

- (absolute,X) / (oper,X)
  - Operand is a 16-bit absolute address $HHLL; X is added to this base before reading the 16-bit target word from memory: effective address = word at ($HHLL + X) and ($HHLL + 1 + X).
  - Implemented for JMP only (provides an indexed-indirect-style JMP where X is added to the absolute operand before indirection).

**Instructions and opcode excerpts (from source)**
The following entries are reproduced from the provided material: opcodes, byte counts, and cycle counts as shown in the source. These cover accumulator/zeropage indirection forms and selected related opcodes.

- ROR (Rotate Right)
  - accumulator    ROR A            6A   1 byte  2 cycles
  - zeropage       ROR oper         66   2 bytes 5 cycles
  - zeropage,X     ROR oper,X       76   2 bytes 6 cycles
  - absolute       ROR oper         6E   3 bytes 6 cycles
  - absolute,X     ROR oper,X       7E   3 bytes 7 cycles

- ADC (Add Memory to Accumulator with Carry)
  - (zeropage)     ADC (oper)       72   2 bytes 5 cycles
  - Operation: A + (ZPG) + C -> A ; Flags: N Z C I D V (as usual)

- AND (Logical AND with Accumulator)
  - (zeropage)     AND (oper)       32   2 bytes 5 cycles

- BIT (Test Bits in Memory with Accumulator)
  - immediate      BIT #oper        89   2 bytes 2 cycles
  - absolute,X     BIT oper,X       3C   3 bytes 4 cycles  (*marked with asterisk in source)
  - zeropage       BIT oper         24   2 bytes 3 cycles
  - zeropage,X     BIT oper,X       34   2 bytes 4 cycles
  - Operation/flags: A AND M -> Z ; M7 -> N ; M6 -> V

- CMP (Compare Memory with Accumulator)
  - (zeropage)     CMP (oper)       D2   2 bytes 5 cycles

- DEC (Decrement by One — Accumulator form)
  - accumulator    DEC A            3A   1 byte  2 cycles

- EOR (Exclusive-OR Memory with Accumulator)
  - (zeropage)     EOR (oper)       52   2 bytes 5 cycles
  - immediate      EOR #oper        49   2 bytes 2 cycles
  - zeropage       EOR oper         45   2 bytes 3 cycles
  - zeropage,X     EOR oper,X       55   2 bytes 4 cycles
  - absolute       EOR oper         4D   3 bytes 4 cycles
  - absolute,X     EOR oper,X       5D   3 bytes 4 cycles
  - absolute,Y     EOR oper,Y       59   3 bytes 4 cycles
  - (zeropage,X)   EOR (oper,X)     41   2 bytes 6 cycles
  - (zeropage),Y   EOR (oper),Y     51   2 bytes 5 cycles

- JMP (Jump)
  - absolute       JMP oper         4C   3 bytes 3 cycles
  - (absolute)     JMP (oper)       6C   3 bytes 5 cycles
  - (absolute,X)   JMP (oper,X)     7C   3 bytes 6 cycles

- INC (Increment Memory by One)
  - accumulator    INC A            1A   1 byte  2 cycles
  - zeropage       INC oper         E6   2 bytes 5 cycles
  - zeropage,X     INC oper,X       F6   2 bytes 6 cycles
  - absolute       INC oper         EE   3 bytes 6 cycles
  - absolute,X     INC oper,X       FE   3 bytes 7 cycles

- LDA (Load Accumulator)
  - immediate      LDA #oper        A9   2 bytes 2 cycles
  - zeropage       LDA oper         A5   2 bytes 3 cycles
  - zeropage,X     LDA oper,X       B5   2 bytes 4 cycles
  - absolute       LDA oper         AD   3 bytes 4 cycles
  - absolute,X     LDA oper,X       BD   3 bytes 4 cycles
  - absolute,Y     LDA oper,Y       B9   3 bytes 4 cycles
  - (zeropage,X)   LDA (oper,X)     A1   2 bytes 6 cycles
  - (zeropage),Y   LDA (oper),Y     B1   2 bytes 5 cycles
  - (zeropage)     LDA (oper)       B2   2 bytes 5 cycles

- ORA (Logical Inclusive OR with Accumulator)
  - immediate      ORA #oper        09   2 bytes 2 cycles
  - zeropage       ORA oper         05   2 bytes 3 cycles
  - zeropage,X     ORA oper,X       15   2 bytes 4 cycles
  - absolute       ORA oper         0D   3 bytes 4 cycles
  - absolute,X     ORA oper,X       1D   3 bytes 4 cycles
  - absolute,Y     ORA oper,Y       19   3 bytes 4 cycles
  - (zeropage,X)   ORA (oper,X)     01   2 bytes 6 cycles
  - (zeropage),Y   ORA (oper),Y     11   2 bytes 5 cycles
  - (zeropage)     ORA (oper)       12   2 bytes 5 cycles

- SBC (Subtract Memory from Accumulator with Borrow)
  - immediate      SBC #oper        E9   2 bytes 2 cycles
  - zeropage       SBC oper         E5   2 bytes 3 cycles
  - zeropage,X     SBC oper,X       F5   2 bytes 4 cycles
  - absolute       SBC oper         ED   3 bytes 4 cycles
  - absolute,X     SBC oper,X       FD   3 bytes 4 cycles
  - absolute,Y     SBC oper,Y       F9   3 bytes 4 cycles
  - (zeropage,X)   SBC (oper,X)     E1   2 bytes 6 cycles
  - (zeropage),Y   SBC (oper),Y     F1   2 bytes 5 cycles
  - (zeropage)     SBC (oper)       F2   2 bytes 5 cycles

- STA (Store Accumulator)
  - zeropage       STA oper         85   2 bytes 3 cycles
  - zeropage,X     STA oper,X       95   2 bytes 4 cycles
  - absolute       STA oper         8D   3 bytes 4 cycles
  - absolute,X     STA oper,X       9D   3 bytes 5 cycles
  - absolute,Y     STA oper,Y       99   3 bytes 5 cycles
  - (zeropage,X)   STA (oper,X)     81   2 bytes 6 cycles
  - (zeropage),Y   STA (oper),Y     91   2 bytes 6 cycles
  - (zeropage)     STA (oper)       92   2 bytes 5 cycles

Additional note from source:
- The W65C02 features 69 instructions and 16 address modes (one counted as stack mode). The W65C02 adds 14 new instructions and 2 address modes (detailed above). The G65SC02 is similar but does not implement the bit-manipulation instructions.

**[Note: Source may contain an error — the 2004 WDC datasheet is noted in the source as having an erroneous cycle count for JMP (oper,X).]**

## Source Code

## Mnemonics
- ROR
- ADC
- AND
- BIT
- CMP
- DEC
- EOR
- JMP
- INC
- LDA
- ORA
- SBC
- STA
