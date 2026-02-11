# READY — KERNAL routine ($A474-$A47F)

**Summary:** Routine at $A474–$A47F (label READY) prints the word "READY", sets the Kernal message flag to indicate direct (immediate) BASIC mode is active, and falls through to the main BASIC loop. Searchable terms: $A474, $A47F, READY, Kernal, direct mode, main BASIC loop.

**Description**
This Kernal entry labeled READY displays the string "READY" (the standard prompt), sets the Kernal message flag so the system knows direct (immediate) BASIC mode is active, and then falls through into the main BASIC loop handler (see main_loop). The routine occupies the address range $A474–$A47F (hex).

**[Note: Source may contain an error — the provided decimal range 42089–42099 does not match $A474–$A47F. $A474–$A47F corresponds to decimal 42100–42111 and is 12 bytes long (inclusive).]**

## Source Code
```assembly
A474  A9 52     LDA #$52        ; Load 'R'
A476  20 D2 FF  JSR $FFD2       ; Call CHROUT to print character
A479  A9 45     LDA #$45        ; Load 'E'
A47B  20 D2 FF  JSR $FFD2       ; Call CHROUT to print character
A47E  A9 41     LDA #$41        ; Load 'A'
A480  20 D2 FF  JSR $FFD2       ; Call CHROUT to print character
A483  A9 44     LDA #$44        ; Load 'D'
A485  20 D2 FF  JSR $FFD2       ; Call CHROUT to print character
A488  A9 59     LDA #$59        ; Load 'Y'
A48A  20 D2 FF  JSR $FFD2       ; Call CHROUT to print character
A48D  A9 0D     LDA #$0D        ; Load carriage return
A48F  20 D2 FF  JSR $FFD2       ; Call CHROUT to print character
A492  A9 80     LDA #$80        ; Load $80 to enable control messages
A494  8D 9D 00  STA $009D       ; Store in MSGFLG ($9D)
A497  4C 00 A4  JMP $A400       ; Jump to main BASIC loop (main_loop)
```

## Key Registers
- **MSGFLG ($9D):** Kernal message flag. Bit 7 controls control messages; setting it to 1 enables them. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue65/feedback_unwanted_messages.php?utm_source=openai))

## References
- "main_loop" — main BASIC loop that READY falls through to
- CHROUT routine at $FFD2 — outputs a character to the current output device
- MSGFLG ($9D) — Kernal message flag controlling system messages

## Labels
- READY
- MSGFLG
