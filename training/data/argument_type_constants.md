# Kick Assembler — CmdValue argument type constants

**Summary:** List of Kick Assembler CmdValue argument type constants (AT_ABSOLUTE, AT_ABSOLUTEX, AT_ABSOLUTEY, AT_IMMEDIATE, AT_INDIRECT, AT_IZEROPAGEX, AT_IZEROPAGEY, AT_NONE) with examples showing the corresponding 6502 addressing-mode syntax; notes that zero page and relative modes are inferred from absolute modes.

## Argument type constants
The assembler uses these constants to classify an instruction operand's addressing type for encoding/selection.

- AT_ABSOLUTE — absolute addressing. Example: $1000  
- AT_ABSOLUTEX — absolute,X addressing. Example: $1000,x  
- AT_ABSOLUTEY — absolute,Y addressing. Example: $1000,y  
- AT_IMMEDIATE — immediate addressing. Example: #10  
- AT_INDIRECT — indirect (absolute) addressing. Example: ($1000)  
- AT_IZEROPAGEX — (indirect,X) (zeropage indexed indirect). Example: ($10,x)  
- AT_IZEROPAGEY — (indirect),Y (zeropage indirect indexed). Example: ($10),y  
- AT_NONE — no operand

Note: the assembler omits explicit constants for absolute zeropage and relative addressing because it automatically detects and selects zeropage or relative encodings when appropriate from the corresponding absolute mode.

**[Note: Source may contain a typographical error — the identifiers AT_IZEROPAGEX and AT_IZEROPAGEY appear to be intended as AT_ZEROPAGEX / AT_ZEROPAGEY (zeropage indirect modes).]**

## Source Code
```text
Table 7.2. Argument Type Constants
Constant            Example

AT_ABSOLUTE         $1000

AT_ABSOLUTEX        $1000,x

AT_ABSOLUTEY        $1000,y

AT_IMMEDIATE        #10

AT_INDIRECT         ($1000)

AT_IZEROPAGEX       ($10,x)

AT_IZEROPAGEY       ($10),y

AT_NONE
```

## References
- "cmdvalue_getters_and_usage" — CmdValue.getType() and return values  
- "constructing_cmdargument_and_16bit_next_argument_function" — examples of constructing CmdArgument values using these type constants