# INIT: BASIC COLD START ($E394) — KERNAL BASIC init sequence

**Summary:** Cold-start BASIC entry at $E394 that runs KERNAL/BASIC initialization routines ($E453, $E3BF), prints the power-up message ($E422), resets the stack pointer (LDX #$FB / TXS), then branches to the warm-start continuation (BNE $E386). Searchable terms: $E394, $E453, $E3BF, $E422, LDX #$FB, TXS, BNE, KERNAL, BASIC cold-start.

## Description
This routine is the BASIC ROM cold-start entry point. It performs the full BASIC initialization sequence and then enters the warm-start path to display the READY prompt and restart BASIC.

Sequence of operations (in order):
- JSR $E453 — call KERNAL/BASIC helper at $E453.
- JSR $E3BF — BASIC initialization routine.
- JSR $E422 — output the power-up message (calls the message routine).
- LDX #$FB / TXS — load X with #$FB and transfer X into the processor stack pointer to reset SP to $FB. (TXS does not affect processor flags.)
- BNE $E386 — branch to the warm-start continuation at $E386 which outputs READY and restarts BASIC. (LDX sets the Z flag; loading #$FB (non-zero) clears Z, so BNE is taken.)

The code uses a short sequence to initialize system state and then jump into the warm-start path rather than returning; the LDX/TXS pair explicitly sets the hardware stack pointer prior to resuming BASIC.

## Source Code
```asm
                                *** INIT: BASIC COLD START
                                This is the BASIC cold start routine that is vectored at
                                the very start of the BASIC ROM. BASIC vectors and
                                variables are set up, and power-up message is output, and
                                BASIC is restarted.
.,E394 20 53 E4 JSR $E453
.,E397 20 BF E3 JSR $E3BF       Initialize BASIC
.,E39A 20 22 E4 JSR $E422       output power-up message
.,E39D A2 FB    LDX #$FB        reset stack
.,E39F 9A       TXS
.,E3A0 D0 E4    BNE $E386       output READY, and restart BASIC
```

## References
- "bassft_basic_warm_start" — expands on the warm-start entry and READY prompt handling
- "initms_output_powerup_message" — expands on the power-up message output called during cold start

## Labels
- INIT
