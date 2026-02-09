# Clearing the Screen (STA $0400,X loop, DEX/BNE wrap-around)

**Summary:** Example 6502 assembly to clear C64 screen RAM ($0400-$07FF) by storing character code $20 (space) using indexed STA $0400,X / STA $0500,X / STA $0600,X / STA $0700,X and the DEX/BNE loop-indexing trick; also sets VIC-II colour registers $D020/$D021 to 0 (black).

**Explanation**
This routine performs two actions: set border and background colours to black, and clear the 1KB screen character memory ($0400-$07FF) by writing the space character ($20) into every byte.

- $D020 and $D021 are VIC-II colour registers for the border and background; storing #$00 sets both to black.
- The screen character memory defaults to $0400 and spans $0400-$07FF (1024 bytes).
- The code uses the X register as the loop index. TAX copies A (which is 0) into X, so execution begins with X = 0.
- Inside the loop, the routine writes the same accumulator value ($20) into four page offsets: $0400+X, $0500+X, $0600+X, and $0700+X. Writing those four pages per X lets a single 8-bit X index cover the entire 1KB range in 256 iterations (4 writes × 256 = 1024 bytes).
- The DEX/BNE pattern is used: DEX is executed after the four STA instructions. Since X starts at 0, the first DEX wraps X to $FF, and then the loop decrements from $FF down to $01; when DEX produces 0, the BNE fails, and the loop exits. This results in exactly 256 iterations, writing every offset 0..255 once (order: 0, $FF, $FE, ..., $01).
- The example does not include a return or jump after the loop; execution falls through into whatever bytes follow the routine, which may cause unpredictable behaviour. Add an RTS/JMP to a safe routine or explicitly stop execution when using this in a program.

## Source Code
```asm
        * = $1000

        LDA #$00      ; Put the value 0 in accumulator
        STA $D020     ; Border colour -> black
        STA $D021     ; Background colour -> black
        TAX           ; Copy A into X (start index = 0)
        LDA #$20      ; Character code $20 = space
clrloop:
        STA $0400,X   ; Screen RAM page 0 + X
        STA $0500,X   ; Screen RAM page 1 + X
        STA $0600,X   ; Screen RAM page 2 + X
        STA $0700,X   ; Screen RAM page 3 + X
        DEX           ; Decrement X (wraps 0 -> $FF)
        BNE clrloop   ; Loop until X becomes 0 again
```

## Key Registers
- $D020-$D021 - VIC-II - Border and background colour registers
- $0400-$07FF - RAM - Default screen character memory (1 KB)

## References
- "screen_and_colour_ram" — expands on screen memory at $0400 and length
- "using_an_assembler" — expands on Turbo Assembler syntax used in examples