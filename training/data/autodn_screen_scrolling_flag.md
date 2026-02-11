# AUTODN ($0292 / 658): Screen autoscroll flag

**Summary:** AUTODN at $0292 (decimal 658) is a KERNAL RAM flag controlling whether the screen will autoscroll (insert a physical line) when the cursor moves past the 40th column of a logical line; 0 = enable autoscroll, nonzero = disable. The OS temporarily disables autoscroll when there are characters pending in the keyboard buffer.

## Description
AUTODN is consulted when the text cursor advances past column 40 of a logical line. Behavior:
- 0: enable autoscroll — the VIC/OS will scroll subsequent screen lines down and add a new physical line to the logical line.
- nonzero: disable autoscroll — no automatic insertion/scrolling occurs when the cursor passes column 40.

The KERNAL sets this flag to disable autoscroll temporarily while the keyboard buffer contains pending characters (these pending characters can include cursor-movement characters that may avoid the need for scrolling). The flag is a simple boolean-style control used by line-edit and screen-update routines in the OS.

## Key Registers
- $0292 - KERNAL RAM - AUTODN: Screen scrolling enabled flag (0 = enable autoscroll on passing 40th column; nonzero = disable). Decimal location 658.

## References
- "xmax_keyboard_buffer_size" — expands on how keyboard buffer state affects AUTODN behavior

## Labels
- AUTODN
