# NMOS 6510 — Dummy-Read Behaviour of Absolute-Indexed Accesses and Practical Exploits

**Summary:** This document details the NMOS 6510/6502 CPU's dummy-read behavior during absolute-indexed addressing modes, particularly when a page boundary is crossed. It includes a timing diagram illustrating the sequence of operations, provides test code listings, and presents concrete examples demonstrating practical exploits such as acknowledging CIA interrupts with a single `LDA $DC1D,X`, creating 5-cycle-wide raster splits, and feeding the VIC-II sprite pattern pipeline.

**Dummy-Read Behaviour (Absolute-Indexed)**

In the NMOS 6502 (6510) CPU, absolute-indexed addressing modes (`ABS,X` or `ABS,Y`) involve a dummy read from the target address before the high byte of the address is corrected when the index causes a page crossing. This behavior results in an additional cycle (page-cross penalty) and can be exploited to access or sample an address on the original page before the effective address is used.

**Timing Diagram:**

The following timing diagram illustrates the sequence of operations for an absolute-indexed read instruction (`LDA $AABB,X`) when a page boundary is crossed:


In this sequence:

- Cycle 4 performs a dummy read from the address before the high byte is incremented.
- Cycle 5 reads from the correct effective address after the high byte is adjusted.

This behavior can be leveraged in various scenarios, such as acknowledging interrupts or synchronizing with the VIC-II chip.

**Zeropage-Indexed Read Ordering**

Zeropage-indexed instructions read from the target address before the index is added. This behavior allows the CPU to read one zeropage location and then use the index for the actual operand, enabling side effects when peripheral registers are placed in zeropage or mirrored ranges.

**Zeropage-Indexed Instructions:**


**Practical Exploit Examples**

The following examples demonstrate practical exploits of the dummy-read behavior:

1. **Acknowledge Both CIA Interrupts with a Single `LDA $DC1D,X`:**

   By performing a `LDA` instruction with an indexed address that crosses a page boundary, the dummy read can access the CIA interrupt control registers, acknowledging pending interrupts.

   **Example:**


   In this example, the dummy read from `$DC0D` acknowledges the interrupt from CIA 1.

2. **Create 5-Cycle-Wide Raster Splits:**

   By carefully ordering `STA`, `LDX`, and `LDY` instructions, one can exploit the dummy-read cycles to create precise timing for raster effects.

   **Example:**


   This sequence ensures that the `STA` instruction's dummy read and the subsequent operations align with the desired raster timing.

3. **Feed the VIC-II Sprite Pattern Pipeline:**

   By issuing `STA VIC_REG,X` instructions timed to the VIC-II's DMA cycles, the dummy read and store operations can be synchronized with sprite fetch windows.

   **Example:**


   Timing this instruction correctly allows the dummy read to coincide with the VIC-II's sprite pattern fetch, effectively feeding the sprite pattern pipeline.

## Source Code

```text
Cycle | Address Bus | Data Bus | Operation
------|-------------|----------|------------------------------
1     | PC          | Opcode   | Fetch opcode
2     | PC+1        | BB       | Fetch low byte of address
3     | PC+2        | AA       | Fetch high byte of address
4     | AABB+X      | Data     | Dummy read from original page
5     | AABB+X+256  | Data     | Read from corrected address
```

```text
ADC zp,X
AND zp,X
CMP zp,X
EOR zp,X
LDA zp,X
ORA zp,X
SBC zp,X
STY zp,X
```

   ```assembly
   LDA $DC0D,X  ; Dummy read acknowledges CIA 1 interrupt
   ```

   ```assembly
   STA $D020,X  ; Store to border color register
   LDX #$00     ; Load X with 0
   LDY #$00     ; Load Y with 0
   ```

   ```assembly
   STA $D027,X  ; Store to sprite color register
   ```


```assembly
; Example: Acknowledge CIA 1 interrupt with dummy read
LDA $DC0D,X  ; Dummy read acknowledges CIA 1 interrupt

; Example: Create 5-cycle-wide raster splits
STA $D020,X  ; Store to border color register
LDX #$00     ; Load X with 0
LDY #$00     ; Load Y with 0

; Example: Feed VIC-II sprite pattern pipeline
STA $D027,X  ; Store to sprite color register
```

## Key Registers

- **$D000-$D02E**: VIC-II registers (sprite registers, control, raster, etc.)
- **$DC00-$DC0F**: CIA 1 registers (port, timer, interrupt control)
- **$DD00-$DD0F**: CIA 2 registers (port, timer, interrupt control)

## References

- "indexed_instructions_dummy_read_on_page_cross" — expands on dummy-read-on-page-cross exploits
- "vicii_sprite_fetch_examples" — expands on VIC-II sprite fetch timing

## Mnemonics
- ADC
- AND
- CMP
- EOR
- LDA
- ORA
- SBC
- STY
