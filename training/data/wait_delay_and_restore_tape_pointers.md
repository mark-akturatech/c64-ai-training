# End-of-wait routine (KERNAL) $E948-$E964

**Summary:** Restores processor status (PLP at $E948), conditionally performs a nested X/Y delay loop, clears the keyboard buffer index ($C6), reads the cursor row ($D6), restores tape buffer pointers from the stack ($AC-$AF via PLA/STA), and returns (RTS).

**Description**
This KERNAL end-of-wait routine performs several tasks in sequence:

- **PLP (.,E948):** Restores the processor status from the stack. The subsequent BNE at .,E949 conditionally skips the delay loop. The BNE is taken when the zero flag (Z) is clear; thus, the delay loop executes only when the restored Z flag is set.

- **Conditional Delay Loop:**
  - If the delay is not skipped, the routine executes a two-level nested delay loop:
    - `LDY #$00` sets the outer-loop count to 256 iterations (Y counts down from $00 to $FF).
    - The inner loop uses the X register, initialized to $16 elsewhere in the code (not shown in this chunk), and a `DEX/BNE` pair with a `NOP` for timing.
    - `DEY` and `BNE` form the outer loop, iterating 256 times.

- **Keyboard Buffer Index Reset:** `STY $C6` clears the keyboard buffer index by storing Y (now $00) into $C6.

- **Cursor Row Load:** `LDX $D6` loads the cursor row into X for use by subsequent routines.

- **Tape Buffer Pointers Restoration:** Four `PLA/STA` pairs restore the tape buffer pointer and end-pointer bytes into $AC-$AF (in order: $AF, $AE, $AD, $AC).

- **Return:** `RTS` returns control to the caller.

**Behavioral Notes:**

- The delay loop's execution depends on the processor status restored by `PLP`; specifically, it runs when the zero flag is set.

- The initial X value for the inner loop is set to $16 elsewhere in the code, as indicated by the source comment, but this initialization is not present in this chunk.

- The routine expects the tape buffer pointer and end-pointer bytes to have been previously pushed onto the stack. This typically occurs in preceding routines that manage tape I/O operations, ensuring these pointers are preserved across subroutine calls.

## Source Code
```asm
.,E948 28       PLP             ; Restore processor status
.,E949 D0 0B    BNE $E956       ; Skip delay if Z flag is clear
                                ; (Delay loop runs only if Z flag is set)
.,E94B A0 00    LDY #$00        ; Set outer loop count to 256
.,E94D EA       NOP             ; Waste cycles
.,E94E CA       DEX             ; Decrement inner loop count
.,E94F D0 FC    BNE $E94D       ; Inner loop: continue if X ≠ 0
.,E951 88       DEY             ; Decrement outer loop count
.,E952 D0 F9    BNE $E94D       ; Outer loop: continue if Y ≠ 0
.,E954 84 C6    STY $C6         ; Clear keyboard buffer index
.,E956 A6 D6    LDX $D6         ; Load cursor row into X
                                ; Restore tape buffer pointers and exit
.,E958 68       PLA             ; Pull tape buffer end pointer (high byte)
.,E959 85 AF    STA $AF         ; Restore it
.,E95B 68       PLA             ; Pull tape buffer end pointer (low byte)
.,E95C 85 AE    STA $AE         ; Restore it
.,E95E 68       PLA             ; Pull tape buffer pointer (high byte)
.,E95F 85 AD    STA $AD         ; Restore it
.,E961 68       PLA             ; Pull tape buffer pointer (low byte)
.,E962 85 AC    STA $AC         ; Restore it
.,E964 60       RTS             ; Return
```

## Key Registers
- **$C6:** KERNAL zero page - keyboard buffer index (cleared by this routine).
- **$D6:** KERNAL zero page - cursor row (loaded into X here).
- **$AC-$AF:** KERNAL zero page - tape buffer pointer and end-pointer bytes (restored from stack via `PLA/STA`).

## References
- "open_up_space_on_screen" — uses the cursor row ($D6) and is followed by the open-up-space routine.