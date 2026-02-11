# Why Program C-64 Demos

**Summary:** Arguments for coding demos on the C-64: fun, low-level hardware control, performance-oriented programming (machine code / 6502 assembly), use of interrupts, and learning fundamentals such as pointers and efficient coding.

## Motivation
Programming demos is primarily rewarding because it combines enjoyable, visible results with deep technical learning. On the C-64 you must program close to the metal: no libraries or high-level abstractions — you manipulate VIC-II, SID, and I/O directly (hardware-level control implied) to produce graphics, sound, and fast I/O. This forces efficient code and teaches performance-minded techniques.

## Technical reasons and learning outcomes
- Fun and visible feedback: demos produce visually and aurally impressive results that motivate further work.
- Low-level programming practice: writing demos requires machine code (6502 assembly), giving practical experience with pointers, addressing modes, and memory layout.
- Hardware mastery: to achieve high performance you must control graphics, sound, and disk I/O directly rather than relying on abstractions.
- Performance and efficiency: demos demand tight, optimized routines and data layouts to meet frame/timing budgets.
- Interrupt usage: demos commonly use IRQ/NMI and raster interrupts to schedule time-critical tasks (raster-split graphics, synchronized effects); mastering interrupts is essential for OS-level programming and precise timing.
- Fundamental concepts: working in machine code makes concepts like pointers and low-level data management concrete and less error-prone compared to learning them in high-level languages.

## References
- "learning_machine_language" — expands on learning 6502 assembly (machine code)
- "interrupts_overview" — expands on importance of interrupts in demos