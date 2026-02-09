# CENTIPEDE — overview and translation strategy

**Summary:** Game mechanics for CENTIPEDE (11 segments, mushrooms, spiders, fleas, scorpions) and a Commodore 64 translation strategy using multicolor programmable characters and VIC-II sprite multiplexing to overcome the 8‑sprite hardware limit and display 16 logical sprites.

**Game overview**
CENTIPEDE plays on a mushroom field. A centipede composed of 11 body segments starts at the top and winds downward toward the player's gun at the bottom. Rules and behaviors:

- **Centipede body:** 11 segments. If the head is shot, the next segment becomes the new head; if a middle body segment is shot, the centipede splits into two independent parts, each with its own head.
- **Mushroom interaction:** Whenever any centipede segment hits a mushroom, that segment drops down one row and reverses horizontal direction.
- **Enemies and their effects:**
  - **Fleas:** Add mushrooms to the field (increases obstacles).
  - **Spiders:** Move through the field and destroy mushrooms.
  - **Scorpions:** Poison mushrooms they touch. A poisoned mushroom causes a centipede hitting it to descend straight downward (ignores usual turn/drop behavior).
- **Player elements:** Player sprite (gun) and single shot projectile.

**[Note: Source may contain an error — original text printed "1 1 body segments"; this has been corrected to "11 body segments".]**

**Translation strategy for the C64**
Constraints and approach for a faithful C64 port:

- **Sprite count needed:** 11 centipede segments + 1 player + 1 shot + 1 flea + 1 spider + 1 scorpion = 16 logical sprites.
- **Hardware limitation:** VIC-II supplies 8 hardware sprites.
- **Solution:** Use multicolor programmable characters for the mushroom field (character graphics) and sprite multiplexing to present more than 8 sprites on-screen. Sprite multiplexing (re-using hardware sprite slots later in the raster frame by changing sprite pointers/positions during blanking or raster interrupts) can make the VIC-II appear to provide 16 sprites if done correctly.
- **Practical mapping (logical allocation):** Reserve 11 sprite "instances" for centipede segments and one each for player, shot, flea, spider, scorpion — multiplexing must schedule hardware sprite reassignments so all required objects are drawn each frame.
- **Implementation notes:**
  - **Multiplexing requires precise raster timing and typically uses raster interrupts (IRQ) to change sprite pointers/Y positions mid-frame.** ([commodorelove.com](https://commodorelove.com/2025/09/03/coding/sprite-multiplexing/?utm_source=openai))
  - **Mushrooms implemented as multicolor programmable characters reduce sprite usage by representing many static/low-change tiles as character RAM entries rather than sprites.** ([c64-wiki.com](https://www.c64-wiki.com/wiki/Character_set?utm_source=openai))

## Source Code
```assembly
; Example code for reallocating sprite pointers/Y during a scanline to achieve 16 logical sprites

; Initialize sprite positions and pointers
; Assume sprite data is located at $2000 and each sprite is 64 bytes
; Sprite pointers are at $07F8-$07FF

; Define sprite Y positions
sprite_y_positions:
    .byte 50, 70, 90, 110, 130, 150, 170, 190
    .byte 210, 230, 250, 270, 290, 310, 330, 350

; Define sprite pointers (each points to a 64-byte sprite)
sprite_pointers:
    .byte $20, $21, $22, $23, $24, $25, $26, $27
    .byte $28, $29, $2A, $2B, $2C, $2D, $2E, $2F

; Raster interrupt routine to multiplex sprites
irq:
    ; Acknowledge the interrupt
    lda $d019
    sta $d019

    ; Determine which set of sprites to display based on current raster line
    lda $d012
    cmp #100
    bcc display_first_set
    cmp #200
    bcc display_second_set
    jmp irq_exit

display_first_set:
    ; Load first set of sprite positions and pointers
    ldx #0
    ldy #0
    lda sprite_y_positions, x
    sta $d001, y
    lda sprite_pointers, x
    sta $07f8, y
    inx
    iny
    cpx #8
    bne display_first_set
    jmp irq_exit

display_second_set:
    ; Load second set of sprite positions and pointers
    ldx #8
    ldy #0
    lda sprite_y_positions, x
    sta $d001, y
    lda sprite_pointers, x
    sta $07f8, y
    inx
    iny
    cpx #16
    bne display_second_set

irq_exit:
    ; Set up next raster interrupt
    lda #150
    sta $d012
    lda #<irq
    sta $0314
    lda #>irq
    sta $0315
    rti
```

## Key Registers
- **$D012:** Raster line register; used to set the line at which the raster interrupt occurs.
- **$D019:** Interrupt status register; writing to it acknowledges the interrupt.
- **$D001-$D00F:** Sprite Y-position registers for sprites 0-7.
- **$07F8-$07FF:** Sprite pointer registers for sprites 0-7.

## References
- "sprite_multiplexing_benefits" — expands on sprite multiplexing technique for the C64 and implementation details
- "Commodore 64 Assembly Programming Course" — provides insights into sprite multiplexing and raster interrupts ([board-b.com](https://board-b.com/2024/04/17/commodore-64-assembly-programming-course/?utm_source=openai))
- "Sprite Multiplexing: Breaking the 8-Sprite Barrier" — discusses advanced sprite multiplexing techniques ([commodorelove.com](https://commodorelove.com/2025/09/03/coding/sprite-multiplexing/?utm_source=openai))
- "Character set - C64-Wiki" — details on multicolor character mode and character RAM layout ([c64-wiki.com](https://www.c64-wiki.com/wiki/Character_set?utm_source=openai))