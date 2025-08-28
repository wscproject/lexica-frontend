# Submit Failed Component Documentation

## Overview

The Submit Failed component displays an error overlay when a submission fails during the session workflow. It provides user-friendly error messaging with a clear call-to-action to retry the operation, helping users recover from failed submissions gracefully.

## Key Features

- **Error State Display**: Clear visual indication of submission failure
- **User-Friendly Messaging**: Localized error messages and descriptions
- **Theme Support**: Adapts icons and colors to dark/light mode
- **Recovery Action**: Single button to retry or go back
- **Overlay Interface**: High z-index overlay that covers the card
- **Accessibility**: Proper labels and semantic structure
- **Visual Feedback**: Theme-appropriate error icons

## Component Structure

### Props

This component accepts no props - it displays static error messaging with theme-based styling.

### Emitted Events

#### back {#back-event}

**Trigger:** When user clicks the action button

**Description:**
Signals the parent component to handle the error recovery action (typically retry or return to previous state).

**Payload:** None

**Usage Example:**
```javascript
@back="handleSubmissionRetry"
```

## Computed Properties

### isThemeDark {#isThemeDark-computed}

**Returns:** `Boolean`

**Description:**
Retrieves the current theme state from the Vuex store to determine which error icon to display.

**Implementation:**
```javascript
computed(() => vuex.getters["profile/isDark"])
```

**Usage:**
Controls the display of light or dark theme error icons.

## Template Structure

### Container Layout

```css
.absolute z-[99] w-full bg-white dark:bg-[#101418] flex justify-center flex-col text-center p-[1rem]
```

**Features:**
- **Overlay Positioning**: Absolute with high z-index (99)
- **Full Coverage**: Full width overlay
- **Theme Background**: White/dark background based on theme
- **Centered Content**: Flexbox centered layout
- **Padding**: 1rem padding for content breathing room

### Content Elements

#### 1. Error Icon
```vue
<img v-if="!isThemeDark" :src="error" alt="home" />
<img v-if="isThemeDark" :src="errordark" alt="home" />
```

**Features:**
- **Theme Adaptive**: Different icons for light/dark themes
- **Visual Impact**: Clear error indication
- **Accessibility**: Alt text for screen readers

#### 2. Error Title
```vue
<CdxLabel class="pb-[1rem] text-[1.125rem] dark:text-[#EAECF0]">
  {{ t("session.cardError.title") }}
</CdxLabel>
```

**Features:**
- **Prominent Display**: 1.125rem font size
- **Theme Colors**: Light text in dark mode
- **Spacing**: Bottom padding for visual hierarchy

#### 3. Error Description
```vue
<p class="w-full text-[1rem] dark:text-[#EAECF0]">
  {{ t("session.cardError.description") }}
</p>
```

**Features:**
- **Explanatory Text**: Detailed error information
- **Theme Consistency**: Matches theme colors
- **Full Width**: Complete width utilization

#### 4. Action Button
```vue
<CdxButton class="w-full h-[2.75rem] mt-[1rem]" weight="primary" action="progressive" @click="emit('back')">
  {{ t("session.cardError.button") }}
</CdxButton>
```

**Features:**
- **Primary Action**: Progressive primary button style
- **Full Width**: Complete width for easy interaction
- **Fixed Height**: 2.75rem for consistent touch targets
- **Top Margin**: Visual separation from description

## Styling System

### Layout Classes

#### Container Styling
- **Positioning**: `absolute z-[99]` for overlay effect
- **Background**: Theme-adaptive with `bg-white dark:bg-[#101418]`
- **Layout**: Flexbox column with center alignment
- **Spacing**: Consistent 1rem padding

#### Typography
- **Title**: Large text (1.125rem) with theme-appropriate color
- **Description**: Standard text (1rem) with theme colors
- **Button**: Full-width primary action button

### Color Scheme

