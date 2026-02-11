# 256‑Byte Autostart Fast Loader — C64 Receive Routine (Four 2‑Bit Transfers via $DD00)

**Summary:** This Commodore 64 (C64) receive routine samples the CIA‑2 Port A register ($DD00) to assemble a byte from four 2‑bit transfers. It utilizes logical shift right (LSR) and exclusive OR (EOR) operations to combine the bits. The routine reads $DD00, processes bits 6 and 7, and achieves a receive path of 28 CPU cycles per byte, resulting in a theoretical throughput of approximately 35,700 bytes per second at a CPU clock of 1.02 MHz.

**Receiving Routine — How It Works**

The routine reads the CIA‑2 Port A register ($DD00) four times, each time extracting two input bits (bits 6 and 7) and folding them into the accumulator using LSR and EOR instructions. The process assumes that the first read provides the two most significant bits, which are then shifted and combined with subsequent reads to form a complete 8‑bit byte.

Behavior Summary:
- Each cycle involves shifting the accumulated bits down twice (LSR) and then performing an EOR with the new 2‑bit sample from $DD00.
- After four such samples (one initial LDA and three EORs, with interleaved LSRs), the accumulator contains the assembled byte.
- The sequence totals 28 CPU cycles, as detailed in the source code below.
- At a CPU clock speed of 1.02 MHz, this results in a theoretical throughput of approximately 35,700 bytes per second.

## Source Code

```asm
; Receive one byte from peripheral via $DD00 (CIA‑2 Port A)
; Strategy: read 2 bits at a time from $DD00 and assemble into A
; Assumes bits come in pairs at bits 6-7 initially

    LDA $DD00       ; get bits 6-7  (4 cycles)
    LSR             ; shift A right 1 (2 cycles)
    LSR             ; shift A right 1 (2 cycles) -> bits moved to 4-5
    EOR $DD00       ; XOR next 2 bits in (4 cycles)
    LSR             ; shift right (2 cycles)
    LSR             ; shift right (2 cycles)
    EOR $DD00       ; XOR next 2 bits (4 cycles)
    LSR             ; shift right (2 cycles)
    LSR             ; shift right (2 cycles)
    EOR $DD00       ; final 2 bits XORed in (4 cycles)

; Cycle totals: LDA(4) + 2*LSR(4) + EOR(4) + 2*LSR(4) + EOR(4) + 2*LSR(4) + EOR(4)
; => 28 cycles total
```

## Key Registers

- **$DD00**: CIA‑2 Port A Data Register.
  - **Bit 7**: Serial Bus Data Input.
  - **Bit 6**: Serial Bus Clock Pulse Input.
  - **Bit 5**: Serial Bus Data Output.
  - **Bit 4**: Serial Bus Clock Pulse Output.
  - **Bit 3**: Serial Bus ATN Signal Output.
  - **Bit 2**: RS‑232 Data Output (User Port).
  - **Bits 1‑0**: VIC Chip System Memory Bank Select (low active).

## References

- "serial_protocol_overview" — expands on two‑bits‑per‑cycle protocol concept.
- "badline_avoidance" — timing constraints due to VIC‑II DMA that affect this routine.

## Labels
- CIA2_PRA
