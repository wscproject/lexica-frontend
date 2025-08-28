# Detail Component Documentation

## Overview

The Detail component provides a comprehensive view of lexeme connection information, displaying detailed linguistic data organized into structured sections. It shows lexeme-level properties, sense-specific information, and related senses with an expandable interface for exploring additional language variants.

## Key Features

- **Structured Data Display**: Organized sections for lexeme properties, current sense, and other senses
- **Expandable Sections**: Collapsible "Other Senses" section with smooth animations
- **Interactive Images**: Clickable thumbnails with lightbox preview functionality
- **Multilingual Support**: Displays alternative glosses in multiple languages
- **Keyboard Navigation**: ESC key support for quick dismissal
- **Loading States**: Smooth loading indicators while fetching data
- **Empty State Handling**: Graceful display when no data is available
- **RTL/LTR Support**: Proper text direction handling
- **Theme Compatibility**: Full dark/light mode support

## Component Structure

### Props

#### data {#data-prop}

**Type:** `Object`

**Description:**
Contains the detailed lexeme connection information organized by sections.

**Structure:**
```javascript
{
  // Lexeme-level properties
  usageExamples: {
    property: String,
    data: Array<{ value: String }>
  },
  hasCharacteristics: {
    property: String,
    data: Array<{ value: String }>
  },
  combinesLexemes: {
    property: String,
    data: Array<{ value: String, id: String }>
  },
  
  // Current sense information
  sense: {
    images: { property: String, data: Array },
    antonym: { property: String, data: Array },
    synonym: { property: String, data: Array },
    locationOfSenseUsage: { property: String, data: Array },
    languageStyle: { property: String, data: Array },
    describedAtUrl: { property: String, data: Array },
    glossQuotes: { property: String, data: Array },
    sematicGender: { property: String, data: Array },
    otherGlosses: Array<{ language: String, value: String }>
  },
  
  // Other language senses
  otherSenses: Array<{
    senseNumber: Number,
    gloss: String,
    itemForThisSense: Object,
    otherGlosses: Array,
    images: Object
  }>
}
```

#### headerData {#headerData-prop}

**Type:** `Object`

**Description:**
Header information displayed at the top of the detail view.

**Structure:**
```javascript
{
  lemma: String,      // The lexeme term
  id: String,         // External identifier (optional)
  category: String,   // Lexical category
  gloss: String       // Main definition (optional)
}
```

#### isLoading {#isLoading-prop}

**Type:** `Boolean`

**Description:**
Loading state indicator that controls the display of loading spinner.

#### languages {#languages-prop}

**Type:** `Object`

**Description:**
Language lookup table for displaying proper language names in alternative glosses.

**Structure:**
```javascript
{
  "en": { autonym: "English" },
  "fr": { autonym: "Français" },
  // ... other languages
}
```

#### currLang {#currLang-prop}

**Type:** `String`

**Description:**
Current language code for displaying language-specific empty states.

#### isCurrent {#isCurrent-prop}

**Type:** `Boolean`

**Description:**
Indicates if this is the currently active card for accessibility and interaction purposes.

#### isFlip {#isFlip-prop}

**Type:** `Boolean`

**Description:**
Indicates if the card is currently in flipped/detail view state.

## Emitted Events

### backtoItem {#backtoItem-event}

**Trigger:** When user clicks back button or presses ESC key

**Description:**
Requests navigation back to the main card interface.

**Payload:** None

**Usage Example:**
```javascript
@backtoItem="returnToMainView"
```

### onHold {#onHold-event}

**Trigger:** On mousedown/touchstart on header area

**Description:**
Signals start of header interaction for potential drag operations.

**Payload:** None

### onRelease {#onRelease-event}

**Trigger:** On mouseup/touchend on header area

**Description:**
Signals end of header interaction.

**Payload:** None

### showImage {#showImage-event}

**Trigger:** When user clicks on an image thumbnail

**Description:**
Requests display of image in lightbox view.

**Payload:** `String` - Image URL

**Usage Example:**
```javascript
@showImage="displayImageLightbox"
```

## Computed Properties

### isThisLexeme {#isThisLexeme-computed}

**Returns:** `Boolean`

**Description:**
Determines if lexeme-level properties are available for display.

**Logic:**
```javascript
return (
  data?.value?.usageExamples ||
  data?.value?.hasCharacteristics ||
  data?.value?.combinesLexemes
);
```

### isNoStatement {#isNoStatement-computed}

**Returns:** `Boolean`

**Description:**
Checks if current sense has any properties to display.

**Logic:**
```javascript
return (
  !data?.value?.sense?.images &&
  !data?.value?.sense?.languageStyle &&
  !data?.value?.sense?.fieldOfUsage &&
  !data?.value?.sense?.locationOfSenseUsage &&
  !data?.value?.sense?.sematicGender &&
  !data?.value?.sense?.antonym &&
  !data?.value?.sense?.synonym &&
  !data?.value?.sense?.glossQuotes
);
```

### noGlosses {#noGlosses-computed}

**Returns:** `Boolean`

**Description:**
Determines if alternative glosses are available.