#### Light Theme
- **Background**: White (#FFFFFF)
- **Text**: Default dark colors
- **Icon**: Light theme error icon

#### Dark Theme  
- **Background**: Dark (#101418)
- **Text**: Light (#EAECF0)
- **Icon**: Dark theme error icon

### Visual Hierarchy

1. **Error Icon**: Top-level visual indicator
2. **Error Title**: Primary message heading
3. **Error Description**: Detailed explanation
4. **Action Button**: Recovery mechanism

## Internationalization

### Translation Keys Used

- `session.cardError.title` - Main error heading
- `session.cardError.description` - Detailed error explanation
- `session.cardError.button` - Action button text

### Localization Features

- **Full i18n Support**: All text elements are localized
- **Context-Aware**: Error messages specific to session context
- **User-Friendly**: Non-technical language for better UX

## Usage Examples

### Basic Implementation
```vue
<SubmitFailed @back="handleRetry" />
```

### With Error Handling
```vue
<transition name="fade">
  <SubmitFailed 
    v-if="isSubmissionError" 
    @back="retrySubmission"
  />
</transition>
```

### In Card Stack
```vue
<div class="card-container">
  <!-- Main card content -->
  <CardContent />
  
  <!-- Error overlay -->
  <SubmitFailed 
    v-if="submissionFailed"
    @back="clearErrorAndRetry"
  />
</div>
```

## Accessibility Features

### Screen Reader Support
- **Alt Text**: Descriptive alt text for error icons
- **Semantic HTML**: Proper use of headings and paragraphs
- **Label Components**: CdxLabel for accessible text display

### Keyboard Navigation
- **Button Focus**: Action button is keyboard accessible
- **Tab Order**: Logical tab progression through elements
- **Clear Actions**: Obvious action button for recovery

### Visual Design
- **High Contrast**: Theme-appropriate color combinations
- **Clear Typography**: Readable font sizes and spacing
- **Visual Hierarchy**: Clear information organization

## Error Recovery Patterns

### Retry Mechanism
```javascript
// Parent component handling
const handleSubmissionRetry = async () => {
  isSubmissionError.value = false;
  try {
    await submitData();
  } catch (error) {
    isSubmissionError.value = true;
  }
};
```

### State Management
```javascript
// Typical error state flow
const submitCard = async () => {
  submittingData.value = true;
  
  try {
    const response = await apiCall();
    if (response.ok) {
      handleSuccess();
    } else {
      isSubmitError.value = true;
    }
  } catch (error) {
    isSubmitError.value = true;
  } finally {
    submittingData.value = false;
  }
};
```

## Integration Patterns

### With Loading States
```vue
<!-- Loading state -->
<Submitting v-if="isSubmitting" />

<!-- Error state -->
<SubmitFailed v-else-if="isSubmitError" @back="retrySubmission" />

<!-- Success state -->
<Success v-else-if="isSuccess" />
```

### With Animation
```vue
<transition name="error-overlay">
  <SubmitFailed 
    v-if="showError"
    @back="handleErrorDismiss"
  />
</transition>

<style>
.error-overlay-enter-active,
.error-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.error-overlay-enter-from,
.error-overlay-leave-to {
  opacity: 0;
}
</style>
```

## Performance Considerations

### Lightweight Component
- **Minimal State**: No complex reactive data
- **Simple Template**: Straightforward DOM structure
- **Efficient Rendering**: Conditional icon display only

### Memory Usage
- **No Event Listeners**: Beyond click handler
- **Static Content**: Mostly static localized text
- **Theme Reactive**: Only theme state subscription

## Error Handling Best Practices

### User Experience
1. **Clear Messaging**: Non-technical error descriptions
2. **Single Action**: One clear path to recovery
3. **Visual Feedback**: Obvious error state indication
4. **Quick Recovery**: Easy retry mechanism

### Technical Implementation
1. **Proper Z-Index**: Ensure overlay appears above content
2. **Theme Integration**: Consistent with app theme
3. **Accessibility**: Screen reader and keyboard support
4. **Localization**: All text properly internationalized

## Known Limitations

1. **Static Content**: No dynamic error message customization
2. **Single Action**: Only one recovery button
3. **No Error Details**: No technical error information display
4. **Fixed Layout**: No customizable positioning or sizing
5. **Theme Dependency**: Requires Vuex store for theme state

## Future Enhancements

1. **Dynamic Messages**: Configurable error text via props
2. **Error Details**: Expandable technical information
3. **Multiple Actions**: Support for different recovery options
4. **Custom Icons**: Configurable error icons
5. **Animation Support**: Built-in entrance/exit animations
6. **Error Logging**: Integration with error tracking systems
7. **Retry Counter**: Display retry attempts
8. **Network Status**: Show connectivity information
9. **Offline Support**: Handle offline scenarios
10. **Sound Feedback**: Audio error notifications