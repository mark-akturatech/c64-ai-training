# Main IRQ/BRK Interrupt Entry Point ($FF48)

**Summary:** Main 6510 IRQ/BRK entry (vector at $FFFE → $FF48) saves A/X/Y on the stack and tests the BRK bit in the P status to distinguish BRK vs IRQ; BRK exits via RAM BRK vector $0316, IRQ via RAM IRQ vector $0314 (typically to keyboard-scan at $EA31). Ensure custom handlers pull saved registers from the stack before returning.

## Description
This ROM entry at $FF48 is the primary entry point for both BRK and IRQ on the 6510. The hardware IRQ/BRK vector at $FFFE points here, so any BRK instruction or IRQ will begin execution at this routine.

Behavior:
- Saves the .A, .X and .Y registers onto the stack (the routine stores these registers for the eventual return).
- Tests the BRK bit in the processor status register (.P) to determine whether the cause was a BRK instruction or a hardware IRQ.
- If BRK is indicated, the routine transfers control through the RAM BRK vector at $0316 (decimal 790). Typical BRK handling in the system eventually goes to $FE66 (decimal 65126).
- If BRK is not set (i.e., a hardware IRQ), control is transferred through the RAM IRQ vector at $0314 (decimal 788). In a stock system this usually vectors to the keyboard-scan IRQ handler at $EA31 (decimal 59953).
- When installing custom routines into $0314 or $0316, those routines must PULL the previously saved A/X/Y values from the stack before returning; failing to restore registers will corrupt state.

No assembly listing is included here; this chunk documents the control flow and vectors involved.

## Key Registers
- $FF48 - ROM - Main IRQ/BRK entry point (target of hardware vector at $FFFE)
- $FFFE - CPU vector - Hardware IRQ/BRK vector (points to $FF48)
- $0314 - RAM - IRQ vector (system IRQ entry; typically points to keyboard-scan handler $EA31)
- $0316 - RAM - BRK vector (system BRK entry; typically points to BRK routine $FE66)

## References
- "irq_vector_table_overview" — expands on system IRQ vector table and standard IRQ routines
- "scnkey_scan_keyboard" — expands on the keyboard-scan IRQ handler (typically vectored from $0314 to $EA31)