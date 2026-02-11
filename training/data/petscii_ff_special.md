# PETSCII code $FF (special case)

**Summary:** PETSCII $FF (decimal 255) is a BASIC token for the pi symbol that is specially converted to/from the screen graphic $DE (hex). Behavior touches printing, screen fetch, and the keyboard buffer (Shift‑up arrow).

## Behavior
- PETSCII $FF (255) — documented as the BASIC token for the pi symbol.
- When the system prints the pi token, $FF is internally converted to $DE (hex $DE, decimal 222) for the on‑screen graphic (the $C0–$DF graphics block).
- When the screen is read/fetched, the $DE graphic is converted back to $FF.
- When reading the keyboard buffer (Shift‑up arrow key), the value returned is $DE (no conversion is performed at that stage).

## References
- "petscii_graphic_c0_df" — expands on the Pi symbol graphic at $DE in the $C0–$DF graphics block  
- "petscii_notes" — overview notes mentioning $FF special handling
