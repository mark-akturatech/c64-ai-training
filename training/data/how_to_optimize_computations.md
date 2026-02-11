# Optimizing 6502 Computations (C-64 demos)

**Summary:** Techniques for reducing machine cycles in 6502 code: consult opcode cycle tables (addressing-mode dependent), remove unnecessary instructions, substitute faster instruction sequences, use loop unrolling, place frequently used variables in zero page (faster LDA/STA), and use lookup tables to trade memory for cycles.

**How to Optimize Computations**
The primary goal is to decrease the number of machine cycles each computation consumes. Every 6502 instruction requires a specific number of cycles (and that number depends on the addressing mode). To optimize, you must compare cycle costs of alternatives and prefer the sequence that completes the required work with fewer cycles.

Key guidelines:
- Always consult an opcode cycle table (addressing‑mode dependent) before replacing one sequence with another.
- Focus on hot paths (the code executed most frequently) — small savings there give the biggest payoff.
- Favor code-size vs speed tradeoffs deliberately (e.g., loop unrolling increases ROM/RAM usage to save cycle-heavy branches).

**Techniques**
- **Remove unnecessary instructions**
  - Eliminate redundant loads/stores, transfers, and flag-affecting operations that are later overwritten or not used.
- **Substitute faster instruction sequences**
  - Replace multi-instruction idioms with shorter-cycle equivalents when they produce the same result.
- **Loop unrolling**
  - Reduce branch overhead and per-iteration setup by repeating the loop body multiple times, decreasing the number of branch instructions executed.
- **Zero page usage**
  - Store frequently accessed variables on the zero page to use faster zero-page addressing for LDA/STA (shorter effective cycles).
- **Lookup tables**
  - Precompute results and read them from memory to replace expensive arithmetic or branches; this trades memory for fewer cycles.

(Parenthetical notes: “addressing-mode dependent” clarifies that cycle counts vary by addressing mode; “zero page” refers to $0000-$00FF.)

## Source Code
```text
; Example of instruction substitution to optimize code

; Original code
LDA #$00        ; Load immediate value 0 into A
STA $0200       ; Store A into memory location $0200
LDA #$FF        ; Load immediate value 255 into A
STA $0201       ; Store A into memory location $0201

; Optimized code
LDX #$00        ; Load immediate value 0 into X
STX $0200       ; Store X into memory location $0200
DEX             ; Decrement X (X now $FF)
STX $0201       ; Store X into memory location $0201
```

```text
; Example of loop unrolling to optimize code

; Original loop
LDX #$00        ; Initialize X to 0
Loop:
  LDA $0200,X   ; Load value from $0200 + X
  STA $0300,X   ; Store value to $0300 + X
  INX           ; Increment X
  CPX #$10      ; Compare X to 16
  BNE Loop      ; Branch if not equal

; Unrolled loop
LDX #$00        ; Initialize X to 0
  LDA $0200,X   ; Load value from $0200 + X
  STA $0300,X   ; Store value to $0300 + X
  LDA $0201,X   ; Load value from $0201 + X
  STA $0301,X   ; Store value to $0301 + X
  LDA $0202,X   ; Load value from $0202 + X
  STA $0302,X   ; Store value to $0302 + X
  LDA $0203,X   ; Load value from $0203 + X
  STA $0303,X   ; Store value to $0303 + X
  INX           ; Increment X by 4
  INX
  INX
  INX
  CPX #$10      ; Compare X to 16
  BNE Loop      ; Branch if not equal
```
```

## Key Registers
- **A (Accumulator):** General-purpose register used in arithmetic and data operations.
- **X, Y (Index Registers):** Used for indexed addressing and loop counters.
- **P (Processor Status):** Flags indicating the result of operations (Negative, Overflow, Break, Decimal, Interrupt Disable, Zero, Carry).
- **S (Stack Pointer):** Points to the top of the stack in page 1 ($0100-$01FF).
- **PC (Program Counter):** Points to the next instruction to be executed.

## References
- "use_the_zero_page" — expanded discussion and examples of using zero page for faster LDA/STA access
- "loop_unrolling" — expanded examples and benefits of loop unrolling
- "6502 Instruction Set Quick Reference" — opcode cycle table and addressing modes
- "6502 assembly optimisations" — additional optimization techniques and examples
```