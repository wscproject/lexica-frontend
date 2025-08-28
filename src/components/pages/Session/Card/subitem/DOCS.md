# SubItem Component Documentation

## Overview

The SubItem component displays detailed information about a specific Wikidata entity during the connection session workflow. It serves as a detailed view that users can access when they want to examine a potential entity connection more thoroughly before making their final selection. This component is primarily used in SessionConnect when users click the info icon on recommended entities or search results.

## Key Features

- **Entity Information Display**: Comprehensive Wikidata entity details with structured presentation
- **Statement Processing**: Organized display of entity statements and properties
- **Image Handling**: Interactive image viewing with lightbox integration
- **Translation Support**: Multi-language content display with proper language attribution
- **Keyboard Navigation**: ESC key support for quick navigation
- **Loading States**: Graceful loading handling during data fetching
- **Theme Integration**: Dark/light mode support with consistent styling
- **RTL Support**: Proper right-to-left language layout handling

## Props

### data {#data-prop}
**Type:** `Object`
**Required:** Yes

**Description:**
Contains the complete entity information fetched from Wikidata API.

**Structure:**
- `aliases` (String) - Alternative names for the entity
- `statements` (Object) - Wikidata statements organized by property
  - Each property contains `data` array with statement values
  - Each statement has `value`, `id`, `url`, `language`, `code` properties

### isLoading {#isLoading-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Indicates whether entity data is currently being fetched. Shows loading spinner when `true`.

### headerData {#headerData-prop}
**Type:** `Object`
**Required:** Yes

**Description:**
Contains basic entity information for header display.

**Structure:**
- `label` (String) - Primary entity name
- `id` (String) - Wikidata entity ID (e.g., "Q123456")
- `description` (String) - Brief entity description

### isCurrent {#isCurrent-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Whether this component is currently active/visible. Controls interactive element availability.

### isFlip {#isFlip-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Whether the card is currently in flipped state. Used for accessibility and focus management.

## Events

### backtoItem {#backtoItem-event}
**Emitted:** When user requests navigation back to main item view

**Description:**
Signals parent component to return to the main item selection interface.

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
**Emitted:** When user clicks on an image statement

**Description:**
Requests lightbox display of the selected image with full URL.

## Functions

### Translation & Localization

#### translate(data) {#translate}

Translates statement property keys to localized display text.

**Parameters:**
- `data` (String) - Property key identifier from Wikidata statements

**Returns:**
- `String` - Localized translation string from i18n system

**Description:**
Maps internal Wikidata property keys to user-friendly, localized display names for better UX.

**Step-by-step breakdown:**

**Property mapping:**
1. **Image statements:** `if (data === "images")` → `t("session.item.images")`
2. **Instance relationships:** `if (data === "instanceOf")` → `t("session.item.instanceOf")`
3. **Part relationships:** `if (data === "partOf")` → `t("session.item.partOf")`
4. **Classification:** `if (data === "subclass")` → `t("session.item.subclass")`
5. **Taxonomic names:** `if (data === "taxonName")` → `t("session.item.taxonName")`
6. **Component parts:** `if (data === "hasParts")` → `t("session.item.hasParts")`
7. **Translations:** `if (data === "translation")` → `t("session.item.translation")`

**Fallback behavior:**
8. **Unmapped properties:** Returns `undefined` (handled gracefully in template)

**When this function is called:**
- During template rendering for each statement property
- Provides consistent, localized labels for Wikidata properties
- Essential for multilingual user experience

### Data Processing

#### statements {#statements}

Computes filtered and processed statement data from entity information.

**Returns:**
- `Array<[string, Object]>` - Array of statement entries with valid data

**Description:**
Processes raw entity statement data to extract only statements with valid values, organizing them for display.

**Step-by-step breakdown:**

**Data validation:**
1. **Input check:** `props?.data?.statements` - Ensures statements object exists
2. **Entry processing:** `[...Object.entries(props?.data?.statements)]` - Converts object to key-value pairs
3. **Filtering logic:** `.filter((item) => item?.[1]?.data?.[0]?.value)` - Keeps only statements with actual values

**Structure explanation:**
- **`item[0]`** - Property key (e.g., "images", "instanceOf")
- **`item[1]`** - Statement object containing data array
- **`item[1].data[0].value`** - First statement value (primary data point)

**Fallback behavior:**
4. **Empty fallback:** Returns `[]` if no valid statements exist

**When this computed property updates:**
- When `props.data.statements` changes (new entity loaded)
- Automatically filters out empty or invalid statements
- Provides clean data structure for template rendering

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

- `hovered` (Boolean) - Tracks hover state for image statements to show cursor pointer

### Template References

- None explicitly defined (uses inline event handling)

## Component Structure

### Header Section
- **Back Navigation**: Arrow button with keyboard support
- **Entity Title**: Label and ID display with proper hierarchy
- **Wikidata Branding**: Logo and source attribution
- **Description**: Entity description with fallback for empty content
- **Drag Handles**: Touch and mouse interaction support

