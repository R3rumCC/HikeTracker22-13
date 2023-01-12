# TEMPLATE FOR RETROSPECTIVE (Team 13)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 7/7
- Total points committed vs done 37/34
- Nr of hours planned vs spent (as a team) 72/63

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| HT-17 | 3       | 13     | 16         | 7.5          |
| HT-18 | 2       | 5      | 6          | 6            |
| HT-34 | 1       | 2      | 3          | 1.5          |
| HT-9  | 1       | 2      | 6          | 4            |
| HT-33 | 1       | 5      | 6          | 8.5          |
| HT-31 | 0       | 2      | 0          | 0            |
| HT-32 | 2       | 3      | 10         | 9            |   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  - Hours per task estimated: = 47/10 = 4.7
  - Hours per task actual: 36.5/10 = 3.65
  - Standard Deviation estimated: 4.74
  - Standard Deviation actual: 3.23
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1 = (47/36.5 -1)= 0.288

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 4
  - Total hours spent: 2
  - Nr of automated unit test cases: 112
  - Coverage (if available): 50,83%
- E2E testing:
  - Total hours estimated: 4
  - Total hours spent: 0.5
- Code review
  - Total hours estimated: 2
  - Total hours spent: 2
- Technical Debt management:
  - Total hours estimated: 3
  - Total hours spent: 4.5
  - Hours estimated for remediation by SonarQube: 4d 7h 20m
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 1d 4h 41m
  - Hours spent on remediation: 4.5
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.9%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): 
    - Reliability: C (after remediation: A)
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)?

  - We overestimated the story HT-17 thinking that it would have been the more 'heavy' of this sprint, instead it took less time than what we thought
 
- What lessons did you learn (both positive and negative) in this sprint?

  - Almost every team mate has learned to work with the others trying to have good communication. Sometimes, this communication has failed and one of our team mates started to work on a story that wasn't even committed and in a lower priority, without respecting the order of the stories. This has made us learn that communication is foundamental to avoid these errors.

- Which improvement goals set in the previous retrospective were you able to achieve?
  - We spent more time on DB. 
- Which ones you were not able to achieve? Why?
  - We didn't assign just one person to the db and we didn't spent enough time on API response
    - For the first goal at least we improved our communication when somebody was working on db to avoid problems.
    - For the second goal we just hadn't enough time to work on it.
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Make all the team members more partecipative. Try to ask a feedback before take decisions.

> Propose one or two

- One thing you are proud of as a Team!!

Each of us tried to be helpfull, sometimes doing well, sometimes doing wrong. But we tried to be solid and achive our goals in any case.
