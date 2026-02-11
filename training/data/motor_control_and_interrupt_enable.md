# KERNAL: Cassette start — set FSBLK, enable motor, delay, enable IRQs

**Summary:** Sets FSBLK ($BE) to 2, calls NEWCH ($FB97) to prepare local counters/flags, enables cassette motor via processor port $0001 (R6510) and sets CAS1 ($C0) to flag internal motor control, runs a two-level delay loop (255×255 = 65,025 inner DEY iterations) to allow hardware to settle, then enables interrupts (CLI). Search terms: $BE, $C0, $0001, R6510, CAS1, FSBLK, NEWCH, delay loop, CLI.

## Description
This KERNAL fragment initializes cassette transfer state and turns the cassette motor on before enabling interrupts.

- FSBLK ($BE) is set to 2 (FSBLK starts at 2). FSBLK is the KERNAL variable holding the current cassette block number for transfers.
- JSR $FB97 (NEWCH) is called to prepare local counters and flags used for tape operations.
- The processor port at $0001 (R6510 I/O port) is read, ANDed with #$1F and written back. The AND #$1F clears the upper bits while leaving the low-state bits intact; the low state of the relevant bit(s) is used here to turn the cassette motor on.
- CAS1 ($C0) is set to indicate that the KERNAL has taken internal control of the cassette motor (internal motor control flag).
- A two-level nested delay loop is executed: LDX/#$FF, LDY/#$FF; inner loop decrements Y from 255 to 0, outer loop decrements X from 255 to 0. This produces 255 × 255 = 65,025 inner DEY iterations, providing a multi-byte delay to allow hardware/motor to spin up or settle.
- After the delay the IRQs are enabled with CLI (clear interrupt-disable flag), allowing cassette-related interrupts to occur.

Behavioral notes preserved from source:
- NEWCH prepares local counters/flags but is not expanded here (see reference chunk).
- The code explicitly flags CAS1 to indicate internal motor control so higher-level code knows the motor state is managed by the KERNAL.
- The nested loops are a crude time delay; the actual real-time delay depends on CPU clock speed and instruction timing.

## Source Code
```asm
.,F8A4 A9 02    LDA #$02        LDA    #2              ;FSBLK STARTS AT 2
.,F8A6 85 BE    STA $BE         STA    FSBLK
.,F8A8 20 97 FB JSR $FB97       JSR    NEWCH           ;PREP LOCAL COUNTERS AND FLAGS
.,F8AB A5 01    LDA $01         LDA    R6510           ;TURN MOTOR ON
.,F8AD 29 1F    AND #$1F        AND    #%011111        ;LOW TURNS ON
.,F8AF 85 01    STA $01         STA    R6510
.,F8B1 85 C0    STA $C0         STA    CAS1            ;FLAG INTERNAL CONTROL OF CASS MOTOR
.,F8B3 A2 FF    LDX #$FF        LDX    #$FF            ;DELAY BETWEEN BLOCKS
.,F8B5 A0 FF    LDY #$FF        TP32   LDY #$FF
.,F8B7 88       DEY             TP35   DEY
.,F8B8 D0 FD    BNE $F8B7       BNE    TP35
.,F8BA CA       DEX             DEX
.,F8BB D0 F8    BNE $F8B5       BNE    TP32
.,F8BD 58       CLI             CLI
```

## Key Registers
- $0001 - R6510 (processor port) - read/modify/write to control cassette motor bit(s)
- $00BE - System RAM / KERNAL variable - FSBLK (current cassette block number)
- $00C0 - System RAM / KERNAL flag - CAS1 (internal cassette motor control flag)

## References
- "tape_operation_timer_and_irq_setup" — Implements hardware enabling after timers/IRQ vectors are set
- "tape_completion_wait_loop" — After enabling interrupts, enters a wait loop until cassette IRQs indicate completion

## Labels
- FSBLK
- CAS1
- NEWCH
