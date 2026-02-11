# VIC-II Raster-Line Timing (Beginning of Line and Raster 0 Special Case)

**Summary:** This document details the VIC-II raster-line timing, focusing on the sequence of memory accesses within a raster line, which remains consistent across different graphics modes. The negative edge of the raster interrupt request (IRQ) marks the start of a line and coincides with the increment of the RASTER register ($D012). Raster line 0 is a special case where the IRQ and RASTER increment/reset occur one cycle later than usual. For simplicity, this document assumes that line 0 begins one cycle before its IRQ.

**Timing of a Raster Line**

The VIC-II's memory access sequence within each raster line is fixed and independent of the graphics mode. A raster line begins at the negative edge of the raster IRQ, which is also when the RASTER register increments.

Raster line 0 is an exception: in this line, the IRQ edge and the RASTER register's increment/reset occur one cycle later than in other lines. For clarity, this document defines the start of raster line 0 as one cycle before its IRQ.

(IRQ = Interrupt Request)

## Source Code

```text
Timing Diagram: 6569 (PAL), Bad Line, No Sprites

Cycle # | ø0  | IRQ | BA  | AEC | VIC Access | CPU Access
--------|-----|-----|-----|-----|------------|-----------
   63   |  L  |  H  |  H  |  H  |    Idle    |    Read
    1   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    2   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    3   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    4   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    5   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    6   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    7   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    8   |  L  |  L  |  H  |  L  | Sprite Ptr |    Read
    9   |  L  |  L  |  H  |  L  |    Idle    |    Read
   10   |  L  |  L  |  H  |  L  |    Idle    |    Read
   11   |  L  |  L  |  H  |  L  |    Idle    |    Read
   12   |  L  |  L  |  L  |  L  |    Idle    |    Read
   13   |  L  |  L  |  L  |  L  |    Idle    |    Read
   14   |  L  |  L  |  L  |  L  |    Idle    |    Read
   15   |  L  |  L  |  L  |  L  |    Idle    |    Read
   16   |  L  |  L  |  L  |  L  |    Idle    |    Read
   17   |  L  |  L  |  L  |  L  |    Idle    |    Read
   18   |  L  |  L  |  L  |  L  |    Idle    |    Read
   19   |  L  |  L  |  L  |  L  |    Idle    |    Read
   20   |  L  |  L  |  L  |  L  |    Idle    |    Read
   21   |  L  |  L  |  L  |  L  |    Idle    |    Read
   22   |  L  |  L  |  L  |  L  |    Idle    |    Read
   23   |  L  |  L  |  L  |  L  |    Idle    |    Read
   24   |  L  |  L  |  L  |  L  |    Idle    |    Read
   25   |  L  |  L  |  L  |  L  |    Idle    |    Read
   26   |  L  |  L  |  L  |  L  |    Idle    |    Read
   27   |  L  |  L  |  L  |  L  |    Idle    |    Read
   28   |  L  |  L  |  L  |  L  |    Idle    |    Read
   29   |  L  |  L  |  L  |  L  |    Idle    |    Read
   30   |  L  |  L  |  L  |  L  |    Idle    |    Read
   31   |  L  |  L  |  L  |  L  |    Idle    |    Read
   32   |  L  |  L  |  L  |  L  |    Idle    |    Read
   33   |  L  |  L  |  L  |  L  |    Idle    |    Read
   34   |  L  |  L  |  L  |  L  |    Idle    |    Read
   35   |  L  |  L  |  L  |  L  |    Idle    |    Read
   36   |  L  |  L  |  L  |  L  |    Idle    |    Read
   37   |  L  |  L  |  L  |  L  |    Idle    |    Read
   38   |  L  |  L  |  L  |  L  |    Idle    |    Read
   39   |  L  |  L  |  L  |  L  |    Idle    |    Read
   40   |  L  |  L  |  L  |  L  |    Idle    |    Read
   41   |  L  |  L  |  L  |  L  |    Idle    |    Read
   42   |  L  |  L  |  L  |  L  |    Idle    |    Read
   43   |  L  |  L  |  L  |  L  |    Idle    |    Read
   44   |  L  |  L  |  L  |  L  |    Idle    |    Read
   45   |  L  |  L  |  L  |  L  |    Idle    |    Read
   46   |  L  |  L  |  L  |  L  |    Idle    |    Read
   47   |  L  |  L  |  L  |  L  |    Idle    |    Read
   48   |  L  |  L  |  L  |  L  |    Idle    |    Read
   49   |  L  |  L  |  L  |  L  |    Idle    |    Read
   50   |  L  |  L  |  L  |  L  |    Idle    |    Read
   51   |  L  |  L  |  L  |  L  |    Idle    |    Read
   52   |  L  |  L  |  L  |  L  |    Idle    |    Read
   53   |  L  |  L  |  L  |  L  |    Idle    |    Read
   54   |  L  |  L  |  L  |  L  |    Idle    |    Read
   55   |  L  |  L  |  L  |  L  |    Idle    |    Read
   56   |  L  |  L  |  L  |  L  |    Idle    |    Read
   57   |  L  |  L  |  L  |  L  |    Idle    |    Read
   58   |  L  |  L  |  L  |  L  |    Idle    |    Read
   59   |  L  |  L  |  L  |  L  |    Idle    |    Read
   60   |  L  |  L  |  L  |  L  |    Idle    |    Read
   61   |  L  |  L  |  L  |  L  |    Idle    |    Read
   62   |  L  |  L  |  L  |  L  |    Idle    |    Read
   63   |  L  |  L  |  L  |  L  |    Idle    |    Read
    1   |  L  |  L  |  L  |  L  |    Idle    |    Read
```

*Note: This diagram illustrates the timing of a raster line for the 6569 (PAL) VIC-II chip during a Bad Line with no sprites active. Each cycle is divided into two phases: the VIC-II accesses memory during the low phase (ø0 = L), and the CPU accesses memory during the high phase (ø0 = H). The 'VIC Access' column indicates the type of memory access performed by the VIC-II, while the 'CPU Access' column shows the CPU's activity.*

## Key Registers

- $D012

## Labels
- RASTER
