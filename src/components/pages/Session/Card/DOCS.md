# Card Component Documentation

## Overview

The Card component is the core interactive card system used across all Lexica session types (Connect, Script, Hyphenation). It provides swipe gestures, drag interactions, flip animations, and position management for the card-based contribution interface. This component handles the physical card interactions while session components manage the data and content.

## Key Features

- **Touch & Mouse Interactions**: Drag and swipe gestures using Interact.js
- **Swipe-to-Skip**: Upward swipe gesture to skip cards
- **Position Management**: Real-time position tracking and animation
- **Flip Animation Support**: 3D card flip effects for detail views
- **Prevention Controls**: Ability to disable swipes during critical operations
- **RTL Support**: Direction-aware animations for right-to-left languages
- **Responsive Design**: Adaptive sizing and constraints for different screen sizes

## Props

### next {#next-prop}

**Type:** `Boolean`
**Default:** `false`

**Description:**
Controls whether the next card animation should be triggered.

### preventSwipe {#preventSwipe-prop}

**Type:** `Boolean`
**Default:** `false`

**Description:**
When `true`, prevents swipe-to-skip functionality. Used during undo warnings or critical operations where accidental swipes should be blocked.

### isFlipped {#isFlipped-prop}

**Type:** `Boolean`
**Default:** `false`

**Description:**
Controls the 3D flip state of the card. When `true`, applies `rotateY(-180deg)` transformation to show the back face content.

## Events

### hideCard {#hideCard-event}

**Emitted:** After card swipe animation completes

**Description:**
Signals to parent component that the card should be removed from the stack. Includes a 300ms delay to allow exit animations to complete.

### onStarting {#onStarting-event}

**Emitted:** When drag interaction begins

**Description:**
Notifies parent that user has started dragging the card. Used to disable transitions and update interaction states.

### onEnd {#onEnd-event}

**Emitted:** When drag interaction ends

**Description:**
Signals that the drag gesture has completed, whether it resulted in a swipe or spring-back.

### onSkip {#onSkip-event}

**Emitted:** When successful skip swipe is detected

**Description:**
Triggered when user swipes upward past the threshold to skip the card.

## State Management

### Static Configuration {#statics}

```javascript
const statics = readonly({
  interactMaxRotation: 2, // Maximum rotation angle in degrees
  interactOutOfSightXCoordinate: 500, // Off-screen X position for animations
  interactOutOfSightYCoordinate: -825, // Off-screen Y position for skip animation
  interactYThreshold: -30, // Minimum upward distance to trigger skip
  interactXThreshold: 100, // Distance for maximum rotation calculation
});
```

### Reactive Position State {#positions}

```javascript
const positions = reactive({
  isShowing: true, // Controls card visibility
  isInteractAnimating: true, // Enables/disables CSS transitions
  isInteractDragged: null, // Tracks if card is being dragged
  interactPosition: {
    // Current card position and rotation
    x: 0,
    y: 0,
    rotation: 0,
  },
});
```

## Functions

### Core Position Management

#### interactSetPosition(coordinates) {#interactSetPosition}

Sets the card's position and rotation coordinates.

**Parameters:**

- `coordinates` (Object) - Position data
  - `x` (Number, optional) - Horizontal position in pixels (default: 0)
  - `y` (Number, optional) - Vertical position in pixels (default: 0)
  - `rotation` (Number, optional) - Rotation angle in degrees (default: 0)

**Description:**
Updates the reactive `positions.interactPosition` state that drives the card's transform CSS property. Uses destructuring with defaults to ensure all coordinate values are numbers.

**Step-by-step breakdown:**

1. **`const { x = 0, y = 0, rotation = 0 } = coordinates`** - Destructures coordinates with default values
2. **`positions.interactPosition = { x, y, rotation }`** - Updates reactive position state that triggers transform recalculation

**When this function is called:**

- During drag interactions to update real-time position
- When resetting card position after incomplete swipes
- When initiating exit animations for card removal

#### resetCardPosition() {#resetCardPosition}

Resets card to center position for spring-back effect.

**Description:**
Calls `interactSetPosition` with zero coordinates to return card to its original position when swipe threshold isn't met.

**Step-by-step breakdown:**

1. **`interactSetPosition({ x: 0, y: 0, rotation: 0 })`** - Sets all position values to zero

**When this function is called:**

- In the `onend` drag handler when swipe threshold is not reached
- Provides visual feedback that the swipe attempt was insufficient
- Creates smooth spring-back animation via CSS transitions

#### interactUnsetElement() {#interactUnsetElement}

Disables further drag interactions and marks card as dragged.

**Description:**
Removes Interact.js event listeners and updates dragged state to prevent interference during exit animations.

**Step-by-step breakdown:**

1. **`interact(cardRef.value).unset()`** - Removes all Interact.js event listeners from the card element
2. **`positions.isInteractDragged = true`** - Marks card as dragged to disable CSS transitions

**When this function is called:**

