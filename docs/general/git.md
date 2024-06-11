# Git Best Practices

## Merge Requests

### For MR Creators

- MR Titles should follow a convention [spec can be found here](https://integriert-studieren-jku.atlassian.net/wiki/x/AwAP)
- Keep MRs atomic, 1 Merge Request resolves 1 Ticket/Issue
- ⚠️ if the Merge Request contains changes to the `easy-reading` include a changeset (if this will be added in the future)  

#### Draft MRs

Draft MRs should be used when you want to keep potential reviewers in the loop about your implementation ,i.e when doing large refactoring work or introducing a new concept/design [spec can be found here](https://integriert-studieren-jku.atlassian.net/wiki/x/EAAP)

### For Reviewers

- Review ASAP
- watch out for any violations of the style-guide

## Git

- try to keep commits atomic  
- follow the conventional commit standard, [spec can be found here](https://integriert-studieren-jku.atlassian.net/wiki/x/I4AO)
- following scopes are available: *List of Scopes*
- 1 dev per branch, if your tasks requires changes that have not been merged upstream yet, checkout a new from the branch that includes these changes
- for keep your branch up-to-date prefer **rebasing** over merging
