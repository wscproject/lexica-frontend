# Item Component Documentation

## Overview

The Item component serves as the main card interface for entity connection sessions in Lexica. It displays lexeme information, provides search functionality for finding related Wikidata entities, shows recommendations, and allows users to select items for connection. This component is primarily used in SessionConnect workflows where contributors need to link lexemes to appropriate Wikidata entities.

## Key Features

- **Lexeme Display**: Shows lemma, gloss, and language information with proper RTL/LTR support
- **Entity Search**: Real-time search with debounced input and highlighting
- **Recommendations**: Display of AI-suggested entities with thumbnails and descriptions
- **Keyboard Navigation**: Arrow key navigation through search results and recommendations
- **Selection Management**: Item selection with visual feedback and state management
- **Loading States**: Progress indicators for search, recommendations, and pagination
- **Accessibility**: ARIA roles, labels, and keyboard interaction support
- **Theme Support**: Dark/light mode with responsive design

## Props

### data {#data-prop}
**Type:** `Object`
**Required:** Yes

**Description:**
Contains the lexeme information to be displayed in the header.

**Structure:**
- `lemma` (String) - The lexeme text
- `externalLexemeSenseId` (String) - External sense identifier
- `gloss` (String) - Description/definition text
- `language` (Object) - Language metadata
  - `title` (String) - Language display name
  - `isRtl` (String) - Text direction ("rtl" or "ltr")

### recommendation {#recommendation-prop}
**Type:** `Array`
**Default:** `[]`

**Description:**
Array of recommended entities for connection. Each entity contains Wikidata information.

**Entity Structure:**
- `id` (String) - Wikidata entity ID (e.g., "Q123456")
- `label` (String) - Human-readable entity name
- `description` (String) - Entity description
- `image` (String) - Thumbnail image URL
- `language` (String) - Entity language code

### keyword {#keyword-prop}
**Type:** `String`
**Default:** `""`

**Description:**
Current search keyword for highlighting matches in search results.

### searchLoading {#searchLoading-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Loading state for search operations. Shows progress bar when `true`.

### recommendedLoading {#recommendedLoading-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Loading state for recommendation fetching. Shows loading spinner when `true`.

### loadmoreLoading {#loadmoreLoading-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Loading state for pagination. Disables "Load More" button when `true`.

### noLoadData {#noLoadData-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Indicates no more results are available. Shows end-of-results message when `true`.

### isCurrent {#isCurrent-prop}
**Type:** `Boolean`
**Default:** `false`

**Description:**
Whether this card is currently active/visible. Controls visibility of interactive elements.

## Events

### gotoDetail {#gotoDetail-event}
**Payload:** Event object
**Emitted:** When user clicks the info icon in the header

**Description:**
Requests navigation to the detailed lexeme view.

### gotoSubItemDetail {#gotoSubItemDetail-event}
**Payload:** Entity object
**Emitted:** When user clicks info icon on an entity item

**Description:**
Requests navigation to detailed entity information view.

### onHold {#onHold-event}
**Emitted:** When user starts drag interaction

**Description:**
Notifies parent that drag interaction has begun.

### onRelease {#onRelease-event}
**Emitted:** When user ends drag interaction

**Description:**
Notifies parent that drag interaction has ended.

### gotoReview {#gotoReview-event}
**Payload:** Selected entity data (optional)
**Emitted:** When user clicks review buttons

**Description:**
Requests navigation to review mode with selected item data.

### selectItem {#selectItem-event}
**Emitted:** When an item is selected

**Description:**
Notifies parent that an item selection has occurred.

### setSearch {#setSearch-event}
**Payload:** Search string
**Emitted:** When search input changes

**Description:**
Requests search operation with the provided keyword.

### loadMore {#loadMore-event}
**Payload:** Focus element reference
**Emitted:** When "Load More" button is clicked

**Description:**
Requests additional search results for pagination.

## Functions

### UI State Management

#### setInfo() {#setInfo}

Toggles the info display state.

**Description:**
Simple state toggle function for showing/hiding informational content.

**Step-by-step breakdown:**
1. **`isInfo.value = !isInfo.value`** - Toggles boolean state between true/false

**When this function is called:**
- When user clicks info toggle buttons
- Currently unused in the template but available for expansion

#### selectItem(n, value) {#selectItem}

Selects an item and stores its details for review.

**Parameters:**
- `n` (String|Number) - Unique identifier of the selected item
- `value` (Object) - Complete entity data object containing all item information

**Description:**
Manages item selection state and prepares data for the review process.

**Step-by-step breakdown:**
1. **`selectedItem.value = n`** - Stores the item ID for selection state management
2. **`detailData.value = value`** - Stores complete item data for review mode
3. **`emit("selectItem")`** - Notifies parent component of selection event

**When this function is called:**
- When user clicks on a recommendation item
- When user presses Space/Enter on a focused item
- Selection enables the "Continue" button for review navigation

### Navigation & Focus Management

#### moveSelectionRec(newIndex) {#moveSelectionRec}

Moves focus to the specified recommendation item using keyboard navigation.

**Parameters:**
- `newIndex` (Number) - Target index in the recommendations array

