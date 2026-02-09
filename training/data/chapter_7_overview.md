# Chapter 7 — Stack, USR, Interrupt, and Wedge

**Summary:** This chapter delves into the 6502/C64 stack for temporary storage, the BASIC USR function as an alternative to SYS, the three types of interrupts (IRQ, NMI, BRK), the IA-family peripheral chips (PIA, VIA, CIA), and techniques for extending BASIC through wedges. Key topics include stack operations, USR/SYS calling conventions, interrupt handling, peripheral chip programming, and BASIC extensions.

**Stack for Temporary Storage**

The 6502 processor utilizes a 256-byte stack located at memory page 1 ($0100–$01FF) for temporary storage. This stack operates on a Last-In-First-Out (LIFO) basis and is primarily used for storing return addresses during subroutine calls and interrupt handling. Each `JSR` (Jump to SubRoutine) instruction pushes the return address onto the stack, and the corresponding `RTS` (ReTurn from Subroutine) instruction pulls it off, allowing the program to resume execution after the subroutine.

In addition to return addresses, the stack can be used to save and restore processor registers (A, X, Y) and status flags during interrupt service routines (ISRs). Proper stack management is crucial to prevent stack overflows and ensure the integrity of program execution.

**USR: An Alternative to SYS**

In Commodore BASIC, the `SYS` command is commonly used to call machine language routines by specifying their starting memory address. However, the `USR` function offers an alternative method that allows for passing arguments and receiving return values between BASIC and machine language routines.

To utilize the `USR` function:

1. **Set the USR Vector:** The address of the machine language routine is stored in the USR vector located at memory addresses 785–786 ($0311–$0312). For example, to point the USR function to a routine at address 49152 ($C000):


2. **Pass Arguments:** BASIC passes the argument provided to `USR()` in the floating-point accumulator (FAC1) located at addresses 97–102 ($61–$66). The machine language routine can access this value directly.

3. **Return Values:** The machine language routine places the result back into FAC1 before returning, allowing BASIC to retrieve the value.

Example of setting up and using a USR function:


In this example, the machine language routine at $C000 simply returns the argument passed to it.

**Interrupts: IRQ, NMI, and BRK**

The 6502 CPU in the Commodore 64 supports three types of interrupts:

1. **IRQ (Interrupt Request):** Maskable interrupts triggered by devices like the CIA timers or the VIC-II chip. The IRQ vector is located at addresses 788–789 ($0314–$0315).

2. **NMI (Non-Maskable Interrupt):** Non-maskable interrupts triggered by the RESTORE key or CIA #2. The NMI vector is at addresses 792–793 ($0318–$0319).

3. **BRK (Break):** Software interrupt triggered by the BRK instruction. The BRK vector shares the IRQ vector at $0314–$0315.

When an interrupt occurs, the CPU performs the following steps:

1. Pushes the program counter (PC) and processor status register onto the stack.
2. Loads the interrupt vector address into the PC.
3. Executes the interrupt service routine (ISR) located at the vector address.
4. Concludes the ISR with an `RTI` (ReTurn from Interrupt) instruction, which restores the PC and status register from the stack.

Example of setting up a custom IRQ handler:


In this example, the custom IRQ handler processes the interrupt and then jumps to the original IRQ handler to maintain system functionality.

**IA Chips: PIA, VIA, and CIA**

The Commodore 64 utilizes Complex Interface Adapters (CIAs) for peripheral control:

1. **CIA #1 ($DC00–$DCFF):** Manages the keyboard, joystick ports, and timers. It generates IRQ interrupts.

2. **CIA #2 ($DD00–$DDFF):** Controls the user port, RS-232 interface, and also has timers. It generates NMI interrupts.

Key registers for CIA #1 include:

- **Data Port A ($DC00):** Reads the keyboard matrix columns.
- **Data Port B ($DC01):** Reads the keyboard matrix rows.
- **Timer A ($DC04–$DC05):** 16-bit timer that can generate interrupts upon underflow.
- **Timer B ($DC06–$DC07):** Another 16-bit timer with similar functionality.
- **Interrupt Control Register ($DC0D):** Manages interrupt enable and status flags.

Example of setting up Timer A to generate an IRQ:


In this setup, Timer A is loaded with a value of 1000 cycles and configured to generate an IRQ upon underflow.

**Infiltrating BASIC: The Wedge**

