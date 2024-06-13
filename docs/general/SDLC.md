# Software Development Lifecycle

Using Jira from Atlassian, here is the Software Development Life Cycle (SDLC) for managing tasks. This SDLC framework in Jira ensures efficient task management and project tracking throughout the development process.

## Task States

````mermaid
flowchart TD
product-backlog -->|sprint-planning| to-do
to-do -->|assigned to dev| is-blocked{everything clear}
is-blocked -->|not-blocked| in-progress
is-blocked -->|blocked| blocked
blocked -->|unblocked| to-do
in-progress --> in-code-review
in-code-review --> testable{can be tested}
testable -->|yes| manual-testing
manual-testing -->|moved by tester| review{can be reviewed}
testable -->|no| review{can be reviewed}
review --> |yes| po-review
review --> |no| closed
po-review -->|moved by PO| closed
````

## Development LC

[Development LC](https://integriert-studieren-jku.atlassian.net/wiki/x/MIAO)
