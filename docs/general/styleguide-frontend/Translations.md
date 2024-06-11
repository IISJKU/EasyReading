---
id: translations
sidebar_position: 5
title: Translations(i18n)
author: RJonuzaj
---

In order to have a consistent handling of translations, the following rules shall be followed:

## Goal

The aim of this guide is to define how we will handle translations in terms of **usage**, **naming**, **approach** and **styling** in an attempt to **uniform our translations** to make them **easier to use** & **read**.

## Word definitions

A translation always has a **key** and a **value**: "scope.example": "Example". The key is used to reference the value / translation inside the code.

We differentiate between **functional**, **common** and **package-scoped** translations.

**functional**: A translation that is commonly used and has nothing to do with a specific feature

**common**: A translation that is used within multiple packages

**package-scoped**: A translation that is only used within a specific package (shared, widgets, …)

## General rules

- While implementing (and already available inside the project) **always** use translations and not hard-coded strings!
- **Before** adding a new translation string make sure it is **not already defined**.
- The default language is english, if a string is not yet inside the corresponding translation file add it to the english one.
- Naming guidelines of the keys:
  - Use CamelCase
  - Use "." to "nest" keys in order better know where and for what a string is used - for example "profile.role.header" is a string that is used for the header of the role of the user profile.
  - NO uppercase except for acronyms like "A+", "AAA" etc
  - NO underscore like "view_detail_header" - **only exception:** if it is used for plural strings like "\_other", "\_one" etc
  - Always start with a lowercase letter
  - Always start with the name of the project - for example "settings" for settings, "easy.reading" for the Easy Reading and so on

## Styling

We try to avoid styling translations inside the translation files as it makes the design less flexible and might lead to having the same string in different stylings inside the file.

Bad example:

```typescript
{
    "edit.profileHeader": "PROFILE",
    "edit.profileHeaderSmall": "Profile",
    "edit.profileHeaderBold": "<strong>Profile<strong>",
    ...
}
<Text>{t("edit.profilesHeaderSmall")}</Text>
<Text>{t("edit.profileHeader")}</Text>
<Text>{t("edit.profileHeaderBold")}</Text>
```

Good example:

```typescript
{
    "edit.profileHeader": "Profile",
    ...
}

<Text>{t("edit.profileHeader")}</Text>
<Text styles={TextInCapslock}>{t("edit.profileHeader")}</Text>
<Text styles={TextInBold}>{t("edit.profileHeader")}</Text>
```

:::warning
We _do_ style translations if a string has a formated part inside it. This is to avoid having to split the string into multiple parts.

For example:

```typescript
"edit.textSubtitle": "These texts are <strong>super important</strong> to us.",
"edit.roleUser": "Are you sure that you want to assign <strong>{{role}}</strong> to this user?",
```

or

```typescript
{ "messages.oldGroupsInMcoInfo": "You may add users to groups in the <Link>Management Console</Link>.", ... }

<Trans
    i18nKey="messages.oldGroupsInMcoInfo"
    components={{
        Link: (
            <Link
                styles={groupInfoLinkStyles}
                href="https://google.com/"
                target="_blank"
            />
        )
    }}
/>
```

:::

## Additional Resources

- [i18next](https://www.i18next.com/)
