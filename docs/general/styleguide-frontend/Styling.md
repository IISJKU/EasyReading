---
id: styling
sidebar_position: 3
title: Styling
author: RJonuzaj
---

## Introduction

First and foremost we can use `ThemeRoller` from [jQueryUI](https://jqueryui.com/) for styling.

You can find more information in `jquery-ui.css` and `jquery-ui.js`.

## CSS file structure example

```
MyComponent
|__MyComponent.jsx
|__MyComponent.scss
|__MyComponent.stories.js
|__MyComponent.test.jsx
SecondComponent
|__SecondComponent.jsx
|__SecondComponent.scss
|__SecondComponent.stories.js
|__SecondComponent.test.jsx
```

## Global Styles

If you need globally avaliable styles add them inside the respective global.css file

:::info
When writing styles try to use semantically correct HTML tags ([more info on semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html))
:::

## Styling

Inside the global.css file you will find:

```
- spacings (for gaps, paddings, margins, ...)
- border-radius
- colors
- fontsize
- fontWeight
- lineHeight
- viewPort
```

## Additional

### Spacings

#### Default Spacings

| property | size |
| -------- | ---- |
| xs       | 4px  |
| s        | 8px  |
| sm       | 12px |
| m        | 16px |
| ml       | 20px |
| l        | 24px |
| xl       | 32px |
| xxxl     | 40px |

#### Spacing Function

In case the needed spacing is not within these options use: `spacing(x)`. `spacing(x)` multiples the given value by 4

```ts
spacing(4); // => 16px
spacing(0.5); // => 2px
```

### Border Radius

#### Default Border Radius

| property | size |
| -------- | ---- |
| xs       | 2px  |
| sxs      | 4px  |
| s        | 6px  |
| m        | 8px  |
| l        | 16px |
| xl       | 20px |

#### Border Radius Function

In case the needed border radius is not within these options use: `borderRadius(x)`. borderRadius() multiples the given value by 2

```ts
borderRadius(2); // => 4px
borderRadius(0.5); /// => 1px
```

### Font Size

#### Default Font Size

| property | size |
| -------- | ---- |
| xs       | 12px |
| s        | 14px |
| m        | 16px |
| l        | 18px |
| xl       | 22px |
| xxl      | 24px |

#### Example How to use it

By creating a global stylesheet `global.css` and define variables inside of it for color, spacing, border radius, font size etc we make these attributes global therefore it makes it possible to change all instances at once if necessary.

In styling you will use `var() CSS function` to insert the value of a custom property (sometimes called a "CSS variable") instead of any part of a value of another property, as shown below:

```
#customBtn {
    display: inline-block;
    background: var(--color-white); - globally attribute for color white
    width: 1rem;
    border-radius: var(--border-radius-m); - globally attribute for border radius 8px
    border: thin solid var(--color-primary-dark);/ - globally attribute for border color dark blue
    white-space: nowrap;
    text-decoration: none;
}
```

### ViewPorts

available viewports:

- `sm` : max-width: 320px
- `md` : max-width: 768px
- `lg` : max-width: 1140xp

### Other Libraries (Suggestion for future work)

- FluentUI
  - [Components](https://developer.microsoft.com/en-us/fluentui#/controls/web)
  - [Icons](https://react.fluentui.dev/?path=/docs/concepts-developer-icons-icons-catalog--page)
  - [Github Repo](https://github.com/microsoft/fluentui/tree/3dbb57b1e6940df2d4039f61a35d961bcb8560c3/packages/react)
