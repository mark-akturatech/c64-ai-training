# $FF99 — Read/Set the Top of Memory

**Summary:** KERNAL entry $FF99 reads or sets the top-of-RAM pointer. Called with carry=1, it loads the 16-bit top-of-RAM pointer into X/Y; with carry=0, it saves X/Y as the new top-of-memory pointer.

**Description**

This KERNAL routine provides an interface to query or change the top of available RAM.

- **Call convention:**
  - **Carry = 1 (set):** Read operation — the routine loads the 16-bit top-of-RAM pointer into registers X and Y (X = low byte, Y = high byte).
  - **Carry = 0 (clear):** Write operation — the routine saves the 16-bit pointer in X/Y as the top-of-memory pointer, changing the top of available RAM.

- **Effect:** Setting the pointer alters the system’s notion of RAM top and therefore the region of memory available to programs; reading lets a program obtain the current top pointer.

- **Implementation details:**
  - **Read operation (Carry = 1):** The routine retrieves the current top-of-memory pointer from system memory and places the low byte into register X and the high byte into register Y.
  - **Write operation (Carry = 0):** The routine updates the system's top-of-memory pointer with the values in registers X (low byte) and Y (high byte).

- **Side effects:**
  - **Registers affected:** The routine alters the contents of registers A, X, and Y.
  - **Interrupts:** The routine does not disable interrupts; it operates with interrupts enabled.
  - **Stack usage:** The routine uses the stack for the return address and any internal operations, but it does not alter the stack pointer beyond its own requirements.

## Source Code

```text
; Example usage: Read the current top-of-memory pointer
    SEC             ; Set carry flag to indicate read operation
    JSR $FF99       ; Call the MEMTOP routine
    ; Upon return, X = low byte, Y = high byte of top-of-memory pointer

; Example usage: Set a new top-of-memory pointer
    LDX #$00        ; Low byte of new top-of-memory address
    LDY #$A0        ; High byte of new top-of-memory address
    CLC             ; Clear carry flag to indicate write operation
    JSR $FF99       ; Call the MEMTOP routine
    ; The top-of-memory pointer is now set to $A000
```

## Key Registers

- **$FF99** - KERNAL ROM - Read/Set top-of-memory pointer (carry=1 read to X/Y, carry=0 save X/Y)

## References

- "ff87_ram_test_and_find_ram_end" — expands on detecting top of RAM
- "ff9c_read_set_bottom_of_memory" — paired bottom-of-memory routine

## Labels
- MEMTOP
