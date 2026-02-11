# Kernal zero-page work storage area $90-$FF

**Summary:** Zero-page Kernal work storage at $0090-$00FF (decimal 144–255). These bytes are used by the ROM Kernal for OS variables and I/O bookkeeping; they are zeroed at power-on and then populated from ROM as needed — modifying them can break Kernal functions.

## Description
This area is reserved as the Kernal's zero-page work storage. It holds operating-system variables and state used by Kernal routines (for example, I/O status words and keyboard/STOP-key related state — see referenced chunks). On power-up the range is first filled with zeros and subsequently initialized from values stored in the ROM when the Kernal requires them.

Do not modify locations in this range unless you understand the specific effect on the Kernal routines that read or write those locations; unexpected changes can cause device I/O, keyboard handling, or other OS services to fail.

## Key Registers
- $0090-$00FF - Kernal - Kernal zero-page work storage area (OS variables and I/O bookkeeping)

## References
- "st_status_io_status_word_0x90" — expands on I/O status word (ST) and device status bits
- "stkey_stop_key_and_keyboard_matrix_0x91" — expands on STOP-key detection and keyboard matrix
