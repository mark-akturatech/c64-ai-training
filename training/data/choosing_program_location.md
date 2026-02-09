# Choosing a RAM Location for Machine Code ($033C)

**Summary:** Select a RAM start address for machine code; this chunk recommends the cassette buffer at $033C (decimal 828) for short test programs and notes that a machine language monitor is required to enter the code into RAM.

## Choosing a Location
The program must reside in RAM. For short test programs, place the code in the cassette buffer starting at address $033C (decimal 828). This provides a convenient, known area to use while developing small routines.

## Entering the Code
To load or enter machine code into the chosen RAM location you must use a machine language monitor (a tool that lets you deposit assembled bytes into memory and inspect/execute them).

## References
- "opcode_encoding_and_translation" — expands on the assembled bytes to be placed at the chosen address  
- "monitors_overview" — introduces monitors used to load or enter code into memory