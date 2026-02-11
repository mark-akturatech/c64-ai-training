# Minimal C64 Datasette Loader — Pulse-duration Thresholds

**Summary:** Defines midpoint thresholds for classifying datasette tape pulse durations (used by tape loaders/get_pulse_routine). Searchable terms: datasette, pulse duration, threshold_short_medium, threshold_medium_long, get_pulse_routine.

## Threshold computation
Pulse durations measured from the tape (e.g., from a CIA timer or software counter) are classified into three nominal types: short, medium, and long. The thresholds used to separate these classes are the midpoints between the nominal lengths:

threshold_short_medium = (length_short + length_medium) / 2  
threshold_medium_long  = (length_medium + length_long) / 2

Use these thresholds to decide which nominal pulse type a measured duration falls into by comparing the measured value to the two thresholds:
- measured <= threshold_short_medium → short
- threshold_short_medium < measured <= threshold_medium_long → medium
- measured > threshold_medium_long → long

(These are simple midpoint discriminators — suitable when nominal lengths are stable and well-separated.)

## Usage
- Compute the two thresholds once (or whenever nominal lengths change), then use them for fast comparisons in the pulse sampling routine.
- The loader's "get_pulse_routine" should compare the measured timer value against threshold_short_medium and threshold_medium_long to classify the current pulse into short/medium/long categories for decoding tape data.

## References
- "get_pulse_routine" — compares measured timer value against thresholds
