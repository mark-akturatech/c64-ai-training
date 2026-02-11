# ca65 '*' pseudo variable

**Summary:** The pseudo variable '*' returns the program counter (PC) at the start of the current input line (assembler source line). Assignment to '*' is permitted only when .FEATURE pc_assignment is enabled; use .ORG to change the location counter instead.

## Description
Reading '*' returns the program counter value at the start of the current input line (PC). Assignment to '*' is allowed only when the assembler feature .FEATURE pc_assignment is enabled. The documentation advises against assigning to '*' and recommends using .ORG to change the location counter.

## References
- "pseudo_variables_overview" — general introduction to pseudo variables