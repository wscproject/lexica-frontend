# Hyphenation Component Documentation

## Overview

The Hyphenation component provides an interactive interface for marking hyphenation points in words. It features a scrollable character-by-character view with snap-to-position scrolling, haptic feedback, and visual indicators for hyphenation breaks. Users can navigate through each letter position and toggle hyphenation marks between characters.

## Key Features

- **Character-by-Character Navigation**: Scroll through word with letter-precise positioning
- **Snap-to-Position Scrolling**: Automatic alignment to character boundaries
- **Haptic Feedback**: Vibration when crossing hyphenation points (mobile devices)
- **Visual Hyphenation Preview**: Real-time display of hyphenated segments
- **Touch and Keyboard Support**: Multiple interaction methods
- **RTL/LTR Support**: Proper text direction handling
- **Theme Adaptation**: Dark/light mode compatibility
- **Accessibility**: ARIA labels and keyboard navigation

## Component Structure

### Props

#### data {#data-prop}

**Type:** `Object` (required)

**Description:**
Contains the lexeme information and metadata for hyphenation.

**Structure:**
```javascript
{
  lemma: String,              // Word to be hyphenated
  gloss: String,              // Definition/meaning (optional)
  language: {
    title: String             // Language name
  }
}
```

**Example:**
```javascript
{
  lemma: "hyphenation",
  gloss: "The practice of dividing words",
  language: {
    title: "English"
  }
}
```

## Emitted Events

### gotoDetail {#gotoDetail-event}

**Trigger:** When user clicks the info icon

**Description:**
Requests navigation to detailed lexeme information view.

**Payload:** Click event

**Usage Example:**
```javascript
@gotoDetail="showLexemeDetail"
```

### gotoReview {#gotoReview-event}

**Trigger:** When user clicks "Review" button

**Description:**
Passes hyphenated word for review confirmation.

**Payload:** `String` - Comma-separated hyphenated segments

**Example Payload:**
```javascript
"hy,phen,a,tion"
```

**Usage Example:**
```javascript
@gotoReview="reviewHyphenation"
```

## Reactive State

### Core State Variables

#### word {#word-ref}

**Type:** `ref<String>`

**Description:**
Original word to be hyphenated (immutable during session).

#### editedWord {#editedWord-ref}

**Type:** `ref<String>`

**Description:**
Current hyphenated version with comma separators for display.

#### currentIndex {#currentIndex-ref}

**Type:** `ref<Number>`

**Description:**
Index of current position in the character array (always odd - between characters).

#### selectedIndexes {#selectedIndexes-ref}

**Type:** `ref<Array<Number>>`

**Description:**
Array of character boundary indexes where hyphenation breaks are placed.

#### containerRef {#containerRef-ref}

**Type:** `ref<HTMLElement>`

**Description:**
Reference to the scrollable character container.

#### itemsRef {#itemsRef-ref}

**Type:** `ref<Array<HTMLElement>>`

**Description:**
Array of character and divider DOM elements for scroll calculations.

## Functions

### Core Logic Functions

#### splitWithEmptySlots(word) {#splitWithEmptySlots}

**Parameters:**
- `word` (String) - Word to split

**Returns:** `Array<String>` - Alternating characters and empty slots

**Description:**
Creates alternating array of characters and empty positions for hyphenation points.

**Example:**
```javascript
splitWithEmptySlots("cat")
// Returns: ["c", "", "a", "", "t"]
```

**Step-by-step breakdown:**
1. `word.split("")` - Splits into character array
2. `.flatMap((char) => [char, ""])` - Inserts empty slot after each character
3. `.slice(0, -1)` - Removes final empty slot

#### splitWord() {#splitWord}

**Description:**
Updates the edited word by inserting commas at selected hyphenation points.

**Process:**
1. Creates character array with empty slots
2. Replaces empty slots at selected indexes with commas
3. Joins array back to hyphenated string
4. Updates `editedWord` reactive reference

**Example:**
```javascript
// word: "hyphenation"
// selectedIndexes: [3, 7, 9]
// Result: "hy,phen,a,tion"
```

### Navigation Functions

#### scrollToItem(index) {#scrollToItem}

**Parameters:**
- `index` (Number) - Target item index

**Description:**
Smoothly scrolls container to center the specified character.

**Calculation:**
```javascript
left: item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2
```

#### scrollPrev() {#scrollPrev}

**Description:**
Navigates to previous character position with boundary checking.

**Step-by-step breakdown:**
1. Finds current center position in scroll container
2. Calculates target index (2 positions back)
3. Handles boundary conditions (start of word)
4. Updates current index and scrolls to position

