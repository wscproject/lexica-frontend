# Lexeme Detail Component Documentation

## Overview

The Lexeme Detail component displays comprehensive information about a lexeme during contribution sessions. It serves as the detailed view that users access when they want to examine the complete structure of a lexeme before making contributions. This component is used across different session types (Script, Hyphenation) to provide context and detailed lexeme information including senses, grammatical features, glosses, and related data.

## Key Features

- **Lexeme Information Display**: Complete lexeme details with structured presentation
- **Sense Processing**: Organized display of lexeme senses with multiple data types
- **Multilingual Support**: Proper handling of glosses and content in different languages
- **Image Integration**: Interactive image viewing with lightbox support
- **Grammatical Features**: Display of lexical category and grammatical information
- **Keyboard Navigation**: ESC key support for quick navigation
- **Loading States**: Graceful loading handling during data fetching
- **Theme Integration**: Dark/light mode support with consistent styling
- **RTL Support**: Proper right-to-left language layout handling

## Props

### data {#data-prop}

**Type:** `Object`
**Required:** Yes

**Description:**
Contains the complete lexeme information fetched from the lexeme detail API.

**Structure:**

- `senses` (Array) - Array of sense objects containing:
  - `senseNumber` (Number) - Sequential sense identifier
  - `gloss` (String) - Primary sense definition
  - `otherGlosses` (Array) - Alternative glosses in different languages
  - `images` (Object) - Associated images with URLs and metadata
  - `combinesLexemes` (Object) - Lexeme combination information
  - `describedAtUrl` (Object) - Reference URLs
  - Various other lexeme properties and statements
- `grammaticalFeatures` (String) - Grammatical category and features

### headerData {#headerData-prop}

**Type:** `Object`
**Required:** Yes

**Description:**
Contains basic lexeme information for header display.

**Structure:**

- `lemma` (String) - Primary lexeme form
- `id` (String) - Lexeme identifier
- `gloss` (String) - Primary gloss/definition
- `category` (String) - Lexical category (noun, verb, etc.)

### isLoading {#isLoading-prop}

**Type:** `Boolean`
**Default:** `false`

**Description:**
Indicates whether lexeme data is currently being fetched. Shows loading spinner when `true`.

### languages {#languages-prop}

**Type:** `Object`
**Required:** Yes

**Description:**
Language metadata for proper display of multilingual content.

**Structure:**

- Key-value pairs where keys are language codes
- Each language contains `autonym` property for native language name

### currLang {#currLang-prop}

**Type:** `String`
**Required:** Yes

**Description:**
Current session language name for display in empty state messages.

## Events

### backtoItem {#backtoItem-event}

**Emitted:** When user requests navigation back to main item view

**Description:**
Signals parent component to return to the main item interface.

**Triggers:**

- ESC key press (global keyboard handler)
- Back arrow button click
- Space key on focused back button

### onHold {#onHold-event}

**Emitted:** When user starts drag interaction on header

**Description:**
Notifies parent that drag interaction has begun for card manipulation.

### onRelease {#onRelease-event}

**Emitted:** When user ends drag interaction on header

**Description:**
Notifies parent that drag interaction has ended.

### showImage {#showImage-event}

**Payload:** Image URL string
**Emitted:** When user clicks on an image in sense data

**Description:**
Requests lightbox display of the selected image with full URL.

## Functions

### Data Processing

#### senses {#senses}

Computes processed sense data from lexeme information for display.

**Returns:**

- `Array<Object>` - Array of sense objects with number and processed data

**Description:**
Transforms raw lexeme sense data into a structured format suitable for template rendering, organizing all sense properties into labeled key-value pairs.

**Step-by-step breakdown:**

**Data extraction:**

1. **Input validation:** `props?.data?.senses?.map()` - Ensures senses array exists
2. **Sense iteration:** Processes each sense object individually

**Property processing:**

3. **Key extraction:** `Object.keys(item).map((key) => ({ ... }))` - Converts object properties to labeled data

- `label: key` - Property name (gloss, images, etc.)
- `value: item[key]` - Property value/data

**Sense structure creation:**

4. **Sense object construction:**

- `number: item.senseNumber` - Sense identifier for display
- `data: inside` - Array of processed property objects

**Fallback handling:**

5. **Empty fallback:** Returns `[]` if no senses exist

**Data structure example:**

