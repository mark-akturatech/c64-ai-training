# FDC Error Codes and Job Ordering (Drive Job Queue)

**Summary:** FDC error-code semantics: an FDC error code of 1 indicates successful completion; any other nonzero value indicates an error. Job-queue ordering: a SEEK (find track) job must precede a READ (sector) job; drive initialization is optional when manipulating the job queue directly (used only as habit in the example, and often skipped for damaged or DOS‑protected disks).

**Behavior and Semantics**

- **FDC Error-Code Interpretation:** An FDC error code of 1 indicates successful completion; any other nonzero value indicates an error.

**Job Hierarchy and Initialization**

- **Job Ordering:** The example program enforces a simple hierarchy: SEEK (find track) must be performed before READ (sector).

- **Drive Initialization:** Not strictly necessary when operating the FDC job queue directly; initialization is often skipped for direct access use cases such as reading damaged disks or bypassing DOS protection.

- **Caveat:** Bypassing normal parser/initialization and manipulating job/header entries directly carries practical risks.

## Source Code

The following is an example program that demonstrates the job queue mechanism and job code bit 7:

```assembly
; Example program demonstrating job queue mechanism and job code bit 7

; Initialize job queue
LDA #$00
STA $01
STA $08
STA $09

; Seek to track 17
LDA #$11
STA $08
LDA #$00
STA $09
LDA #$80
STA $01

; Wait for job completion
WAIT:
LDA $01
BMI WAIT

; Read sector 0
LDA #$11
STA $08
LDA #$00
STA $09
LDA #$90
STA $01

; Wait for job completion
WAIT2:
LDA $01
BMI WAIT2

; Check for errors
LDA $01
CMP #$01
BEQ SUCCESS
; Handle error
ERROR:
; Error handling code here
JMP END

SUCCESS:
; Success code here

END:
; End of program
```

This program initializes the job queue, performs a SEEK to track 17, and then reads sector 0. It waits for each job to complete and checks for errors.

## Key Registers

- **$01:** Job code register.
- **$08:** Track register.
- **$09:** Sector register.

## References

- "job_queue_mechanism_and_job_code_bit7" — expands on how job completion is detected so these error codes are read.
- "warning_dangers_of_bypassing_parser_and_alignment_requirements" — expands on practical risks and caveats when skipping the parser and handling job/header entries.