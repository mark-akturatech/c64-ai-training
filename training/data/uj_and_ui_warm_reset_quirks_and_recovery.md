# UJ and UI- (1541 USER commands — warm reset and VIC-20 speed)

**Summary:** Describes the 1541 USER command UJ (intended warm reset like SYS 64738), its failure mode (hangs the 1541), recovery procedure (RUN/STOP+RESTORE) and the immediate-mode one-liner (OPEN 15,8,15,"UJ":CLOSE15). Also notes UI- (sets 1541 to VIC-20 speed) can cause problems and recommends using the U: form instead of UJ.

## Behavior and recovery
- UJ is the 1541 USER command intended to perform a warm reset of the 1541 (analogous to SYS 64738 on the C64), but in practice issuing UJ hangs the 1541 instead of resetting it.
- If the drive hangs after sending UJ, regain interactive control of the C64 by pressing RUN/STOP and RESTORE together (press both keys in tandem).
- The commonly used immediate-mode one-liner to send UJ to the drive is provided in Source Code below; run it in immediate mode and use RUN/STOP+RESTORE if the system becomes unresponsive.
- Recommendation: use the U: form of USER commands instead of the UJ form where possible.
- The UI- USER command (implemented to set the 1541 to VIC-20 speed) can also cause problems on the 1541; this behavior is noted but attributed to the implementation intent (setting VIC-20 speed) rather than an unrelated fault.

## Source Code
```basic
100 REM send UJ to drive 8 (immediate mode)
OPEN 15,8,15,"UJ":CLOSE15
```

## References
- "effect_of_block_write_on_subsequent_block_read" — low-level I/O discussion and examples
- "user_commands_intro_and_u3_example_start" — introduction to USER commands and U3 example program