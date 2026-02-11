# MACHINE — Debugging techniques (BRK breakpoints, monitor, stop-key test)

**Summary:** Use BRK (opcode $00) to insert breakpoints and invoke the machine language monitor, inspect registers/memory, then restore the original opcode and use the monitor .G command to continue; insert a stop-key test (JSR $FFE1) to regain control and avoid clobbering the monitor workspace.

## Debugging overview
Debugging is the systematic search for and removal of errors. Isolate program sections and test them; when behavior diverges from expectation, use breakpoints and the monitor to inspect state (registers, memory) at precise points.

## Breakpoint technique
- Replace selected instruction opcodes with BRK (value $00). Run the program; when execution reaches the BRK, the machine language monitor takes control.
- In the monitor inspect CPU registers and memory locations that the program should have modified to verify correct behavior.
- After inspection (and optionally modifying memory or registers), restore the original opcode at the breakpoint location.
- Use the monitor command .G <address> to continue execution from that address (resume program).
- You may change memory or registers in the monitor before continuing to test different conditions.
- For exhaustive tracing you can single-step through instructions by inserting BRK at every instruction (slow but thorough).

## Stop-key tests and writing style
- To retain control if the program can lock up, insert a stop-key test (JSR $FFE1) in your code so you can interrupt and regain control.
- Prefer clear, maintainable code over clever but obfuscated constructs — simpler code is easier to debug.

## Monitor workspace collision
- The machine language monitor uses several memory locations as workspace. If your program uses the same addresses, inspections will show the monitor's working values rather than your program's. Avoid using the monitor's workspace addresses in your program to prevent misleading results.
- If you must use overlapping addresses, be aware that reads while the monitor is active may not reflect program state.

## References
- "symbolic_assemblers_and_source_management" — expands on using symbolic assemblers to reduce retyping and address errors during debugging
