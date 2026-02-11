# TABLE loop: load per-track ID low/high into device command bytes

**Summary:** 6502 assembly table-lookup loop that reads a track index from zero page ($51), fetches ID low/high bytes from tables (IDL, IDH) using indexed addressing (LDA IDL,Y / LDA IDH,Y), and stores them into zero-page command bytes ($13 = ID low, $12 = ID high); compares Y to immediate #$23 (track 35) with CPY/BNE to repeat. Uses zero-page variables and absolute,Y table addressing.

**Description**

This code implements a per-track table lookup and stores the selected ID low/high bytes into device command buffer bytes in zero page.

- **LDY $51**
  - Loads the Y index register from zero-page location $51 (track number).
- **LDA IDL,Y**
  - Loads the ID low byte from the IDL table at address (IDL + Y) using absolute indexed addressing.
- **STA $13**
  - Stores that ID low byte into zero-page command byte $13.
- **LDA IDH,Y**
  - Loads the ID high byte from the IDH table at address (IDH + Y).
- **STA $12**
  - Stores that ID high byte into zero-page command byte $12.
- **CPY #$23**
  - Compares Y with immediate value $23 (hex), which is decimal 35.
- **BNE TABLE**
  - Branches back to TABLE if Y != $23, repeating the sequence.

**Behavioral notes:**

- IDL and IDH are tables of bytes indexed by track number (track→ID low/high). (IDL/IDH must be defined as absolute tables in the program.)
- The loop compares the loaded Y with #$23; for the branch to make progress, the value read from $51 (or $51 itself) must be changed between iterations by code outside this snippet (for example, $51 may be incremented elsewhere). The snippet itself does not modify $51 or Y.
- Addressing clarification: the original source used “*nn” notation; here that is interpreted as standard 6502 zero-page/hex notation: *51 → $51, *12 → $12, *13 → $13, *23 → $23. **[Note: Source may contain an error — notation '*23' interpreted as immediate hex $23 (decimal 35).]**

## Source Code

```asm
TABLE:
    LDY $51         ; Y = track number (zero-page $51)

    LDA IDL,Y       ; load ID low byte from table IDL + Y
    STA $13         ; store ID low into device command byte $13

    LDA IDH,Y       ; load ID high byte from table IDH + Y
    STA $12         ; store ID high into device command byte $12

    CPY #$23        ; compare Y to track 35 ($23)
    BNE TABLE       ; loop until Y == $23
```

**Definitions and table data for IDL/IDH, plus surrounding setup/teardown code, are not included here.**

## References

- "vector_and_drive_initialization" — setup that prepares device and vectors before entering the TABLE loop
- "wait_loop_and_final_jmp" — code executed after TABLE completes (wait/poll loop and final JMP)
- "inline_comments_id_labels" — comments and labels describing ID LO / ID HI / TRACK 35 data following the code
