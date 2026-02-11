# MACHINE — Prepare memory and run swap program (addresses $0380/$0381, entry $033C)

**Summary:** Prepare memory locations $0380/$0381 via the monitor `.M` editor, then start the machine-language swap program at $033C with `.G 033C`. The program runs extremely fast (< 1/50,000 s), ends with `BRK` which returns to the MLM monitor (displaying `B*`) and shows register changes (AC, XR, PC).

**Preparation**

Display and edit the two bytes you intend to swap so you can verify the swap afterwards. Using the monitor:

- Display the bytes: `.M 0380 0381`
- Edit the display so the line reads (example): `.:0380 11 99 xx xx xx xx xx xx`
- Press RETURN to commit the edits.

Start the program at its entry point:

- Run: `.G 033C`

Behavior notes:

- The routine executes nearly instantaneously (reported runtime: less than one fifty thousandth of a second).
- The final instruction is `BRK` (break). `BRK` returns control to the MLM monitor and the monitor will display `B*` (Break) plus the full register display.
- Inspect the register display carefully: AC (accumulator) and XR (X register) values — and the PC (program counter) — will reflect the state at `BRK`.
- Re-display the target memory to confirm the swap actually occurred: `.M 0380 0381`

## References

- "entering_program_with_mlm" — expands how the program was entered before running
- "detail_program_execution" — step-by-step account of CPU actions during the run