# Monitor display when entering the MLM

**Summary:** Explains the MLM (machine-level monitor) register display: B* (break), PC (program counter), SR (status register), AC/XR/YR (A/X/Y registers), SP (stack pointer, e.g. next stack address $01F8), and the IRQ field (interrupt vector stored in memory). Includes the period prompt meaning (ready).

## Monitor display
When you enter a machine-level monitor (MLM) you typically see a compact register display showing the CPU internal registers and a prompt. Example fields and meanings:

- B* — the monitor indicates the stop was reached via a break (software or user break). The asterisk commonly marks the break condition.
- PC — program counter value shown is the address of the next instruction to be executed. The monitor reports the PC as where execution will continue; depending on monitor implementation the printed PC may equal the address of the instruction that stopped or the following address (see note below).
- SR — status register (8 bits). Contains the processor flags (N, V, -, B, D, I, Z, C). The monitor prints SR as a byte; to interpret individual flags split into bits.
- AC, XR, YR — accumulator (A) and index registers X and Y contents, printed as hex bytes.
- SP — stack pointer byte. The value printed is the 8-bit stack pointer; for example SP = F8 means the next push will store to memory address $01F8 (stack base $0100 + SP).
- IRQ — sometimes shown by monitors as an extra field; this is not a 6502 internal register but an address (interrupt vector) stored in memory. It is reported for convenience by some monitors but is not part of the 6502 register set.
- Period prompt (.) — the monitor prompt; roughly equivalent to BASIC's READY, indicating the monitor is awaiting a command.

Note: Different monitors format and interpret the display slightly differently (for example whether the PC shown is the address of the stopped instruction or the following address).

## Source Code
```text
B*
    PC  SR AC XR YR SP
.; 0005 20 54 23 6A F8
.
```

## Key Registers
- $01F8 - RAM - example next stack write address when SP = $F8 (stack base $0100 + SP)

## References
- "mlm_commands_reference" — commands available in the monitor (exit .X, memory display .M, run .G, etc.)
- "displaying_memory_and_format" — how memory displays appear and what the hex bytes mean