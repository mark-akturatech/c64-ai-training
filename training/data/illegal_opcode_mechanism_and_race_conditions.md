# 6502 illegal opcodes: concurrent c=1 and c=2 micro-threads (c=3) — origin and effects

**Summary:** Explains how illegal/undocumented 6502 opcodes arise when the opcode low bits = 3 (c = 3 / aaabbb11): the decoder activates micro-threads for c=1 and c=2 concurrently, their outputs are AND-ed on internal data lines, producing combined/partial operations; covers JAM (timing failure), NOP-like results, unstable/magic-constant behavior, and lists example opcodes observed (ANE $8B, LXA $AB, TAS $9B, SHA/SHX/SHY H+1).

## How undocumented opcodes appear (mechanism)
On many NMOS 6502 implementations the 8-bit opcode is interpreted as aaabbbcc (bits 7–0). The low two bits (c = 0..3) select micro-routine families; legitimate opcodes use c = 0,1,2 while c = 3 columns are undefined in the official instruction set.

- Instruction layout: aaabbbcc (a = bits 7–5, b = bits 4–2, c = bits 1–0).
- Example mapping: abc = 312 => (3 << 5 | 1 << 2 | 2) = %011.001.10 = $66 (ROR zpg).

When an opcode has c = 3 (bits0–1 = 11), some silicon decoders do not route to a single defined micro-routine; instead the control logic activates (or partially activates) the micro-threads associated with both c = 1 and c = 2. The two concurrently-active micro-threads each drive internal data/control lines; because the hardware wiring ANDs certain outputs, the observed external behavior is a logical combination (commonly an AND) of the two intended operations.

Consequences:
- Combined operations: The visible effect can look like two ops fused (e.g., an arithmetic/logical result influenced by both operand flows).
- NOP-like opcodes: If the two micro-threads correspond to incompatible addressing/mode actions, the net effect may be effectively a NOP (no meaningful state change).
- JAM / bus contention: If both micro-threads drive the same bus lines in opposing ways or violate timing, the CPU can enter a bus-stuck state — a JAM (execution halts, often requiring reset/power cycle).
- Unstable / implementation-dependent results: If lines are contended or only one driver is dominant, the resulting values can depend on silicon revision, temperature, or transient capacitances producing so-called “magic constants” or varying behavior across chips and conditions.

## JAM, NOPs, and unstable instructions (behavioral details)
- JAM (timing failure): Occurs when overlapping micro-threads attempt to drive the same internal bus or control lines in incompatible ways. Because NMOS outputs can fight, the bus can be left in an indeterminate or latched state and instruction sequencing fails. JAMs are implementation-dependent (strength of drivers, pull-ups, etc.).
- NOPs / meaningless combos: When the combined micro-threads address different resources or the ANDing zeros-out meaningful outputs, the net visible effect can be a do-nothing instruction (instruction pointer advances but registers/memory unchanged).
- Unstable / magic-constant behavior: Contention or partial activation of data paths can yield reproducible but undocumented constants as outputs (e.g., a pulled-up line reading as 1 or an open-drain resolving to 0 depending on chip). These constants vary with revision and temperature.

## Examples and well-known illegals (summary, not exhaustive)
The following are examples commonly observed on NMOS 6502 families; they are given here as examples of illegal opcode outcomes tied to combined micro-thread behavior rather than formal, architected instructions. The source material identifies these specific opcodes as illustrative:

- ANE ($8B) — observed as an undocumented logical/combined operation (commonly cited in literature as combining AND/OR-like behavior with A/X and immediate).
- LXA ($AB) — another fused/combined-opcode example (observed effects differ by chip family).
- TAS ($9B) — observed to store A & X into memory and set the stack pointer in various implementations.
- SHA / SHX / SHY family — exhibit “H+1” behaviors in some chip revisions: writes to memory sometimes store (high-byte+1) or otherwise altered values due to partial arithmetic logic being engaged by the concurrent micro-threads.

Caveat: precise opcode semantics vary by NMOS revision; WDC (W65C02) and some CMOS clones either define behavior for formerly illegal opcodes or prevent the simultaneous micro-thread activation that causes the NMOS illegals.

## Notes on status register / stack example (source excerpt)
A small assembly-driven example in the source demonstrates push/pull interactions and the bias of bits 4 and 5 when viewing pushed SR (emulators often display SR with bits 4 and 5 forced set):

- The material highlights that emulators commonly display SR with bits 4 and 5 on (a $30 bias) because pushed status bytes include those bits as “virtual” flags. The example omits that bias to show raw pushed bits.

