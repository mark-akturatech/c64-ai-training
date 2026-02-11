# Run assembled program from the monitor (.G address)

**Summary:** How to run an assembled program from the machine-language monitor using the .G command (example: .G 033C), what to expect as output (a single character printed), and a small extension exercise using ASCII codes ($49 for "I", $0D for RETURN).

## Running the Program
At the monitor prompt, move the cursor to an empty line if needed and type:
.G 033C
The monitor will transfer execution to the assembled program at address $033C and it will run immediately; control returns to the monitor (MLM) when the program terminates. The program prints a single character (the letter H) — it can be hard to spot on the screen, but it will have been output when the program ran. ASCII codes used by the program are listed in Appendix D (column marked ASCII).

## Extension: print HI (and on a new line)
- To print the letter I in addition to the existing H, add the ASCII code $49 to the program sequence (the source suggests adding the byte for "I").  
- To print HI on a separate line, append the RETURN code $0D after the letters.  
- ASCII codes are available in Appendix D (column labeled ASCII).

## References
- "disassembler_checking_and_editing" — expands on running the program once it's checked  
- "linking_machine_language_with_basic" — expands on running machine code from BASIC using SYS