### Content Section
- **Loading State**: Full-height loading spinner during data fetch
- **Aliases Display**: Highlighted alternative names when available
- **Statements Section**: Organized property-value pairs with:
  - **Regular Statements**: General entity properties
  - **Translation Section**: Separate section for multilingual content
- **Image Interactions**: Clickable images with expand indicators
- **Empty State**: Graceful message when no statements exist

## Statement Types & Display

### Supported Statement Types
1. **Images** (`images`)
   - Interactive thumbnails with expand overlay
   - Click to view in lightbox
   - Special hover effects and cursor styling

2. **Instance Of** (`instanceOf`)
   - Classification relationships
   - Shows what category the entity belongs to

3. **Part Of** (`partOf`)
   - Hierarchical relationships
   - Shows larger entities this is part of

4. **Subclass** (`subclass`)
   - Taxonomic relationships
   - Shows broader categories

5. **Taxon Name** (`taxonName`)
   - Scientific nomenclature
   - Biological classification information

6. **Has Parts** (`hasParts`)
   - Component relationships
   - Shows what this entity contains

7. **Translation** (`translation`)
   - Multilingual equivalents
   - Separate section with language attribution

### Statement Display Format
Each statement shows:
- **Property Label**: Translated property name with Wikidata property ID
- **Value**: Primary statement value
- **Entity ID**: Wikidata ID when applicable (in parentheses)
- **Language Attribution**: For translation statements

## Accessibility Features

### Keyboard Navigation
- **ESC Key**: Global navigation back to main view
- **Space Key**: Activates back button when focused
- **Tab Navigation**: Proper focus flow through interactive elements

### ARIA Support
- **Aria-label**: Descriptive labels for icon buttons
- **Role Semantics**: Proper heading hierarchy and content structure
- **Focus Management**: Dynamic tabindex based on component state

### Screen Reader Support
- **Semantic HTML**: Proper heading structure and content organization
- **Alternative Text**: Image descriptions where applicable
- **Content Attribution**: Clear source attribution for Wikidata content

## Theme & Responsive Design

### Theme Support
- **Color Scheme**: Dark/light mode with CSS custom properties
- **Visual Consistency**: Matches overall application theming
- **Header Branding**: Distinctive green header (#196551) for entity details

### Responsive Features
- **Flexible Layout**: Adapts to different screen sizes and orientations
- **Touch Interactions**: Full touch and mouse event support
- **Content Overflow**: Scrollable content area for long statement lists

### RTL Support
- **Layout Direction**: Proper spacing and alignment for RTL languages
- **Text Flow**: Natural reading flow in right-to-left languages
- **Icon Positioning**: Direction-aware icon and spacing adjustments

## Performance Considerations

### Efficient Rendering
- **Computed Properties**: Cached statement processing
- **Conditional Rendering**: Smart v-if/v-else for different content states
- **Event Optimization**: Minimal event listeners with proper cleanup

### Data Processing
- **Statement Filtering**: Only processes statements with valid data
- **Lazy Evaluation**: Computed properties update only when dependencies change
- **Memory Management**: Proper cleanup of global event listeners

## Integration Patterns

### Parent Component Usage
```vue
<SubItem 
  :data="entityData"
  :isLoading="isLoadingEntity"
  :headerData="selectedEntityHeader"
  :isCurrent="isActiveCard"
  :isFlip="isCardFlipped"
  @backtoItem="returnToMainView"
  @showImage="openLightbox"
  @onHold="handleDragStart"
  @onRelease="handleDragEnd"
/>
```

### Data Flow
1. **Entity Selection** → Parent fetches detailed data → Updates `data` prop
2. **Loading Management** → Parent manages API state → Updates `isLoading` prop
3. **Navigation** → `backtoItem` event → Parent switches view mode
4. **Image Viewing** → `showImage` event → Parent opens lightbox with URL

## Browser Compatibility

- **Modern Browsers**: ES6+ features and CSS custom properties
- **Keyboard Events**: Full keyboard event support
- **Touch Events**: Touch and mouse interaction compatibility
- **CSS Features**: Flexbox, CSS Grid, and custom properties

## Troubleshooting

### Common Issues

1. **ESC key not working**
   - Check if global event listeners are properly attached
   - Verify `handleKeyPress` function is correctly bound
   - Ensure component is properly mounted/unmounted

2. **Images not clickable**
   - Verify image statements have valid URL data
   - Check if `showImage` event handler is connected
   - Ensure image thumbnails are rendering correctly

3. **Statements not displaying**
   - Check if `data.statements` prop contains valid structure
   - Verify statement filtering logic in computed property
   - Ensure statements have required `value` property

4. **Translation missing**
   - Verify all property keys are mapped in `translate()` function
   - Check if i18n keys exist in translation files
   - Ensure fallback behavior handles unmapped properties

5. **Loading state issues**
   - Verify `isLoading` prop is correctly managed by parent
   - Check loading component import and rendering
   - Ensure loading states don't interfere with data display