A "wedge" is a technique used to extend or modify the BASIC interpreter by inserting machine language routines that intercept and process BASIC commands. This allows for the addition of new commands or the alteration of existing ones.

To implement a wedge:

1. **Redirect the BASIC Input Vector:** Change the vector at addresses 631–632 ($0277–$0278) to point to your custom routine.

2. **Process Input:** In your routine, check the input command. If it matches your custom command, handle it accordingly. Otherwise, pass control back to the original input handler.

Example of a simple wedge that adds a `HELLO` command:


In this example, typing `HELLO` at the BASIC prompt will trigger the custom message, demonstrating how wedges can extend BASIC functionality.

## Source Code

   ```basic
   POKE 785, 0
   POKE 786, 192
   ```

```basic
10 POKE 49152, 96  : REM Store RTS at $C000
20 POKE 785, 0     : REM Set USR vector low byte
30 POKE 786, 192   : REM Set USR vector high byte
40 PRINT USR(42)   : REM Call USR function with argument 42
```

```assembly
; Disable CIA #1 interrupts
LDA #$7F
STA $DC0D

; Acknowledge any pending CIA #1 interrupts
LDA $DC0D

; Set IRQ vector to custom handler
LDA #<MyIRQHandler
STA $0314
LDA #>MyIRQHandler
STA $0315

; Enable VIC-II raster interrupt
LDA #$01
STA $D01A

; Set raster line for interrupt
LDA #$00
STA $D012

; Enable interrupts
CLI

; Custom IRQ handler
MyIRQHandler:
  ; Acknowledge VIC-II interrupt
  LDA $D019
  STA $D019

  ; Your interrupt code here

  ; Jump to original IRQ handler
  JMP $EA31
```

```assembly
; Load timer value (e.g., 1000 cycles)
LDA #$E8
STA $DC04
LDA #$03
STA $DC05

; Enable Timer A interrupt
LDA #%00000001
STA $DC0D

; Start Timer A
LDA #%00010001
STA $DC0E
```

```assembly
; New input handler
NewInputHandler:
  ; Save registers
  PHA
  TXA
  PHA
  TYA
  PHA

  ; Check for 'HELLO' command
  LDX #0
CheckCommand:
  LDA Command,X
  BEQ CommandMatched
  CMP ($0200),X
  BNE NotMatched
  INX
  JMP CheckCommand

CommandMatched:
  ; Print message
  LDX #0
PrintMessage:
  LDA Message,X
  BEQ Done
  JSR $FFD2  ; CHROUT
  INX
  JMP PrintMessage

Done:
  ; Restore registers and return
  PLA
  TAY
  PLA
  TAX
  PLA
  JMP ($0277)  ; Original input handler

NotMatched:
  ; Restore registers and pass to original handler
  PLA
  TAY
  PLA
  TAX
  PLA
  JMP ($0277)

Command:
  .BYTE "HELLO",0

Message:
  .BYTE "Hello, world!",0
```


```assembly
; ASCII representation of the 6502 stack during a subroutine call

; Before JSR
; Stack (top to bottom):
; ----------------------
; |                    |
; |                    |
; |                    |
; |                    |
; ----------------------

; After JSR to $1234
; Stack (top to bottom):
; ----------------------
; | Return Address Low |  ; Low byte of return address
; | Return Address High|  ; High byte of return address
; |                    |
; |                    |
; ----------------------

; After RTS
; Stack (top to bottom):
; ----------------------
; |                    |
; |                    |
; |                    |
; |                    |
; ----------------------
```

## Key Registers

- **Stack Pointer (SP):** Located at address 1 ($0001), points to the current top of the stack.
- **USR Vector:** Located at addresses 785–786 ($0311–$0312), points to the machine language routine called by the USR function.
- **IRQ Vector:** Located at addresses 788–789 ($0314–$0315), points to the IRQ service routine.
- **NMI Vector:** Located at addresses 792–793 ($0318–$0319), points to the NMI service routine.
- **CIA #1 Registers:**
  - **Data Port A ($DC00):** Keyboard matrix columns.
  - **Data Port B ($DC01):** Keyboard matrix rows.
  - **Timer A ($DC04–$DC05):** 16-bit timer.
  - **Timer B ($DC06–$DC07):** 16-bit timer.
  - **Interrupt Control Register ($DC0D):** Interrupt enable and status.

## References

- "stack_overview" — expands on stack for temporary storage
- "using_irq_vector_and_masking_interrupts" — expands on interrupts overview