# Review Component Documentation

## Overview

The Review component is the final confirmation interface in the lexeme connection workflow. It presents users with a preview of the connection they're about to create between a lexeme and a Wikidata entity, allowing them to review and confirm or go back to modify their selection.

## Key Features

- **Connection Preview**: Visual representation of the lexeme-to-entity connection
- **Bilingual Display**: Shows information in both source and display languages
- **Visual Feedback**: Thumbnails and icons for better recognition
- **Decision Interface**: Clear action buttons for confirmation or revision
- **Empty State Handling**: Graceful handling of "no suitable entity" scenarios
- **Theme Support**: Dark/light mode compatibility
- **Accessibility**: Screen reader support with proper labels

## Component Structure

### Props

#### headerRef {#headerRef-prop}

**Type:** `Object`

**Description:**
Reference to the header element for potential scroll synchronization or styling control.

**Usage:**
Passed from parent component to maintain header consistency across different card modes.

#### data {#data-prop}

**Type:** `Object`

**Description:**
Contains the lexeme information being reviewed.

**Structure:**
```javascript
{
  lemma: String,              // The lexeme term
  externalLexemeSenseId: String, // External identifier
  gloss: String,              // Definition/meaning
  id: String,                 // Lexeme ID
  statements: {
    images: {
      data: Array           // Associated images
    }
  }
}
```

#### detail {#detail-prop}

**Type:** `Object`

**Description:**
Contains the selected Wikidata entity information, or null for "no item" selections.

**Structure:**
```javascript
{
  id: String,           // Wikidata Q-identifier
  label: String,        // Entity label
  description: String,  // Entity description
  image: String        // Entity thumbnail URL
}
```

#### img {#img-prop}

**Type:** `String`

**Description:**
URL for the lexeme's associated image, falls back to default Wikimedia logo if not provided.

#### currLang {#currLang-prop}

**Type:** `String`

**Description:**
Current language code for displaying language-specific empty state messages.

## Emitted Events

### backtoItem {#backtoItem-event}

**Trigger:** When user clicks "Back" button

**Description:**
Signals parent component to return to the previous selection interface.

**Payload:** None

**Usage Example:**
```javascript
@backtoItem="handleBackNavigation"
```

### onDone {#onDone-event}

**Trigger:** When user clicks "Submit" button

**Description:**
Confirms the connection and passes the selection data to parent for submission.

**Payload:**
```javascript
{
  contributionDetailId: String,  // Lexeme ID
  itemId: String                 // Entity ID (empty string for "no item")
}
```

**Usage Example:**
```javascript
@onDone="submitConnection"
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
Determines which version of icons to display (light/dark theme variants).

## Template Sections

### Header Section {#header-section}

**Description:**
Fixed header displaying the review title.

**Features:**
- Gray background (#54595D)
- White text for contrast
- Fixed positioning for scroll stability

### Lexeme Display {#lexeme-display}

**Description:**
Shows the lexeme being connected.

**Components:**
- Thumbnail image or default Wikimedia logo
- Lexeme term with external ID
- Gloss (definition) or empty state message

**Empty State:**
When no gloss is available, displays italic text: "No description for [language]"

### Connection Arrow {#connection-arrow}

**Description:**
Visual connector between lexeme and entity sections.

**Styling:**
- CSS triangle pointing downward
- Adapts to theme (light/dark border colors)

### Entity Display {#entity-display}

**Description:**
Shows the selected Wikidata entity or empty state.

**Two States:**

1. **With Entity Selection:**
   - Green "add" icon indicating new connection
   - Statement type label (P5137)
   - Entity thumbnail with Wikidata logo fallback
   - Entity label with Q-identifier
   - Entity description or empty state

2. **No Entity Selection:**
   - Info icon with explanatory message
   - Indicates no suitable item found
   - Styled with gray background

### Action Buttons {#action-buttons}

**Description:**
Fixed footer with decision buttons.

**Buttons:**
1. **Back Button:** Returns to selection interface
2. **Submit Button:** Confirms the connection (primary action)

**Layout:**
- Equal width buttons
- Gap spacing for visual separation
- Fixed positioning at bottom

## Styling

### Custom CSS Classes

#### arrow {#arrow-style}

**Description:**
Creates a CSS triangle for visual connection between sections.

```css
.arrow {
  width: 0;
  height: 0;
  border-left: 0.75rem solid transparent;
  border-right: 0.75rem solid transparent;
  border-bottom: 0.75rem solid #eaecf0;
}
```

**Dark Mode:**
Border color changes via Tailwind class: `dark:border-b-[#27292D]`

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
Ensures default Wikimedia logo displays properly without stretching.

## Accessibility Features

- **Semantic HTML**: Proper heading hierarchy and label elements
- **Screen Reader Support**: CdxLabel components provide accessible labels
- **Button Roles**: Clear action buttons with descriptive text
- **Language Indication**: Shows current language context for empty states
- **Focus Management**: Interactable class on buttons for keyboard navigation

## Theme Support

### Light Mode
- White backgrounds for content areas
- Gray (#54595D) for secondary text
- Light gray (#eaecf0) for section backgrounds

### Dark Mode  
- Dark backgrounds (#101418, #27292D)
- Light text (#EAECF0)
- Adjusted contrast for readability
- Darker borders and separators

## Internationalization

### Translation Keys Used

- `session.preview.title` - Review header title
- `session.preview.lexeme` - Lexeme section label
- `session.preview.newStatement` - New statement creation message
- `session.preview.statement` - Statement type label
- `session.preview.empty` - No item selected header
- `session.preview.reason` - No item explanation
- `session.preview.button1` - Back button text
- `session.preview.button2` - Submit button text
- `session.emptyDescriptionHead` - Empty description prefix
- `session.emptyDescription` - Generic empty description

## Component Dependencies

### Wikimedia Codex Components
- `CdxLabel` - Accessible labels
- `CdxIcon` - Icon display
- `CdxButton` - Action buttons
- `CdxThumbnail` - Image thumbnails

### Icons
- `cdxIconInfoFilled` - Information indicator
- `cdxIconLogoWikidata` - Wikidata branding

### Custom Assets
- `add.svg` - Light theme add icon
- `adddark.svg` - Dark theme add icon
- `lexeme.svg` - Default lexeme image

## Data Flow

1. **Parent Component** passes lexeme and entity data via props
2. **Review Component** displays the connection preview
3. **User Action** triggers either:
   - `backtoItem` to revise selection
   - `onDone` to confirm and submit
4. **Parent Component** handles the emitted events accordingly

## Usage Example

```vue
<Review
  :headerRef="headerElement"
  :data="lexemeData"
  :detail="selectedEntity"
  :img="lexemeImage"
  :currLang="currentLanguage"
  @backtoItem="handleBack"
  @onDone="handleSubmit"
/>
```

## Error Handling

### Empty States
- Missing gloss shows language-specific message
- Missing entity description shows generic empty text
- Missing images fall back to default icons

### Null Safety
- Handles missing `detail` prop gracefully
- Optional chaining for nested properties
- Fallback values for all displayed content

## Performance Considerations

- **Fixed Positioning**: Header and footer remain fixed during scroll
- **Conditional Rendering**: Empty state only renders when needed
- **Image Optimization**: Thumbnails use Codex component for proper sizing
- **Minimal Re-renders**: Computed properties cache theme state

## Best Practices

1. **Always provide language context** via `currLang` prop
2. **Handle both entity and no-entity scenarios** in parent
3. **Validate submission data** before processing
4. **Provide visual feedback** after submission
5. **Maintain accessibility** with proper labels and navigation