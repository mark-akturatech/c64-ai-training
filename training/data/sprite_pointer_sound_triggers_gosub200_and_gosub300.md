# Sprite-pointer triggers for waveform subroutines (IF P=192 / IF P=193 THEN GOSUB200/300)

**Summary:** Describes BASIC checks of the sprite pointer P (IF P=192 THEN GOSUB200 and IF P=193 THEN GOSUB300) that call waveform-control subroutines to set waveform control values (129 and 128) for two sound-effect voices. Searchable terms: sprite pointer, GOSUB200, GOSUB300, waveform control 129/128, Voice 2, BASIC.

**Behavior**
These BASIC lines inspect the sprite pointer variable P and call distinct subroutines based on its value:
- When P = 192, the program calls the subroutine at line 200 (GOSUB200). This subroutine sets the waveform control for the first sound-effect waveform to values 129 and 128.
- When P = 193, the program calls the subroutine at line 300 (GOSUB300). This subroutine sets the waveform control for the second sound-effect waveform (Voice 2) to values 129 and 128.

The sprite pointer is used as a selector: specific pointer values (192 and 193) map to specific sprite shapes and trigger the corresponding sound waveform subroutine. The surrounding program increments and wraps the pointer through three sprite-shape values (192, 193, 194) to select different shapes and associated behaviors.

## Source Code
```basic
10 P = 192
20 V = 53248
30 POKE V + 21, 1
40 POKE 2040, P
50 FOR T = 1 TO 60: NEXT
60 P = P + 1
70 IF P > 194 THEN P = 192
80 IF P = 192 THEN GOSUB 200
90 IF P = 193 THEN GOSUB 300
100 GOTO 40

200 POKE 54276, 129
210 POKE 54276, 128
220 RETURN

300 POKE 54283, 129
310 POKE 54283, 128
320 RETURN
```

## Key Registers
- **54276**: Waveform control register for Voice 1
- **54283**: Waveform control register for Voice 2

## References
- "waveform_control_subroutine_line_200" — details of the first waveform-control subroutine called by GOSUB200
- "waveform_control_subroutine_line_300" — details of the second waveform-control subroutine called by GOSUB300
- "increment_pointer_and_wrap_three_sprite_shapes" — how pointer values cycle through 192/193/194 to select shapes and trigger subroutines