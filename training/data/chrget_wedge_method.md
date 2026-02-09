# Replace CHRGET to add BASIC commands (wedge)

**Summary:** Replace the BASIC interpreter's CHRGET routine (BASIC character/token fetcher) to implement a wedge that recognizes a special prefix (e.g., '@') and dispatches to user machine-language handlers; CHRGET is located at zero-page address $0073.

**Description**
CHRGET is the BASIC token/character fetch routine used whenever BASIC reads source text (parsing keywords/tokens). By installing your own CHRGET (via the zero-page address $0073), you can intercept the stream of characters BASIC sees.

The common wedge pattern:
- CHRGET examines the incoming text for a chosen prefix character (commonly '@').
- If the prefix is not present, the custom CHRGET hands control back to the original CHRGET so BASIC behaves unchanged.
- If the prefix is present, the custom CHRGET performs recognition and execution of the new command(s) by calling user-provided machine-language subroutines (one ML routine per new keyword or a dispatcher that decodes the command).
- Each new command must be executed by your machine-language code — the wedge only detects/dispatches.

This yields new BASIC “keywords” without modifying the rest of the interpreter; performance impact is minimal because the patched CHRGET only needs to test for the single prefix character before deferring.

**Implementation notes**
- Install a new CHRGET routine by replacing the code at zero-page address $0073, where the original CHRGET entry resides.
- Your CHRGET must preserve original behavior on non-wedge text: explicitly transfer control to the original CHRGET routine when the prefix is not found.
- When dispatching a wedge command, your ML handler is responsible for:
  - Consuming the command text (so BASIC’s parser won’t see it as normal text)
  - Performing the command’s behavior and returning status/values expected by BASIC (if any)
  - Restoring any registers/flags that BASIC expects, or following the calling convention used by the original CHRGET
- Keep the prefix test efficient (single-byte compare) to minimize overhead.
- Ensure any code you overwrite is restored on program exit to avoid destabilizing other programs.

## Source Code
Below is an example assembly listing demonstrating the installation and restoration of a custom CHRGET routine:

```assembly
; Custom CHRGET routine to implement a BASIC wedge
; Assumes the wedge command prefix is '@'

        .org $C000          ; Load address for the wedge routine

WEDGE:  LDA $7A             ; Load low byte of TXTPTR
        STA $FB             ; Store in temporary storage
        LDA $7B             ; Load high byte of TXTPTR
        STA $FC             ; Store in temporary storage

        LDY #0              ; Initialize index register
        LDA ($FB),Y         ; Load character pointed to by TXTPTR
        CMP #'@'            ; Compare with wedge prefix '@'
        BEQ HANDLE_WEDGE    ; If match, handle wedge command

        ; No match, proceed with original CHRGET behavior
        INC $7A             ; Increment TXTPTR low byte
        BNE CHRGOT          ; If no overflow, jump to CHRGOT
        INC $7B             ; Increment TXTPTR high byte if overflow

CHRGOT: LDA ($7A),Y         ; Load character at TXTPTR
        RTS                 ; Return to BASIC interpreter

HANDLE_WEDGE:
        ; Implement wedge command handling here
        ; Consume command text, execute command, etc.

        JMP CHRGOT          ; After handling, continue with CHRGOT

; Installation routine
INSTALL_WEDGE:
        SEI                 ; Disable interrupts
        LDA #$4C            ; Opcode for JMP
        STA $0073           ; Overwrite original CHRGET entry
        LDA #<WEDGE         ; Low byte of WEDGE address
        STA $0074
        LDA #>WEDGE         ; High byte of WEDGE address
        STA $0075
        CLI                 ; Enable interrupts
        RTS

; Restoration routine
RESTORE_CHRGET:
        SEI                 ; Disable interrupts
        LDA #$E6            ; Restore original opcode at $0073
        STA $0073
        LDA #$7A            ; Restore original operand at $0074
        STA $0074
        LDA #$D0            ; Restore original opcode at $0075
        STA $0075
        CLI                 ; Enable interrupts
        RTS
```

In this example:
- `INSTALL_WEDGE` replaces the original CHRGET routine at $0073 with a jump to the custom `WEDGE` routine.
- `RESTORE_CHRGET` restores the original CHRGET routine to ensure system stability after the wedge is no longer needed.

## Key Registers
- **$0073-$0075**: Entry point for the CHRGET routine in zero-page memory.
- **$7A-$7B**: TXTPTR, pointer to the current character in the BASIC program text.

## References
- Commodore 64 Programmer's Reference Guide, Chapter 5: "BASIC to Machine Language - Using Machine Language from BASIC"