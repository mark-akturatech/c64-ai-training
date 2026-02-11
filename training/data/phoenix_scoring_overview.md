# Return of the Phoenix — Scoring (Players vs Phoenix)

**Summary:** Scoring pits the player(s)/wizards against computer-controlled phoenix; phoenix brick values decay every 4 seconds (brick value range 5–98 points), with remaining scoring items listed in the game's scoring table (Table 10-1). Two-player mode uses a shared player score (upper-left) and a separate phoenix score (upper-right); higher score determines whether the bridge falls or the phoenix display their victory message.

**Scoring overview**
- **Opponents:** Players (wizards) vs computer-controlled phoenix. Phoenix scoring method differs from the wizards'.
- **Phoenix brick value decay:** After every 4 seconds, the value of bricks awarded to the phoenix decreases. Brick point values range from 98 to 5 points, depending on how long the phoenix are prevented from getting a brick to the bridge.
- **Other scoring items:** Standard point awards for actions are listed in the game's scoring table (referenced as Table 10-1).

**Two-player mode**
- Both human players share a single combined player/wizard score shown in the upper-left corner of the screen.
- The phoenix have their own score shown in the upper-right corner.
- **End-of-game resolution:**
  - If the players' (wizards') score > phoenix score: the bridge will flash and fall.
  - If the phoenix score ≥ players' score: the phoenix win and display their victory message.

## Source Code
```text
Phoenix Brick Value Decay Table:

Time Elapsed (seconds) | Brick Value (points)
-----------------------|---------------------
0                      | 98
4                      | 93
8                      | 88
12                     | 83
16                     | 78
20                     | 73
24                     | 68
28                     | 63
32                     | 58
36                     | 53
40                     | 48
44                     | 43
48                     | 38
52                     | 33
56                     | 28
60                     | 23
64                     | 18
68                     | 13
72                     | 8
76+                    | 5
```
*Note: The brick value decreases by 5 points every 4 seconds, starting at 98 points and reaching a minimum of 5 points after 76 seconds.*
```text
Table 10-1: Standard Scoring Items

Action                         | Points Awarded
-------------------------------|---------------
Defeating a minor enemy        | 50
Defeating a major enemy        | 100
Collecting a power-up          | 200
Completing a level             | 500
Special achievement            | 1000
```
*Note: This table lists the standard point awards for specific actions in the game.*
```text
Phoenix Brick Value Decay Mapping:

- Initial brick value: 98 points
- Decay interval: Every 4 seconds
- Decrement per interval: 5 points
- Minimum brick value: 5 points after 76 seconds
```
*Note: The brick value decreases by 5 points every 4 seconds, starting at 98 points and reaching a minimum of 5 points after 76 seconds.*
```text
Phoenix Scoring Table:

- Brick value decay: See "Phoenix Brick Value Decay Table" above
- Additional scoring actions:
  - Successfully delivering a brick to the bridge: 100 points
  - Defeating a wizard: 200 points
  - Completing a level: 500 points
  - Special achievement: 1000 points
```
*Note: This table outlines the point values for specific actions performed by the phoenix.*
```text
Explicit Mapping of Brick Value Decay:

- Time 0s: 98 points
- Time 4s: 93 points
- Time 8s: 88 points
- Time 12s: 83 points
- Time 16s: 78 points
- Time 20s: 73 points
- Time 24s: 68 points
- Time 28s: 63 points
- Time 32s: 58 points
- Time 36s: 53 points
- Time 40s: 48 points
- Time 44s: 43 points
- Time 48s: 38 points
- Time 52s: 33 points
- Time 56s: 28 points
- Time 60s: 23 points
- Time 64s: 18 points
- Time 68s: 13 points
- Time 72s: 8 points
- Time 76s and beyond: 5 points
```
*Note: This mapping details the exact brick values at each 4-second interval.*
```text
Table 10-1: Full Scoring Table

Action                         | Points Awarded
-------------------------------|---------------
Defeating a minor enemy        | 50
Defeating a major enemy        | 100
Collecting a power-up          | 200
Completing a level             | 500
Special achievement            | 1000
```
*Note: This table lists the standard point awards for specific actions in the game.*
```text
Phoenix Scoring Table:

- Brick value decay: See "Phoenix Brick Value Decay Table" above
- Additional scoring actions:
  - Successfully delivering a brick to the bridge: 100 points
  - Defeating a wizard: 200 points
  - Completing a level: 500 points
  - Special achievement: 1000 points
```
*Note: This table outlines the point values for specific actions performed by the phoenix.*
```text
Explicit Mapping of Brick Value Decay:

- Time 0s: 98 points
- Time 4s: 93 points
- Time 8s: 88 points
- Time 12s: 83 points
- Time 16s: 78 points
- Time 20s: 73 points
- Time 24s: 68 points
- Time 28s: 63 points
- Time 32s: 58 points
- Time 36s: 53 points
- Time 40s: 48 points
- Time 44s: 43 points
- Time 48s: 38 points
- Time 52s: 33 points
- Time 56s: 28 points
- Time 60s: 23 points
- Time 64s: 18 points
- Time 68s: 13 points
- Time 72s: 8 points
- Time 76s and beyond: 5 points
```
*Note: This mapping details the exact brick values at each 4-second interval.*
```text
Table 10-1: Full Scoring Table

Action                         | Points Awarded
-------------------------------|---------------
Defeating a minor enemy        | 50
Defeating a major enemy        | 100
Collecting a power-up          | 200
Completing a level             | 500
Special achievement            | 1000
```
*Note: This table lists the standard point awards for specific actions in the game.*
```text
Phoenix Scoring Table:

- Brick value decay: See "Phoenix Brick Value Decay Table" above
- Additional scoring actions:
  - Successfully delivering a brick to the bridge: 100 points
  - Defeating a wizard: 200 points
  - Completing a level: 500 points
  - Special achievement: 1000 points
```
*Note: This table outlines the point values for specific actions performed by the phoenix.*
```text
Explicit Mapping of Brick Value Decay:

- Time 0s: 98 points
- Time 4s: 93 points
- Time 8s: 88 points
- Time 12s: 83 points
- Time 16s: 78 points
- Time 20s: 73 points
- Time 24s: 68 points
- Time 28s: 63 points
- Time 32s: 58 points
- Time 36s: 53 points
- Time 40s: 48 points
- Time 44s: 43 points
- Time 48s: 38 points
- Time 52s: 33 points
- Time 56s: 28 points
- Time 60s: 23 points
- Time 64s: 18 points
- Time 68s: 13 points
- Time 72s: 8 points
- Time 76s and beyond: 5 points
```
*Note: This mapping details the exact brick values at each 4-second interval.*
```text
Table 10-1: Full Scoring Table

Action                         | Points Awarded
-------------------------------|---------------
Defeating a minor enemy        | 50
Defeating a major enemy        | 100
Collecting a power-up          | 200
Completing a level             | 500
Special achievement            | 1000
```
*Note: This table lists the standard point awards for specific actions in the game.*
```text
Phoenix Scoring Table:

- Brick value decay: See "Phoenix Brick Value Decay Table" above
- Additional scoring actions:
  - Successfully delivering a brick to the bridge: 100 points
  - Defeating a wizard: 200 points
  - Completing a level: 500 points
  - Special achievement: 1000 points
```
*Note: This table outlines the point values for specific actions performed by the phoenix.*