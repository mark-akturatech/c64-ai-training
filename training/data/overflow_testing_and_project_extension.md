# Overflow checks for the multiply-by-ten ML example

**Summary:** Reminder that the example 6502 machine-language routine that multiplies a value by ten does not check for overflow; test the largest input that multiplies by ten without error, observe behaviour at overflow (wrap/carry during shifts and ADCs), and if you add overflow handling update the SOV pointer at $002D/$002E.

## Notes and exercises
- Run the example ML program and determine the largest value that can be multiplied by ten without producing an incorrect result. The routine does not perform overflow detection, so at overflow you should observe an incorrect stored result (see "Behavior on overflow" below).
- Observe when overflow occurs. The places to watch are the shift operations and any ADCs (add with carry) used to implement multiplication by ten — these are the instruction types that can set the carry or discard high bits.
- Decide how you want the program to behave on overflow. Options include:
  - Print a user-visible message and continue.
  - Set the result to zero (or another sentinel).
  - Clamp to a maximum representable value.
  - Any other behavior that does not break into the monitor or halt the program.
- Whatever you change will likely lengthen the program. If the program grows, update the SOV pointer (see below) so your code does not overwrite BASIC variables or system data.

## Behavior on overflow (what to look for)
- Overflow during the shift/add sequence typically results in lost high-order bits (wraparound) and the 6502 carry flag being set by ASL/ROL/ADC instructions. The visible symptom is an incorrect numeric result stored by the routine. Observe the stored bytes and status flags if you can (via debugging/disassembly) to confirm when carry bits are produced or discarded.
- Test multiple inputs around the suspected boundary; document the exact input that first gives an incorrect result so you know the safe range for the routine as currently written.

## Project suggestions (implementation constraints)
- Implement detection by checking the carry flag after the instructions that can overflow (the shifts and ADCs). If a carry is detected, branch to a handler that implements your chosen behavior.
- The handler must not stop the program or enter the monitor; it should return control to the running program after taking the chosen action.
- Because handling will increase code size, update the SOV pointer at $002D/$002E so variables and system areas remain safe.

## Key Registers
- $002D-$002E - Zero page - SOV pointer (Start Of Variables / pointer to BASIC variable area) — update if program grows

## References
- "double_to_make_times_ten_and_store_back" — expands on places where overflow can occur (during shifts and ADCs)
- "disassemble_list_save_and_run_instructions" — expands on testing the BASIC/ML program after changes

## Labels
- SOV
