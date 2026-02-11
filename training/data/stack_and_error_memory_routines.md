# FNDFOR / BLTU / GETSTK / REASON / OMERR / ERROR (BASIC memory & error handling)

**Summary:** Describes BASIC ROM routines at $A38A-$A468: FNDFOR ($A38A-$A3B7) scans the BASIC stack for FOR entries; BLTU ($A3B8) opens space for new program lines or variables; GETSTK ($A3FB-$A407) checks stack space; REASON ($A408-$A434) checks free memory and invokes garbage collection; OMERR ($A435-$A468) prepares an OUT OF MEMORY error; ERROR (vectored through RAM at 768 / $300) displays error messages (error number passed in X).

**Behavior and usage**

- **FNDFOR ($A38A-$A3B7)**
  - **Purpose:** Search the BASIC stack for FOR-loop control blocks left by FOR statements.
  - **When used:** Invoked whenever the interpreter needs to locate an existing FOR entry (e.g., for NEXT processing or loop-control bookkeeping).
  - **Data reference:** FOR places its stack data at the area starting at 256 ($100); FNDFOR scans that stack area for the blocks created by FOR.

- **BLTU ($A3B8)**
  - **Purpose:** Make room in memory for insertion of a new program line or creation of a new (non-array) variable by opening a contiguous free space.
  - **Actions:** Checks whether sufficient space exists; if so, moves program text and/or variable storage to create the required gap.
  - **When used:** Called during editing or when adding/replacing BASIC program lines and when allocating single variables.

- **GETSTK ($A3FB-$A407)**
  - **Purpose:** Verify there is adequate stack space before performing an operation that requires pushing data on the stack.
  - **Behavior:** If insufficient stack space remains, it triggers an OUT OF MEMORY condition (see OMERR/REASON).
  - **When used:** Caller routines that need temporary stack allocation must call GETSTK to avoid stack corruption.

- **REASON ($A408-$A434)**
  - **Purpose:** Check for sufficient free memory for proposed allocations (e.g., inserting program text).
  - **Behavior:** If free memory is insufficient, REASON initiates garbage collection; if garbage collection fails to free enough space, it causes an OUT OF MEMORY error.
  - **Interaction:** Tightly tied to string allocation and other memory-consuming operations.

- **OMERR ($A435-$A468)**
  - **Purpose:** OUT OF MEMORY error handler helper.
  - **Behavior:** Sets the error message code appropriate for an OUT OF MEMORY condition, then falls through to the general ERROR routine to display the message.

- **ERROR ($A437-$A468)**
  - **Purpose:** General error message dispatcher and display routine.
  - **Interface:** Error number is passed in the X register (.X).
  - **Behavior:** Looks up/sets the appropriate error message for the given error number and displays it; execution reaches ERROR via the RAM-vectored entry point at location 768 ($300), allowing user code to trap or replace error handling by changing that vector.

**FOR Stack Block Structure**

FOR-loop control blocks are stored on the BASIC stack starting at address $0100. Each block occupies 18 bytes and has the following structure:

- **Bytes 0-1:** Line number of the FOR statement (2 bytes)
- **Bytes 2-3:** Address of the variable name in the variable name table (2 bytes)
- **Bytes 4-8:** Floating-point representation of the final value (5 bytes)
- **Bytes 9-13:** Floating-point representation of the step value (5 bytes)
- **Bytes 14-15:** Address to return to after the loop (2 bytes)
- **Bytes 16-17:** Address of the next FOR block on the stack (2 bytes)

This structure allows the interpreter to manage nested FOR loops by linking control blocks together.

**Garbage Collection Routine**

The garbage collection routine in Commodore 64 BASIC is located at address $B526. It operates as follows:

1. **Initialization:** Set pointers to define the start and end of the string storage area.
2. **Mark Phase:** Scan all string descriptors in variables and arrays to identify active strings.
3. **Sweep Phase:** Move active strings to the beginning of the string storage area, updating their descriptors accordingly.
4. **Completion:** Adjust pointers to reflect the new boundaries of the string storage area.

This process compacts the string storage area by eliminating gaps left by discarded strings, thereby freeing memory for new allocations. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Garbage_Collection?utm_source=openai))

## Source Code
```text
ROM routine map (addresses and brief purpose):

$A38A-$A3B7  FNDFOR  - Find FOR entries on BASIC stack (FOR data at $100)
$A3B8        BLTU    - Open space for new program line or non-array variable
$A3FB-$A407  GETSTK  - Check for required stack space; trigger OOM if not
$A408-$A434  REASON  - Check free memory; call garbage collection if needed; OOM if still insufficient
$A435-$A468  OMERR   - Set OUT OF MEMORY error code and fall through
$A437-$A468  ERROR   - General error handler (error number in X); vectored via RAM at 768 ($300)
```

## References
- "basic_input_processing_and_program_storage" — expands on main loop, READY handling, adding/replacing program lines
- "string_allocation_and_manipulation" — expands on REASON interaction with string allocation and garbage collection

## Labels
- FNDFOR
- BLTU
- GETSTK
- REASON
- OMERR
- ERROR
