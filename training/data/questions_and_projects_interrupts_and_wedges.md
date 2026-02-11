# Interrupts, Stack-Parameter Passing, and Scrolling-Listing Projects (Ideas)

**Summary:** Redirecting the IRQ/BRK vector ($FFFE/$FFFF) to a custom IRQ handler can be used to copy zero page ($0000-$00FF) to the screen; passing parameters on the 6502 stack (stack page $0100-$01FF) is possible but tricky (use TSX and $0100,X addressing); scrolling a BASIC listing is usually done by a wedge or by hooking system vectors/interrupts rather than a plain SYS call.

**Redirect IRQ to Display Zero Page Contents**

Idea: Install your own IRQ/BRK vector ($FFFE/$FFFF) which jumps to a small machine-language routine that walks zero page and writes its bytes to screen memory. Typical approach:

- On entry, preserve registers and status as needed (the IRQ leaves the return address and processor flags on the stack).
- Initialize X = 0 and use indexed zero-page addressing to read $0000,X .. $00FF,X.
- Store each byte into successive screen RAM locations (e.g., starting at screen base) with a second index or compute the screen address and use STA (addr),Y / STA (addr),X as appropriate.
- Restore preserved registers and RTI to return from the interrupt to normal execution.

Caveats and practical notes:

- IRQ occurs asynchronously — zero page contents will change while the machine is running (timers, keyboard, KERNAL/BASIC variables), producing a dynamic "fascinating screen."
- Because interrupts occur during normal execution, preserve state carefully (A, X, Y, flags) and avoid long-running work in the IRQ routine.
- If you repeatedly write to screen RAM from IRQ you may produce tearing or visual artifacts if the VIC-II is updating the same character cells; consider timing or briefly disabling interrupts in critical sections if you need atomic behavior.

**Example Assembly Code:**


**Why Pushing Parameters on the Stack and JSRing is Problematic**

Passing parameters by pushing them on the stack (caller: PHA/PHX/PHB..., then JSR subroutine) can be implemented but requires careful handling because:

- JSR itself pushes the two-byte return address onto the stack. The parameters pushed by the caller are below that return address on the stack.
- The callee must read parameters from the stack without disturbing the return address. The usual technique:
  - Use TSX to transfer the stack pointer into X: TSX sets X = SP.
  - Read parameter bytes with absolute indexed addressing from the stack page: LDA $0100,X ; or LDA $0100,X+offset (adjust X appropriately).
- The callee must not inadvertently POP or otherwise corrupt the return address; any PLAs/PHPs used must preserve the return address layout so that RTS returns correctly.
- Cleanup (removing parameters) is awkward: the callee can adjust SP so that RTS will pop the correct return address, but arithmetic on SP is awkward (you can manipulate X and then TXS, or PLA parameters into temporary storage, etc.). Alternatively, have the caller remove parameters after return.
- Interrupts (IRQ/NMI) occurring while parameters are on the stack will push additional bytes (SR and PC), changing SP and making stack-relative addressing brittle unless interrupts are disabled (CLI/SEI) around the critical region.
- Conclusion: it works, but requires TSX/$0100,X reading, careful register preservation, coordinated stack cleanup, and interrupt-safety. For this reason passing in zero page or registers is generally simpler.

**Example Assembly Code:**


**Scrolling BASIC Listings — SYS vs. Wedge vs. Interrupt**

Which method implements a “scrolling listing” (press CURSOR-DOWN at bottom and new BASIC lines appear)?

- **Plain SYS call:** Possible to implement a scrolling routine that takes over (looping, reading keyboard, printing lines) and ultimately RTS back to BASIC. But a SYS routine runs synchronously and while it loops BASIC is not executing; the user experience is fine, but integration with BASIC (e.g., resuming execution) and preserving the correct return addresses/state is more work. SYS is effectively a single call; it must set up its own event loop and then return cleanly.
- **Wedge (patch to BASIC/KERNAL):** Common approach historically. A wedge modifies or hooks BASIC/KERNAL entry points (for example, the text-input or cursor-handling routines) so that when CURSOR-DOWN is pressed the wedge supplies the next line from the program buffer. This integrates naturally with BASIC’s own input/print flow and avoids juggling return addresses or long-running SYS loops.
- **Interrupt/vector hook:** Possible by installing a handler on IRQ/NMI or by patching KERNAL vectors that the OS uses for keyboard/console input. An interrupt-driven approach can detect key presses asynchronously and push new lines to the console, but it must be careful not to interfere with BASIC execution or with the VIC-II timing. This approach is more complex but can provide background scrolling without halting BASIC.

Practical assessment: Most polished “scrolling listing” utilities were implemented as wedges (patches/hooks) or by installing vector hooks in the KERNAL — not as a single simple SYS in BASIC — because wedges integrate more cleanly and avoid the caller/callee stack complications.

