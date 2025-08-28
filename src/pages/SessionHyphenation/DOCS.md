# SessionHyphenation Component Documentation

## Overview

The SessionHyphenation component handles the hyphenation contribution session for lexemes. Users are presented with lexemes that need hyphenation patterns and can provide their own hyphenation input through a card-based interface with detailed views and validation. This session type allows contributors to add syllable breaks and stress patterns to improve pronunciation guidance.

## Key Features

- **Hyphenation Interface**: Interactive input for users to provide hyphenation patterns for lexemes
- **Card-based Navigation**: Stack of cards with swipe gestures and skip functionality
- **Multi-mode Views**: Front card, detail view, and review modes
- **Progress Tracking**: Session progress with undo functionality
- **Accessibility Support**: Reduced motion preferences and keyboard navigation
- **Theme Support**: Dark/light mode with RTL/LTR text direction

## Functions

### Navigation & Card Management

#### slideRightWithSuccess() {#slideRightWithSuccess}

Handles successful hyphenation submission animation and state reset.

**Description:**
Manages the animation sequence when a hyphenation pattern is successfully submitted, including success indicator display and card transition.

**Step-by-step breakdown:**

1. **`setTimeout(() => { ... }, 1000)`** - Waits 1 second (1000ms) to allow success animation to display

**Inside the first timeout (after 1000ms):**
2. **`submit.value = true`** - Triggers submit animation for card transition
3. **`noLoad.value = false`** - Resets no-load state for future data loading
4. **Motion preference handling:**
   - If normal motion: `setTimeout(() => { isSuccess.value = false }, 50)` - Hides success after 50ms
   - If reduced motion: Success will be hidden later in the flow

**Second timeout (after additional 400ms):**
5. **`if (isPreferredMotion.value) { isSuccess.value = false }`** - Hides success for reduced motion users
6. **`onHideCard()`** - Removes current card from stack and updates counters
7. **`splash.value = true`** - Shows splash screen on next card
8. **`currMode.value = 1`** - Resets to main card view mode
9. **`submittingData.value = false`** - Stops submitting animation
10. **`flip.value = false`** - Ensures card is not flipped
11. **`submit.value = false`** - Resets submit animation flag
12. **`disableSplash()`** - Starts 1.5s timer to hide splash screen

**When this function is called:**
- After successful hyphenation submission
- Provides celebratory success animation before transitioning to next card
- Total animation sequence: 1000ms (success display) + 400ms (transition) = 1.4 seconds

#### onHideCard() {#onHideCard}

Removes the current card from the stack and updates counters.

**Description:**
Handles the core logic of removing a card from the data array and updating the UI state.

**Step-by-step breakdown:**

1. **`tempData.value = data.value.pop()`** - Removes last card from array and stores in temp
2. **`count.value = count.value - 1`** - Decrements card counter

#### nextCard(isButton, id, contributionId) {#nextCard}

Initiates the skip/next card sequence.

**Parameters:**
- `isButton` (boolean) - Whether the action was triggered by button click or gesture
- `id` (string) - Card ID
- `contributionId` (string) - Contribution session ID

**Description:**
Handles skipping to the next card with undo warning setup.

**Step-by-step breakdown:**

**Immediate actions:**
1. **`if (isButton) { next.value = true }`** - Sets next animation flag only for button clicks
2. **`isSkipButton.value = isButton`** - Tracks whether skip was triggered by button or gesture

**Delayed actions (after 300ms):**
3. **`setTimeout(async () => { ... }, 300)`** - Waits 300ms for skip animation to complete
4. **`splash.value = true`** - Shows splash screen on the next card
5. **`setUndoWarn(id, contributionId)`** - Starts undo warning timer with progress bar
6. **`onHideCard()`** - Removes current card from stack and updates counters
7. **`zIndex.value = "z-[1]"`** - Resets z-index to default layer
8. **`currMode.value = 1`** - Resets to main card view mode
9. **`flip.value = false`** - Ensures card is not in flipped state
10. **`isSubmitError.value = false`** - Clears any previous submit errors
11. **`noLoad.value = false`** - Resets no-load state for future data loading
12. **`if (isButton) { next.value = false }`** - Resets next animation flag for button clicks
13. **`disableSplash()`** - Starts 1.5s timer to hide splash screen

