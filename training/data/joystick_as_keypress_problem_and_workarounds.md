# Keyboard / Joystick Input Conflicts (C64)

**Summary:** Explains the common C64 issue where joystick movement is mistaken for keyboard keypresses (and vice versa), mentions the typical workaround of using Controller Port 2 and references disabling the keyscan routine to isolate joystick reads.

## Problem
On the C64 the keyboard scanning routine and the joystick inputs share signal lines in a way that can cause joystick movements to be detected as keyboard keys (and keyboard activity to interfere with joystick reads). This can produce spurious keypresses during gameplay or cause joystick actions to be ignored when the keyscanner senses a key.

## Typical Workarounds
- Use Controller Port 2 for games to avoid conflicts (Controller Port 1 lines are more likely to collide with the keyboard matrix used by the normal keyscan).
- Disable or temporarily stop the keyscan routine when performing direct joystick reads (search: "keyboard_joystick_confusion_and_keyscan_disable" for detailed methods). Turning off keyscanning isolates joystick reads from keyboard matrix activity.
- Anecdote: pressing the joystick left can slow down a program listing because the keyscan routine interprets that joystick direction as the CTRL key; some users exploited this to pause/slow listings.

## References
- "keyboard_joystick_confusion_and_keyscan_disable" — expanded notes on turning off keyscan to isolate joystick reads
