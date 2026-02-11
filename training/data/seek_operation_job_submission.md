# REM SEEK — prepare drive-side seek job

**Summary:** BASIC snippet (lines 270–310) that normalizes the sector number (wraps S to NS when zero, converts to zero-based by decrementing S), sets JOB to the seek handler (JOB=176), and invokes the job-queue routine with GOSUB 570 to submit the drive-side seek job.

**Description**
This code fragment prepares a drive-side seek job for the currently selected track/sector:

- **Line 280:** Tests the sector variable S; if S is zero, it is replaced with NS (wrap to the last sector of the track) and control jumps to the job creation step.
- **Line 290:** Converts S from 1-based to 0-based sector numbering by decrementing S (the drive/job format expects zero-based sector numbers).
- **Line 300:** Sets JOB to 176, selecting the job handler number that performs the actual seek on the drive (the drive-side routine number to be dispatched).
- **Line 310:** Calls the program's job-queue handler (GOSUB 570), which submits JOB to the drive and waits for the drive to accept/complete it (see referenced "job_queue_handling_subroutine").

This chunk assumes earlier checks (device open and drive status) succeeded before initiating the seek (see referenced "device_open_and_drive_status_check").

## Source Code
```basic
270 REM SEEK
280 IF S=0 THEN S=NS : GOTO 300
290 S = S - 1
300 JOB = 176
310 GOSUB 570
```

## References
- "device_open_and_drive_status_check" — checks that the device is open and ready before submitting jobs
- "job_queue_handling_subroutine" — submits JOB and waits for drive acceptance/completion