**When this function is called:**
- When user clicks skip button (`isButton = true`)
- When user swipes card (`isButton = false`)
- Triggers undo warning that allows reversal within ~2.75 seconds

#### undoCard() {#undoCard}

Restores the previously skipped card.

**Description:**
Reverses the last skip action by restoring the card to the stack and clearing undo state.

**Step-by-step breakdown:**

**Immediate actions:**
1. **`clearTimeout(timeout)`** - Cancels the undo warning timer to stop auto-skip
2. **`prev.value = true`** - Sets previous/undo animation flag
3. **`splash.value = false`** - Hides splash screen to show the restored card

**Card restoration:**
4. **`data.value = [...data.value, tempData.value]`** - Adds the temporarily stored card back to the end of the array
5. **`tempData.value = null`** - Clears the temporary storage
6. **`undoWarn.value = false`** - Hides the undo warning UI

**Animation cleanup:**
7. **`setTimeout(() => { prev.value = false }, 600)`** - Resets undo animation flag after 600ms

### Card Mode Management

#### test1(id, contributionId, headerData) {#test1}

Switches to detail view mode (mode 1).

**Parameters:**
- `id` (string) - Card ID
- `contributionId` (string) - Contribution session ID
- `headerData` (Object) - Header information for detail view

**Description:**
Transitions card to flip state and loads detailed lexeme information for hyphenation context.

**Step-by-step breakdown:**

**Immediate state changes:**
1. **Motion-aware z-index:** If normal motion, immediately sets `zIndex.value = ""`
2. **`setTimeout(() => { ... }, 350)`** - Motion preference handling for reduced motion users
3. **`currMode.value = 1`** - Sets card to detail view mode
4. **`detailHeaderData.value = headerData`** - Stores header data for display
5. **`flip.value = true`** - Triggers card flip animation

**Data loading:**
6. **`await getDetail({ contributionId, id })`** - Loads detailed lexeme information from API

#### test3(data) {#test3}

Switches to review mode (mode 3).

**Parameters:**
- `data` (Object) - Review data

**Description:**
Shows the final review interface before hyphenation submission.

**Step-by-step breakdown:**

**Immediate state changes:**
1. **Motion-aware z-index:** If normal motion, immediately sets `zIndex.value = ""`
2. **`setTimeout(() => { ... }, 350)`** - Motion preference handling for reduced motion users
3. **`currMode.value = 3`** - Sets card to review mode
4. **`flip.value = true`** - Triggers card flip animation
5. **`detail.value = data`** - Stores review data for display

#### backtoHome() {#backtoHome}

Returns to front card view from any detail mode.

**Description:**
Resets card flip state and restores front view visibility.

**Step-by-step breakdown:**

1. **`flip.value = false`** - Triggers card flip back to front
2. **`setTimeout(() => { zIndex.value = "z-[1]" }, 300)`** - Resets z-index after flip animation

### Data Management

#### submitCard(item, contributionId, id) {#submitCard}

Submits user's hyphenation input for the current card.

**Parameters:**
- `item` (Object) - Hyphenation data item
- `contributionId` (string) - Contribution session ID
- `id` (string) - Card ID

**Description:**
Processes the user's hyphenation submission and updates the backend.

**Step-by-step breakdown:**

**Initial setup:**
1. **`submittingData.value = true`** - Shows submitting animation/loading state
2. **`let action = ""`** - Initialize action variable
3. **`action = "add"`** - Sets action to "add" (hyphenation always adds content)

**API submission:**
4. **`const response = await updateDetail({ data: { ...item, action }, contributionId, id })`** - Sends hyphenation to backend

**Response handling:**
5. **If response.statusCode === 200 (Success):**
   - `isSuccess.value = true` - Shows success indicator
   - `setTimeout(() => { slideRightWithSuccess() }, 1125)` - Waits 1.125s then transitions with success animation

6. **If response.statusCode === 503 (No Internet):**
   - `isLoading.value = false` - Stops loading state
   - `noInternet.value = true` - Shows no internet error