- Before starting exit animations in `playCard()`
- Prevents user from interfering with card removal process
- Ensures smooth exit animations without gesture conflicts

### Animation & Lifecycle

#### hideCard() {#hideCard}

Initiates card removal sequence with timed visibility control.

**Description:**
Sets card visibility to false and emits removal event after delay to allow exit animations to complete.

**Step-by-step breakdown:**

1. **`setTimeout(() => { ... }, 300)`** - Waits 300ms for exit animation completion
2. **`positions.isShowing = false`** - Hides card by setting display to none
3. **`emit("hideCard")`** - Notifies parent component that card should be removed from stack

**When this function is called:**

- At the end of `playCard()` after exit animation is initiated
- 300ms delay ensures smooth visual transition before DOM removal
- Critical for maintaining proper card stack management in parent component

#### playCard(interaction) {#playCard}

Executes card exit animations based on interaction type.

**Parameters:**

- `interaction` (String) - Animation type identifier
  - `"SKIP_CARD"` - Upward swipe animation to skip current card

**Description:**
Handles different card exit scenarios by positioning card off-screen and triggering appropriate events.

**Step-by-step breakdown:**

1. **Destructure static values** - Gets animation coordinates from `statics` configuration
2. **`interactUnsetElement()`** - Disables further interactions to prevent conflicts
3. **Switch statement handling:**
   - **For "SKIP_CARD":**
     - `interactSetPosition({ y: interactOutOfSightYCoordinate })` - Moves card to -825px Y position
     - `emit("onSkip")` - Notifies parent that skip action occurred
4. **`hideCard()`** - Initiates 300ms removal sequence

**When this function is called:**

- From `onend` drag handler when skip threshold is exceeded
- Provides consistent exit animation regardless of final drag position
- Ensures proper event emission for parent component state management

## Interaction System

### Drag Configuration

The component uses Interact.js for gesture handling with specific configuration:

```javascript
interact(element).draggable({
  allowFrom: ".header", // Only allow dragging from header area
  onstart: () => {
    /* Disable animations, emit onStarting */
  },
  onmove: (event) => {
    /* Update position, calculate rotation */
  },
  onend: () => {
    /* Check thresholds, skip or spring back */
  },
});
```

### Movement Physics

#### Vertical Movement

- **Upward**: Natural 1:1 movement ratio
- **Downward**: Reduced ratio (1/1.35) to create resistance effect
- **Skip Threshold**: -30px upward movement triggers skip

#### Rotation Calculation

- Based on horizontal displacement relative to `interactXThreshold` (100px)
- Maximum rotation: ±2 degrees
- Formula: `rotation = maxRotation * (x / xThreshold)`

#### Swipe Detection

```javascript
if (!props.preventSwipe && y < interactYThreshold) {
  playCard("SKIP_CARD");
} else {
  resetCardPosition(); // Spring back
}
```

## Computed Properties

### transformString {#transformString}

Generates CSS transform string for card positioning and animations.

**Returns:** String | null

**Description:**
Dynamically calculates the CSS transform property value based on current position state and animation mode. Critical for real-time drag feedback and flip animations.

**Step-by-step breakdown:**

**Animation state check:**

1. **`if (!positions.isInteractAnimating || positions.isInteractDragged)`** - Checks if manual positioning is needed
   - `!positions.isInteractAnimating` - True during active drag interactions
   - `positions.isInteractDragged` - True when card is being removed

**Manual transform generation:**

2. **`const { x, y, rotation } = positions.interactPosition`** - Destructures current position values
3. **Transform string construction:**

- `translate3D(0, ${y}px, 0)` - Vertical positioning (X disabled for performance)
- `rotate(${rotation}deg)` - Rotation based on horizontal drag distance
- `${props.isFlipped ? "rotateY(-180deg)" : ""}` - 3D flip for detail views

**Automatic animation mode:**

4. **`return null`** - When CSS transitions should handle movement

- Allows smooth spring-back animations
- Enables CSS-driven exit animations

**When this computed property updates:**

- During drag interactions as position changes
- When flip state changes for detail views
- When transitioning between manual and automatic animation modes

**Performance considerations:**

- Uses `translate3D` for hardware acceleration
- Disables X translation to reduce calculations
- Returns `null` to leverage CSS transitions when possible

## Lifecycle Hooks

### onMounted() {#onMounted}

Initializes Interact.js drag system with gesture recognition.

**Description:**
Sets up complete draggable behavior including gesture recognition, movement physics, threshold detection, and event emission for parent communication.

**Step-by-step breakdown:**

**Initial setup:**

1. **`const element = cardRef.value`** - Gets DOM reference to card element

2. **`interact(toRaw(element)).draggable({ ... })`** - Initializes Interact.js with unwrapped Vue ref

3. **Draggable configuration:**

4. **`allowFrom: ".header"`** - Restricts drag initiation to elements with "header" class

5. **Event handler setup:**

6. **onstart handler:**

