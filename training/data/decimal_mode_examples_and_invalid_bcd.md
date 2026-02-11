# NMOS 6510 — ADC Decimal-Mode Behaviour and Examples (SED / CLC / LDA / ADC)

**Summary:** Examples demonstrating NMOS 6510 ADC behavior with the Decimal flag (SED), using mnemonics SED, CLC, LDA, ADC, and showing results for invalid BCD nibbles (A–F) and how results can be non-BCD; includes opcode/addressing info for ADC (zp),y ($71).

**Decimal-Mode Behaviour (Concise)**

On the NMOS 6502/6510, when the Decimal flag (D) is set (SED), ADC performs a binary addition and then applies BCD corrections (decimal adjust). If one or both input nibbles are not valid BCD (0–9), the correction step still runs and can produce results that are not valid BCD digits — i.e., the CPU does not validate inputs, and the final byte may be a non-BCD value. The precise adjustment follows the standard NMOS decimal correction: binary add, add 0x06 to the low nibble when the half-carry/low-nibble sum > 9, add 0x60 to the whole byte when needed. The following pseudocode outlines the exact branching and flag details:

Practical notes:

- Use SED to set decimal mode, CLC to clear carry in examples (carry-in = 0).
- ADC (zp),y opcode is $71 (zero page indirect,Y addressing). This opcode uses 2 bytes; typical cycle cost is 5 cycles (+1 on page-cross).
- Examples below demonstrate both valid BCD inputs and inputs with invalid nibbles (A–F), resulting in non-BCD final A and different carry/overflow flag outcomes.

## Source Code

```text
; Pseudocode for ADC in Decimal Mode on NMOS 6502/6510

1. Perform binary addition:
   Temp = A + M + C

2. Set initial flags based on binary result:
   N = Temp.7
   V = (A.7 == M.7) AND (A.7 != Temp.7)
   Z = (Temp == 0)
   C = (Temp > 255)

3. If Decimal flag (D) is set:
   a. Adjust low nibble:
      If (A & 0x0F) + (M & 0x0F) + C > 9:
         Temp += 0x06

   b. Adjust high nibble:
      If Temp > 0x99:
         Temp += 0x60
         C = 1
      Else:
         C = 0

4. Store result:
   A = Temp & 0xFF
```

```asm
; Simple decimal-mode ADC examples (NMOS 6510)
; All examples assume no initial carry (CLC) unless noted.

        SED         ; set decimal mode
        CLC         ; clear carry in

; Example 1: valid BCD inputs -> valid BCD result
        LDA #$15    ; A = $15 (BCD 15)
        ADC #$27    ; A = $15 + $27 => $42 (BCD 42)

; Example 2: invalid low nibble (A)
        SED
        CLC
        LDA #$1A    ; A = $1A (invalid BCD: low nibble = A)
        ADC #$05    ; Binary sum = $1A + $05 = $1F; BCD adjust -> $25 (not $31)

; Example 3: invalid low nibble combined with a carry from low nibble
        SED
        CLC
        LDA #$1A
        ADC #$19    ; Binary sum = $1A + $19 = $33; low-nibble sum >9 -> adjust -> $39

; Example 4: invalid high nibble, overflow into carry
        SED
        CLC
        LDA #$A5    ; invalid high nibble (A)
        ADC #$15    ; Binary sum = $A5 + $15 = $BA
                    ; low nibble 5+5 -> >9 add 6 => $C0; >$99 -> add $60 => $120 -> final $20 with carry set
```

```text
Quick result table (inputs in hex as bytes, final A and carry shown)

Inputs              Binary sum   Decimal-adjust result   Final A   Carry
-----------------   -----------  ---------------------   -------   -----
$15 + $27 (BCD)     $3C          $42                     $42       0
$1A + $05 (inv)     $1F          $25                     $25       0
$1A + $19 (inv)     $33          $39                     $39       0
$A5 + $15 (inv)     $BA          $120 -> low $20         $20       1
```

## References

- "adc_instruction_decimal_mode" — ADC decimal-mode pseudocode and detailed examples

## Mnemonics
- ADC
