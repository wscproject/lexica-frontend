# Splash Component Documentation

## Overview

The Splash component provides an overlay screen that displays basic lexeme information during card transitions. It appears temporarily when switching between cards in the session workflow, showing the current card number, lexeme term, and definition to give users context about the upcoming content.

## Key Features

- **Card Transition Overlay**: Covers cards during switching animations
- **Session Context Display**: Shows current position in session
- **Lexeme Information**: Displays term, ID, and definition
- **Conditional Visibility**: Only shows for current/active cards
- **Theme Integration**: Adapts text colors based on content type
- **Empty State Handling**: Graceful display when definition is missing
- **Multilingual Support**: Language-specific empty state messages

## Component Structure

### Props

#### data {#data-prop}

**Type:** `Object`

**Description:**
Contains the lexeme information to display on the splash screen.

**Structure:**
```javascript
{
  lemma: String,                    // The lexeme term to display
  externalLexemeSenseId: String,    // External sense identifier (optional)
  externalLexemeFormId: String,     // External form identifier (optional)
  externalLexemeId: String,         // External lexeme identifier (optional)
  gloss: String                     // Definition/meaning (optional)
}
```

#### currCount {#currCount-prop}

**Type:** `Number`

**Description:**
Current position in the session (1-based indexing).

**Usage:**
Displayed as "Session [currCount]" to show progress.

#### isNotCurrent {#isNotCurrent-prop}

**Type:** `Boolean`

**Description:**
Determines if this card is not the currently active one.

**Behavior:**
- `true`: Hides all content (empty splash)
- `false`: Shows full lexeme information

#### currLang {#currLang-prop}

**Type:** `String`

**Description:**
Current language name for empty state messages.

**Usage:**
Displayed as "No description for [currLang]" when gloss is missing.

## Template Structure

### Conditional Content Display

The component uses `v-if="!isNotCurrent"` to only show content for the active card.

### Information Hierarchy

1. **Session Progress**: "Session [number]" at the top
2. **Lexeme Term**: Large text display with external ID
3. **Definition**: Gloss or empty state message

### Dynamic Styling

The component applies conditional CSS classes based on data availability:

```javascript
// Text color logic
(props?.data?.externalLexemeSenseId || props?.data?.externalLexemeFormId) && 
'text-[var(--color-inverted-fixed)]'
```

**Color Rules:**
- **Standard Text**: Default theme colors
- **Inverted Text**: `--color-inverted-fixed` when external IDs are present

## Styling System

### Layout Classes

#### Container
```css
.absolute z-[99] w-full flex justify-center flex-col text-center p-[1rem] h-full
```
- **Positioning**: Absolute with high z-index (99) for overlay effect
- **Layout**: Full width/height with centered flexbox
- **Alignment**: Text centered with 1rem padding

#### Content Elements

##### Session Title
```css
font-bold [+ conditional text color]
```

##### Lexeme Term
```css
text-[1.75rem] py-[var(--spacing-100)] [+ conditional text color]
```
- **Size**: Large 1.75rem text for prominence
- **Spacing**: Vertical padding using CSS variable

##### Definition Text
```css
text-[1rem] [+ conditional text color]
```
- **Size**: Standard 1rem for readability
- **Style**: Italic for empty states

### Color Scheme

#### Standard Mode
- Uses default theme colors
- Adapts to dark/light mode automatically

#### Inverted Mode
- Triggered when `externalLexemeSenseId` or `externalLexemeFormId` exists
- Uses `--color-inverted-fixed` for high contrast
- Typically white text on colored backgrounds

## Data Display Logic

### External ID Priority

The component shows external identifiers in this order:
1. `externalLexemeSenseId` (sense-level ID)
2. `externalLexemeFormId` (form-level ID)  
3. `externalLexemeId` (lexeme-level ID)
4. Empty string (fallback)

### Definition Display

```javascript
// With gloss
{{ props?.data?.gloss }}

// Without gloss (empty state)
{{ t("session.emptyDescriptionHead") }} {{ props?.currLang }}
// Results in: "No description for English"
```

