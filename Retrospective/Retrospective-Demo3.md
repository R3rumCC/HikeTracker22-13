# TEMPLATE FOR RETROSPECTIVE (Team 13)

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES

### Macro statistics

- Number of stories committed vs done 5/1
- Total points committed vs done 17/2
- Nr of hours planned vs spent (as a team) 72/60

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| HT8   | 2       | 2      | 7          | 6            |

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation):
  Average: 6/2= 3h, Std Deviation: 0.5
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1 = (7/6 -1)= 0.166

## QUALITY MEASURES

- Unit Testing:
  - Total hours estimated: 4h
  - Total hours spent: 4h
  - Nr of automated unit test cases: 90
  - Coverage (if available): 65,7%
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review
  - Total hours estimated: 12
  - Total hours spent: 19
- Technical Debt management:
  - Total hours estimated: 5h
  - Total hours spent: 2h 30m
  - Hours estimated for remediation by SonarQube: 3d 1h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 4h 57m
  - Hours spent on remediation: 2h 30m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.9%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): 
    - Reliability: A
    - Security: A
    - Maintainability: A

## ASSESSMENT

- What caused your errors in estimation (if any)?

Updating the stories to be FAQ requirements took more time than expected and we could not use the entire time budget

- What lessons did you learn (both positive and negative) in this sprint?

STo be more weary of flase positives when using SonarCloud. 

- Which improvement goals set in the previous retrospective were you able to achieve?
- Which ones you were not able to achieve? Why?

We were able to improve the documentation where needed, but we did not have enough time to perform an overhaul of the DB

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

Appoint a member of team as responsible of the db and work on the API response

> Propose one or two

- One thing you are proud of as a Team!!

Even though we did not finish all the stories we committed to, we managed to create a solid foundation for future development