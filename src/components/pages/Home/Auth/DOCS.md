# Auth Component Documentation

## Overview

The Auth component handles authenticated user's home page, displaying personalized greetings, language selection, activity selection, and navigation to contribution sessions.

## Functions

### fetchProfile(lang) {#fetchProfile}

Fetches user profile data and applies user preferences.

**Parameters:**

- `lang` (string) - The language code to use as fallback

**Description:**
Retrieves user profile, sets language/theme preferences, and applies accessibility settings.

#### Conditional Logic Breakdown {#fetchProfile-conditionals}

##### 1. Language Selection Logic

```javascript
if (!response?.data?.languageCode)
```

**What it does:** Checks if user has no saved language preference.

- **If true:** Uses fallback language parameter and finds details from selection array
- **If false:** Uses saved language from user profile

##### 2. Reduced Motion Preference

```javascript
if (!localStorage.getItem("reduceMotion"))
```

**What it does:** Only sets motion preference if not already stored locally.

- Checks system preference - if system has reduced motion enabled, stores "true"
- Otherwise uses user's profile setting

##### 3. Link Underline Styling

```javascript
if (response?.data?.isUnderline)
```

**What it does:** Applies user's link underline preference to all anchor tags.

- **If enabled:** Adds underline decoration to all links on page
- **If disabled:** Removes underline decoration from all links

##### 4. Font Family Configuration

```javascript
if (!localStorage.getItem("altFont"))
```

**What it does:** Only applies font settings if not already cached.

**Nested logic:**

- `if (response?.data?.isAlternateFont)` - Choose between Atkinson or Inter font families
- `if (response?.data?.isBold)` - Within each font family, choose bold or regular variant

Sets CSS custom property `--font-family` with complete font stack including fallbacks for various languages.

##### 5. Theme Management

```javascript
if (response?.data?.displayTheme !== "default")
```

**What it does:** Handles theme selection:

- **If user has specific theme (dark/light):** Applies that theme and saves to localStorage
- **If user has "default" theme:** Sets to "auto" mode and uses system preference

##### 6. Ongoing Contribution Cleanup

```javascript
if (response?.data?.ongoingContribution)
```

**What it does:** If user has unfinished contribution session, automatically ends it to clean up state.

### getActivities(id) {#getActivities}

Fetches available activities for a specific language.

**Parameters:**

- `id` (number) - The language ID to fetch activities for

**Description:**
Retrieves and sets available contribution activities for the selected language.

### getLexemeLanguage(search) {#getLexemeLanguage}

Fetches available lexeme languages with optional search filter.

**Parameters:**

- `search` (string) - Optional search query to filter languages

**Description:**
Retrieves list of available languages for lexeme contribution.

### gotoSession() {#gotoSession}

Navigates to the appropriate session page based on selected activity.

**Description:**
Updates store with current selections and routes to session page based on selected activity type:

- `connect` → `/session-connect`
- `script` → `/session-script`
- `hyphenation` → `/session-hyphenation`

## Lifecycle Hooks

### onMounted() {#onMounted}

Component lifecycle hook - initializes component data on mount.

**Description:**
Sets up default language, fetches profile and language data.

## Watchers

### searchQuery Watcher {#searchQuery-watcher}

Watcher for search query changes.

**Description:**
Triggers language search when search query changes.

### selectedLang Watcher {#selectedLang-watcher}

Watcher for selected language changes.

**Description:**
Fetches activities when language selection changes.

## Component Structure

### Template Elements

- **Title Section:** Personalized greeting with user's name
- **Language Selection Menu:** Clickable menu to open language contribution dialog
- **Activity Selection Menu:** Clickable menu to open activity selection dialog
- **Action Buttons:** Start session button and tutorial link

### Dialogs

- `GuideDialog` - Tutorial/guide dialog
- `ContributeLanguageDialog` - Language selection dialog
- `ActivityDialog` - Activity type selection dialog

## Key Features

- Responsive design with mobile-first approach
- Keyboard accessibility support
- Theme-aware styling (dark/light mode)
- RTL/LTR text direction support
- User preference persistence
- Accessibility settings application
