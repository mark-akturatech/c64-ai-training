# Sample BASIC + ML: Switch VIC-II to Bank 3, Copy Character ROM to RAM, Install NMI Fix, Write/Restore Charset

**Summary:** This program demonstrates how to switch the Commodore 64's VIC-II to bank 3, copy the character ROM into RAM, install a Non-Maskable Interrupt (NMI) handler to modify RESTORE key behavior, and manipulate the character set. Key operations include configuring the processor port ($0001) and VIC-II memory pointer ($D018), copying the ROM character set to RAM at $F000 (61440 decimal), and installing a custom NMI handler.

**Description**

This example illustrates the following steps:

- **Machine Language Copier:** Loads a machine-language routine into memory starting at 49152 ($C000) to copy the character ROM into RAM.

- **Memory Configuration:**
  - Modifies the processor port at $0001 to map the character ROM into the CPU's address space for copying.
  - Sets the VIC-II memory pointer register ($D018) to point to the new screen and character memory locations.

- **NMI Handler Installation:**
  - Writes a custom NMI handler into memory.
  - Redirects the NMI vector at addresses 792 and 793 to point to the new handler.

- **Screen and Character Set Manipulation:**
  - Writes patterns to the screen and color RAM.
  - Demonstrates the difference between PEEK and POKE operations with the character set in RAM.
  - Restores the original character set by re-invoking the machine-language copier.

**Line-by-Line Overview:**

- **Lines 20–30:** Load the machine-language routine into memory and call the copier subroutine.

- **Lines 40–50:** Configure memory by adjusting the processor port and VIC-II registers to enable bank 3 and set screen/character memory pointers.

- **Line 70:** Set BASIC's screen pointer to the new screen memory location.

- **Line 80:** Clear the screen.

- **Lines 90–110:** Install the NMI handler and update the NMI vector to point to the new routine.

- **Line 120:** Write patterns to the screen and color RAM.

- **Lines 130–160:** Demonstrate character set manipulation by erasing, modifying, and restoring characters.

- **Lines 200–250:** Subroutine to disable interrupts, switch memory configuration, invoke the machine-language copier, and restore settings.

- **Lines 300–340:** DATA statements containing the machine-language routines for copying the character set and the NMI handler.

**Important Considerations:**

- **Memory Mapping:** The program temporarily maps the character ROM into the CPU's address space to copy its contents into RAM and then remaps it to allow the VIC-II to display the RAM-resident character set.

- **Interrupt Handling:** Interrupts are disabled during the copy operation to prevent corruption. The program saves and restores the previous NMI vector to maintain system stability.

## Source Code

```basic
20 FOR I=1 TO 33:READ A:POKE 49152+I,A:NEXT: REM SET UP ML ROUTINE
30 GOSUB 200: REM ML COPY OF ROM CHARACTER SET TO RAM
40 POKE 56576,PEEK(56576) AND 252: REM STEP 1, ENABLE BANK 3
50 POKE 53272,44: REM STEPS 2-3, POINT VIC-II TO SCREEN AND CHARACTER MEMORY
60 REM SCREEN OFFSET IS 2*16, CHARACTER OFFSET IS 12
70 POKE 648,200: REM STEP 4, POINT OS TO SCREEN AT 51200 (200*256)
80 PRINT CHR$(147): REM CLEAR SCREEN
90 FOR I=53236 TO 53245:READ A:POKE I,A:NEXT: REM NEW INTERRUPT ROUTINE
100 POKE 53246,PEEK(792):POKE 53247,PEEK(793): REM SAVE OLD NMI VECTOR
110 POKE 792,244:POKE 793,207: REM ROUTE THE INTERRUPT THROUGH THE NEW ROUTINE
120 FOR I=0 TO 255:POKE 51400+I,I:POKE 55496+I,1:NEXT
125 REM POKE CHARACTERS TO SCREEN
130 FOR J=1 TO 8:FOR I=61439+J TO 63487+J STEP 8
140 POKE I,0:NEXT I,J: REM ERASE CHARACTER SET
150 FOR I=61440 TO 63488:POKE I,PEEK(I):NEXT: REM POKE ROM TO RAM
160 GOSUB 200:END: REM RESTORE CHARACTER SET
200 POKE 56334,PEEK(56334) AND 254: REM DISABLE INTERRUPTS
210 POKE 1,PEEK(1) AND 251:REM SWITCH CHARACTER ROM INTO 6510 MEMORY
220 SYS 49152: REM COPY ROM CHARACTER SET TO RAM AT 61440
230 POKE 1,PEEK(1) OR 4: REM SWITCH CHARACTER ROM OUT OF 6510 MEMORY
240 POKE 56334,PEEK(56334)OR 1: REM ENABLE INTERRUPTS
250 RETURN
300 REM DATA FOR ML PROGRAM TO COPY CHARACTER SET TO RAM
310 DATA169,0,133,251,133,253,169,208,133,252,169,240,133,254,162,16
320 DATA160,0,177,251,145,253,136,208,249,230,252,230,254,202,208,240,96
330 REM NEXT IS ML PROGRAM TO MAKE THE RESTORE KEY RESET OS POINTER TO SCREEN
340 DATA 72,169,4,141,136,2,104,108,254,207
```

**Note:** The DATA statements contain machine-language code loaded into memory and executed via the SYS command.

## Key Registers

- **$0001 (1):** Processor Port – Controls memory configuration and bank switching.

- **$D018 (53272):** VIC-II Memory Pointer – Determines the locations of screen and character memory.

- **$DC0E (56334):** CIA1 Control Register – Used to disable and enable interrupts.

- **$DD00 (56576):** CIA2 Port A – Controls VIC-II memory bank selection.

- **$0318–$0319 (792–793):** NMI Vector – Points to the routine executed on a Non-Maskable Interrupt.

## References

- "changing_vic_memory_banks_procedure" – Details on implementing VIC memory bank changes.

- "character_generator_rom_overview_and_bit_values" – Information on copying the character ROM to RAM and character bit values.