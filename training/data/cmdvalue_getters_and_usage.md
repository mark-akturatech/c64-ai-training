# Kick Assembler — CmdValue objects for pseudo command arguments

**Summary:** Kick Assembler passes pseudo command arguments as CmdValue objects, each containing an argument type constant and a numeric value. These can be inspected using `getType()` (which returns an argument type constant such as `AT_IMMEDIATE`) and `getValue()` (which returns the numeric value).

**CmdValue Overview**

CmdValue is the value wrapper used when arguments are passed to pseudo commands in Kick Assembler. Each CmdValue contains:
- A type (an argument type constant; see the table below)
- A numeric value

Accessors:
- `getType()` — Returns an argument type constant (e.g., `AT_IMMEDIATE` for immediate/# arguments)
- `getValue()` — Returns the numeric value (the resolved numeric operand)

Behavioral notes:
- A token written as `#20` (immediate) will yield `getType() == AT_IMMEDIATE` and `getValue() == 20`.

**Argument Type Constants**

The argument type constants are as follows:

| Constant         | Example    |
|------------------|------------|
| `AT_ABSOLUTE`    | `$1000`    |
| `AT_ABSOLUTEX`   | `$1000,x`  |
| `AT_ABSOLUTEY`   | `$1000,y`  |
| `AT_IMMEDIATE`   | `#10`      |
| `AT_INDIRECT`    | `($1000)`  |
| `AT_IZEROPAGEX`  | `($10,x)`  |
| `AT_IZEROPAGEY`  | `($10),y`  |
| `AT_NONE`        |            |

*Note:* Some addressing modes, like absolute zeropage and relative, are missing from the above table. This is because the assembler automatically detects when these should be used from the corresponding absolute mode. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch07s03.html?utm_source=openai))

**Constructing CmdArgument and 16-bit Next Argument Function**

You can construct new command arguments with the `CmdArgument` function. For example, to create a new immediate argument with the value 100:


To define a function that returns the next argument in a 16-bit instruction:


This function returns an argument of the same type as the original. If it's an immediate argument, it sets the value to be the high byte of the original value; otherwise, it increments the value by 1. This supports the `AT_ABSOLUTE`, `AT_ABSOLUTEX`, `AT_ABSOLUTEY`, and `AT_IMMEDIATE` addressing modes. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch07s03.html?utm_source=openai))

## Source Code

```assembly
.var myArgument = CmdArgument(AT_IMMEDIATE, 100)
lda myArgument   // Generates lda #100
```

```assembly
.function _16bitnextArgument(arg) {
    .if (arg.getType() == AT_IMMEDIATE) 
        .return CmdArgument(arg.getType(), >arg.getValue())
    .return CmdArgument(arg.getType(), arg.getValue() + 1)
}
```


```text
// Example comments from source:
//
// // This calls the standard mnemonic
// // This calls the pseudocommand
//
// Example usage (semantics):
// Token:   "#20"
// getType():  AT_IMMEDIATE
// getValue(): 20
//
// Functions:
// CmdValue.getType()   -> returns an argument type constant
// CmdValue.getValue()  -> returns the numeric value
```

## References

- [Kick Assembler Manual: Pseudo Commands](https://theweb.dk/KickAssembler/webhelp/content/ch07s03.html)
- [Kick Assembler Manual: Argument Types](https://www.theweb.dk/KickAssembler/webhelp/content/ch03s02.html)