7. **If other error:**
   - `isSubmitError.value = true` - Shows submission error state
   - `submittingData.value = false` - Stops submitting animation

#### updateDetail({data, contributionId, id}) {#updateDetail}

Updates card details on the backend using hyphenation-specific API.

**Parameters:**
- `data` (Object) - Update data including action type and hyphenation content
- `contributionId` (string) - Contribution session ID
- `id` (string) - Card ID

**Description:**
Calls the UpdateHyphenationCardDetail API to save hyphenation contributions.

### Data Loading Functions

#### getDetail({contributionId, id}) {#getDetail}

Loads detailed information for a specific lexeme card.

**Parameters:**
- `contributionId` (string) - Contribution session ID
- `id` (string) - Card ID

**Description:**
Fetches detailed lexeme information using GetHyphenationDetail API for the detail view.

#### getLanguages() {#getLanguages}

Loads available language options.

**Description:**
Fetches language list for the interface and stops loading state.

#### getProfile() {#getProfile}

Fetches user profile and initiates session data loading.

**Description:**
Initial profile fetch that determines language and activity type for the session.

#### getCardsData(code, type) {#getCardsData}

Loads session cards based on language and activity type.

**Parameters:**
- `code` (string) - Language code
- `type` (string) - Activity type (defaults to "hyphenation")

**Description:**
Fetches the main card data for the hyphenation session, filtering for pending status cards.

### Session Management

#### endEarly() {#endEarly}

Handles early session termination with confirmation.

**Description:**
Allows users to end the session before completing all cards, with confirmation dialog and proper cleanup.

#### setUndoWarn(id, contributionId) {#setUndoWarn}

Sets up the undo warning timer and progress indicator.

**Parameters:**
- `id` (string) - Card ID
- `contributionId` (string) - Contribution session ID

**Description:**
Creates a timed warning (2.75 seconds) that allows users to undo their skip action.

**Step-by-step breakdown:**

**Initial setup:**
1. **`undoWarn.value = true`** - Shows the undo warning UI component
2. **Timer configuration:**
   - `const duration = 2750` - Total duration of 2.75 seconds
   - `const interval = 27.5` - Updates every 27.5ms (smooth animation)
   - `const steps = duration / interval` - Calculates total steps (100 steps)

**Progress animation:**
3. **Recursive increment function** - Updates progress bar smoothly
4. **Completion check with session validation:**
   - `if (currCount.value <= totalCount.value)` - Only finalize skip if still in session
   - `await updateDetail({ data: { action: "skip" }, contributionId, id })` - Finalizes skip action

### Animation & UI Functions

#### submitCardAnim(condition) {#submitCardAnim}

Returns appropriate CSS class for submit animation.

**Parameters:**
- `condition` (boolean) - Whether to apply animation

**Description:**
Determines animation class based on motion preferences and text direction for hyphenation submissions.

#### skipCardAnim(condition) {#skipCardAnim}

Returns appropriate CSS class for skip animation.

**Parameters:**
- `condition` (boolean) - Whether to apply animation

**Description:**
Handles skip animation with motion and direction considerations.

#### undoCardAnim(condition) {#undoCardAnim}

Returns appropriate CSS class for undo animation.

**Parameters:**
- `condition` (boolean) - Whether to apply animation

**Description:**
Manages undo card restoration animation with motion preferences.

#### skipAllAnim() {#skipAllAnim}

Returns CSS class for skip-all animation.

**Description:**
Handles animation when user chooses to skip all remaining cards.

#### animClass(index) {#animClass}

Generates combined animation classes for card at given index.

**Parameters:**
- `index` (number) - Card index in the array

**Description:**
Combines multiple animation states into a single class array for card styling.

### Utility Functions

#### disableSplash() {#disableSplash}

Hides the splash screen after a 1.5-second delay.

**Description:**
Controls the timing of splash screen visibility for smooth transitions.

#### reload() {#reload}

Reloads the page for error recovery.

**Description:**
Simple page reload for error recovery scenarios.

#### aa() {#aa}

Sets movement state for card interactions.

**Description:**
Indicates that card movement/interaction has started by setting `isMove.value = true`.

#### ab() {#ab}

