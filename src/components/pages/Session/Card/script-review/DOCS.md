# Script Review Component Documentation

## Overview

The Script Review component is the final confirmation interface in the script writing workflow. It displays a preview of the script/writing system conversion for a lexeme, allowing users to review their transliteration or script conversion before final submission.

## Key Features

- **Script Conversion Preview**: Shows the converted text in the target script
- **Language Variant Display**: Indicates the specific script system being used
- **Lexeme Context**: Original lexeme with metadata
- **Visual Flow Indicator**: Arrow connecting source to result
- **Bilingual Support**: Shows both source and target scripts
- **Theme Adaptation**: Full dark/light mode support
- **Internationalization**: Dynamic language and script names

## Component Structure

### Props

#### headerRef {#headerRef-prop}

**Type:** `Object`

**Description:**
Reference to the header element for potential DOM manipulation or styling control.

**Usage:**
Maintains header consistency across different card modes and enables parent component control.

#### data {#data-prop}

**Type:** `Object`

**Description:**
Contains the source lexeme information and language metadata.

**Structure:**
```javascript
{
  lemma: String,              // Original word in source script
  externalLexemeId: String,   // External identifier
  gloss: String,              // Definition/meaning
  id: String,                 // Unique identifier
  language: {
    languageVariant: {
      title: String,         // Target script name (e.g., "Cyrillic")
      codePreview: String    // Script code (e.g., "Cyrl")
    }
  }
}
```

#### detail {#detail-prop}

**Type:** `Object`

**Description:**
Contains the converted text in the target script.

**Example:**
```javascript
"текст" // Cyrillic conversion of "text"
```

#### img {#img-prop}

**Type:** `String`

**Description:**
URL for the lexeme's associated image. Falls back to default Wikimedia logo if not provided.

#### currLang {#currLang-prop}

**Type:** `String`

**Description:**
Current language code for displaying language-specific empty states and messages.

## Emitted Events

### backtoItem {#backtoItem-event}

**Trigger:** When user clicks "Back" button

**Description:**
Signals parent component to return to the script input interface.

**Payload:** None

**Usage Example:**
```javascript
@backtoItem="handleBackNavigation"
```

### onDone {#onDone-event}

**Trigger:** When user clicks "Submit" button

**Description:**
Confirms the script conversion and passes data for submission.

**Payload:**
```javascript
{
  contributionDetailId: String,  // Lexeme ID
  lemma: String                  // Converted text in target script
}
```

**Example Payload:**
```javascript
{
  contributionDetailId: "L12345",
  lemma: "текст"
}
```