```javascript
[
  {
    number: 1,
    data: [
      { label: "gloss", value: "definition text" },
      { label: "images", value: { data: [{ url: "...", value: "..." }] } },
      { label: "otherGlosses", value: [{ language: "en", value: "..." }] },
    ],
  },
];
```

**When this computed property updates:**

- When `props.data.senses` changes (new lexeme loaded)
- Automatically processes all sense data for consistent display
- Critical for organizing complex lexeme information

### Event Handling

#### handleKeyPress(event) {#handleKeyPress}

Handles global keyboard events for component navigation.

**Parameters:**

- `event` (KeyboardEvent) - Standard browser keyboard event object

**Description:**
Provides keyboard accessibility by listening for ESC key to enable quick navigation back to main view.

**Step-by-step breakdown:**

**Key detection:**

1. **ESC key check:** `if (event.key === "Escape")` - Detects ESC key press
2. **Navigation action:** `emit("backtoItem")` - Triggers navigation back to main item view

**Accessibility considerations:**

- Provides keyboard alternative to mouse-based navigation
- Follows standard UI conventions (ESC to close/go back)
- Global event handler ensures it works regardless of focus location

**When this function is called:**

- On any keydown event while component is mounted
- Provides consistent keyboard navigation experience
- Essential for accessibility compliance

### Lifecycle Management

#### onMounted() {#onMounted}

Sets up global keyboard event listeners on component mount.

**Description:**
Registers global keyboard event handlers to enable ESC key navigation functionality.

**Step-by-step breakdown:**

1. **Event registration:** `window.addEventListener("keydown", handleKeyPress)`
   - Attaches keyboard handler to window object
   - Ensures ESC key works from any focus location within component

**When this function is called:**

- Automatically when component is mounted to DOM
- Essential for keyboard accessibility setup
- Prepares component for user interaction

#### onUnmounted() {#onUnmounted}

Cleans up global keyboard event listeners on component unmount.

**Description:**
Removes global event listeners to prevent memory leaks and orphaned event handlers.

**Step-by-step breakdown:**

1. **Event cleanup:** `window.removeEventListener("keydown", handleKeyPress)`
   - Removes previously registered keyboard handler
   - Prevents memory leaks and interference with other components

**When this function is called:**

- Automatically when component is being destroyed
- Critical for proper cleanup in single-page applications
- Ensures no orphaned event listeners remain active

## State Management

### Reactive State Variables

- `hovered` (Boolean) - Tracks hover state for image elements to show cursor pointer

### Watchers

#### senses Watcher {#senses-watcher}

Monitors changes to processed sense data for debugging.

**Description:**
Development helper that logs sense data changes to console for debugging purposes.

**Logic:**

```javascript
watch(senses, () => {
  console.log(senses.value);
});
```

**Purpose:**

- Development debugging and data structure verification
- Can be removed in production builds
- Helps track data processing correctness

## Component Structure

### Header Section

