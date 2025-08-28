# SessionConnect Component Documentation

## Overview

The SessionConnect component is the main interface for the lexeme connection contribution session. It presents users with cards containing lexemes that need to be connected to Wikidata entities, featuring a swipe-based interface with detailed views and search functionality.

## Key Features

- **Card-based Interface**: Stack of cards with swipe gestures for navigation
- **Multi-mode Views**: Front card, detail view, sub-item detail, and review modes
- **Search & Recommendations**: Entity search with keyword filtering and AI recommendations
- **Accessibility Support**: Reduced motion preferences and keyboard navigation
- **Progress Tracking**: Session progress with undo functionality
- **Theme Support**: Dark/light mode with RTL/LTR text direction

## Functions

### Navigation & Card Management

#### slideRightWithSuccess() {#slideRightWithSuccess}

Handles successful card submission animation and state reset.

**Description:**
Manages the animation sequence when a card is successfully submitted, including success indicator display and card transition.

**Step-by-step breakdown:**

1. **`setTimeout(() => { ... }, 1000)`** - Waits 1 second (1000ms) to allow success animation to display

**Inside the first timeout (after 1000ms):** 2. **`submit.value = true`** - Triggers submit animation for card transition 3. **`noLoad.value = false`** - Resets no-load state for future data loading 4. **Motion preference handling:**

- If normal motion: `setTimeout(() => { isSuccess.value = false }, 50)` - Hides success after 50ms
- If reduced motion: Success will be hidden later in the flow

**Second timeout (after additional 400ms):** 5. **`if (isPreferredMotion.value) { isSuccess.value = false }`** - Hides success for reduced motion users 6. **`onHideCard()`** - Removes current card from stack and updates counters 7. **`splash.value = true`** - Shows splash screen on next card 8. **`currMode.value = 1`** - Resets to main card view mode 9. **`submittingData.value = false`** - Stops submitting animation 10. **`flip.value = false`** - Ensures card is not flipped 11. **`submit.value = false`** - Resets submit animation flag 12. **`disableSplash()`** - Starts 1.5s timer to hide splash screen

**When this function is called:**

- After successful entity connection submission (when user selects a valid entity)
- Provides celebratory success animation before transitioning to next card
- Total animation sequence: 1000ms (success display) + 400ms (transition) = 1.4 seconds

#### slideRight() {#slideRight}

Handles standard card transition without success animation.

**Description:**
Manages quick card transition for cases like "no item" submissions.

**Step-by-step breakdown:**

1. **`submit.value = true`** - Sets the submit flag to trigger submit animation on the current card
2. **`noLoad.value = false`** - Resets the no-load state to allow future data loading
3. **`setTimeout(async () => { ... }, 200)`** - Delays the state reset by 200ms to allow animation to complete

**Inside the timeout (after 200ms):** 4. **`submittingData.value = false`** - Stops the submitting animation/loading state 5. **`currMode.value = 1`** - Resets card mode to front view (mode 1 = main card view) 6. **`splash.value = true`** - Shows splash screen on the next card 7. **`onHideCard()`** - Removes current card from stack and updates counters 8. **`flip.value = false`** - Ensures card is not in flipped state 9. **`submit.value = false`** - Resets submit animation flag 10. **`zIndex.value = "z-[1]"`** - Resets z-index to default layer 11. **`disableSplash()`** - Starts timer to hide splash screen after 1.5 seconds

**When this function is called:**

- When user submits a "no item" action (when `item?.itemId === ""`)
- This provides immediate transition without success animation since no positive contribution was made

#### onHideCard() {#onHideCard}

Removes the current card from the stack and updates counters.

**Description:**
Handles the core logic of removing a card from the data array and updating the UI state.

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

1. **`params.keyword = ""`** - Clears any active search keyword
2. **`if (isButton) { next.value = true }`** - Sets next animation flag only for button clicks (not gestures)
3. **`isSkipButton.value = isButton`** - Tracks whether skip was triggered by button or gesture (affects animation)

