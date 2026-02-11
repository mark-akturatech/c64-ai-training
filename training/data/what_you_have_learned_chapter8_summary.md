# MACHINE — Run-Time Estimation and I/O Channel Handling (CHKIN/CHKOUT, CLRCHN, $FFE4, $FFD2)

**Summary:** Estimating machine code run times and switching input/output via KERNAL channel calls (CHKIN $FFC6, CHKOUT $FFC9, CLRCHN $FFCC) and performing I/O with CHRIN $FFE4 and CHROUT $FFD2; distinction between opening a file and connecting to a channel is emphasized.

## What this covers
Concise, practical points from the chapter: how to estimate execution time for machine-language routines, how to redirect BASIC-style input/output to files or other devices by switching the current channel, the KERNAL entry points to connect/disconnect channels and perform character I/O, and a reminder that the full 650x instruction set has been introduced.

## Run-time estimation
- Machine-language (650x) instruction timings are deterministic; you can calculate routine run times by summing known cycle counts for each instruction and accounting for page-cross penalties and branches.
- In many real cases, machine code is sufficiently fast that precise per-instruction timing is unnecessary; coarse estimates are often adequate.
- When exact timing matters (e.g., raster-synced graphics or cycle-exact I/O), use instruction cycle counts and include memory-access and bus-contention effects.

## I/O channel switching and KERNAL calls
- Devices presented to programs are handled via the concept of the "current" input and output channel.
- To use a file (or other device) as the current input or output, you must:
  1. OPEN the file (typically once).
  2. CONNECT the file's logical channel to the current input or output as needed.
  3. READ (via CHRIN) or WRITE (via CHROUT) characters through the connected channel.
  4. DISCONNECT when finished with that connection (but the file can remain open).
- Opening a file is distinct from connecting to it:
  - OPEN allocates and prepares a file (usually done once).
  - CHKIN/CHKOUT and CLRCHN connect/disconnect the file's logical channel to the current input/output and are used repeatedly during I/O.
  - Typical pattern: open a file once; connect and disconnect that channel many times while reading/writing.
- Standard KERNAL entry points (JSR to these addresses) are used for channel and character I/O:
  - Connect input channel: CHKIN (JSR $FFC6)
  - Connect output channel: CHKOUT (JSR $FFC9)
  - Disconnect/clear channel: CLRCHN (JSR $FFCC)
  - Read a character from current input: CHRIN (JSR $FFE4)
  - Write a character to current output: CHROUT (JSR $FFD2)
- After connecting input/output to the desired channel, use CHRIN/CHROUT to receive/send characters in the usual way; connect/disconnect as needed between operations.

## Opening vs connecting — practical note
- Open file once; connect/disconnect (CHKIN/CHKOUT/CLRCHN) many times.
- Confusing these operations can lead to unnecessary OPEN/CLOSE overhead or incorrect device addressing.

## Instruction set coverage reminder
- The chapter states that all 650x instructions have been presented; there are enough instructions for versatility but the set is small enough to be manageable.
- Use the instruction set reference when performing timing calculations or assembling routines.

## Key Registers
- $FFC6 - KERNAL ROM - CHKIN (connect logical input channel)
- $FFC9 - KERNAL ROM - CHKOUT (connect logical output channel)
- $FFCC - KERNAL ROM - CLRCHN (disconnect/clear logical channel)
- $FFE4 - KERNAL ROM - CHRIN (read character from current input device)
- $FFD2 - KERNAL ROM - CHROUT (write character to current output device)

## References
- "input_output_kernal_calls_and_output_switching" — expands on I/O subroutines and channel handling
- "instruction_set_review" — expands on Instruction coverage summary

## Labels
- CHKIN
- CHKOUT
- CLRCHN
- CHRIN
- CHROUT
