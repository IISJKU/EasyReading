# Documentation Guide

## Writing Docs

- create new files with CLI
- front-matter should be provided

### Templates

following templates are avaliable:

- ADR
- Design Spec
- Default

### Style Guide

- try to not add negativ examples, focus on the positive usage examples, if neccessary hide behind a section with a warning/error admonition
- Documentation should be a part of the MR where the to-be-documented code/concept gets introduced
- use spell-checking (i.e via the Code Spell Checker VS-Code plugin)
- conform to MarkdownLint
- Changes to the Styleguide need approval from the Team & should be communicated
- Do not document stuff where the source-of-truth is something not in our control, just provide a link to the source
- use mermaid for diagrams

## Rule of Thumb when & where to add documentation

- Architecture Design Records
  - ADRs when introducing new architecture (Tracing, etc...) **use `ADR` template**
    - Useful to gain an understanding why a certain tool/approach was used down the line
- Inline Documentation for complex/non-obvious implementation details
- JsDoc/ NodeDoc for utils functions
- Design Specs
  - for complex/non-obvious code structures (i.e Structure for Auth)  --> **use `Design Spec` Template**
  - should give an overview over the general functionality
  - should state motivations behind the approach
  - can/should state caveats of implementation