**Delayed actions (after 300ms):** 4. **`setTimeout(async () => { ... }, 300)`** - Waits 300ms for skip animation to complete 5. **`splash.value = true`** - Shows splash screen on the next card 6. **`onHideCard()`** - Removes current card from stack and updates counters 7. **`setUndoWarn(id, contributionId)`** - Starts undo warning timer with progress bar 8. **`zIndex.value = "z-[1]"`** - Resets z-index to default layer 9. **`currMode.value = 1`** - Resets to main card view mode 10. **`flip.value = false`** - Ensures card is not in flipped state 11. **`noLoad.value = false`** - Resets no-load state for future data loading 12. **`if (isButton) { next.value = false }`** - Resets next animation flag for button clicks 13. **`disableSplash()`** - Starts 1.5s timer to hide splash screen

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

**Card restoration:** 4. **`data.value = [...data.value, tempData.value]`** - Adds the temporarily stored card back to the end of the array 5. **`tempData.value = null`** - Clears the temporary storage 6. **`undoWarn.value = false`** - Hides the undo warning UI

**Animation cleanup:** 7. **`setTimeout(() => { prev.value = false }, 600)`** - Resets undo animation flag after 600ms

**When this function is called:**

- When user clicks the "Undo" button during the 2.75-second warning period
- Immediately cancels the skip timer and restores the card
- Provides smooth animation for card restoration

### Card Mode Management

#### test1(id, contributionId, headerData) {#test1}

Switches to detail view mode (mode 1).

**Parameters:**

- `id` (string) - Card ID
- `contributionId` (string) - Contribution session ID
- `headerData` (Object) - Header information for detail view

**Description:**
Transitions card to flip state and loads detailed connection information.

**Step-by-step breakdown:**

**Immediate state changes:**

1. **`currMode.value = 1`** - Sets card to detail view mode
2. **`detailHeaderData.value = headerData`** - Stores header data for display
3. **`hideBack.value = false`** - Shows the back navigation button
4. **`flip.value = true`** - Triggers card flip animation
5. **Motion-aware z-index:** If normal motion, immediately sets `zIndex.value = ""`

**Delayed DOM manipulation (after 350ms):** 6. **`setTimeout(() => { ... }, 350)`** - Waits for flip animation to complete 7. **Reduced motion z-index:** If reduced motion, sets `zIndex.value = ""` 8. **DOM element access:**

- `const div = document.querySelector('.card-${currCount.value}')` - Gets current card element
- `const front = div.querySelector(".card-front")` - Gets front face element
- `front.style.setProperty("display", "none", "important")` - Hides front face completely

**Data loading:** 9. **`await getDetail({ contributionId, id })`** - Loads detailed card information from API

**When this function is called:**

- When user clicks on the main card content to see details
- Initiated from the front card view (CardItem component)
- Creates smooth flip transition to show detailed information

#### test2(id, data) {#test2}

Switches to sub-item detail view mode (mode 2).

**Parameters:**

- `id` (string) - Entity ID
- `data` (Object) - Sub-item data

**Description:**
Displays detailed information about a specific entity/sub-item.

**Step-by-step breakdown:**

**Immediate state changes:**

1. **Motion-aware z-index:** If normal motion, immediately sets `zIndex.value = ""`
2. **`subItemHeaderData.value = data`** - Stores sub-item data for header display
3. **`currMode.value = 2`** - Sets card to sub-item detail view mode
4. **`flip.value = true`** - Triggers card flip animation
5. **`hideBack.value = false`** - Shows the back navigation button

**Delayed DOM manipulation (after 350ms):** 6. **`setTimeout(() => { ... }, 350)`** - Waits for flip animation to complete 7. **Reduced motion z-index:** If reduced motion, sets `zIndex.value = ""` 8. **DOM element access:**

- `const div = document.querySelector('.card-${currCount.value}')` - Gets current card element
- `const front = div.querySelector(".card-front")` - Gets front face element
- `front.style.setProperty("display", "none", "important")` - Hides front face completely

**Data loading:** 9. **`await getEntityDetail(id)`** - Loads detailed entity information from API

**When this function is called:**

- When user clicks on a specific entity from the detail view (mode 1)
- Shows comprehensive information about the selected entity
- Allows deeper exploration before making final decision

#### test3(data) {#test3}

Switches to review mode (mode 3).

**Parameters:**

- `data` (Object) - Review data

**Description:**
Shows the final review interface before submission.

**Step-by-step breakdown:**

**Immediate state changes:**