**Example Assembly Code for a Wedge:**


**Inspecting the Stack to Find the SYS/JSR Return Address**

- The CPU stack page is $0100-$01FF; the stack pointer (SP) points to the next free location (stack grows downward).
- When BASIC executes a SYS (machine code call), the processor pushes the return address (low then high) onto the stack the same as for any JSR. That two-byte return address is what RTS will use.
- To inspect that return address from a machine routine:
  - Use TSX to get SP into X.
  - Read return address bytes at $0100,X+0 and $0100,X+1 (or compute exact offsets depending on what else was pushed).
  - Combine low and high into a 16-bit address (low + 256*high).
- Be cautious: interrupts or other pushes can change SP; freeze interrupts (SEI) if you need a stable view.

**Example Assembly Code:**


## Source Code

```assembly
; Custom IRQ handler to display zero page contents on screen
IRQHandler:
    PHA             ; Preserve A
    TXA
    PHA             ; Preserve X
    TYA
    PHA             ; Preserve Y

    LDX #$00        ; Initialize X to 0
    LDY #$00        ; Initialize Y to 0
    LDA #$04        ; Screen memory high byte ($0400)
    STA $FB         ; Store in zero-page pointer low byte
    LDA #$00        ; Screen memory low byte ($0400)
    STA $FC         ; Store in zero-page pointer high byte

Loop:
    LDA $0000,X     ; Load byte from zero page
    STA ($FB),Y     ; Store byte to screen memory
    INX             ; Increment X
    INY             ; Increment Y
    CPX #$00        ; Check if all 256 bytes are processed
    BNE Loop        ; If not, continue loop

    PLA             ; Restore Y
    TAY
    PLA             ; Restore X
    TAX
    PLA             ; Restore A
    RTI             ; Return from interrupt
```

```assembly
; Caller code to push parameters and call subroutine
    LDA #$01        ; Load first parameter
    PHA             ; Push onto stack
    LDA #$02        ; Load second parameter
    PHA             ; Push onto stack
    JSR Subroutine  ; Call subroutine
    PLA             ; Clean up stack (remove second parameter)
    PLA             ; Clean up stack (remove first parameter)
    ; Continue with program

; Subroutine to access parameters from stack
Subroutine:
    TSX             ; Transfer stack pointer to X
    LDA $0104,X     ; Load first parameter (2 bytes above return address)
    ; Process first parameter
    LDA $0105,X     ; Load second parameter (3 bytes above return address)
    ; Process second parameter
    RTS             ; Return from subroutine
```

```assembly
; Wedge to hook into the KERNAL CHRIN routine
    SEI             ; Disable interrupts
    LDA #<NewCHRIN  ; Load low byte of new CHRIN address
    STA $0314       ; Store at IRQ vector low byte
    LDA #>NewCHRIN  ; Load high byte of new CHRIN address
    STA $0315       ; Store at IRQ vector high byte
    CLI             ; Enable interrupts
    RTS             ; Return to BASIC

NewCHRIN:
    JSR OldCHRIN    ; Call original CHRIN routine
    CMP #$11        ; Check if CURSOR-DOWN was pressed
    BNE NotCursorDown
    ; Code to handle scrolling the listing
NotCursorDown:
    RTS             ; Return from CHRIN
```

```assembly
; Routine to inspect the return address on the stack
    TSX             ; Transfer stack pointer to X
    LDA $0101,X     ; Load low byte of return address
    STA $FB         ; Store in zero-page pointer low byte
    LDA $0102,X     ; Load high byte of return address
    STA $FC         ; Store in zero-page pointer high byte
    ; Now $FB/$FC contains the return address
    RTS             ; Return from subroutine
```


```assembly
; Custom IRQ handler to display zero page contents on screen
IRQHandler:
    PHA             ; Preserve A
    TXA
    PHA             ; Preserve X
    TYA
    PHA             ; Preserve Y

    LDX #$00        ; Initialize X to 0
    LDY #$00        ; Initialize Y to 0
    LDA #$04        ; Screen memory high byte ($0400)
    STA $FB         ; Store in zero-page pointer low byte
    LDA #$00        ; Screen memory low byte ($0400)
    STA $FC         ; Store in zero-page pointer high byte

Loop:
    LDA $0000,X     ; Load byte from zero page
    STA ($FB),Y     ; Store byte to screen memory
    INX             ; Increment X
    INY             ; Increment Y
    CPX #$00        ; Check if all 256 bytes are processed
    BNE Loop        ; If not, continue loop

    PLA             ; Restore Y
    TAY
    PLA             ; Restore X
    TAX
    PLA             ; Restore A
    RTI             ; Return from interrupt
```
