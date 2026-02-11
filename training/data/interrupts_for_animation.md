# Why you need interrupts in games

**Summary:** Interrupts (periodic or raster interrupts) are required when the main program performs lengthy calculations or is otherwise busy so the system can update animation and timing; take control at least once every other screen to avoid jerky motion.

## Explanation
When the main program performs long calculations or stays busy for extended periods, it can prevent timely updates to animation and screen-related tasks. Using periodic interrupts lets a handler run independently of the main program to perform display updates, sync animation, or service time-critical tasks. Without such interrupts, animation updates will be delayed and appear jerky; the guideline is to take control at least once every other screen to maintain smooth motion.

(See raster interrupts for gaining CPU at a specific screen position; see interrupt preparation for disabling other interrupts before enabling a custom handler.)

## References
- "raster_interrupts_overview" — expands on Use raster interrupts to gain CPU at a screen position
- "disable_other_interrupts" — expands on Prepare system before enabling custom interrupts
