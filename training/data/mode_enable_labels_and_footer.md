# ENABLE WRITE MODE / ENABLE READ MODE (label/footer notes — JMP target SF969)

**Summary:** Labels "ENABLE WRITE MODE" and "ENABLE READ MODE" are documentation markers in the Commodore 1541 disk drive firmware, indicating entry points for switching the drive's operational modes. These labels correspond to the jump target at address SF969, which is part of the drive's code responsible for enabling write or read modes. The actual implementation of these routines is located in the drive's firmware code.

**Description**

In the Commodore 1541 disk drive firmware, the labels "ENABLE WRITE MODE" and "ENABLE READ MODE" serve as documentation markers that indicate where the drive's code switches between write and read operational modes. These labels correspond to the jump target at address SF969, which is part of the drive's firmware responsible for enabling the respective modes.

The actual implementation of the routines at SF969 involves setting specific registers and status flags to configure the drive's hardware for the desired operation. This includes:

- **Write Mode:** Configuring the drive to allow data to be written to the disk by setting the appropriate control registers and ensuring the write head is engaged.
- **Read Mode:** Configuring the drive to read data from the disk by setting the control registers for reading and ensuring the read head is properly positioned.

The detailed implementation of these routines, including the specific register settings and control flow, is found in the drive's firmware code. For a comprehensive understanding, refer to the original firmware source code and technical documentation.

## References

- Commodore 1541 Firmware Source Code: [GitHub Repository](https://github.com/mist64/cbmsrc)
- Commodore 1541 Service Manual: [Service Manual PDF](https://www.c64copyprotection.com/wp-content/uploads/2023/07/1541_Service_Manual-1985.pdf)

## Labels
- ENABLE WRITE MODE
- ENABLE READ MODE
