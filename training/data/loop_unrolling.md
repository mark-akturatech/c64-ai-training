# Loop unrolling: INC table,X → INC table+N (6502 / C-64)

**Summary:** Example of loop unrolling on the 6502: replacing a 256-iteration LDX/INC table,X/DEX/BNE loop (7+2+3 = 12 cycles/iter, total 3074 cycles including setup) with a static unrolled sequence of INC table+N (6 cycles each) to halve execution time at the cost of ~768 bytes (3 pages) of code. Searchable terms: 6502, INC absolute, INC absolute,X, DEX, BNE, LDX, cycles, loop unrolling, raster time.

**Loop unrolling**
Loop unrolling eliminates per-iteration loop overhead (counter update and branch) by emitting the loop body repeatedly with fixed absolute addresses. The example uses INC on an absolute table address and shows the exact cycle counts for both the looping and unrolled approaches.

- Looped version uses indexed absolute INC (INC table,X), DEX and BNE with an initial LDX #$00.
- Unrolled version replaces INC table,X repeated 256 times with 256 absolute INC instructions: INC table, INC table+1, ... INC table+255.

Keep the addressing semantics in mind: the loop relies on INC absolute,X (7 cycles) indexing through 256 sequential absolute addresses; the unrolled code uses INC absolute (6 cycles) for each distinct address.

**Cycle and size calculations**
- Instruction cycle counts used here (6502):
  - LDX #imm = 2 cycles (setup)
  - INC abs,X = 7 cycles (indexed absolute INC)
  - DEX = 2 cycles
  - BNE (taken) = 3 cycles
  - INC abs = 6 cycles (absolute INC)

- Looped version:
  - Per iteration: INC table,X (7) + DEX (2) + BNE (3) = 12 cycles.
  - Setup LDX #$00 = 2 cycles.
  - Total for 256 iterations: 256 * 12 + 2 = 3074 cycles.

- Unrolled version (static absolute INC for each byte):
  - Per instruction: INC table+N = 6 cycles.
  - Total for 256 instructions: 256 * 6 = 1536 cycles.

- Code size (unrolled):
  - INC absolute is a 3-byte instruction (opcode + 16-bit address).
  - 256 * 3 bytes = 768 bytes = 3 pages (256 bytes/page).

- Result: unrolling halves the execution time for this exact case (3074 → 1536 cycles) at the cost of ~768 bytes of ROM/RAM.

## Source Code
```asm
; Looped version (indexed absolute INC)
        LDX #$00        ; 2 cycles (setup)
loop:
        INC table,X     ; 7 cycles (INC absolute,X)
        DEX             ; 2 cycles
        BNE loop        ; 3 cycles (branch back while X != 0)

; Total cycles: 256 * (7+2+3) + 2 = 3074 cycles
```

## Mnemonics
- LDX
- INC
- DEX
- BNE
