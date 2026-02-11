# NMOS 6510 — BRK (software interrupt) cycle sequence

**Summary:** Cycle-by-cycle BRK (0x00) sequence for NMOS 6510/6502: opcode fetch, dummy fetch of PC+1 (padding/signature), pushes program counter (high then low) and status (with B flag set) to the stack page ($0100-$01FF), then reads IRQ/BRK vector from $FFFE/$FFFF. Note about RTI/return behavior and the side-effecting opcode fetch after return.

## Cycle sequence and behaviour
BRK is a two‑byte software interrupt (opcode 0x00 + a padding/signature byte). On BRK the CPU:
- Performs the opcode fetch, then a dummy fetch of the next byte (PC+1) — this second read is often used as a "signature" byte by systems.
- Pushes the return address (the address after the BRK + padding — effectively PC+2) onto the stack as two bytes: high then low.
- Pushes the processor status (SR) onto the stack with the Break flag (B, bit 4) set in the value written to the stack.
- Sets the Interrupt Disable flag (I) in the internal status.
- Reads the low then high bytes of the IRQ/BRK vector from $FFFE (low) and $FFFF (high) and loads them into the program counter.

Important details:
- The pushed PC is the return address that RTI will restore; it corresponds to the address after the BRK and its padding byte (i.e., PC+2 at time of push).
- The status byte pushed for BRK has the Break flag set; for hardware IRQ/NMI the pushed B bit differs (BRK sets B=1 in the pushed value).
- After RTI returns, the CPU performs an opcode fetch from the restored PC; that fetch can have side effects if the memory read is mapped (e.g., it can acknowledge a CIA/NMI by reading a location).

## Source Code
```asm
; Example showing RTI side-effect: acknowledging CIA interrupts by the fetch
        JMP $DD0C       ; jump to vector/handler area
; $DD0C:
        RTI             ; return from interrupt at $DD0C
; When RTI restores PC = $DD0C, the next opcode fetch reads $DD0D.
; On C64 this read can acknowledge the NMI at $DD0D (CIA), so placing RTI
; here causes the fetch to perform the acknowledge one cycle earlier than:
;   LDA $DD0D
;   RTI

; BRK cycle reference (conceptual)
; Cycle  Addr             R/W   Data / Action
; 1      PC               R     opcode (BRK = $00)      ; opcode fetch
; 2      PC+1 (dummy)     R     padding/signature byte  ; dummy fetch
; 3      $0100+S          W     PCH pushed to stack
; 4      $0100+(S-1)      W     PCL pushed to stack
; 5      $0100+(S-2)      W     SR (with B=1) pushed
; 6      $FFFE            R     vector low -> PCL
; 7      $FFFF            R     vector high -> PCH
; After cycle 7 PC is loaded from $FFFE/$FFFF and execution continues.
```

## Key Registers
- $FFFE-$FFFF - CPU - IRQ / BRK vector (low/high)
- $0100-$01FF - CPU - Stack page (pushes write to $0100 + S)

## References
- "hardware_interrupts_cycles" — comparison with IRQ/NMI/RESET sequences and timing differences

## Mnemonics
- BRK