**Description:**
Handles keyboard navigation within the recommendations list, with bounds checking and focus management.

**Step-by-step breakdown:**

**Boundary validation:**
1. **Search mode check:** `if (isSearch.value && ...)` - Exits if in search mode
2. **Index bounds check:** `newIndex < 0 || newIndex >= recommendation?.filter((item, i) => i <= 2)?.length` 
   - Prevents navigation outside valid range (recommendations limited to first 3 items)
   - Returns early if index is invalid

**Focus management:**
3. **`nextTick(() => { radioButtons.value[newIndex]?.focus() })`** - Moves DOM focus to target element
   - Uses Vue's nextTick to ensure DOM is updated
   - Safe navigation with optional chaining

**When this function is called:**
- Arrow key navigation (left, right, up, down) on recommendation items
- Only active when NOT in search mode
- Provides keyboard accessibility for recommendations

#### moveSelectionSearch(newIndex) {#moveSelectionSearch}

Moves focus to the specified search result item using keyboard navigation.

**Parameters:**
- `newIndex` (Number) - Target index in the search results array

**Description:**
Handles keyboard navigation within search results, similar to recommendations but for search mode.

**Step-by-step breakdown:**

**Boundary validation:**
1. **Search mode check:** `if (!isSearch.value && ...)` - Exits if NOT in search mode
2. **Index bounds check:** `newIndex < 0 || newIndex >= recommendation?.length`
   - Prevents navigation outside search results range
   - Uses full recommendation array length (not limited like recommendations)

**Focus management:**
3. **`nextTick(() => { radioButtons2.value[newIndex]?.focus() })`** - Moves DOM focus to target element
   - Uses separate ref array for search results
   - Ensures proper DOM timing with nextTick

**When this function is called:**
- Arrow key navigation on search result items
- Only active when IN search mode
- Provides keyboard accessibility for search results

### Search & Text Processing

#### highlightText(text, searchTerm) {#highlightText}

Splits text into segments for highlighting search matches.

**Parameters:**
- `text` (String) - The text to be processed for highlighting
- `searchTerm` (String) - The search term to highlight within the text

**Returns:**
- `Array<String>` - Array of text segments, alternating between matches and non-matches

**Description:**
Processes text to enable visual highlighting of search matches in the UI. Critical for search result visibility.

**Step-by-step breakdown:**

**Input validation:**
1. **`if (!searchTerm) return [text]`** - Returns original text as single-item array if no search term
   - Prevents unnecessary processing when no highlighting needed

**Text processing:**
2. **`const regex = new RegExp(\`(${searchTerm})\`, "gi")`** - Creates case-insensitive global regex
   - Parentheses capture the search term for preservation in split
   - "gi" flags: global (all matches) + case-insensitive
3. **`return text.split(regex)`** - Splits text into alternating segments
   - Returns array where odd indices are matches, even indices are non-matches

**Template usage:**
- Segments are rendered with conditional styling to highlight matches
- Enables visual search feedback without complex text manipulation

#### onInput() {#onInput}

Handles search input with debounced processing to optimize performance.

**Description:**
Debounced input handler that manages search state transitions and triggers search operations. Uses 500ms delay to prevent excessive API calls.

**Step-by-step breakdown:**

**Empty search handling:**
1. **`if (search.value === "")`** - Detects cleared search input
2. **State reset sequence:**
   - `isSearch.value = false` - Switches back to recommendation mode
   - `selectedItem.value = null` - Clears any selected item
   - `emit("setSearch", search.value)` - Notifies parent with empty string
   - `recommendationSearch.value = []` - Clears local search cache

**Active search handling:**
3. **`else` block for non-empty search:**
   - `isSearch.value = true` - Switches to search mode
   - `emit("setSearch", search.value)` - Triggers parent search operation

**Focus management:**
4. **`searchRef.value.focus()`** - Maintains focus on search input
   - Ensures continuous typing experience
   - Prevents accidental focus loss during state changes

**Debouncing:**
- Wrapped in `debounce()` with 500ms delay
- Prevents API calls on every keystroke
- Balances responsiveness with performance

**When this function is called:**
- Automatically triggered 500ms after user stops typing
- Essential for search performance optimization

### Computed Properties

#### glossAlign {#glossAlign}

Computes text alignment for gloss display based on language direction and content directionality.

**Returns:**
- `String` - CSS text alignment value ("left" or "right")

**Description:**
Determines proper text alignment for the gloss (definition) text based on the overall UI direction and the specific language characteristics of the lexeme data.

**Step-by-step breakdown:**

**Direction analysis:**
1. **`if (dir.value === "rtl")`** - Checks if overall UI is right-to-left
2. **Inner language check:**
   - `if (props?.data?.language?.isRtl === "ltr")` - Checks if lexeme language is left-to-right
   - `return "right"` - Forces right alignment for RTL UI regardless of content language
   - `else return "right"` - Default right alignment for RTL UI

**LTR default:**
3. **`else return "left"`** - Left alignment for left-to-right UI