**Logic:**
```javascript
return data?.value?.sense?.otherGlosses?.length === 0;
```

### langs {#langs-computed}

**Returns:** `Array<Object>`

**Description:**
Processes other senses data with formatted language names for alternative glosses.

**Processing:**
1. Maps through otherSenses array
2. Formats otherGlosses with language autonyms
3. Returns structured data for template rendering

**Output Format:**
```javascript
[
  {
    ...senseData,
    otherGlosses: ["definition (English)", "définition (Français)"]
  }
]
```

## Functions

### handleKeyPress(event) {#handleKeyPress}

**Parameters:**
- `event` (KeyboardEvent) - Keyboard event object

**Description:**
Handles global keyboard events for component navigation.

**Supported Keys:**
- `Escape` - Triggers backtoItem event

## Lifecycle Hooks

### onMounted() {#onMounted}

**Description:**
Sets up global keyboard event listeners when component mounts.

### onUnmounted() {#onUnmounted}

**Description:**
Cleans up global keyboard event listeners when component unmounts.

## Template Structure

### Header Section {#header-section}

**Description:**
Blue header area displaying primary lexeme information.

**Features:**
- Wikidata blue background (#3056A9)
- Back navigation with arrow icon
- Lexeme title with optional ID
- Category information with Wikidata lexeme icon
- Gloss or empty state message
- Interactive area for drag operations

### Content Sections {#content-sections}

The component organizes information into three main sections:

#### 1. Lexeme Properties Section {#lexeme-properties}

**Condition:** `isThisLexeme` is true

**Displays:**
- Usage Examples (P5831)
- Has Characteristics
- Combines Lexemes (compound word information)

**Template Structure:**
```vue
<div v-if="data?.usageExamples">
  <span>{{ t("session.detail.usageExample") }} ({{ data?.usageExamples?.property }})</span>
  <span>{{ data?.usageExamples?.data?.[0]?.value }}</span>
</div>
```

#### 2. Current Sense Section {#current-sense}

**Condition:** `!isNoStatement || !noGlosses`

**Subsections:**

##### 2a. Sense Properties
- **Images**: Clickable thumbnails with expand icons
- **Antonyms**: Opposite meaning words
- **Synonyms**: Similar meaning words  
- **Location of Sense Usage**: Geographic usage
- **Language Style**: Register/formality level
- **Described at URL**: External references
- **Gloss Quotes**: Usage quotations
- **Semantic Gender**: Grammatical gender

##### 2b. Alternative Glosses
- **Other Languages**: Translations/definitions in different languages
- **Language Attribution**: Shows language autonyms

#### 3. Other Senses Section {#other-senses}

**Condition:** `data?.otherSenses?.length > 0`

**Features:**
- **Expandable Interface**: Click to toggle visibility
- **Rotating Icon**: Visual indicator for expand/collapse state
- **Smooth Animation**: Transition effects for showing/hiding content
- **Multiple Senses**: Each with sense number and gloss
- **Per-Sense Properties**: Item connections, alternative glosses, images

**Expansion Logic:**
```javascript
isExpand = ref(false) // Controls visibility
@click="isExpand = !isExpand" // Toggle on header click
```

### Loading and Empty States {#states}

#### Loading State
- Centered loading spinner
- Localized loading text
- Full height container

#### Empty State  
- Centered italic message
- Displayed when no data sections are available
- Condition: All computed properties indicate no content

## Styling System

### CSS Classes

#### Component-Level Animations
```css
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-detail-enter-active {
  transition: all 0.5s ease-out;
}
```

#### Icon Animations
```css
.icon {
  transition: transform 250ms ease-out;
}

.open {
  transform: rotate(-180deg);
}
```

#### Smooth Transitions
```css
.smooth-enter-active, .smooth-leave-active {
  transition: height 0.25s;
  overflow: hidden;
}
```

### Design System

#### Color Scheme
- **Header**: #3056A9 (Wikidata blue)
- **Text Colors**: CSS variables (--color-base, --color-subtle)
- **Backgrounds**: CSS variables (--background-color-base, --background-color-neutral)
- **Borders**: CSS variable (--border-color-base)

#### Spacing System
- `--spacing-25`: 0.25rem
- `--spacing-50`: 0.5rem  
- `--spacing-75`: 0.75rem
- `--spacing-100`: 1rem

#### Component Layout
```css
/* Property boxes */
.border-[0.0625rem] border-[var(--border-color-base)] 
bg-[var(--background-color-base)] p-[var(--spacing-75)] 
rounded-[0.1250rem]
```

## Interactive Features

### Image Handling
- **Clickable Thumbnails**: All images are clickable for lightbox view
- **Expand Icons**: Visual indicator overlay on thumbnails
- **Cursor Changes**: Pointer cursor on hover
- **Event Emission**: Passes image URL to parent component

### Expandable Sections
- **Click Toggle**: Header click toggles expansion
- **Icon Rotation**: 180-degree rotation animation
- **Smooth Transitions**: Height-based animations
- **Keyboard Accessible**: Can be triggered with keyboard

### Header Interactions
- **Touch/Mouse Events**: Supports both interaction methods
- **Event Stopping**: Prevents event bubbling
- **Drag Support**: Provides hooks for drag operations

## Accessibility Features

### ARIA Support
- `aria-label` on back navigation button
- Proper heading hierarchy (h4, h5, h6)
- Screen reader friendly structure

### Keyboard Navigation
- **ESC Key**: Quick dismissal functionality
- **Space Bar**: Activation on interactive elements
- **Tab Navigation**: Proper focus management with conditional tabindex

### Language Support
- **Autonym Display**: Native language names for better UX
- **Language Codes**: Technical identifiers in parentheses
- **RTL/LTR**: Proper text direction handling

## Data Organization Logic

### Section Visibility Logic

The component uses multiple computed properties to determine section visibility:

```javascript
// Show content if any section has data
!props.isLoading && (
  !isNoStatement ||      // Current sense has properties
  isThisLexeme ||        // Lexeme-level properties exist  
  data?.otherSenses?.length > 0 || // Other senses available
  !noGlosses            // Alternative glosses exist
)

// Show empty state only if all sections are empty
!props.isLoading && 
isNoStatement && 
!isThisLexeme && 
data?.otherSenses?.length === 0 && 
noGlosses
```

### Data Formatting

#### Property Display Pattern
Most properties follow this structure:
```javascript
// Label with property identifier
{{ t("session.detail.propertyName") }} ({{ data?.property }})

// Value display
{{ data?.data?.[0]?.value }}
```

#### Compound Lexemes
Special formatting for compound words:
```javascript
data?.combinesLexemes?.data
  ?.map(item => `${item.value} (${item.id})`)
  ?.join(" + ")
// Result: "word1 (L1) + word2 (L2)"
```

#### Language Glosses
Formatted with language autonyms:
```javascript
item?.otherGlosses?.map(x => 
  `${x?.value} (${props?.languages?.[x?.language]?.autonym})`
)
// Result: "definition (English), définition (Français)"
```

## Performance Considerations

### Event Handling
- **Global Listeners**: Properly added/removed on mount/unmount
- **Event Delegation**: Efficient handling of repeated elements
- **Event Stopping**: Prevents unnecessary bubbling

### Data Processing
- **Computed Properties**: Cache processed language data
- **Conditional Rendering**: Only renders sections with data
- **Lazy Loading**: Images loaded on demand via thumbnail component

### Animation Performance
- **CSS Transitions**: Hardware-accelerated animations
- **Conditional Classes**: Only apply animation classes when needed
- **Transform-based**: Efficient rotation animations

## Error Handling

### Data Safety
- **Optional Chaining**: Prevents errors from undefined nested properties
- **Array Checks**: Verifies array existence before mapping
- **Fallback Values**: Empty arrays/objects when data missing

### UI Resilience
- **Graceful Degradation**: Shows available data even if some sections fail
- **Loading States**: Clear feedback during data fetching
- **Empty States**: User-friendly messages when no data available

## Usage Examples

### Basic Implementation
```vue
<Detail
  :data="connectionData"
  :headerData="lexemeHeader"
  :isLoading="false"
  :languages="languageLookup"
  :currLang="currentLanguage"
  :isCurrent="true"
  :isFlip="true"
  @backtoItem="closeDetail"
  @showImage="openImageModal"
/>
```

### With All Features
```vue
<Detail
  :data="{
    usageExamples: { property: 'P5831', data: [{ value: 'Example usage' }] },
    sense: {
      images: { property: 'P18', data: [{ url: 'image.jpg', value: 'Description' }] },
      otherGlosses: [{ language: 'en', value: 'English definition' }]
    },
    otherSenses: [{ senseNumber: 2, gloss: 'Second meaning' }]
  }"
  :headerData="{
    lemma: 'example',
    id: 'L12345',
    category: 'noun',
    gloss: 'An example word'
  }"
  :isLoading="false"
  :languages="{ en: { autonym: 'English' } }"
  :currLang="'English'"
  :isCurrent="true"
  :isFlip="true"
  @backtoItem="handleBack"
  @showImage="showImage"
  @onHold="startDrag"
  @onRelease="endDrag"
/>
```

## Known Limitations

1. **Single Image Display**: Only shows first image per property
2. **Static Expansion**: Other Senses section doesn't remember state
3. **Limited Property Types**: Fixed set of supported sense properties
4. **No Deep Linking**: Can't link to specific sections
5. **Performance with Large Data**: May be slow with many other senses

## Future Enhancements

1. **Image Galleries**: Support multiple images per sense
2. **Section Bookmarking**: Persistent expansion states
3. **Search Within Details**: Find specific properties or values  
4. **Export Options**: Save detail information in various formats
5. **Comparison Mode**: Compare multiple senses side-by-side
6. **Property Customization**: User-configurable visible properties
7. **Advanced Animations**: More sophisticated transition effects
8. **Mobile Optimizations**: Swipe gestures and touch enhancements
9. **Virtualization**: Handle large datasets efficiently
10. **Accessibility Improvements**: Enhanced screen reader support