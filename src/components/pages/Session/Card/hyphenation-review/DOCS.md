# Hyphenation Review Component Documentation

## Overview

The Hyphenation Review component is the final confirmation interface in the hyphenation workflow. It displays a preview of the hyphenation pattern that will be applied to a lexeme, allowing users to review their hyphenation marks before final submission.

## Key Features

- **Hyphenation Preview**: Visual representation of hyphenation breaks with interpunct (‧) symbols
- **Lexeme Display**: Shows the original lexeme with associated metadata
- **Visual Connection**: Arrow indicator between lexeme and hyphenation result
- **Decision Interface**: Back and submit buttons for user actions
- **Theme Support**: Full dark/light mode compatibility
- **Internationalization**: Multi-language support through i18n

## Component Structure

### Props

#### headerRef {#headerRef-prop}

**Type:** `Object`

**Description:**
Reference to the header element for potential DOM manipulation or styling synchronization.

**Usage:**
Passed from parent component to maintain header consistency across different card modes.

#### data {#data-prop}

**Type:** `Object`

**Description:**
Contains the lexeme information being hyphenated.

**Structure:**
```javascript
{
  lemma: String,              // The word to be hyphenated
  externalLexemeFormId: String, // External form identifier
  gloss: String,              // Definition/meaning of the word
  id: String                  // Unique identifier for the lexeme
}
```

#### detail {#detail-prop}

**Type:** `Object`

**Description:**
Contains the hyphenation pattern as a comma-separated string.

**Example:**
```javascript
"hy,phen,a,tion" // Will display as "hy‧phen‧a‧tion"
```

#### img {#img-prop}

**Type:** `String`

**Description:**
URL for the lexeme's associated image. Falls back to default Wikimedia logo if not provided.

#### currLang {#currLang-prop}

**Type:** `String`

**Description:**
Current language code used for displaying language-specific empty state messages.

## Emitted Events

### backtoItem {#backtoItem-event}

**Trigger:** When user clicks "Back" button

**Description:**
Signals parent component to return to the hyphenation input interface.

**Payload:** None

**Usage Example:**
```javascript
@backtoItem="handleBackNavigation"
```

### onDone {#onDone-event}

**Trigger:** When user clicks "Submit" button

**Description:**
Confirms the hyphenation and passes the data to parent for submission.

**Payload:**
```javascript
{
  hyphenation: Array  // Array of hyphenated segments
}
```

**Example Payload:**
```javascript
{
  hyphenation: ["hy", "phen", "a", "tion"]
}
```

**Usage Example:**
```javascript
@onDone="submitHyphenation"
```

## Computed Properties

### isThemeDark {#isThemeDark-computed}

**Returns:** `Boolean`

**Description:**
Retrieves the current theme state from the Vuex store.

**Implementation:**
```javascript
computed(() => vuex.getters["profile/isDark"])
```

**Usage:**
Determines which version of the add icon to display (light/dark theme variants).

## Template Sections

### Header Section {#header-section}

**Description:**
Fixed header with review title.