1. **Motion-aware z-index:** If normal motion, immediately sets `zIndex.value = ""`
2. **`currMode.value = 3`** - Sets card to review mode
3. **`flip.value = true`** - Triggers card flip animation
4. **`detail.value = data`** - Stores review data for display
5. **`hideBack.value = false`** - Shows the back navigation button

**Delayed DOM manipulation (after 350ms):** 6. **`setTimeout(() => { ... }, 350)`** - Waits for flip animation to complete 7. **Reduced motion z-index:** If reduced motion, sets `zIndex.value = ""` 8. **DOM element access:**

- `const div = document.querySelector('.card-${currCount.value}')` - Gets current card element
- `const front = div.querySelector(".card-front")` - Gets front face element
- `front.style.setProperty("display", "none", "important")` - Hides front face completely

**Vue lifecycle:** 9. **`await nextTick()`** - Waits for Vue to complete DOM updates

**When this function is called:**

- When user selects an entity and wants to review before final submission
- Final step before `submitCard()` is called
- Shows summary of the connection choice for confirmation

#### backtoHome() {#backtoHome}

Returns to front card view from any detail mode.

**Description:**
Resets card flip state and restores front view visibility.

**Step-by-step breakdown:**

**Immediate actions:**

1. **`flip.value = false`** - Triggers card flip back to front
2. **DOM element access:**
   - `const div = document.querySelector('.card-${currCount.value}')` - Gets current card element
   - `const front = div.querySelector(".card-front")` - Gets front face element
   - `front.style.setProperty("display", "", "important")` - Restores front face visibility

**Delayed cleanup (after 300ms):** 3. **`setTimeout(() => { ... }, 300)`** - Waits for flip animation to complete 4. **`zIndex.value = "z-[1]"`** - Resets z-index to default layer 5. **`hideBack.value = true`** - Hides the back navigation button

**When this function is called:**

- When user clicks back button from any detail mode (1, 2, or 3)
- Returns user to the main card interface
- Restores the original card state and visibility

### Data Management

#### submitCard(item, contributionId, id) {#submitCard}

Submits user's connection choice for the current card.

**Parameters:**

- `item` (Object) - Selected entity item
- `contributionId` (string) - Contribution session ID
- `id` (string) - Card ID

**Description:**
Processes the user's selection and updates the backend with the connection choice.

**Step-by-step breakdown:**

**Initial setup:**

1. **`submittingData.value = true`** - Shows submitting animation/loading state
2. **`let action = ""`** - Initialize action variable

**Action determination:** 3. **Action logic:**

- If `item?.itemId === ""`: Sets `action = "noItem"` and `submitAction.value = "noItem"`
- Else: Sets `action = "add"` and `submitAction.value = "add"`

**API submission:** 4. **`const response = await updateDetail({ data: { ...item, action }, contributionId, id })`** - Sends update to backend

**Response handling:** 5. **If response.statusCode === 200 (Success):**

- **For "noItem" action:**
  - Calls `slideRight()` - Quick transition without success animation
- **For "add" action:**
  - `submittingData.value = false` - Stops submitting animation
  - `isSuccess.value = true` - Shows success indicator
  - `setTimeout(() => { slideRightWithSuccess() }, 1125)` - Waits 1.125s then transitions with success animation

6. **If response.statusCode === 503 (No Internet):**

   - `isLoading.value = false` - Stops loading state
   - `noInternet.value = true` - Shows no internet error

7. **If other error:**
   - `submittingData.value = false` - Stops submitting animation
   - `isSubmitError.value = true` - Shows submission error state

**When this function is called:**

- When user confirms their choice in review mode (mode 3)
- Handles both positive contributions (entity selection) and negative ones (no suitable entity)

#### updateDetail({data, contributionId, id}) {#updateDetail}

Updates card details on the backend.

**Parameters:**

- `data` (Object) - Update data including action type
- `contributionId` (string) - Contribution session ID
- `id` (string) - Card ID

**Description:**
Generic function for updating card status (skip, add, noItem actions).

### Search & Recommendations

#### searchKeyword(keyword) {#searchKeyword}

Initiates entity search with keyword.

**Parameters:**

- `keyword` (string) - Search term

**Description:**
Sets up search parameters and triggers entity search.

**Step-by-step breakdown:**

1. **`params.page = 1`** - Resets pagination to first page for new search
2. **`params.keyword = keyword`** - Sets the search keyword in reactive params object