#### scrollNext() {#scrollNext}

**Description:**
Navigates to next character position with boundary checking.

**Step-by-step breakdown:**
1. Finds current center position
2. Calculates next character boundary (2 positions forward)
3. Handles end-of-word boundary
4. Updates current index and scrolls

#### updateCurrentIndex() {#updateCurrentIndex}

**Description:**
Updates current position based on scroll position (debounced for performance).

**Logic:**
- Finds item at container center
- Ensures index is odd (character boundary)
- Updates reactive `currentIndex`

### Hyphenation Functions

#### tagHyphenation() {#tagHyphenation}

**Description:**
Adds hyphenation break at current position.

**Process:**
1. Adds current index to selected indexes array
2. Waits for DOM update (`nextTick`)
3. Regenerates hyphenated word string

#### untagHyphenation() {#untagHyphenation}

**Description:**
Removes hyphenation break from current position.

**Process:**
1. Filters current index from selected indexes
2. Waits for DOM update
3. Regenerates word without break at position

### Feedback Functions

#### handleScrollVibration() {#handleScrollVibration}

**Description:**
Provides haptic feedback when crossing hyphenation points.

**Features:**
- Immediate response (not debounced)
- Only vibrates at character boundaries (even indexes)
- Short 10ms vibration pulse
- Browser compatibility check

**Step-by-step breakdown:**
1. Calculates center position in container
2. Finds item at center
3. Checks if crossing divider boundary
4. Triggers vibration if supported and appropriate

## Computed Properties

### isThemeDark {#isThemeDark-computed}

**Returns:** `Boolean`

**Description:**
Gets current theme state from Vuex store for icon selection.

## Component Lifecycle

### onMounted() {#onMounted}

**Description:**
Initializes component state and sets up scroll listeners.

**Process:**
1. Sets word values from props
2. Waits for DOM rendering
3. Populates `itemsRef` with DOM elements
4. Attaches scroll event listeners:
   - `handleScrollVibration` (immediate)
   - `debouncedUpdateCurrentIndex` (debounced)

### onBeforeUnmount() {#onBeforeUnmount}

**Description:**
Cleans up event listeners to prevent memory leaks.

## Template Structure

### Header Section {#header-section}

**Description:**
Displays hyphenated word preview and lexeme information.

