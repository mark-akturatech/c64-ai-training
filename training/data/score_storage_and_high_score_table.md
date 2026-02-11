# Practical scoring considerations

**Summary:** Reserve enough bytes in score storage to accommodate extremely high scores and avoid digit rollover; optionally implement a high-score table that stores player names to encourage competition.

## Practical guidance
- Reserve sufficient storage for the score representation so an unusually large score cannot cause a rollover (e.g., avoid the display or memory changing from all 9s to all 0s).
- Do not assume current playtesting limits reflect absolute limits — allocate room for scores much larger than anticipated.
- Optionally provide a high-score table that records top players' scores and lets them enter names to encourage competition and replayability.
- Keep the scoring data structure and persistence (RAM/disk) in mind when allocating bytes so stored tables and names survive as intended across sessions.

## References
- "scoring_principles" — expands on how scoring design should be made visible and meaningful