**When this function is called:**

- When user types in the search input field
- Triggers the params watcher which calls `searchData()`
- Resets pagination since it's a new search query

#### searchData() {#searchData}

Performs entity search API call.

**Description:**
Fetches entities based on current search parameters and lemma context.

**Step-by-step breakdown:**

**API call setup:**

1. **`const response = await SearchEntity({ ... })`** - Calls search API with parameters:
   - `page: params.page` - Current page for pagination
   - `limit: params.keyword ? 10 : 3` - 10 results for keyword search, 3 for recommendations
   - `keyword: params.keyword || data?.value?.[totalCount.value - currCount.value]?.lemma` - Uses search keyword or current lemma
   - `languageCode: data?.value?.[...].language.code` - Language of current card
   - `displayLanguageCode: cookies.get("locale")` - User's interface language

**Response handling:** 2. **`if (response?.statusCode)`** - Checks if response is valid 3. **Empty results check:**

- `if (response?.data?.entities?.length === 0)` - If no entities found
- `noLoad.value = true` - Sets flag to show "no more results" message

4. **Results processing:**

   - **If first page (`params.page === 1`):**
     - `entities.value = [...response?.data?.entities]` - Replace current results
   - **If additional page:**
     - `entities.value = [...entities?.value, ...response?.data?.entities]` - Append to existing results

5. **Loading state cleanup:**
   - `searchLoading.value = false` - Stops search loading indicator
   - `loadmoreLoading.value = false` - Stops load-more loading indicator

**When this function is called:**

- Triggered by params watcher when search keyword changes
- When loading more results via pagination
- Automatically called for recommendations when no keyword is set

#### getRecommendation() {#getRecommendation}

Fetches entity recommendations.

**Description:**
Gets recommended entities based on the current lemma using intelligent matching.

**Step-by-step breakdown:**

**Initial setup:**

1. **`recommendedLoading.value = true`** - Shows loading state for recommendations

**Lemma processing:** 2. **`const lemma = data?.value?.[totalCount.value - currCount.value]?.lemma`** - Gets current card's lemma 3. **`const lemmaParts = typeof lemma === "string" ? lemma.split(" / ") : []`** - Splits lemma by " / " separator 4. **`const keyword = lemmaParts.find((item) => item.match(/[a-zA-Z]+/))`** - Finds first part with Latin characters

**API call:** 5. **`const response = await GetRecommendations({ ... })`** - Calls recommendation API with:

- `...params` - Spreads current search parameters
- `page: 1` - Always gets first page of recommendations
- `keyword: keyword || lemmaParts[0]` - Uses Latin keyword or first lemma part
- `languageCode: data?.value?.[...].language.code` - Language of current card
- `displayLanguageCode: cookies.get("locale")` - User's interface language

**Response handling:** 6. **`if (response?.statusCode)`** - If successful response:

- `recommendedLoading.value = false` - Stops loading state
- `entities.value = [...(response?.data?.entities || [])]` - Sets recommendation results

7. **`else if (response?.statusCode === 503)`** - If no internet:
   - `isLoading.value = false` - Stops general loading
   - `noInternet.value = true` - Shows no internet error

**When this function is called:**

- Automatically when a new card becomes active
- When search keyword is cleared (falls back to recommendations)
- Provides intelligent suggestions based on lemma analysis

#### loadMore() {#loadMore}

Loads additional search results.

**Description:**
Increments page counter for pagination of search results.

### Data Loading

#### getProfile() {#getProfile}

Fetches user profile and initiates session data loading.

**Description:**
Initial profile fetch that determines language and activity type for the session.

#### getCardsData(code, type) {#getCardsData}

Loads session cards based on language and activity type.

**Parameters:**

- `code` (string) - Language code
- `type` (string) - Activity type

**Description:**
Fetches the main card data for the contribution session.

#### getDetail({contributionId, id}) {#getDetail}

Loads detailed information for a specific card.

**Parameters:**

- `contributionId` (string) - Contribution session ID
- `id` (string) - Card ID

**Description:**
Fetches detailed connection information for the detail view.

#### getEntityDetail(id) {#getEntityDetail}

Loads detailed information for a specific entity.

**Parameters:**

- `id` (string) - Entity ID