**Features:**
- Red background (#9F3526) matching design system
- White text for contrast
- Segmented word display in chips
- Gloss or empty state message
- Info button for detailed view

**Word Preview:**
Each hyphenated segment displays in white rounded chips:
```html
<div class="bg-white p-[var(--spacing-25)] w-fit rounded-[0.5rem]">
  <h4 class="text-[1.125rem] font-bold text-[#9F3526]">{{ segment }}</h4>
</div>
```

### Character Navigation Area {#navigation-area}

**Description:**
Large scrollable area for character-by-character navigation.

**Features:**
- 6rem font size for visibility
- Horizontal scroll with snap points
- Hidden scrollbars for clean appearance
- Gradient overlays for fade effect
- Center indicator line

**Character Items:**
- Characters: 3.25rem min-width, centered
- Dividers: Empty slots with optional hyphenation marks
- Scroll snap points at character boundaries

### Control Footer {#control-footer}

**Description:**
Navigation and action buttons with visual styling.

**Components:**
1. **Previous Button**: Navigate to previous character
2. **Hyphenation Toggle**: Add/remove hyphenation break
3. **Next Button**: Navigate to next character
4. **Review Button**: Proceed to confirmation

**Styling Features:**
- Triangular cutout design with CSS pseudo-elements
- Disabled states for boundary conditions
- RTL/LTR icon direction handling

## Styling System

### CSS Custom Properties

#### Layout Variables
- `--spacing-25`: 0.25rem spacing
- `--spacing-50`: 0.5rem spacing  
- `--spacing-75`: 0.75rem spacing
- `--spacing-100`: 1rem spacing

#### Color Variables
- `--background-color-base`: Main background
- `--background-color-neutral`: Footer background
- `--border-color-base`: Border colors
- `--color-base`: Text colors

### Custom CSS Classes

#### .triangle {#triangle-style}

**Description:**
Creates downward pointing triangle from header.

```css
.triangle {
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 1.5rem solid transparent;
  border-right: 1.5rem solid transparent;
  border-top: 1.5rem solid #9f3526;
  transform: translateX(-50%);
}
```

#### .hyphenation-footer {#footer-style}

**Description:**
Creates triangular cutout effect using pseudo-elements.

```css
.hyphenation-footer::after {
  /* Creates upward triangle cutout */
  border-bottom: 25px solid var(--background-color-neutral);
}

.hyphenation-footer::before {
  /* Creates border for triangle */
  border-bottom: 25px solid var(--border-color-base);
}
```

#### .x.mandatory-scroll-snapping {#scroll-snap-style}

**Description:**
Enables precise scroll snapping to character boundaries.

```css
.x.mandatory-scroll-snapping {
  scroll-snap-type: x mandatory;
  scroll-padding-left: calc(50% - 26px);
  padding-left: calc(50% - 26px);
  padding-right: calc(50% - 26px);
}
```

#### .letter-divider {#divider-style}

**Description:**
Shows hyphenation mark at selected positions.

```css
.letter-divider::after {
  content: url("/src/assets/letter_divider.svg");
  position: absolute;
  top: 0;
  width: 1.6875rem;
  height: auto;
}
```

### Gradient Overlays

#### Light Theme
```css
.gradient-light {
  background: url("@/assets/gradient-light.svg");
  background-size: cover;
  pointer-events: none;
}
```

#### Dark Theme
```css
.gradient {
  background: url("@/assets/gradient.svg");
  background-size: cover;
  pointer-events: none;
}
```

## Accessibility Features

### ARIA Support
- `aria-label` on info button and navigation buttons
- `tabindex` management for keyboard navigation
- Focus indicators on interactive elements

### Keyboard Navigation
- Tab navigation through controls
- Space bar activation for buttons
- Proper focus management

### Screen Reader Support
- Descriptive button labels
- Semantic HTML structure
- Language context information

## Performance Optimizations

### Debounced Functions
- `updateCurrentIndex` debounced at 50ms for smooth scrolling
- Prevents excessive state updates during scroll

### Event Handling
- Separate immediate vibration handler
- Efficient DOM queries with cached references
- Proper event listener cleanup

### Memory Management
- Event listener removal on unmount
- Reactive reference cleanup
- DOM reference management

## Mobile Optimizations

### Touch Interactions
- Large touch targets (2.125rem buttons)
- Smooth scroll behavior
- Haptic feedback support

### Responsive Design
- Viewport-aware sizing
- Touch-friendly spacing
- Optimized for mobile screens

## Browser Compatibility

### Scroll Snap Support
- Modern browsers with CSS Scroll Snap
- Fallback behavior for older browsers

### Vibration API
- Feature detection with `'vibrate' in navigator`
- Graceful degradation when unavailable

### CSS Grid/Flexbox
- Modern layout techniques
- Fallbacks for older browsers

## Usage Examples

### Basic Implementation
```vue
<Hyphenation
  :data="lexemeData"
  @gotoDetail="showDetail"
  @gotoReview="reviewHyphenation"
/>
```

### With Custom Handlers
```vue
<Hyphenation
  :data="{
    lemma: 'hyphenation',
    gloss: 'Word division practice',
    language: { title: 'English' }
  }"
  @gotoDetail="handleDetailView"
  @gotoReview="handleReviewSubmission"
/>
```

## Data Flow

1. **Component Mount**: Initialize with lexeme data
2. **User Navigation**: Scroll or use buttons to move between characters
3. **Position Detection**: Update current index based on scroll position
4. **Hyphenation Toggle**: Add/remove breaks at current position
5. **Preview Update**: Show segmented word in header
6. **Review Trigger**: Submit comma-separated hyphenation string

## Error Handling

### Boundary Conditions
- Prevents navigation before start or after end
- Disables buttons at boundaries
- Safe array access with bounds checking

### DOM Safety
- Null checks for DOM references
- Element existence validation
- Safe event listener handling

### Data Validation
- Props validation for required data
- Fallback values for missing properties
- Safe string operations

## Known Limitations

1. **Single Word Only**: Cannot handle multi-word phrases
2. **Latin Script Optimized**: May need adjustments for other scripts
3. **Mobile-First Design**: Desktop experience could be enhanced
4. **No Validation**: Doesn't verify hyphenation correctness
5. **Memory Usage**: Stores all character positions in DOM

## Future Enhancements

1. **Hyphenation Validation**: Check against dictionary rules
2. **Multi-word Support**: Handle compound words and phrases
3. **Pronunciation Guide**: Audio feedback for hyphenated segments
4. **Export Options**: Save hyphenation patterns
5. **Batch Processing**: Multiple words in sequence
6. **Custom Snap Points**: Adjustable scroll sensitivity
7. **Gesture Recognition**: Swipe gestures for navigation
8. **Syllable Indicators**: Show syllable boundaries
9. **Language-Specific Rules**: Adapt to different hyphenation systems
10. **Accessibility Improvements**: Better screen reader support