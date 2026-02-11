# Disabling the C64 OS — consequences and safety advice

**Summary:** Disabling the C64 operating system (for example by installing custom ISRs or overriding KERNAL vector routines) will disable keyboard-scan routines and other OS services, making the machine unresponsive to normal input; recovery requires power-cycling. Always save your program and source code before running programs that take over interrupts.

## Consequences
When a program disables the OS keyboard-scan routines or replaces standard interrupt service routines (ISRs), the computer becomes effectively "deaf" to outside stimuli (keyboard, normal reset paths, and other KERNAL services). After such a program runs, the usual means of resetting or returning control to the OS will not work; the only guaranteed recovery is to power the machine off and then on again.

## Safety advice
- Save your program and all source code before running any code that installs custom ISRs, changes KERNAL vectors, or otherwise takes over interrupts.
- If you run such a program and want to stop it, turn the machine off and back on (power-cycle). Do not rely on normal software reset methods.
- Treat any routine that "takes over" interrupts as potentially preventing normal keyboard detection and reset.

## References
- "kill_macro_and_vector_setup" — expands on why running custom ISRs effectively disables OS services