**Description:**
Fetches comprehensive entity information for sub-item detail view.

#### getLanguages() {#getLanguages}

Loads available language options.

**Description:**
Fetches language list for the interface.

### Session Management

#### endEarly() {#endEarly}

Handles early session termination.

**Description:**
Allows users to end the session before completing all cards, with confirmation dialog.

**Step-by-step breakdown:**

**Session progress check:**

1. **`if (currCount.value > 1 && currCount.value < totalCount.value + 1)`** - Checks if user is in middle of session

   **If in middle of session:** 2. **`const userInput = await testing?.value?.openModal()`** - Shows warning dialog asking for confirmation 3. **`if (userInput)`** - If user confirms they want to end early:

   - `skipAll.value = true` - Sets skip-all flag for animations
   - `endLoading.value = true` - Shows loading state
   - `const response = await EndContribution()` - Calls API to end session

   4. **API response handling:**

      - **If response.statusCode === 200 (Success):**

        - `endLoading.value = false` - Stops loading
        - `const userInput = await completeRef?.value?.openModal()` - Shows completion dialog
        - `if (userInput) { router.push("/") }` - Navigates to home if user confirms

      - **If response.statusCode === 503 (No Internet):**
        - `endLoading.value = false` - Stops loading
        - `isLoading.value = false` - Stops general loading
        - `noInternet.value = true` - Shows no internet error

**If not in middle of session:** 5. **`else { router.push("/") }`** - Direct navigation to home (no confirmation needed)

**When this function is called:**

- When user clicks the home/back button in session header
- When user clicks "End Early" button in bottom controls
- Provides safety confirmation to prevent accidental session loss
- Only shows confirmation if user has made progress but hasn't finished

#### setUndoWarn(id, contributionId) {#setUndoWarn}

Sets up the undo warning timer and progress indicator.

**Parameters:**

- `id` (string) - Card ID
- `contributionId` (string) - Contribution session ID

**Description:**
Creates a timed warning that allows users to undo their skip action.

**Step-by-step breakdown:**

**Initial setup:**

1. **`undoWarn.value = true`** - Shows the undo warning UI component
2. **Timer configuration:**
   - `const duration = 2750` - Total duration of 2.75 seconds
   - `const interval = 27.5` - Updates every 27.5ms (smooth animation)
   - `const steps = duration / interval` - Calculates total steps (100 steps)
   - `let currentStep = 0` - Initialize step counter

**Progress animation (increment function):** 3. **`const increment = async () => { ... }`** - Recursive function for progress updates 4. **`progress.number = (currentStep / steps) * 100`** - Updates progress bar (0-100%) 5. **`currentStep++`** - Increments step counter 6. **`if (currentStep <= steps) { timeout = setTimeout(increment, interval) }`** - Schedules next update 7. **Completion check:**

- If `progress.number === 100`:
  - `undoWarn.value = false` - Hides undo warning
  - `await updateDetail({ data: { action: "skip" }, contributionId, id })` - Finalizes skip action on backend

**Timer start:** 8. **`timeout = setTimeout(increment, interval)`** - Starts the progress animation

**When this function is called:**

- Immediately after `nextCard()` executes (when user skips)
- Provides 2.75 seconds for user to change their mind
- Progress bar visually shows remaining time
- Can be interrupted by `undoCard()` function

### Animation & UI

#### submitCardAnim(condition) {#submitCardAnim}

Returns appropriate CSS class for submit animation.

**Parameters:**

- `condition` (boolean) - Whether to apply animation

**Description:**
Determines animation class based on motion preferences and text direction.

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
Manages undo card restoration animation.

#### skipAllAnim() {#skipAllAnim}

Returns CSS class for skip-all animation.

**Description:**
Handles animation when user chooses to skip all remaining cards.

#### animClass(index) {#animClass}

Generates combined animation classes for card at given index.

**Parameters:**

- `index` (number) - Card index in the array

**Description:**
Combines multiple animation states into a single class array.

### Utility Functions

#### disableSplash() {#disableSplash}

Hides the splash screen after a delay.

**Description:**
Controls the timing of splash screen visibility.

#### reload() {#reload}

Reloads the page (error recovery).

**Description:**
Simple page reload for error recovery scenarios.

#### aa() {#aa}

Sets movement state for card interactions.