Handles spring-back animation after card interaction.

**Description:**
Manages the spring-back effect when card returns to position with 350ms timing.

## Lifecycle Hooks

### onMounted() {#onMounted}

Component initialization and theme setup.

**Description:**
Sets up theme colors based on user preferences, initiates data loading based on store state, and configures meta theme colors for mobile browsers.

### onBeforeRouteLeave() {#onBeforeRouteLeave}

Route guard for session preservation.

**Description:**
Prevents accidental navigation away from active session with confirmation dialog and handles session cleanup.

## Watchers

### data Array Watcher {#data-watcher}

Monitors changes to the card data array.

**Description:**
Updates card margins and spacing when cards are added/removed to maintain proper visual stacking.

### currCount & undoWarn Watcher {#currCount-undoWarn-watcher}

Monitors session completion.

**Description:**
Triggers session completion flow when all cards are processed, handling EndContribution API call and completion dialog.

### Accessibility Watcher {#accessibility-watcher}

Manages focus and tabindex for accessibility.

**Description:**
Complex watcher that manages keyboard navigation and screen reader accessibility across different card modes and states, including special handling for hyphenation input fields.

## Computed Properties

### currCount {#currCount-computed}

Calculates current card position in the session.

**Returns:** Current card number (1-based)

**Description:**
Provides the current position for UI display and progress tracking using `totalCount.value + 1 - data?.value?.length`.

### isThemeDark {#isThemeDark-computed}

Gets current theme state from store.

**Returns:** Boolean indicating dark theme

### language {#language-computed}

Gets current language from store.

**Returns:** Current language code

## Component Structure

### Template Sections

#### Header
- Back to home button with endEarly functionality
- Session progress indicator showing current card number

#### Error States
- No internet connection with theme-aware error icons
- General errors with retry functionality
- No lexemes available (completion state)
- Loading states with branded loading component

#### Main Card Interface
- Card stack with swipe interactions and proper z-indexing
- Multiple card modes: splash, hyphenation input, detail, review
- Success and error overlays for submission feedback
- Hyphenation-specific submission states

#### Undo Interface
- Progress indicator with smooth 2.75-second countdown
- Undo button with proper accessibility
- Conditional display based on motion preferences

#### Bottom Controls
- Skip button with direction-aware icons
- End early button with proper disable states

#### Dialogs
- Warning dialog for early exit confirmation
- Completion dialog for session finish
- Image lightbox for reference materials

## State Management

### Reactive State Variables

- `data` - Array of hyphenation session cards
- `currMode` - Current card view mode (1: detail, 3: review)
- `flip` - Card flip state for mode transitions
- `splash` - Splash screen visibility
- `undoWarn` - Undo warning state with progress tracking
- `submittingData` - Hyphenation submission in progress
- `isLoading` - General loading state
- `progress` - Undo timer progress (reactive object)

### Loading States

- `cardDetailLoading` - Card detail loading
- `endLoading` - Session end in progress

### Error States

- `isError` - General error state
- `isSubmitError` - Hyphenation submission error
- `noInternet` - Network connectivity error

## Hyphenation Specific Features

- **Hyphenation Input Interface**: Specialized input handling for syllable breaks and stress patterns
- **Validation Logic**: Always uses "add" action since hyphenation always adds content
- **GetHyphenationDetail API**: Uses hyphenation-specific API endpoints for detailed views
- **UpdateHyphenationCardDetail**: Uses hyphenation-specific update API for submissions
- **Syllable Pattern Recognition**: Support for various hyphenation notations and stress indicators

## Accessibility Features

- Reduced motion support with `isPreferredMotion`
- Keyboard navigation with dynamic tabindex management
- Screen reader compatibility with proper ARIA labels
- Focus management across card modes
- Special hyphenation input accessibility handling
- High contrast theme support
- RTL/LTR text direction support

## Animation System

The component includes a comprehensive animation system that:
- Respects user motion preferences
- Supports RTL/LTR text directions  
- Provides smooth card transitions with 3D perspective
- Includes loading and success animations specific to hyphenation workflow
- Handles reduced motion scenarios gracefully
- Uses consistent visual feedback for hyphenation submissions