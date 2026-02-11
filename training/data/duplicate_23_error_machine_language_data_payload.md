# DUPLICATE A SECTOR — BASIC DATA (6502 ML payload)

**Summary:** BASIC DATA statements containing 6502 machine-code bytes for a 1541/C64 "duplicate a sector" payload. This payload is designed to be loaded into the 1541 disk drive's memory and executed to perform sector duplication while preserving the sector checksum.

**Description**
This chunk provides a BASIC source fragment that embeds a 6502 machine-language payload as DATA statements. The listing begins with a REM comment ("DUPLICATE A SECTOR") and a sequence of DATA lines holding raw byte values in decimal format. These bytes form a routine intended to be written into the 1541 disk drive's memory by a BASIC program and then executed to perform low-level disk sector duplication, ensuring the sector checksum is preserved.

The machine-code payload is designed to be loaded into the 1541's memory starting at address $0300 (decimal 768). This is a common area for user-defined routines in the 1541's memory map.

The BASIC loader routine that reads these DATA statements and writes the bytes to the 1541's memory is provided in the companion chunk "duplicate_23_error_master_read_and_clone_write_sequence." This loader uses the "M-W" (Memory Write) command to transfer the machine-code payload to the drive and the "M-E" (Memory Execute) command to execute it.

The job-queue and drive command sequence used to install and execute the payload on the drive are covered in the separate chunk "duplicate_23_error_job_queue_polling_and_retries."

## Source Code
```basic
790 REM DUPLICATE A SECTOR

800 DATA 169,4,133,49,32,143,247,32
810 DATA 16,245,162,8,208,254,184,202
820 DATA 208,250,169,255,141,3,28,173
830 DATA 12,28,41,31,9,192,141,12
840 DATA 28,169,255,162,5,141,1,28
850 DATA 184,208,254,184,202,208,250,160
860 DATA 187,185,0,1,208,254,184,141
870 DATA 1,28,200,208,244,185,0,4
880 DATA 208,254,184,141,1,28,200,208
890 DATA 244,208,254,32,0,254,169,5
900 DATA 133,49,169,1,76,105,249,234

DUPLICATE A SINGLE SECTOR 23 ERROR SOURCE LISTING
```

## References
- "duplicate_23_error_master_read_and_clone_write_sequence" — BASIC code that writes these DATA bytes to the drive (M-W) and executes them
- "duplicate_23_error_job_queue_polling_and_retries" — job-queue commands used to install/execute this machine-language payload and poll results
