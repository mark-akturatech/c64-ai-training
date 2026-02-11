# Decimal↔Hex Conversion Routines (Commodore 64 BASIC)

**Summary:** Two BASIC subroutines for byte-to-hexadecimal and hexadecimal-to-byte conversion using standard BASIC functions. Variables: D (numeric byte), HD$ (2-character hex string), H$ (hex-digit lookup string), TME (error flag).

**Description**

This document details two BASIC subroutines for the Commodore 64:

- **Decimal to Hexadecimal Conversion:**
  - **Algorithm:** Computes the high nibble (H) as `INT(D/16)` and the low nibble (L) as `D - H*16`. Constructs the hexadecimal string `HD$` using `MID$` to extract characters from the lookup string `H$`.
  - **Output:** `HD$` (2-character string) representing the hexadecimal value of `D`.
  - **Assumptions:** `D` is an integer between 0 and 255. `H$` contains the 16 hexadecimal digits in order.

- **Hexadecimal to Decimal Conversion:**
  - **Algorithm:** Initializes `TME` to 0. For each character in `HD$`, finds its position in `H$` using a loop. If a character is not found, sets `TME` to 1 and exits. Computes `D` as `H*16 + L`.
  - **Error Handling:** Sets `TME` to 1 if an invalid character is encountered in `HD$`.
  - **Behavior:** The lookup is case-sensitive; `H$` must match the case of characters in `HD$`.

These routines are useful for formatting bytes as hexadecimal strings and parsing hexadecimal input into numeric bytes.

## Source Code

```basic
1000 REM DECIMAL TO HEXADECIMAL
1005 REM Requires H$ = "0123456789ABCDEF"
1010 H = INT(D/16)
1020 L = D - (H * 16)
1030 HD$ = MID$(H$, H + 1, 1) + MID$(H$, L + 1, 1)
1040 RETURN

1050 REM HEXADECIMAL TO DECIMAL
1060 TME = 0        : REM error flag (0 = ok, 1 = error)
1070 H = 0
1080 FOR I = 1 TO 16
1090   IF LEFT$(HD$, 1) = MID$(H$, I, 1) THEN H = I : I = 16
1100 NEXT I
1110 IF H = 0 THEN TME = 1 : GOTO 1200
1120 H = H - 1
1130 L = 0
1140 FOR I = 1 TO 16
1150   IF RIGHT$(HD$, 1) = MID$(H$, I, 1) THEN L = I : I = 16
1160 NEXT I
1170 IF L = 0 THEN TME = 1 : GOTO 1200
1180 L = L - 1
1190 D = H * 16 + L
1200 RETURN
```

## References

- "compute_and_display_old_load_address_and_prompt_new" — formats LOW/HIGH bytes as printable hex address
- "confirm_and_convert_new_address" — converts user's hex input into numeric LOW/HIGH bytes