- **Back Navigation**: Arrow button with keyboard support and blue theme (#3056A9)
- **Lexeme Title**: Lemma and ID display with proper hierarchy
- **Wikidata Lexeme Branding**: Logo and lexeme category information
- **Gloss Display**: Primary definition with word-wrapping and RTL support
- **Drag Handles**: Touch and mouse interaction support with event propagation control

### Content Section

- **Loading State**: Full-height loading spinner during data fetch
- **Grammatical Features**: Highlighted display when available
- **Senses Organization**: Structured display of all sense information:
  - **Primary Gloss**: Main sense definition with sense numbering
  - **Other Glosses**: Multilingual alternative definitions
  - **Combines Lexemes**: Compound lexeme information
  - **Images**: Interactive thumbnails with expand overlay
  - **Additional Properties**: Dynamic property display with localization
- **Empty State**: Graceful message when no senses exist

## Sense Data Types & Display

### Supported Sense Properties

1. **Gloss** (`gloss`)

   - Primary sense definition
   - Displayed as main heading for each sense
   - Format: "Sense [number]: [definition]"

2. **Other Glosses** (`otherGlosses`)

   - Alternative definitions in different languages
   - Shows language autonym from languages prop
   - Formatted as comma-separated list

3. **Combines Lexemes** (`combinesLexemes`)

   - Compound lexeme composition information
   - Shows constituent lexemes with IDs
   - Formatted with "+" separator

4. **Images** (`images`)

   - Interactive thumbnails with lightbox integration
   - Hover effects and expand overlay
   - Clickable for full-size viewing

5. **Described At URL** (`describedAtUrl`)

   - Reference URLs without ID display
   - Special handling for URL-only content

6. **Dynamic Properties**
   - Any other lexeme properties not explicitly handled
   - Automatic localization via i18n keys
   - Standard format with property ID and values

### Display Filtering

- Excludes internal properties: `senseNumber`, `externalLexemeSenseId`
- Filters null/empty values automatically
- Special rendering for each property type

## Accessibility Features

### Keyboard Navigation

- **ESC Key**: Global navigation back to main view
- **Space Key**: Activates back button when focused
- **Tab Navigation**: Proper focus flow through interactive elements

### ARIA Support

- **Aria-label**: Descriptive labels for navigation buttons
- **Semantic HTML**: Proper heading hierarchy (h4, h5, h6)
- **Focus Management**: Dynamic focus control based on component state

### Screen Reader Support

- **Content Organization**: Logical structure with proper headings
- **Alternative Text**: Image descriptions and alt attributes
- **Language Attribution**: Proper language identification for multilingual content

## Theme & Responsive Design

### Theme Support

- **Color Scheme**: Dark/light mode with CSS custom properties
- **Distinctive Header**: Blue header (#3056A9) for lexeme details
- **Consistent Styling**: Matches overall application theming

### Responsive Features

- **Flexible Layout**: Adapts to different screen sizes and orientations
- **Word Wrapping**: Proper text wrapping for long definitions
- **Touch Interactions**: Full touch and mouse event support
- **Content Overflow**: Scrollable content area for extensive lexeme data

### RTL Support

- **Layout Direction**: Proper spacing and alignment for RTL languages
- **Text Flow**: Natural reading flow in right-to-left languages
- **Icon Positioning**: Direction-aware spacing and alignment

## Performance Considerations

### Efficient Rendering

- **Computed Properties**: Cached sense processing with automatic updates
- **Conditional Rendering**: Smart v-if/v-else for different content states
- **Property Filtering**: Only renders properties with actual values

### Data Processing

- **Sense Organization**: Efficient transformation of raw lexeme data
- **Lazy Evaluation**: Computed properties update only when dependencies change
- **Memory Management**: Proper cleanup of global event listeners

## Integration Patterns

### Parent Component Usage

```vue
<LexemeDetail
  :data="lexemeDetailData"
  :headerData="lexemeHeaderInfo"
  :isLoading="isLoadingLexeme"
  :languages="availableLanguages"
  :currLang="currentLanguageName"
  @backtoItem="returnToMainView"
  @showImage="openImageLightbox"
  @onHold="handleDragStart"
  @onRelease="handleDragEnd"
/>
```

### Data Flow

1. **Lexeme Selection** → Parent fetches detailed data → Updates `data` prop
2. **Loading Management** → Parent manages API state → Updates `isLoading` prop
3. **Navigation** → `backtoItem` event → Parent switches view mode
4. **Image Viewing** → `showImage` event → Parent opens lightbox with URL

## Browser Compatibility

- **Modern Browsers**: ES6+ features, computed properties, and watchers
- **Keyboard Events**: Full keyboard event support
- **Touch Events**: Touch and mouse interaction compatibility
- **CSS Features**: CSS custom properties, flexbox, and modern selectors

## Troubleshooting

### Common Issues

1. **ESC key not working**

   - Check if global event listeners are properly attached
   - Verify `handleKeyPress` function is correctly bound
   - Ensure component is properly mounted/unmounted

2. **Sense data not displaying**

   - Verify `data.senses` prop contains valid array structure
   - Check sense processing logic in computed property
   - Ensure senses have required properties (senseNumber, etc.)

3. **Images not clickable**

   - Verify image data has valid URL structure
   - Check if `showImage` event handler is connected
   - Ensure hover state management works correctly

4. **Loading state issues**

   - Verify `isLoading` prop is correctly managed by parent
   - Check loading component import and rendering
   - Ensure loading states don't interfere with data display

5. **Multilingual content problems**

   - Verify `languages` prop contains required language data
   - Check autonym properties for language display
   - Ensure proper language code mapping

6. **Header information missing**
   - Verify `headerData` prop contains required fields
   - Check lexeme ID and category display logic
   - Ensure gloss fallback works for empty descriptions