**Usage Example:**
```javascript
@onDone="submitScriptConversion"
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
Determines appropriate icon variants for the current theme.

## Template Sections

### Header Section {#header-section}

**Description:**
Fixed header with review title.

**Features:**
- Consistent gray background (#54595D)
- White text for readability
- Bold typography (1.125rem)
- Fixed positioning for scroll stability

### Lexeme Display Section {#lexeme-display}

**Description:**
Shows the original lexeme in source script.

**Components:**
- Thumbnail with fallback to Wikimedia logo
- Lexeme term with external ID
- Gloss or empty state message
- Border container for visual separation

**Empty State:**
Displays "No description for [language]" when gloss is unavailable.

### Connection Arrow {#connection-arrow}

**Description:**
Visual flow indicator between source and target scripts.

**Implementation:**
- Pure CSS triangle
- Theme-aware coloring
- Centered positioning
- Points from source to result

### Script Conversion Display {#script-conversion-display}

**Description:**
Shows the converted text in the target script.

**Features:**
- Green "add" icon for new content
- Dynamic script information label
- Target script text display
- Gray background for distinction

**Dynamic Label:**
```javascript
t("session.scriptPreview.newStatement", {
  lang: props.data?.language?.languageVariant?.title,
  code: props.data?.language?.languageVariant?.codePreview,
})
// Output: "New text in Cyrillic (Cyrl)"
```

### Action Buttons Section {#action-buttons}

**Description:**
Fixed footer with user actions.

**Buttons:**
1. **Back Button:** Returns to script input
2. **Submit Button:** Confirms conversion (primary action)

**Layout:**
- Equal width distribution
- Gap spacing (0.75rem)
- Fixed bottom positioning
- Border separator

## Styling

### Custom CSS Classes

#### arrow {#arrow-style}

**Description:**
CSS triangle for directional flow.

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
```css
dark:border-b-[#27292D]
```

#### custom-thumbnail {#custom-thumbnail-style}

**Description:**
Thumbnail styling for default images.

```css
.custom-thumbnail .cdx-thumbnail__image {
  background-size: auto !important;
  background-position: center !important;
  background-color: transparent !important;
}
```

**Purpose:**
Prevents distortion of fallback Wikimedia logo.

## Script Systems Support

### Common Script Conversions

1. **Latin to Cyrillic**
   - Source: "text" (Latn)
   - Target: "текст" (Cyrl)

2. **Latin to Arabic**
   - Source: "kitab" (Latn)
   - Target: "كتاب" (Arab)

3. **Latin to Devanagari**
   - Source: "namaste" (Latn)
   - Target: "नमस्ते" (Deva)

4. **Traditional to Simplified Chinese**
   - Source: "傳統" (Hant)
   - Target: "传统" (Hans)

## Accessibility Features

- **Semantic Structure**: Proper heading hierarchy
- **Screen Reader Support**: Descriptive labels via CdxLabel
- **Button Semantics**: Clear action descriptions
- **Language Attributes**: Proper language context
- **Focus Management**: Keyboard navigation support
- **High Contrast**: Maintained in both themes

## Theme Support

### Light Mode
- Background: White (#FFFFFF)
- Text: Dark (#202122)
- Secondary: Gray (#54595D)
- Sections: Light gray (#eaecf0)

### Dark Mode
- Background: Dark (#101418)
- Text: Light (#EAECF0)
- Secondary: Medium gray (#A2A9B1)
- Sections: Dark gray (#27292D)

## Internationalization

### Translation Keys

- `session.preview.title` - Review header
- `session.preview.lexeme` - Lexeme label
- `session.scriptPreview.newStatement` - Script conversion label with parameters
- `session.preview.button1` - Back button
- `session.preview.button2` - Submit button
- `session.emptyDescriptionHead` - Empty description prefix

### Dynamic Translations

The script preview label accepts parameters:
```javascript
{
  lang: "Cyrillic",  // Script name
  code: "Cyrl"       // ISO 15924 code
}
```

## Component Dependencies

### Wikimedia Codex Components
- `CdxLabel` - Accessible text labels
- `CdxIcon` - Icon display (imported)
- `CdxButton` - Interactive buttons
- `CdxThumbnail` - Image display with fallback

### Icons
- `cdxIconInfoFilled` - Info indicator (imported)
- `cdxIconLogoWikidata` - Wikidata logo (imported)

### Custom Assets
- `add.svg` - Light theme addition icon
- `adddark.svg` - Dark theme addition icon
- `lexeme.svg` - Default lexeme image

## Data Flow

1. **Parent Component** provides lexeme and conversion data
2. **Review Component** displays the script conversion
3. **User Review** examines the conversion accuracy
4. **User Action** triggers:
   - `backtoItem` for revision
   - `onDone` for confirmation
5. **Parent Component** processes the submission

## Usage Example

```vue
<ScriptReview
  :headerRef="headerRef"
  :data="lexemeData"
  :detail="convertedText"
  :img="lexemeImage"
  :currLang="currentLanguage"
  @backtoItem="goBack"
  @onDone="submitConversion"
/>
```

## Error Handling

### Empty States
- Missing gloss: Shows language-specific message
- Missing image: Falls to Wikimedia logo
- Missing script info: Handles with optional chaining

### Data Safety
- Null checks on nested properties
- Fallback values for submissions
- Optional chaining throughout

## Performance Considerations

- **Fixed Elements**: Header/footer reduce reflow
- **Computed Caching**: Theme state memoized
- **Minimal DOM**: Efficient structure
- **CSS Animations**: Hardware accelerated

## Visual Design

### Layout Structure
```
┌─────────────────────────┐
│    Preview Header       │ (Fixed)
├─────────────────────────┤
│                         │
│   Original Lexeme       │
│   [Image] Term (ID)     │
│   Definition            │
│                         │
│           ▼            │ (Arrow)
│                         │
│   Script Conversion     │
│   [+] New text in...    │
│   Converted Text        │
│                         │
├─────────────────────────┤
│   Back  |   Submit      │ (Fixed)
└─────────────────────────┘
```

### Visual Hierarchy
1. **Header** - Context setting
2. **Source** - Original content
3. **Arrow** - Transformation indicator
4. **Target** - Result display
5. **Actions** - User decisions

## Script-Specific Considerations

### Right-to-Left Scripts
- Arabic script text alignment
- Hebrew script direction
- Persian script rendering

### Complex Scripts
- Devanagari conjuncts
- Thai tone marks
- Chinese character variants

### Bidirectional Text
- Mixed script handling
- Number preservation
- Punctuation positioning

## Best Practices

1. **Validate script conversions** before display
2. **Handle RTL/LTR transitions** properly
3. **Preserve formatting** in conversions
4. **Show script system clearly** in UI
5. **Test with various scripts** thoroughly
6. **Maintain readability** across scripts

## Known Limitations

1. No side-by-side comparison view
2. Limited to single lexeme conversion
3. No conversion confidence indicator
4. No alternative conversion options
5. No preview of usage context

## Future Enhancements

1. Add side-by-side comparison mode
2. Show conversion confidence score
3. Provide alternative conversions
4. Add pronunciation guide
5. Include script system information tooltip
6. Support batch conversions
7. Add copy-to-clipboard functionality
8. Include romanization preview