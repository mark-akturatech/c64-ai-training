# NMOS 6510 — Example: load A and X with the same value (LAX $1000,Y)

**Summary:** Demonstrates using the undocumented/illegal opcode LAX (loads memory into both A and X) with absolute,Y addressing ($1000,Y) to preserve a value across manipulation. Shows two sequences: one that stores A and X together with SAX, and an alternate that restores the preserved value with TXA and continues manipulating A. Uses STA (indirect),Y and EOR to modify A.

## Example: load A and X with same value
Use-case: when you need to manipulate a register value (A) but later must reuse the original value without reloading from memory. LAX loads the same byte into both A and X so you can manipulate A and still recover the original via X (transfer with TXA) or store both registers with SAX (illegal opcode that stores A & X).

Sequence 1 (preserve value in X, store A and X to memory):
- LAX $1000,y — load memory at $1000 + Y into A and X (preserves a copy in X).
- EOR #$80 — manipulate A (examples use EOR to flip bits).
- STA ($FD),Y — store the manipulated A via indirect,Y addressing.
- LDA #$F8 — load a mask or value into A for the SAX store (source shows LDA used before SAX).
- SAX jump+1 — store A and X (SAX typically stores A & X into memory at the given address; here used to write both registers at a code/data location).

Sequence 2 (preserve value in X and later restore it to A):
- LAX $1000,y — load memory into A and X.
- EOR #$80 — manipulate A.
- STA ($FD),y — store manipulated A.
- TXA — transfer preserved value from X back into A.
- EOR #$40 — further manipulate the restored original value.
- STA ($FB),y — store the new manipulated value.

Notes:
- LAX and SAX are undocumented/illegal opcodes; behavior described here matches the example sequences (LAX: memory -> A and X).
- The examples use absolute,Y addressing ($1000,Y) and indirect,Y ((zp),Y) stores; adjust zero-page pointers ($FD, $FB) and addresses to suit your memory layout.

## Source Code
```asm
; LAX zp,y

; Example: load A and X with same value

; Loading A and X with the same value is ideal if you manipulate the original value, but later on
; need the value again. Instead of loading it again you can either transfer it again from the other
; register, or combine A and X again with another illegal opcode.
LAX $1000,y          ; load A and X with value from $1000,y

EOR #$80             ; manipulate A

STA ($fd),y          ; store A

LDA #$f8             ; load mask

SAX jump+1           ; store A & X


; Also one could do:
LAX $1000,y          ; load A and X with value from $1000,y

EOR #$80             ; manipulate A

STA ($fd),y          ; store A

TXA                  ; fetch value again

EOR #$40             ; manipulate

STA ($fb),y          ; store
```

## References
- "lax_opcodes_and_overview" — opcode reference and operation for LAX
- "lax_example_simulate_lda_zp_y" — related LAX usage example (simulating LDA zp,Y)
- "dcp_description" — next undocumented opcode described in the document

## Mnemonics
- LAX
- SAX
- AXS
