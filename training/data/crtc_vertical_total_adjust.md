# MACHINE - CRTC Register R5: Vertical Total Adjust

**Summary:** CRTC R5 (Vertical Total Adjust) — 5-bit write-only register storing an additional 0–31 scan lines to be appended to the frame vertical total; used to fine‑tune frame time and final frame height.

**Description**
The Vertical Total Adjust register (R5) is a 5‑bit, write‑only register that specifies the number of extra scan lines to be added when completing a full frame. Its primary purpose is fine adjustment of the video frame time (frame duration) and to produce the exact desired number of scan lines per frame.

- **Bit fields:**
  - Bits 0–4: Vertical Total Adjust value (0–31).
  - Bits 5–7: Reserved (not implemented/ignored).
- **Effect:** The value stored in R5 is added to the vertical total (the number of scan lines specified by the CRTC Vertical Total register) to form the final frame scan‑line count. Each unit equals one raster scan line; total frame time increases by (value × scanline_time).
- **Access:** Write‑only — the CRTC does not provide a readback for this register.
- **Typical use:** Small adjustments to frame timing to match monitor refresh requirements or to compensate for other timing differences in the video pipeline.

**Example Timing Calculation**
To illustrate the effect of the Vertical Total Adjust register on frame timing, consider the following example:

- **Horizontal Total (R0):** 63 characters
- **Horizontal Displayed (R1):** 40 characters
- **Vertical Total (R4):** 38 character rows
- **Vertical Total Adjust (R5):** 6 scan lines
- **Maximum Raster Address (R9):** 7 scan lines per character row
- **Dot Clock Frequency:** 16 MHz

**Calculations:**

1. **Character Time (tc):**
   \[ tc = \frac{1}{\text{Dot Clock Frequency}} \times (\text{Horizontal Total} + 1) \]
   \[ tc = \frac{1}{16 \times 10^6} \times (63 + 1) \]
   \[ tc = \frac{64}{16 \times 10^6} \]
   \[ tc = 4 \times 10^{-6} \text{ seconds} \]
   \[ tc = 4 \text{ microseconds} \]

2. **Scan Line Time (ts):**
   \[ ts = (\text{Horizontal Total} + 1) \times tc \]
   \[ ts = 64 \times 4 \times 10^{-6} \]
   \[ ts = 256 \times 10^{-6} \text{ seconds} \]
   \[ ts = 256 \text{ microseconds} \]

3. **Total Number of Scan Lines per Frame (N):**
   \[ N = (\text{Vertical Total} + 1) \times (\text{Maximum Raster Address} + 1) + \text{Vertical Total Adjust} \]
   \[ N = (38 + 1) \times (7 + 1) + 6 \]
   \[ N = 39 \times 8 + 6 \]
   \[ N = 312 + 6 \]
   \[ N = 318 \text{ scan lines} \]

4. **Frame Time (tf):**
   \[ tf = N \times ts \]
   \[ tf = 318 \times 256 \times 10^{-6} \]
   \[ tf = 81.408 \times 10^{-3} \text{ seconds} \]
   \[ tf = 81.408 \text{ milliseconds} \]

5. **Frame Rate (fr):**
   \[ fr = \frac{1}{tf} \]
   \[ fr = \frac{1}{81.408 \times 10^{-3}} \]
   \[ fr \approx 12.29 \text{ Hz} \]

In this example, setting R5 to 6 adds 6 additional scan lines to the frame, resulting in a total of 318 scan lines per frame. This increases the frame time to approximately 81.408 milliseconds, yielding a frame rate of about 12.29 Hz.

## References
- "CRTC register set" — general CRTC register descriptions (covers how Vertical Total and Vertical Total Adjust combine)
- "Motorola MC6845 Cathode Ray Tube Controller" — detailed timing calculations and register descriptions
- "The Amstrad CPC CRTC" — comprehensive guide on CRTC registers and their functions