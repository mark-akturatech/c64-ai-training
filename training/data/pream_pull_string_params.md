# PREAM — Pull String-Function Parameters from Stack for LEFT$, RIGHT$, MID$

**Summary:** Assembly routine at $B761 (decimal 46945) that pulls string-function parameters from the stack for LEFT$, RIGHT$, and MID$. Used to obtain the first two parameters common to these commands (string pointer/descriptor and the first numeric parameter).

**Description**

PREAM is a ROM routine invoked by the string functions LEFT$, RIGHT$, and MID$ to extract their parameter values from the BASIC expression stack. This routine retrieves the first two parameters common to these string functions: the string descriptor and the first numeric parameter. The higher-level perform_* routines (such as leftd_perform_left$, rightd_perform_right$, midd_perform_mid$) utilize PREAM to obtain these parameters for further processing.

### Assembly Implementation of PREAM

The PREAM routine is located at memory address $B761. Below is the assembly code for PREAM:


### Stack Layout and Parameter Retrieval

In Commodore 64 BASIC, when a function like LEFT$, RIGHT$, or MID$ is called, its parameters are pushed onto the BASIC expression stack. The PREAM routine retrieves these parameters in the following order:

1. **String Descriptor:** Consists of three bytes:
   - **Length Byte:** The length of the string.
   - **Low Byte of Address:** Low byte of the string's memory address.
   - **High Byte of Address:** High byte of the string's memory address.

2. **First Numeric Parameter:** Typically represents the number of characters to extract or the starting position, depending on the function. This is a two-byte floating-point number in Commodore BASIC's internal format.

The stack layout for these parameters is as follows (top of stack at the bottom):


The PREAM routine uses the GETBYT subroutine to sequentially pull these bytes from the stack and store them in memory locations $61 through $66:

- **$61:** String Length
- **$62:** Low Byte of String Address
- **$63:** High Byte of String Address
- **$64:** First Numeric Parameter Byte 1
- **$65:** First Numeric Parameter Byte 2

### Register Usage and Preservation

The PREAM routine primarily utilizes the accumulator (A) register to retrieve and store parameter bytes. The X and Y registers are not modified during the execution of PREAM, ensuring their values are preserved across the subroutine call. The status register is affected by the operations performed but is not explicitly preserved.

### Invocation by perform_* Routines

The perform_* routines for LEFT$, RIGHT$, and MID$ invoke PREAM to retrieve the necessary parameters from the stack. After calling PREAM, these routines access the parameters stored in memory locations $61 through $65 to perform their respective string operations.

For example, the perform_left$ routine would:

1. Call PREAM to retrieve the parameters.
2. Access the string descriptor and numeric parameter from $61 through $65.
3. Use these parameters to extract the specified portion of the string.
4. Return the resulting substring to the calling context.

## Source Code

```assembly
B761  20 1A B7  JSR $B71A   ; Call GETBYT to retrieve the first parameter
B764  85 61     STA $61     ; Store the retrieved byte in location $61
B766  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B769  85 62     STA $62     ; Store the retrieved byte in location $62
B76B  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B76E  85 63     STA $63     ; Store the retrieved byte in location $63
B770  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B773  85 64     STA $64     ; Store the retrieved byte in location $64
B775  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B778  85 65     STA $65     ; Store the retrieved byte in location $65
B77A  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B77D  85 66     STA $66     ; Store the retrieved byte in location $66
B77F  60        RTS         ; Return from subroutine
```

```
| High Byte of String Address |  (SP)
| Low Byte of String Address  |  (SP + 1)
| String Length               |  (SP + 2)
| First Numeric Parameter Byte 2 |  (SP + 3)
| First Numeric Parameter Byte 1 |  (SP + 4)
```


```assembly
B761  20 1A B7  JSR $B71A   ; Call GETBYT to retrieve the first parameter
B764  85 61     STA $61     ; Store the retrieved byte in location $61
B766  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B769  85 62     STA $62     ; Store the retrieved byte in location $62
B76B  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B76E  85 63     STA $63     ; Store the retrieved byte in location $63
B770  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B773  85 64     STA $64     ; Store the retrieved byte in location $64
B775  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B778  85 65     STA $65     ; Store the retrieved byte in location $65
B77A  20 1A B7  JSR $B71A   ; Call GETBYT again to retrieve the next parameter
B77D  85 66     STA $66     ; Store the retrieved byte in location $66
B77F  60        RTS         ; Return from subroutine
```

## References

- "leftd_perform_left$" — expands on uses PREAM to get parameters
- "rightd_perform_right$" — expands on uses PREAM to get parameters
- "midd_perform_mid$" — expands on uses PREAM to get parameters

## Labels
- PREAM
