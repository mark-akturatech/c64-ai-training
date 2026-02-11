# 6502 Store & Transfer Instructions (STA, STX, STY, TAX/TAY/TSX/TXA/TXS/TYA)

**Summary:** Opcode tables and behavior for STA/STX/STY (store memory from A/X/Y) and the transfer instructions TAX, TAY, TSX, TXA, TXS, TYA; includes addressing modes (zeropage, zeropage,X/Y, absolute, absolute,X/Y, (indirect,X), (indirect),Y), opcode hex, bytes, cycles, flag effects, assembler notes (forced zeropage), page-boundary and branch-cycle penalties, and the NMOS read-modify-write double-write caveat.

## Instruction behavior and flags
- STA: Store Accumulator to memory. Does not modify processor flags.
- STX: Store X register to memory. Does not modify processor flags.
- STY: Store Y register to memory. Does not modify processor flags.
- TAX/TAY/TSX/TXA/TYA: Transfer register-to-register operations.
  - TAX, TAY, TSX, TXA, TYA: update N (negative) and Z (zero) flags based on result.
  - TXS: transfers X to the stack pointer and does NOT affect any flags.
- Legend for flags in tables: + = modified, - = not modified.
- M6 / M7 notation (from source): M6 = memory bit 6, M7 = memory bit 7 (used where bit numbering of a byte is referenced).

Notes:
- Page-boundary penalty: Certain addressing modes incur an extra cycle if an effective address crosses a page boundary. Applies to:
  - Absolute,X and Absolute,Y addressing for load/store/other instructions that use index-based addressing.
  - (Indirect),Y addressing — extra cycle if the addition of Y to the indirect base crosses a page.
  - The opcode tables show base cycles; add +1 cycle when a page boundary is crossed in these modes.
- Branch penalties: Branch instructions (not in this chunk) have base cycles, +1 if the branch is taken, and +1 additional if the branch target crosses a page boundary.
- Assembler syntax note (forced zeropage): Some assemblers use a notation to force zeropage addressing, e.g. OPC *oper or an extension like .b on the mnemonic (assembler-dependent).
- NMOS read-modify-write (RMW) caveat (NMOS 6502 only): Certain RMW instructions perform an intermediate write of the unmodified value before writing the modified value. This results in two writes to the same memory address (intermediate unmodified write, then final modified write). This can affect external devices that react on writes. CMOS 6502 variants (WDC W65C02, etc.) do not exhibit this double-write behavior.

## Source Code
```text
Opcode table format:
  Mnemonic   Addr Mode         Opcode  Bytes  Cycles  Flags
    Flags legend for transfers: N,Z = updated (+) or not (-)
    For store instructions: flags not affected (-)

STA (Store Accumulator)
  STA  zp         (Zero Page)           $85    2     3    -
  STA  zp,X       (Zero Page,X)         $95    2     4    -
  STA  abs        (Absolute)            $8D    3     4    -
  STA  abs,X      (Absolute,X)          $9D    3     5*   -   (* +1 if page crossed)
  STA  abs,Y      (Absolute,Y)          $99    3     5*   -   (* +1 if page crossed)
  STA  (ind,X)    (Indexed Indirect)    $81    2     6    -
  STA  (ind),Y    (Indirect Indexed)    $91    2     6*   -   (* +1 if page crossed)

STX (Store X register)
  STX  zp         (Zero Page)           $86    2     3    -
  STX  zp,Y       (Zero Page,Y)         $96    2     4    -
  STX  abs        (Absolute)            $8E    3     4    -

STY (Store Y register)
  STY  zp         (Zero Page)           $84    2     3    -
  STY  zp,X       (Zero Page,X)         $94    2     4    -
  STY  abs        (Absolute)            $8C    3     4    -

Transfer instructions (register-register)
  TAX  (A -> X)                          $AA    1     2    N,Z(+)
  TAY  (A -> Y)                          $A8    1     2    N,Z(+)
  TSX  (SP -> X)                         $BA    1     2    N,Z(+)
  TXA  (X -> A)                          $8A    1     2    N,Z(+)
  TXS  (X -> SP)                         $9A    1     2    -  (flags not modified)
  TYA  (Y -> A)                          $98    1     2    N,Z(+)
```

## References
- "note_on_read_modify_write" — expands on the NMOS read-modify-write double-write caveat
- "w65c02_and_implementation_specifics" — differences between NMOS and WDC CMOS variants, undocumented opcode behavior, and enhancements

## Mnemonics
- STA
- STX
- STY
- TAX
- TAY
- TSX
- TXA
- TXS
- TYA
