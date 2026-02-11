# DCP (undocumented) — DEC+CMP tricks; ISC/ISB/INS overview

**Summary:** DCP is an undocumented NMOS 6502/6510 opcode that performs a decrement on memory followed by a compare between the accumulator and the decremented memory value. This is useful for multi-byte decrements and emulating DEC addressing modes missing from the official instruction set. ISC (also known as ISB or INS) is the complementary undocumented opcode that increments memory and then subtracts it from the accumulator with borrow.

**Description**

- **DCP behavior:** Performs `DEC {addr}` followed by `CMP A,{addr}`. The memory at `{addr}` is decremented, then the accumulator is compared against the new memory value. Flags N, Z, and C are set as they would be for a CMP instruction; V is unaffected.

- **Practical consequence:** After DCP, the carry flag reflects whether the decrement caused an underflow relative to the original accumulator value, allowing for branching tests for borrow when decrementing multi-byte values.

- **DEC addressing-mode gaps:** The official DEC instruction lacks certain addressing modes (e.g., DEC abs,Y and DEC (zp),Y / DEC (zp,X)). DCP exists in these addressing forms, providing DEC-like memory decrement combined with a CMP against the accumulator.

- **ISC/ISB/INS behavior:** Equivalent to `INC {addr}` followed by `SBC A,{addr}`. It increments memory and then subtracts it from the accumulator with borrow, setting flags per SBC semantics.

**Usage examples**

- **Multi-byte decrement (16-bit little-endian):** Load the accumulator with the original low byte before the DCP; after DCP, the carry is clear only if the low byte underflowed (original was $00), so branch to decrement the high byte.


- **Emulating DEC abs,Y:** Use DCP abs,Y form when available. This decrements the absolute,Y addressed memory and sets flags via the implicit CMP against the accumulator.


- **Emulating DEC (zp),Y and DEC (zp,X):**


- **ISC example (increment-then-subtract-with-borrow):**


Notes:

- DCP does not change the accumulator (CMP leaves A intact). Use LDA beforehand to capture the pre-decrement low byte when doing multi-byte arithmetic.

- The CMP half of DCP sets N, Z, C as CMP would; DEC sets the memory and affects the memory byte but does not directly set the carry — the carry comes from the CMP.

- ISC behaves as INC then SBC; SBC uses the processor carry as borrow-in (i.e., SBC subtracts with borrow), so set or clear C appropriately before ISC if you need specific borrow behavior.

## Source Code

```asm
; 16-bit decrement using DCP on low byte
; LABEL = low byte (LSB), LABEL+1 = high byte (MSB)
    LDA LABEL        ; A = original low byte
    DCP LABEL        ; *LABEL = LABEL - 1 ; CMP A, *LABEL -> sets flags
    BCC dec_high     ; if carry clear -> low byte underflowed -> borrow
    ; no borrow -> done
    RTS

dec_high:
    DEC LABEL+1      ; decrement high byte
    RTS
```

```asm
    LDA target_low_value    ; (optionally load A as desired for comparison)
    DCP $2000,Y             ; acts like DEC $2000,Y then CMP A,(new value)
```

```asm
    LDA (ZP_PTR),Y    ; if you need A for comparison, load it appropriately
    DCP (ZP_PTR),Y    ; decrements the indirect,Y target and CMPs against A

    ; Zero-page,X indirect form
    LDA (ZP_PTR,X)
    DCP (ZP_PTR,X)
```

```asm
    ; ISC {addr}  ; semantic: INC {addr} then SBC A,{addr}
    LDA #$05
    SEC                 ; set carry for SBC (no borrow)
    ISC $10             ; memory $10 = $10 + 1 ; A = A - memory - (1 - C)
    ; result flags reflect SBC outcome
```


```asm
; Multi-byte decrement example (16-bit little-endian)
; LABEL = low byte, LABEL+1 = high byte

    LDA LABEL        ; A = original low byte
    DCP LABEL        ; DEC LABEL ; CMP A,LABEL (new value)
    BCC dec_high     ; carry clear -> underflow -> borrow
    RTS

dec_high:
    DEC LABEL+1
    RTS
```

```asm
; Emulating DEC addressing modes with DCP (forms shown as mnemonics)
    ; DEC abs,Y replacement
    LDA SOME_VALUE
    DCP $2000,Y

    ; DEC (zp),Y replacement
    LDA (ZP_PTR),Y
    DCP (ZP_PTR),Y

    ; DEC (zp,X) replacement
    LDA (ZP_PTR,X)
    DCP (ZP_PTR,X)
```

```asm
; ISC (ISB/INS) semantic example: INC {addr} then SBC A,{addr}
    LDA #$10
    SEC
    ISC $0010    ; memory $0010 incremented, then A = A - mem - (1 - C)
```

## Key Registers

- **DCP:**
  - **N (Negative):** Set if the result of the CMP is negative.
  - **Z (Zero):** Set if the result of the CMP is zero.
  - **C (Carry):** Set if the accumulator is greater than or equal to the memory value after decrement.

- **ISC:**
  - **N (Negative):** Set if the result of the SBC is negative.
  - **Z (Zero):** Set if the result of the SBC is zero.
  - **C (Carry):** Set if there is no borrow in the SBC operation.
  - **V (Overflow):** Set if the SBC operation results in signed overflow.

## References

- "6502 Instruction Set" — provides details on undocumented opcodes and their behaviors.

- "NMOS 6510 Unintended Opcodes — No More Secrets" — offers in-depth analysis of unintended opcodes and their effects.

## Mnemonics
- DCP
- ISC
- ISB
- INS