**Description:**
Indicates that card movement/interaction has started.

**Step-by-step breakdown:**

1. **`isMove.value = true`** - Sets movement flag to indicate card is being moved/swiped

**When this function is called:**

- When user starts dragging/swiping a card
- Triggered by touch/mouse interaction on card component
- Used to disable certain transitions during active movement

#### ab() {#ab}

Handles spring-back animation after card interaction.

**Description:**
Manages the spring-back effect when card returns to position.

**Step-by-step breakdown:**

1. **`springBack.value = true`** - Enables spring-back animation
2. **`isMove.value = false`** - Clears movement flag
3. **`setTimeout(() => { springBack.value = false }, 350)`** - Disables spring-back after 350ms

**When this function is called:**

- When user releases card without completing a swipe gesture
- Provides visual feedback that card returns to original position
- Creates smooth bounce-back effect for incomplete swipes

#### handleGlobalFocus(event) {#handleGlobalFocus}

Global focus event handler for accessibility.

**Parameters:**

- `event` (Event) - Focus event

**Description:**
Tracks focus changes for accessibility purposes.

## Lifecycle Hooks

### onMounted() {#onMounted}

Component initialization and theme setup.

**Description:**
Sets up theme colors, focus listeners, and initiates data loading based on store state.

### onBeforeUnmount() {#onBeforeUnmount}

Cleanup event listeners.

**Description:**
Removes global event listeners to prevent memory leaks.

### onBeforeRouteLeave() {#onBeforeRouteLeave}

Route guard for session preservation.

**Description:**
Prevents accidental navigation away from active session with confirmation dialog.

## Watchers

### data Array Watcher {#data-watcher}

Monitors changes to the card data array.

**Description:**
Updates card margins and spacing when cards are added/removed.

### currCount & undoWarn Watcher {#currCount-undoWarn-watcher}

Monitors session completion.

**Description:**
Triggers session completion flow when all cards are processed.

### currCount & data Watcher {#currCount-data-watcher}

Triggers recommendation loading.

**Description:**
Loads new recommendations when card changes.

### params Object Watcher {#params-watcher}

Monitors search parameter changes.

**Description:**
Triggers search or recommendation loading based on parameter changes.

## Computed Properties

### currCount {#currCount-computed}

Calculates current card position in the session.

**Returns:** Current card number (1-based)

**Description:**
Provides the current position for UI display and progress tracking.

### isThemeDark {#isThemeDark-computed}

Gets current theme state from store.

**Returns:** Boolean indicating dark theme

### language {#language-computed}

Gets current language from store.

**Returns:** Current language code

## Component Structure

### Template Sections

#### Header

- Back to home button
- Session progress indicator

#### Error States

- No internet connection
- General errors
- No lexemes available
- Loading states

#### Main Card Interface

- Card stack with swipe interactions
- Multiple card modes (splash, item, detail, review)
- Success and error overlays
- Submission states

#### Undo Interface

- Progress indicator
- Undo button
- Timed auto-skip

#### Bottom Controls

- Skip button
- End early button

#### Dialogs

- Warning dialog for early exit
- Completion dialog
- Image lightbox

## State Management

### Reactive State Variables

- `data` - Array of session cards
- `currMode` - Current card view mode (1: detail, 2: sub-item, 3: review)
- `flip` - Card flip state
- `splash` - Splash screen visibility
- `undoWarn` - Undo warning state
- `entities` - Search/recommendation results
- `submittingData` - Submission in progress
- `isLoading` - General loading state
- `progress` - Undo timer progress

### Loading States

- `searchLoading` - Entity search in progress
- `recommendedLoading` - Recommendations loading
- `cardDetailLoading` - Card detail loading
- `entityDetailLoading` - Entity detail loading
- `endLoading` - Session end in progress

### Error States

- `isError` - General error state
- `isSubmitError` - Submission error
- `noInternet` - Network connectivity error
- `noLoad` - No more results available

## Accessibility Features

- Reduced motion support with `isPreferredMotion`
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast theme support
- RTL/LTR text direction support

## Animation System

The component includes a comprehensive animation system that:

- Respects user motion preferences
- Supports RTL/LTR text directions
- Provides smooth card transitions
- Includes loading and success animations
- Handles reduced motion scenarios gracefully
