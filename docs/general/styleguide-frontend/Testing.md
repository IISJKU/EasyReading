---
id: testing
sidebar_position: 4
title: Testing
author: RJonuzaj
---

:::info

- new code should have tests associated with it
- when fixing a bug add a test case to prevent regressions
  :::

## General

- lift up test-constants & helpers if needed
- when fixing a bug add test-case covering to prevent regressions

## Testing Components

[Use Testing Library](https://jestjs.io/)

### Structure & Naming

- Tests should be placed next to the associated component in the file tree

```
.
└── component/
    ├── Component.tsx
    └── Component.test.tsx
```

### Mocking

- when mocking a module with `jest.mock` always include `...jest.requireActual()`

### Additional Info

- use `renderWithProvider`
- prefer `findBy` queries over `getBy` queries

