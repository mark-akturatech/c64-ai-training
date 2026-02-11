# NMI-based load-loop entry routine at $03E7

**Summary:** The NMI ISR at $03E7 enables interrupts (CLI) to allow FLAG-line IRQs to be serviced, patches $02D3 (RAM) to become CLI for skipping Part 2 of the next block, writes $0B to $D011 (VIC-II) to show the screen, then enters a CPU poll loop on $02 until FLAG IRQs or loop exit occurs; on exit, it jumps to $0407.

**Description**

This NMI handler is used by a tape loader to keep the CPU in a tight wait loop while the FLAG-line IRQs (handled by a separate IRQ ISR) process incoming pulses. Sequence of actions:

- **CLI at $03E7:** Re-enable interrupts so the FLAG-line IRQ (IRQ vector) can run while the CPU is parked in the loop.
- **Patch $02D3:** Store #$58 (CLI opcode) into $02D3 so that on the next block setup, the code at $02D3 will be a CLI, effectively skipping "Part 2" of the setup routine for subsequent blocks.
- **Show screen:** Write #$0B to $D011 (VIC-II control register) to enable/display the screen as desired by the loader.
- **Enter load loop:** Repeatedly LDA $02 / BEQ $03F2 — the CPU busy-waits while $02 remains zero. When any bit in $02 is set (set by IRQs or other code), the BEQ falls through.
- **On loop exit:** DEC $02 then JMP $0407 to continue loader finalization.
- **Note on branch trick:** The code uses a branch that will always be taken as a relocatable alternative to an absolute JMP (avoids embedding an absolute target address in a non-relocatable manner).

This NMI expects the IRQ ISR (FLAG-line) to handle the actual bit-wise servicing of the tape pulses; the NMI's role is to prepare the CPU to be interruptible and to hold execution in a simple poll loop until the loader signals completion by changing $02.

## Source Code

```asm
; ***************************************************************
; * NMI-ISR                                                     *
; * Description: keeps the CPU in a loop during which the FLAG  *
; *              line interrupts are serviced.                  *
; *              Executes code $0407 as soon as the load loop   *
; *              is over.                                       *
; ***************************************************************
03E7  58             CLI            ; Enable interrupts since we are ready to service
                                    ; our FLAG line interrupt requests.

03E8  A9 58          LDA #$58       ; Change the NOP at $02D3 into a CLI
03EA  8D D3 02       STA $02D3      ; to skip Part 2 of setup on next block load.

03ED  A9 0B          LDA #$0B       ; Show screen
03EF  8D 11 D0       STA $D011

03F2  A5 02          LDA $02        ; Load Loop. The CPU loops here, waiting
03F4  F0 FC          BEQ $03F2      ; FLAG line interrupts to serve or a
                                    ; loop_break instruction (= performed when
                                    ; any bit in $02 memory register is set).

03F6  C6 02          DEC $02
03F8  4C 07 04       JMP $0407
03FB  20 00 00       JSR $0000      ; Placeholder for missing bytes
; ***************************************************************
; * NMI-ISR.END                                                 *
; ***************************************************************
```

## Key Registers

- **$D011** - VIC-II - screen/control register (written #$0B here to "show screen")
- **$02D3** - System RAM - patched byte (written #$58 to change behavior on next block)
- **$0002 ($02)** - Zero page RAM - loader FLAG/loop control byte polled by the NMI loop

## References

- "irq_isr" — expands on the IRQ ISR (FLAG-line) that services individual pulses while NMI keeps CPU in wait loop
- "irq_loader_setup_part2_disassembly" — expands on the setup routine; this NMI was pointed to by the NMI vector during setup