## Use Cases

### Card Transitions
- Appears during card switching animations
- Provides context for upcoming content
- Smooth overlay effect with high z-index

### Session Navigation
- Shows current position in session
- Helps users track progress
- Consistent information display

### Loading States
- Brief display while new card content loads
- Prevents jarring transitions
- Maintains user engagement

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy with session title
- Clear information structure
- Screen reader friendly content

### Language Support
- Displays current language context
- Proper internationalization with i18n
- Empty state messages in user's language

### Visual Hierarchy
- Clear font size differentiation
- Logical reading order
- High contrast text options

## Performance Considerations

### Minimal DOM
- Simple template structure
- No complex computations
- Efficient conditional rendering

### CSS Optimization
- Uses CSS variables for consistency
- Minimal inline styles
- Hardware-accelerated positioning

### Memory Efficiency
- No reactive state beyond props
- No event listeners
- Lightweight component footprint

## Internationalization

### Translation Keys Used

- `session.title` - Session progress label
- `session.emptyDescriptionHead` - Empty description prefix

### Dynamic Content

The component handles multilingual content through:
- Props-based language context
- i18n integration for static text
- Language-specific empty state messages

## Integration Examples

### Basic Usage
```vue
<Splash
  :data="currentCard"
  :currCount="3"
  :isNotCurrent="false"
  currLang="English"
/>
```

### In Card Stack
```vue
<div v-for="(card, index) in cards" :key="card.id">
  <Splash
    :data="card"
    :currCount="index + 1"
    :isNotCurrent="index !== currentIndex"
    :currLang="card.language?.title"
  />
</div>
```

### With Animation
```vue
<transition name="fade">
  <Splash
    v-if="showSplash"
    :data="lexemeData"
    :currCount="sessionProgress"
    :isNotCurrent="false"
    :currLang="currentLanguage"
  />
</transition>
```

## Error Handling

### Missing Data
- Safe property access with optional chaining
- Fallback to empty strings for IDs
- Graceful handling of missing gloss

### Invalid Props
- Component functions with partial data
- No errors from undefined properties
- Consistent display regardless of data completeness

## Known Limitations

1. **Static Display**: No interactive elements or user input
2. **Single Language**: Only shows one language at a time
3. **Fixed Layout**: No customizable positioning or sizing
4. **Brief Visibility**: Designed for short display periods
5. **No Animation**: Component itself doesn't animate (relies on parent)

## Common Patterns

### Session Workflow
```vue
<!-- Show splash during card transitions -->
<Splash
  v-if="isTransitioning"
  :data="nextCard"
  :currCount="nextIndex"
  :isNotCurrent="false"
  :currLang="language"
/>
```

### Progress Tracking
```vue
<!-- Display current session position -->
<Splash
  :data="activeCard"
  :currCount="completedCards + 1"
  :isNotCurrent="!isActive"
  :currLang="selectedLanguage"
/>
```

### Multi-Card Stack
```vue
<!-- Only show splash for top card -->
<div v-for="(card, i) in cardStack" :key="i">
  <Splash
    :data="card"
    :currCount="totalCards - i"
    :isNotCurrent="i !== 0"
    :currLang="card.language"
  />
</div>
```

## Best Practices

1. **Brief Display**: Keep splash visible for 1-2 seconds maximum
2. **Consistent Data**: Ensure all cards have similar data structure
3. **Language Context**: Always provide current language information
4. **Progress Accuracy**: Maintain correct session counting
5. **Performance**: Use conditional rendering to minimize DOM impact

## Future Enhancements

1. **Animation Support**: Built-in fade/slide transitions
2. **Customizable Layout**: Configurable positioning and sizing
3. **Rich Content**: Support for images or additional metadata
4. **Accessibility Improvements**: Screen reader announcements
5. **Theme Variants**: More color scheme options
6. **Progress Indicators**: Visual progress bars or indicators
7. **Gesture Support**: Swipe-to-dismiss functionality
8. **Sound Integration**: Audio cues for transitions