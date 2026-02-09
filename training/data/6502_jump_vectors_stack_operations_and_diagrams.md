# 6502 interrupts, vectors and stack layout

**Summary:** Stack memory lives at $0100-$01FF; interrupt vectors are at $FFFA-$FFFF ($FFFA/$FFFB = NMI, $FFFC/$FFFD = RESET, $FFFE/$FFFF = IRQ/BRK). On IRQ/NMI/BRK the 6502 completes the current instruction, pushes the return address and the Processor Status (SR) onto the stack, sets the I flag, and loads the new PC from the relevant vector. The W65C02 clears the Decimal (D) flag on interrupt entry.

## Interrupt entry sequence (behavioral summary)
- The CPU finishes the currently-executing instruction (instructions are not preempted mid-instruction).
- It then performs the interrupt entry microsequence (IRQ/NMI/BRK — reset differs as noted):
  1. Push Program Counter high byte (PCH).
  2. Push Program Counter low byte (PCL).
  3. Push Processor Status (SR). For BRK the pushed SR has the B bit set; for IRQ/NMI the pushed SR has B cleared (B is only a pushed indicator).
  4. Set the Interrupt Disable flag (I = 1).
  5. (W65C02 only) Clear Decimal flag (D = 0) on interrupt entry.
  6. Fetch low and high bytes of the vector (low first) and set PC to that vector address:
     - NMI: read $FFFA (low), $FFFB (high)
     - RESET: read $FFFC (low), $FFFD (high)
     - IRQ/BRK: read $FFFE (low), $FFFF (high)
- After RTI (return from interrupt) the CPU pulls SR, then PCL, then PCH (SR is restored first).

Notes:
- BRK is a software interrupt: it forces the same push sequence but the pushed SR has the B flag set; afterward vectoring uses IRQ/BRK vector ($FFFE/$FFFF).
- RESET (RES) does not push PC/SR; instead it initializes the PC from $FFFC/$FFFD and performs reset initialization (different microsequence).
- RTI pulls SR first, then PCL, then PCH. RTS pulls PCL, then PCH, and then increments the pulled PC by one before resuming (this is why JSR/RTS push/pop values are arranged as they are — see examples).

## How PC and SR are stored on the stack (orders and byte layout)
- Push order for interrupts and JSR: PCH, then PCL, then SR (SR only for interrupts/BRK).
- Memory write uses the 8-bit stack pointer (SP), physical address = $0100 + SP. Each push decrements SP then writes.
- RTI sequence: PLP (pull SR), then pull PCL, then pull PCH.
- RTS sequence: pull PCL, pull PCH, then increment the resulting 16-bit value and load PC.

Example consequences:
- JSR pushes PCH then PCL. RTS pulls PCL then PCH, then increments the value (so JSR stores return address = address of last byte of JSR instruction; RTS increments it to return to the next instruction).
- BRK pushes (PC+2) (the implementation makes the pushed return address point such that RTI/RTS semantics return to the instruction after BRK).

## Stack layout examples
Stack layout diagrams for interrupt entry (IRQ/NMI pushing PCH, PCL, SR), JSR/RTS (pushing PCH, PCL only), and BRK vs IRQ B-flag differences are provided in the Source Code section below. All examples use starting SP = $FF; the 6502 push decrements SP then stores at $0100+SP.

Key points:
- Interrupt entry: SP decrements from $FF to $FC after pushing PCH, PCL, SR (three bytes).
- JSR: SP decrements from $FF to $FD after pushing PCH, PCL (two bytes). RTS pulls PCL then PCH and increments the 16-bit value before resuming.
- BRK pushed SR has B bit = 1; IRQ/NMI pushed SR has B bit = 0. The B flag is not a real persistent processor state — it appears only in pushed SR copies and in PHP.

## Subtle timing notes and NMOS peculiarities
- Interrupt recognition occurs between instructions; the CPU finishes the current instruction before performing the push/vector microsequence.
- Branch instructions:
  - A taken branch costs +1 cycle; if the branch crosses a page boundary it costs an additional +1 cycle. These extra cycles affect when the CPU reaches the inter-instruction boundary where the interrupt will be observed and acted upon.
- Page-crossing and extra-cycle timing can change which instruction completes before an interrupt is serviced — this matters for cycle-precise code and hardware-timed events (raster IRQs, etc.).
- NMOS 6502 hardware quirk: there are well-known edge cases where an NMI asserted during the internal BRK handling (or certain cycles of BRK) can produce unexpected vector selection or ordering; some NMOS devices may appear to “hijack” the BRK/IRQ handling under very specific timing conditions. **[Note: source-level behavior and exact symptom timing varies by NMOS revision and system; test on real hardware if cycle-accurate behavior matters.]**

## Source Code
```text
Stack Layout Diagrams (starting SP = $FF)

Interrupt (IRQ/NMI) entry example:
  Before interrupt:
  $01FF: <free>
  $01FE: <older data>
  $01FD: <older data>
  SP = $FF

  After interrupt pushes (PCH, PCL, SR):
  $01FF: <free>
  $01FE: PCH      ; pushed first (stored at $0100+$FE)
  $01FD: PCL      ; pushed second (stored at $0100+$FD)
  $01FC: SR       ; pushed third (stored at $0100+$FC)
  SP = $FC

  Visual (top = higher addresses):
  $01FF: ...
  $01FE: [PCH]
  $01FD: [PCL]
  $01FC: [SR]    <- new SP points here ($FC)

JSR/RTS example:
  After JSR (pushes PCH then PCL, no SR):
  $01FF: <free>
  $01FE: PCH
  $01FD: PCL
  SP = $FD

  RTS: pulls PCL ($01FD), PCH ($01FE), increments and resumes at address+1.
```

```asm
; 8/16-bit add/sub examples (from source)
        LDA $1001     ; load high byte of first argument
        ADC $1003     ; add high byte of second argument
        STA $1005     ; store high byte of result (result in $1004 and $1005)

; 16-bit subtraction example (low byte then high)
        SEC           ; prepare carry for subtraction
        LDA $1000     ; load low byte of first argument
        SBC $1002     ; subtract low byte of second argument
        STA $1004     ; store low byte of result
        LDA $1001     ; load high byte of first argument
        SBC $1003     ; subtract high byte of second argument
        STA $1005     ; store high byte of result (result in $1004 and $1005)
```

## Key Registers
- $0100-$01FF - Stack memory (pushes/pulls use $0100 + SP).
- $FFFA-$FFFB - VIC/CPU? NMI vector (low/high) — CPU loads PC from here on NMI.
- $FFFC-$FFFD - RESET (RES) vector (low/high) — PC source on reset.
- $FFFE-$FFFF - IRQ/BRK vector (low/high) — PC source on IRQ and BRK.

## References
- "interrupts_and_vectors" — expands on interrupt vector addresses and hardware semantics
- "break_flag_and_stack_examples" — expands on BRK/RTI and PHP/PLP stack behavior