Practical note included in source (preserved exactly): most emulators display SR in the state as it would be currently pushed to the stack, with bits 4 and 5 on, adding a bias of $30; the source chooses to omit that virtual presence.

## Source Code
```asm
; small pushed-status example from source (verbatim lines preserved)
              LDA #$32 ;00110010
              PHA  ->  0 0 1 1 0 0 1 0   =  $32
              PLP  <-  0 0 - - 0 0 1 0   =  $02
          3)
              LDA #$C0
              PHA -> 1 1 0 0 0 0 0 0     =  $C0
              LDA #$08
              PHA -> 0 0 0 0 1 0 0 0     =  $08
              LDA #$12
              PHA -> 0 0 0 1 0 0 1 0     =  $12
              RTI
                    SR: 0 0 - - 0 0 1 0  =  $02
                    PC: $C008
```

```text
; 6502 instruction layout and table excerpt (aaabbbcc, c=3 empty/illegal)
          a a a b b b c c
            bit   7 6 5 4 3 2 1 0
                   (0…7)  (0…7) (0…3)

; Example mapping explanation:
; All ROR instructions share a = 3 and c = 2 (3b2) with the address mode in b.
; abc = 312 => ( 3 << 5 | 1 << 2 | 2 ) = %011.001.10 = $66 "ROR zpg".

; Instruction set excerpt grouped by c then a (empty c=3 columns omitted in many tables)
                c          a                                                               b
                                         0               1           2            3                  4     5      6       7
                0          0       $00  BRK impl                $08 PHP impl                 $10   BPL rel   $18 CLC impl
                           1       $20  JSR abs     $24 BIT zpg $28 PLP impl $2C BIT abs     $30   BMI rel   $38 SEC impl
               ...
                          2       $40  RTI impl                   $48  PHA impl   $4C  JMP abs     $50   BVC rel                 $58 CLI impl
                          3       $60  RTS impl                   $68  PLA impl   $6C  JMP ind     $70   BVS rel                 $78 SEI impl
                          4                         $84 STY zpg   $88  DEY impl   $8C  STY abs     $90   BCC rel   $94 STY zpg,X $98 TYA impl
                          5       $A0  LDY #        $A4 LDY zpg   $A8  TAY impl   $AC  LDY abs     $B0   BCS rel   $B4 LDY zpg,X $B8 CLV impl  $BC LDY abs,X
                          6       $C0  CPY #        $C4 CPY zpg   $C8  INY impl   $CC  CPY abs     $D0   BNE rel                 $D8 CLD impl
                          7       $E0  CPX #        $E4 CPX zpg   $E8  INX impl   $EC  CPX abs     $F0   BEQ rel                 $F8 SED impl
                          0       $01  ORA X,ind    $05 ORA zpg   $09  ORA #      $0D  ORA abs     $11   ORA ind,Y $15 ORA zpg,X $19 ORA abs,Y $1D ORA abs,X
                          1       $21  AND X,ind    $25 AND zpg   $29  AND #      $2D  AND abs     $31   AND ind,Y $35 AND zpg,X $39 AND abs,Y $3D AND abs,X
                          2       $41  EOR X,ind    $45 EOR zpg   $49  EOR #      $4D  EOR abs     $51   EOR ind,Y $55 EOR zpg,X $59 EOR abs,Y $5D EOR abs,X
                          3       $61  ADC X,ind    $65 ADC zpg   $69  ADC #      $6D  ADC abs     $71   ADC ind,Y $75 ADC zpg,X $79 ADC abs,Y $7D ADC abs,X
               1
                          4       $81  STA X,ind    $85 STA zpg                   $8D  STA abs     $91   STA ind,Y $95 STA zpg,X $99 STA abs,Y $9D STA abs,X
                          5       $A1  LDA X,ind    $A5 LDA zpg   $A9  LDA #      $AD  LDA abs     $B1   LDA ind,Y $B5 LDA zpg,X $B9 LDA abs,Y $BD LDA abs,X
                          6       $C1  CMP X,ind    $C5 CMP zpg   $C9  CMP #      $CD  CMP abs     $D1   CMP ind,Y $D5 CMP zpg,X $D9 CMP abs,Y $DD CMP abs,X
                          7       $E1  SBC X,ind    $E5 SBC zpg   $E9  SBC #      $ED  SBC abs     $F1   SBC ind,Y $F5 SBC zpg,X $F9 SBC abs,Y $FD SBC abs,X
```

## References
- "revA_ror_bug" — expands on an implementation-specific missing instruction (Rev A ROR)
- "w65c02_extensions_address_modes" — how WDC treats previously illegal opcodes / extends instruction set

## Mnemonics
- ANE
- LXA
- TAS
- SHA
- SHX
- SHY
