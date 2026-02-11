# RAMTAS (RAM Test and Set Pointers) — $FD50

**Summary:** KERNAL routine RAMTAS ($FD50, callable via jump-table entry $FF87) clears memory pages 0, 2 and 3, sets the tape buffer pointer to $033C, performs a nondestructive RAM test starting at $0400 to find the top of RAM (stored at $0283-$0284), sets the bottom-of-RAM pointer at $0281-$0282 to $0800, and sets the screen memory pointer at $0288 to 4 (screen at $0400).

## Description
This documented KERNAL routine (entry point $FD50; external entry via the jump-table vector at $FF87) performs system RAM and pointer initialization:

- Clears three pages to zero: page 0 ($0000-$00FF), page 2 ($0200-$02FF), and page 3 ($0300-$03FF).
- Initializes the tape buffer pointer to address $033C (decimal 828). The routine sets the tape buffer pointer so tape routines will use the buffer at $033C.
- Performs a nondestructive RAM test beginning at $0400 (decimal 1024). The test writes/read-checks memory upward until it encounters a non-RAM address (commonly the BASIC ROM at $A000 / decimal 40960). The address where RAM ends is stored into the Top-of-RAM pointer.
- Stores the top-of-RAM pointer (two-byte) into $0283-$0284 (decimal 643–644).
- Sets the Bottom-of-RAM pointer (two-byte) at $0281-$0282 (decimal 641–642) to $0800 (decimal 2048), which is the start of BASIC program text.
- Sets the screen memory pointer at $0288 (decimal 648) to the value 4, indicating the OS screen memory base is $0400.

Behavioral notes preserved from source:
- The RAM test is nondestructive (intended to preserve existing RAM contents).
- The routine is typically invoked during system RESET as part of power-on initialization.

## Key Registers
- $FD50 - KERNAL ROM - RAMTAS routine entry (ROM address of the implementation)
- $FF87 - KERNAL jump table - vector to RAMTAS (callable entry in the jump table)
- $0281-$0282 - KERNAL/Zero-page area ($0281-$0282) - Bottom-of-RAM pointer (set to $0800)
- $0283-$0284 - KERNAL/Zero-page area ($0283-$0284) - Top-of-RAM pointer (set by nondestructive RAM test)
- $0288 - KERNAL - Screen memory pointer (set to 4 to indicate screen at $0400)
- $033C - RAM - Tape buffer address (RAMTAS sets tape buffer pointer to $033C)

## References
- "power_on_reset_routine" — covers when RAMTAS is invoked during RESET
- "tape_motor_and_pointer_routines" — covers tape buffer pointer and related tape initialization

## Labels
- RAMTAS