**Features:**
- Gray background (#54595D)
- White text for high contrast
- Bold typography
- Fixed positioning during scroll

### Lexeme Display Section {#lexeme-display}

**Description:**
Shows the original lexeme being hyphenated.

**Components:**
- Thumbnail image or default Wikimedia logo
- Lexeme term with external form ID
- Gloss (definition) or empty state message

**Empty State Handling:**
When no gloss is available, displays: "No description for [language]"

### Connection Arrow {#connection-arrow}

**Description:**
Visual connector between lexeme and hyphenation sections.

**Implementation:**
- CSS triangle pointing downward
- Adapts to theme (light/dark border colors)
- Centers automatically between sections

### Hyphenation Display Section {#hyphenation-display}

**Description:**
Shows the hyphenated result with visual breaks.

**Features:**
- Green "add" icon indicating new hyphenation
- Translation key for "New hyphenation" label
- Hyphenation pattern with interpunct (‧) symbols
- Gray background to distinguish from lexeme section

**Hyphenation Transformation:**
```javascript
props?.detail?.split(",").join("‧")
// "hy,phen,a,tion" → "hy‧phen‧a‧tion"
```

### Action Buttons Section {#action-buttons}

**Description:**
Fixed footer with decision buttons.

**Buttons:**
1. **Back Button:** Returns to hyphenation input
2. **Submit Button:** Confirms the hyphenation (primary action)

**Layout:**
- Equal width buttons (50% each)
- Gap spacing between buttons
- Fixed positioning at bottom
- Border separator from content

## Styling

### Custom CSS Classes

#### arrow {#arrow-style}

**Description:**
Creates a CSS triangle for visual connection.

```css
.arrow {
  width: 0;
  height: 0;
  border-left: 0.75rem solid transparent;
  border-right: 0.75rem solid transparent;
  border-bottom: 0.75rem solid #eaecf0;
}
```

**Dark Mode Adaptation:**
```css
dark:border-b-[#27292D]
```

#### custom-thumbnail {#custom-thumbnail-style}

**Description:**
Adjusts thumbnail display for default images.

```css
.custom-thumbnail .cdx-thumbnail__image {
  background-size: auto !important;
  background-position: center !important;
  background-color: transparent !important;
}
```

**Purpose:**
Ensures the default Wikimedia logo displays properly without stretching or background issues.

## Data Processing

### Hyphenation Format Conversion

**Input Format:** Comma-separated string
```javascript
"hy,phen,a,tion"
```

**Display Format:** Interpunct-separated string
```javascript
"hy‧phen‧a‧tion"
```

**Submission Format:** Array of segments
```javascript
["hy", "phen", "a", "tion"]
```

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy (h4)
- **Screen Reader Support**: CdxLabel components provide accessible labels
- **Button Accessibility**: Clear action buttons with descriptive text
- **Language Context**: Shows current language for empty states
- **Focus Management**: Proper tabindex handling
- **High Contrast**: White text on dark backgrounds

## Theme Support

### Light Mode
- White backgrounds (#FFFFFF)
- Gray text for secondary content (#54595D)
- Light gray section backgrounds (#eaecf0)
- Standard borders

### Dark Mode
- Dark backgrounds (#101418)
- Light text (#EAECF0)
- Dark gray section backgrounds (#27292D)
- Adjusted text colors (#A2A9B1)

## Internationalization

### Translation Keys Used

- `session.preview.title` - Review header title
- `session.preview.lexeme` - Lexeme section label
- `session.hyphenationPreview.newStatement` - New hyphenation label
- `session.preview.button1` - Back button text
- `session.preview.button2` - Submit button text
- `session.emptyDescriptionHead` - Empty description prefix

## Component Dependencies

### Wikimedia Codex Components
- `CdxLabel` - Accessible labels and headings
- `CdxIcon` - Icon display (unused but imported)
- `CdxButton` - Action buttons
- `CdxThumbnail` - Image thumbnails with fallback

### Icons
- `cdxIconInfoFilled` - Information indicator (imported but unused)
- `cdxIconLogoWikidata` - Wikidata branding (imported but unused)

### Custom Assets
- `add.svg` - Light theme add icon
- `adddark.svg` - Dark theme add icon
- `lexeme.svg` - Default lexeme image

## Data Flow

1. **Parent Component** passes lexeme and hyphenation data via props
2. **Review Component** displays the hyphenation preview
3. **Data Transformation** converts comma-separated to interpunct display
4. **User Action** triggers either:
   - `backtoItem` to revise hyphenation
   - `onDone` to confirm and submit
5. **Parent Component** receives array of hyphenated segments

## Usage Example

```vue
<HyphenationReview
  :headerRef="headerElement"
  :data="lexemeData"
  :detail="hyphenationPattern"
  :img="lexemeImage"
  :currLang="currentLanguage"
  @backtoItem="handleBack"
  @onDone="handleSubmit"
/>
```

## Error Handling

### Empty States
- Missing gloss shows language-specific message
- Missing image falls back to default Wikimedia logo
- Null/undefined detail handled with fallback to empty string

### Data Validation
- Splits hyphenation string safely with null checks
- Uses optional chaining for nested properties
- Provides empty array fallback for hyphenation

## Performance Considerations

- **Fixed Positioning**: Header and footer remain fixed during scroll
- **Minimal Re-renders**: Computed properties cache theme state
- **Efficient String Operations**: Single join operation for display
- **Lightweight Components**: Uses Codex components for consistency

## Visual Design

### Layout Structure
```
┌─────────────────────────┐
│      Review Header      │ (Fixed)
├─────────────────────────┤
│                         │
│    Lexeme Display       │
│                         │
│           ▼            │ (Arrow)
│                         │
│  Hyphenation Display    │
│                         │
├─────────────────────────┤
│   Back  |   Submit      │ (Fixed)
└─────────────────────────┘
```

### Color Scheme
- **Header**: #54595D (gray)
- **Background**: White/Dark (#101418)
- **Section Background**: #eaecf0/#27292D
- **Text**: Dynamic based on theme
- **Borders**: CSS variable based

## Best Practices

1. **Always validate hyphenation data** before display
2. **Handle empty states gracefully** with appropriate messages
3. **Maintain visual hierarchy** with proper spacing
4. **Ensure accessibility** with proper labels and navigation
5. **Test theme transitions** for smooth experience
6. **Validate array conversion** before submission

## Known Limitations

1. No validation of hyphenation pattern correctness
2. No preview of how hyphenation affects text flow
3. Limited to single-word hyphenation
4. No undo after submission
5. No keyboard shortcuts for quick actions

## Future Enhancements

1. Add hyphenation pattern validation
2. Show syllable count indicator
3. Provide hyphenation rules reference
4. Add keyboard shortcuts (Enter to submit, Esc to go back)
5. Include confidence indicator for hyphenation
6. Add animation for hyphenation preview