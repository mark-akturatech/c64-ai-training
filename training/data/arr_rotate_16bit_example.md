# ARR-based 16-bit rotate example (NMOS 6510)

**Summary:** Demonstrates using the undocumented ARR (AND immediate then ROR) opcode to rotate a 16-bit value across two bytes stored in zero-page ($FB/$FC). Shows code sequences and the equivalence between ARR #$00 and an explicit LDA #$00 / ROR sequence; notes how the final Carry can be influenced by the immediate used.

## Example and explanation
This chunk shows a compact sequence that rotates a 16-bit quantity across two consecutive zero-page bytes by using ARR to combine an AND-immediate with a ROR in one opcode (ARR = A AND imm, then ROR A). The example stores the low/high bytes into $FC/$FB; the ARR variant behaves the same as explicitly clearing A and performing ROR, but the final Carry flag can be affected by the immediate value used and by A's bit 7 when using ARR with #$80.

Key points preserved from the source:
- ARR performs A = A & imm, then ROR A (undocumented/illegal opcode behavior).
- Using ARR #$00 after storing $FC is equivalent to LDA #$00 followed by ROR before storing $FB (for the shown case).
- The final Carry flag can be influenced:
  - By loading A with #$00 or #$01 before an explicit ROR (affects result).
  - By using different immediates with ARR (e.g. #$00 or #$80), but ARR #$80 only behaves as expected if A has bit 7 set — so take care when relying on that behavior.

## Source Code
```asm
; ARR-based 16-bit rotate (stores high/low bytes at $FC/$FB)
    LDA #>addr
    LSR
    STA $fc
    ARR #$00      ; A = A & #$00 -> then ROR A
    STA $fb

; Equivalent explicit sequence:
    LDA #>addr
    LSR
    STA $fc
    LDA #$00
    ROR
    STA $fb

; Note from source:
; You can influence the final state of the carry by using #$00 or #$01 for the LDA
; (or #$00 or #$80 in case of ARR — the latter only if A has bit 7 set, so be careful).
```

## Key Registers
- (none) — this chunk describes a code technique using zero-page stores ($FB/$FC), not hardware registers; no chip register ranges included.

## References
- "arr_opcode_flags_and_table" — expands on ARR flags and the mapping table used to understand ARR effects on multi-byte rotates
- "arr_load_register_depending_on_carry" — another example of exploiting ARR's effect on Carry for control flow or data loading