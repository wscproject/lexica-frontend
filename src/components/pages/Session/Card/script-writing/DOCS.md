# Script Writing Component Documentation

## Overview

The Script Writing component provides the main interface for script writing contribution sessions in Lexica. Users are presented with lexemes that need script writing (pronunciation transcription) and can input their transcription through a specialized text area interface. This component features a distinctive orange theme and is optimized for script input with proper language direction support and focus management.

## Key Features

- **Script Input Interface**: Large, prominent text area optimized for script writing
- **Language-Specific Display**: Shows target language variant and code for transcription context
- **Automatic Focus Management**: Ensures text area stays focused for continuous input
- **Scrollbar Detection**: Adaptive layout based on content overflow
- **RTL/LTR Support**: Proper text direction handling for different scripts
- **Distinctive Theme**: Orange branding (#FFA758) specific to script writing workflow
- **Accessibility**: Proper ARIA labeling and keyboard navigation
- **Responsive Design**: Adapts to different screen sizes with mobile-specific optimizations

## Props

### data {#data-prop}
**Type:** `Object`
**Required:** Yes

**Description:**
Contains the lexeme information for script writing context.

**Structure:**
- `lemma` (String) - The lexeme text to be transcribed
- `gloss` (String) - Definition/meaning of the lexeme
- `language` (Object) - Language metadata
  - `title` (String) - Language display name
  - `languageVariant` (Object) - Target script language information
    - `title` (String) - Script language display name
    - `codePreview` (String) - Script language code (e.g., "IPA", "Arab")
    - `isRtl` (Boolean) - Whether script is right-to-left

### recommendation {#recommendation-prop}
**Type:** `Array`
**Default:** `[]`
**Note:** Currently unused but maintained for interface consistency

### keyword {#keyword-prop}
**Type:** `String`
**Default:** `""`
**Note:** Currently unused but maintained for interface consistency

### searchLoading {#searchLoading-prop}
**Type:** `Boolean`
**Default:** `false`
**Note:** Currently unused but maintained for interface consistency

### recommendedLoading {#recommendedLoading-prop}
**Type:** `Boolean`
**Default:** `false`
**Note:** Currently unused but maintained for interface consistency

### loadmoreLoading {#loadmoreLoading-prop}
**Type:** `Boolean`
**Default:** `false`
**Note:** Currently unused but maintained for interface consistency

### noLoadData {#noLoadData-prop}
**Type:** `Boolean`
**Default:** `false`
**Note:** Currently unused but maintained for interface consistency

### currCount {#currCount-prop}
**Type:** `Number`
**Required:** Yes

**Description:**
Current card number in the session. Used for triggering focus management when cards change.

## Events

### gotoDetail {#gotoDetail-event}
**Payload:** Event object
**Emitted:** When user clicks the info icon

**Description:**
Requests navigation to the detailed lexeme view for additional context.

### onHold {#onHold-event}
**Emitted:** When drag interaction begins (currently unused)

### onRelease {#onRelease-event}
**Emitted:** When drag interaction ends (currently unused)

### gotoReview {#gotoReview-event}
**Payload:** Script string content
**Emitted:** When user clicks the continue button

**Description:**
Requests navigation to review mode with the entered script text.

### selectItem {#selectItem-event}
**Note:** Currently unused but maintained for interface consistency

### setSearch {#setSearch-event}
**Note:** Currently unused but maintained for interface consistency

### loadMore {#loadMore-event}
**Note:** Currently unused but maintained for interface consistency

## Functions & Computed Properties

### Theme Management

#### isThemeDark {#isThemeDark}

Computes current theme state from Vuex store.

**Returns:**
- `Boolean` - True if dark theme is active, false for light theme

**Description:**
Provides reactive theme state for conditional styling and asset selection.

**Step-by-step breakdown:**
1. **Store access:** `vuex.getters["profile/isDark"]` - Retrieves theme preference from Vuex store
2. **Reactive updates:** Automatically updates when theme changes in store

**When this computed property updates:**
- When user toggles theme in application settings
- When system theme preference changes (if applicable)
- Used for theme-aware asset selection (currently unused in this component)

### Lifecycle Management

#### onMounted() {#onMounted}

Sets up initial focus on the text area after component mount.

**Description:**
Ensures the text area receives focus after the component is fully mounted and rendered, providing immediate input readiness.

**Step-by-step breakdown:**
1. **Delayed focus:** `setTimeout(() => { ... }, 1500)` - Waits 1.5 seconds for complete rendering
2. **Element access:** `textAreaRef.value.textarea` - Accesses the underlying textarea element from Codex component
3. **Focus action:** `.focus()` - Sets keyboard focus to the text area

**When this function is called:**
- Automatically when component mounts to DOM
- Essential for user experience - enables immediate typing
- Delay ensures all animations and transitions are complete

**Timing rationale:**
- 1500ms delay accounts for card flip animations and transitions
- Ensures focus doesn't interfere with visual animations
- Provides smooth transition to input-ready state

### Watchers

#### changing Watcher {#changing-watcher}

Watches for card changes to refocus text area.

**Description:**
Monitors changes to the current card count and refocuses the text area when a new card is displayed.

**Step-by-step breakdown:**
1. **Change detection:** `watch(changing, () => { ... })` - Triggered when `currCount` prop changes
2. **Delayed refocus:** `setTimeout(() => { ... }, 1500)` - Same 1.5 second delay as onMounted
3. **Focus restoration:** `textAreaRef.value.textarea.focus()` - Restores focus to text area

**When this watcher is called:**
- When user moves to next card in the session
- After skip actions or successful submissions
- Ensures continuous input readiness across card transitions

**Purpose:**
- Maintains consistent user experience across card changes
- Prevents need for manual focus management by user
- Critical for smooth script writing workflow

#### scrollRef Watcher {#scrollRef-watcher}

Watches scroll container to detect scrollbar presence.

**Description:**
Monitors the scroll container for content overflow to adjust layout styling accordingly.

**Step-by-step breakdown:**

**Scrollbar detection:**
1. **Height comparison:** `scrollRef?.value?.scrollHeight > scrollRef?.value?.clientHeight`
   - `scrollHeight` - Total content height including hidden overflow
   - `clientHeight` - Visible container height
2. **State update:**
   - **If overflow:** `isScrollbar.value = true` - Content exceeds container
   - **If no overflow:** `isScrollbar.value = false` - Content fits within container

**Layout impact:**
3. **Styling adjustment:** Used in template class binding for layout optimization
   - With scrollbar: Normal flex layout
   - Without scrollbar: Centered alignment (`flex items-center`)

**When this watcher is called:**
- When scroll container ref is initially set
- When content changes affect overflow state
- Provides adaptive layout based on content size

#### script Watcher {#script-watcher}

Watches script input changes for debugging purposes.

**Description:**
Development helper that logs script input changes to console for debugging and development purposes.

**Step-by-step breakdown:**
1. **Input monitoring:** `watch(script, () => { ... })` - Triggered on every script value change
2. **Debug logging:** `console.log(script.value)` - Outputs current script content to console

**When this watcher is called:**
- On every keystroke or input change in the text area
- Provides real-time debugging of user input
- Can be removed in production builds

**Development purpose:**
- Helps track input behavior during development
- Useful for debugging text area interactions
- No functional impact on user experience

## State Management

### Reactive State Variables

- `script` (String) - Current script input content
- `isScrollbar` (Boolean) - Whether scroll container has overflow
- `scrollRef` (Ref) - Reference to scroll container element
- `textAreaRef` (Ref) - Reference to Codex text area component

### Template References

- `scrollRef` - Scroll container for lemma display
- `textAreaRef` - Codex CdxTextArea component reference

## Component Structure

### Header Section (White Background)
- **Title**: Script writing instruction text
- **Lemma Display**: Large, scrollable display of the lexeme to be transcribed
  - Automatic hyphenation and word wrapping
  - Scrollbar detection for layout optimization
  - Language-specific attributes
- **Info Button**: Access to detailed lexeme information
- **Gloss Display**: Definition/meaning with ellipsis overflow

### Input Section (Orange Background #FFA758)
- **Language Header**: Target script language and code display
- **Text Area**: 
  - Large, prominent input field
  - RTL/LTR direction support based on target script
  - Autofocus functionality
  - Grows with content up to maximum height
  - Custom orange styling to match theme

### Action Section (Orange Background)
- **Continue Button**: 
  - Disabled when no input provided
  - Emits script content for review
  - Full-width progressive action styling

## Styling & Theme

### Color Scheme
- **Primary Orange**: #FFA758 (distinctive script writing theme)
- **Text Colors**: #361D13 (dark brown on orange background)
- **White Background**: For lexeme display section
- **Responsive**: Dark/light mode support where applicable

### Typography
- **Large Text**: 1.75rem for both lemma display and script input
- **Responsive**: Smaller text on very small screens (1rem on height < 575px)
- **Font Features**: Auto-hyphenation and word wrapping for lemma display

### Layout Features
- **Flexible Heights**: Adaptive to content and screen size
- **Scrollable Areas**: Both lemma display and text area support overflow
- **RTL Support**: Complete right-to-left layout support
- **Mobile Optimization**: Responsive breakpoints for different screen sizes

## Accessibility Features

### Focus Management
- **Automatic Focus**: Text area receives focus on mount and card changes
- **Focus Timing**: Delayed to avoid animation conflicts
- **Interactable Elements**: Proper `interactable` class for accessibility helpers

### ARIA Support
- **Aria-label**: Descriptive labels for info button
- **Semantic HTML**: Proper structure with appropriate elements
- **Language Attributes**: `lang` and `dir` attributes for proper content handling

### Keyboard Navigation
- **Tab Order**: Logical focus flow through interactive elements
- **Space Activation**: Space key support for button activation
- **Text Input**: Full keyboard support in text area

## Performance Considerations

### Efficient Rendering
- **Conditional Classes**: Smart class application based on state
- **Ref Management**: Proper template ref handling
- **Watcher Optimization**: Targeted watchers for specific functionality

### Focus Management
- **Delayed Actions**: Prevents interference with animations
- **Safe Access**: Optional chaining for ref access
- **Memory Cleanup**: Proper cleanup of watchers and refs

## Integration Patterns

### Parent Component Usage
```vue
<ScriptWriting 
  :data="lexemeData"
  :currCount="currentCardNumber"
  @gotoDetail="handleDetailView"
  @gotoReview="handleScriptReview"
/>
```

### Data Flow
1. **Lexeme Display** → Shows lexeme and language context
2. **Script Input** → User types transcription
3. **Review Trigger** → `gotoReview` event with script content
4. **Card Changes** → Focus management maintains input readiness

## Browser Compatibility

- **Modern Browsers**: ES6+ features, computed properties, and watchers
- **CSS Features**: CSS custom properties, flexbox, and media queries
- **Text Input**: Full text area and focus management support
- **Mobile**: Touch-friendly interface with appropriate sizing

## Troubleshooting

### Common Issues

1. **Text area not focusing**
   - Check if delays in `onMounted` and `changing` watcher are appropriate
   - Verify `textAreaRef.value.textarea` is accessible
   - Ensure component is fully mounted before focus attempts

2. **Layout issues with long lemmas**
   - Verify scrollbar detection is working correctly
   - Check `isScrollbar` state and conditional classes
   - Ensure hyphenation and word-wrap CSS is applied

3. **RTL layout problems**
   - Verify `props?.data?.language?.languageVariant?.isRtl` is correct
   - Check `dir` attribute application in template
   - Ensure RTL-specific styling is properly applied

4. **Button not enabling**
   - Verify `script` model is properly bound to text area
   - Check that button `:disabled="!script"` binding is correct
   - Ensure script watcher is properly tracking input changes

5. **Theme-related issues**
   - Verify orange color scheme is consistently applied
   - Check that custom CSS overrides Codex component styles
   - Ensure responsive breakpoints work correctly

6. **Mobile responsiveness**
   - Test text size scaling on small screens
   - Verify touch interactions work properly
   - Check that layout adapts to different screen orientations