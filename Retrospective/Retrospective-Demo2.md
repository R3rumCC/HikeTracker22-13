TEMPLATE FOR RETROSPECTIVE (Team ##13)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done 4/4
- Total points committed vs. done 9/9
- Nr of hours planned vs. spent (as a team) 59/72

**Remember**a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |         |        |            |              |
|  HT-2  |    2    |     2   |    6     |      7       |
|  HT-5  |    2    |     2   |    2     |      1       |
|  HT-6  |    2    |     2   |    1     |      1       |
|  HT-7  |    2    |     3   |    3     |      7       |


   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
  - Hours per task estimated: 12/8= 1.5h
  - Hours per task actual: 16/8 = 2h
  - Standard Deviation estimated: 1,87
  - Standard Deviation actual: 3

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
  - 12/16 - 1 = 0.75 - 1 = -0.25
  
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 8h
  - Nr of automated unit test cases: 73
  - Coverage (if available): 41.1%
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated: 10h
  - Total hours spent: 10h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

Requirements changes added complexity on almost completed tasks.

- What lessons did you learn (both positive and negative) in this sprint?

We learned that by committing to less stories in the sprint we were able to complete all of them. We need more complete and updated documentation especially on backend, and we learned that if more people are involved in db management problems can arise.

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
  We were able to better balance the story/task size with time budgeting. Also, we managed to work in pairs on several issues.

- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

Improve the documentation, appoint one team member responsible for the db.

- One thing you are proud of as a Team!!

We completed our improvement goals and for the first time we marked as done all the stories we committed to this sprint.