7. **`positions.isInteractAnimating = false`** - Disables CSS transitions during active drag

8. **`emit("onStarting")`** - Notifies parent that drag interaction has begun

9. **onmove handler:**

10. **Position calculation:**

- `const x = positions.interactPosition.x + event.dx` - Updates X position with drag delta
- `let y = positions.interactPosition.y + event.dy` - Updates Y position with drag delta

11. **Downward resistance:**

- `if (y > 0) { y = y / 1.35 }` - Reduces downward movement by 35% to create resistance

12. **Rotation calculation:**

- `let rotation = interactMaxRotation * (x / interactXThreshold)` - Calculates rotation based on horizontal displacement
- Clamps rotation between -2° and +2° degrees

13. **`interactSetPosition({ x, y, rotation })`** - Updates position state with new values

14. **onend handler:**

15. **Threshold evaluation:**

- `const { x, y } = positions.interactPosition` - Gets final drag position
- `positions.isInteractAnimating = true` - Re-enables CSS transitions
- `emit("onEnd")` - Notifies parent that drag interaction has ended

16. **Action determination:**
   - **If skip threshold met:** `if (!props.preventSwipe && y < interactYThreshold) playCard("SKIP_CARD")`
   - **If threshold not met:** `resetCardPosition()` for spring-back effect

**When this function is called:**

- Automatically when component mounts to DOM
- Essential for enabling all card interaction functionality
- Sets up the foundation for swipe-to-skip and visual feedback systems

### onBeforeUnmount() {#onBeforeUnmount}

Cleanup Interact.js listeners to prevent memory leaks.

**Description:**
Removes all Interact.js event listeners when component is destroyed to prevent memory leaks and orphaned event handlers.

**Step-by-step breakdown:**

1. **`interact(cardRef.value).unset()`** - Removes all event listeners and interaction data from the card element

**When this function is called:**

- Automatically when component is being destroyed
- Before component removal from DOM
- Critical for preventing memory leaks in single-page applications
- Ensures clean teardown of third-party library integrations

## CSS Animations

### Skip Animations

#### swipeCardUp / swipeCardUpRTL

- **Duration**: 400ms
- **Path**: Moves to -825px Y, 2° rotation (LTR) or -2° (RTL)
- **Opacity**: Fades out at 80% completion

#### swipeCardDown / swipeCardDownRTL

- **Duration**: 500ms
- **Path**: Reverse of skip animation for undo functionality
- **Opacity**: Fades in at 80% completion

### Submit Animations

#### swipeCardRight / swipeCardLeft

- **Duration**: 1125ms
- **Path**: Moves to ±125rem X position with 2° rotation
- **Opacity**: Fades out at 80% completion
- **Usage**: Success submissions in contribution sessions

## Responsive Design

### Size Constraints

- **Width**: 100% with max 448px, min 18rem
- **Height**: 100% with max 640px, min 415px (responsive)
- **Mobile**: Min height removed on screens < 567px height

### Touch Optimization

- `touch-action: none` prevents browser scroll interference
- Optimized threshold values for mobile swipe gestures
- Visual feedback through rotation and position changes

## Integration Patterns

### Session Component Usage

```vue
<Card
  :isFlipped="flip"
  :preventSwipe="undoWarn"
  @hideCard="nextCard(false, cardId, contributionId)"
  @onStarting="startInteraction"
  @onEnd="endInteraction"
  @onSkip="skipCard"
>
  <!-- Card content (CardItem, CardDetail, etc.) -->
</Card>
```

### Content Slot

The Card component uses a single default slot for content:

- **Front face**: CardItem, CardSplash, CardSuccess, etc.
- **Back face**: CardItemDetail, CardReview, etc.
- **Overlays**: CardSubmitting, CardSubmitFailed

## Accessibility Considerations

- Drag interactions are confined to `.header` class elements
- Visual feedback through rotation and position changes
- Alternative skip mechanisms should be provided in parent components
- Consider reduced motion preferences in parent animation logic

## Performance Notes

- Uses `translate3D` for hardware acceleration
- Reactive position updates are optimized with computed transforms
- Interact.js listeners are properly cleaned up on unmount
- CSS animations handle exit transitions efficiently

## Browser Compatibility

- Requires modern browser support for:
  - CSS 3D transforms (`rotateY`, `translate3D`)
  - Touch events and pointer events
  - CSS custom properties (CSS variables)
  - ES6 reactive/computed properties

## Troubleshooting

### Common Issues

1. **Cards not responding to swipes**

   - Check if `preventSwipe` prop is set to `true`
   - Ensure `.header` class exists on draggable content
   - Verify Interact.js is properly imported

2. **Animation glitches**

   - Confirm `isInteractAnimating` state transitions properly
   - Check CSS transition conflicts with transform changes
   - Verify cleanup in `onBeforeUnmount`

3. **Position calculation errors**
   - Review threshold values in `statics` configuration
   - Check coordinate system consistency (Y-axis direction)
   - Validate event listener attachment to correct element