**Logic rationale:**
- RTL interfaces typically align text to the right for visual consistency
- Mixed-direction content handling ensures proper visual hierarchy
- Maintains readability across different language combinations

**When this computed property updates:**
- When `dir.value` changes (UI direction switch)
- When `props.data.language.isRtl` changes (content language change)
- Used in template for dynamic style binding

## State Management

### Reactive State Variables

- `isInfo` (Boolean) - Info display toggle state
- `selectedItem` (Ref) - Currently selected item ID
- `detailData` (Ref) - Complete data of selected item
- `isLoading` (Boolean) - General loading state
- `search` (String) - Current search input value
- `isSearch` (Boolean) - Search mode toggle (recommendations vs search results)
- `isScrollBar` (Boolean) - Scrollbar detection for styling
- `recommendationSearch` (Array) - Cached search results

### Template References

- `searchRef` - Reference to search input component
- `radioButtons` - Array of recommendation item elements
- `radioButtons2` - Array of search result item elements

## Watchers

### search Watcher {#search-watcher}

Monitors search input changes for immediate state updates.

**Description:**
Provides immediate feedback for search clearing without waiting for debounce delay.

**Logic:**
```javascript
watch(search, () => {
  if (search.value === '') {
    isSearch.value = false;
    emit("setSearch", search.value);
  }
})
```

**Purpose:**
- Instant switch back to recommendations when search is cleared
- Complements the debounced `onInput` handler
- Ensures responsive UI state transitions

## Accessibility Features

### Keyboard Navigation
- **Arrow Keys**: Navigate through recommendations and search results
- **Space/Enter**: Select focused items
- **Tab Navigation**: Proper focus management across interactive elements

### ARIA Support
- **Role="radiogroup"**: Proper semantic grouping for item selection
- **Role="radio"**: Individual item semantics
- **Aria-label**: Descriptive labels for icon buttons and inputs
- **Tabindex Management**: Dynamic focus control based on current state

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy and labeling
- **Live Regions**: Search result updates announced to screen readers
- **Focus Management**: Logical tab order and focus indication

## Theme & Responsive Design

### Theme Support
- **Dark/Light Mode**: Automatic theme adaptation with CSS custom properties
- **Asset Switching**: Theme-appropriate images (noData/noDataDark)
- **Color Variables**: Consistent theming with CSS custom properties

### Responsive Features
- **Flexible Layout**: Adapts to different screen sizes
- **Touch Interactions**: Mouse and touch event handling
- **Mobile Optimization**: Appropriate sizing for mobile interfaces

### RTL Support
- **Text Direction**: Proper handling of right-to-left languages
- **Layout Mirroring**: Automatic layout adjustments
- **Mixed Content**: Support for mixed-direction text content

## Performance Optimizations

### Debouncing
- **Search Input**: 500ms debounce prevents excessive API calls
- **Focus Management**: nextTick ensures proper DOM timing

### Efficient Rendering
- **Conditional Templates**: Smart v-if/v-else-if for different states
- **Limited Recommendations**: Shows only first 3 recommendations for performance
- **Lazy Loading**: Load more functionality for large result sets

### Memory Management
- **Ref Management**: Proper cleanup of template refs
- **Event Handling**: Efficient event delegation and cleanup

## Integration Patterns

### Parent Component Usage
```vue
<Item 
  :data="cardData"
  :recommendation="entities"
  :keyword="searchKeyword"
  :searchLoading="isSearching"
  :recommendedLoading="isLoadingRecs"
  :loadmoreLoading="isLoadingMore"
  :noLoadData="noMoreResults"
  :isCurrent="isActiveCard"
  @gotoDetail="handleDetailView"
  @gotoSubItemDetail="handleEntityDetail"
  @gotoReview="handleReview"
  @setSearch="handleSearch"
  @loadMore="handleLoadMore"
  @onHold="handleDragStart"
  @onRelease="handleDragEnd"
/>
```

### Event Flow
1. **Search Input** → `setSearch` event → Parent API call → Updated `recommendation` prop
2. **Item Selection** → `selectItem` internal + `selectItem` event → Review button enabled
3. **Navigation** → `gotoDetail`/`gotoReview` events → Parent route/mode changes
4. **Pagination** → `loadMore` event → Parent API call → Additional results

## Browser Compatibility

- **Modern Browsers**: ES6+ features require modern browser support
- **Touch Events**: Full touch and mouse event support
- **CSS Features**: CSS custom properties, flexbox, CSS Grid
- **Accessibility**: Screen reader and keyboard navigation support

## Troubleshooting

### Common Issues

1. **Items not selectable**
   - Check if `isCurrent` prop is `true`
   - Verify event handlers are properly connected
   - Ensure items have valid `id` properties

2. **Search not working**
   - Verify `setSearch` event is handled by parent
   - Check debounce timing (500ms delay)
   - Ensure search results update `recommendation` prop

3. **Keyboard navigation fails**
   - Check if radioButtons refs are properly populated
   - Verify DOM elements are rendered before navigation
   - Ensure proper focus management in parent component

4. **Loading states not showing**
   - Verify loading props are correctly passed
   - Check conditional rendering logic
   - Ensure parent component manages loading states properly