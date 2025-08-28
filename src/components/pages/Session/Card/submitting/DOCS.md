# Submitting Component Documentation

## Overview

The Submitting component displays a loading overlay during data submission processes in the session workflow. It provides visual feedback to users that their contribution is being processed, preventing confusion and accidental re-submissions while data is being sent to the server.

## Key Features

- **Loading State Display**: Clear visual indication of ongoing submission
- **Overlay Interface**: High z-index overlay that covers the card during submission
- **Theme Support**: Adapts background colors to dark/light mode
- **Localized Messaging**: Internationalized loading text
- **Loading Animation**: Uses the application's standard Loading component
- **Action Context**: Optional action type specification (though currently unused)
- **Accessibility**: Screen reader friendly loading state

## Component Structure

### Props

#### submitAction {#submitAction-prop}

**Type:** `String`

**Description:**
Specifies the type of submission action being performed.

**Usage:**
Currently passed as a prop but not actively used in the template. Could be used for:
- Different loading messages per action type
- Analytics tracking
- Debugging purposes

**Example Values:**
- `"add"` - Adding a new connection
- `"skip"` - Skipping a card
- `"noItem"` - Indicating no suitable item found

## Template Structure

### Container Layout

```css
.absolute z-[99] w-full bg-white dark:bg-[#101418] flex justify-center flex-col text-center p-[1rem]
```

**Features:**
- **Overlay Positioning**: Absolute with high z-index (99)
- **Full Coverage**: Complete width overlay
- **Theme Background**: Adaptive background (white/dark)
- **Centered Content**: Flexbox centered layout
- **Padding**: 1rem padding for visual breathing room

### Content Elements

#### Loading Component
```vue
<Loading :text="t('session.upload')" variant="big" />
```

**Features:**
- **Standard Loading**: Uses application's Loading component
- **Localized Text**: Displays "Uploading..." or equivalent
- **Large Variant**: "big" variant for prominent display
- **Consistent Styling**: Matches app-wide loading patterns

## Styling System

### Layout Classes

#### Container Styling
- **Positioning**: `absolute z-[99]` for complete overlay
- **Background**: Theme-responsive with `bg-white dark:bg-[#101418]`
- **Layout**: Flexbox column with center alignment
- **Spacing**: Consistent 1rem padding throughout

### Color Scheme

#### Light Theme
- **Background**: White (#FFFFFF)
- **Content**: Loading component handles its own theming

#### Dark Theme
- **Background**: Dark (#101418)
- **Content**: Loading component adapts automatically

### Visual Hierarchy

1. **Full Screen Overlay**: Covers all underlying content
2. **Centered Loading**: Loading spinner and text in center
3. **Clear Messaging**: "Uploading..." text for context

## Loading Component Integration

### Loading Props Used

- **text**: `t('session.upload')` - Localized loading message
- **variant**: `"big"` - Large size for prominent display

### Loading Component Features

The Loading component provides:
- Animated spinner
- Themed colors
- Accessible loading announcements
- Consistent visual style

## Internationalization

### Translation Keys Used

- `session.upload` - Loading message (typically "Uploading...")

### Localization Features

- **Full i18n Support**: Loading text is properly localized
- **Context-Aware**: Specific to session upload context
- **User-Friendly**: Clear indication of ongoing process

## Usage Examples

### Basic Implementation
```vue
<Submitting submitAction="add" />
```

### With Conditional Display
```vue
<transition name="fade">
  <Submitting 
    v-if="isSubmitting"
    :submitAction="currentAction"
  />
</transition>
```

### In Card Workflow
```vue
<div class="card-container">
  <!-- Main card content -->
  <CardContent v-if="!isSubmitting" />
  
  <!-- Submitting overlay -->
  <Submitting 
    v-if="isSubmitting"
    :submitAction="submissionType"
  />
  
  <!-- Other states -->
  <Success v-if="isSuccess" />
  <SubmitFailed v-if="isError" />
</div>
```

## State Management Patterns

### Typical Submission Flow
```javascript
const submitData = async () => {
  // Show submitting overlay
  isSubmitting.value = true;
  
  try {
    const response = await apiCall();
    
    if (response.ok) {
      // Hide submitting, show success
      isSubmitting.value = false;
      isSuccess.value = true;
    } else {
      // Hide submitting, show error
      isSubmitting.value = false;
      isError.value = true;
    }
  } catch (error) {
    // Handle network errors
    isSubmitting.value = false;
    isError.value = true;
  }
};
```

### Action Type Handling
```javascript
const handleSubmission = async (actionType) => {
  submitAction.value = actionType;
  isSubmitting.value = true;
  
  // Different API calls based on action
  switch (actionType) {
    case 'add':
      await submitConnection();
      break;
    case 'skip':
      await skipCard();
      break;
    case 'noItem':
      await markNoItem();
      break;
  }
  
  isSubmitting.value = false;
};
```

## Integration Patterns

### With Multiple States
```vue
<template>
  <!-- Normal card content -->
  <div v-if="!isSubmitting && !isSuccess && !isError">
    <CardContent @submit="handleSubmit" />
  </div>
  
  <!-- Loading state -->
  <Submitting 
    v-if="isSubmitting"
    :submitAction="actionType"
  />
  
  <!-- Success state -->
  <Success v-if="isSuccess" />
  
  <!-- Error state -->
  <SubmitFailed v-if="isError" @back="retry" />
</template>
```

### With Animation
```vue
<transition-group name="overlay">
  <Submitting 
    v-if="isSubmitting"
    key="submitting"
    :submitAction="action"
  />
  <Success 
    v-else-if="isSuccess"
    key="success"
  />
</transition-group>

<style>
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
```

## Accessibility Features

### Screen Reader Support
- **Loading Announcements**: Loading component provides screen reader updates
- **Context Information**: Clear loading message
- **State Changes**: Assistive technology notified of state transitions

### Visual Design
- **High Contrast**: Theme-appropriate background colors
- **Clear Messaging**: Obvious loading indication
- **Full Coverage**: Prevents interaction with underlying content

### User Experience
- **Immediate Feedback**: Instant visual response to user actions
- **Prevent Double-Submission**: Overlay blocks additional interactions
- **Clear Status**: Users understand processing is occurring

## Performance Considerations

### Lightweight Implementation
- **Minimal Template**: Simple overlay structure
- **Component Reuse**: Leverages existing Loading component
- **Efficient Rendering**: No complex computations or watchers

### Memory Usage
- **No Event Listeners**: Static display component
- **Minimal State**: Only props and basic theme integration
- **Fast Rendering**: Quick to show and hide

## Error Prevention

### Double-Submission Prevention
- **Overlay Coverage**: Prevents clicking underlying elements
- **Clear Visual State**: Users understand submission is processing
- **State Management**: Component visibility tied to submission status

### User Confusion Prevention
- **Immediate Display**: Shows instantly on submission start
- **Clear Messaging**: Loading text explains what's happening
- **Consistent Placement**: Same location across all cards

## Best Practices

### Implementation
1. **Show Immediately**: Display as soon as submission starts
2. **Hide Properly**: Remove when submission completes (success or error)
3. **Prevent Interaction**: Use overlay to block user input during submission
4. **Provide Context**: Use clear loading messages

### State Management
1. **Single Source of Truth**: One submission state variable
2. **Proper Cleanup**: Reset submission state after completion
3. **Error Handling**: Handle both success and failure cases
4. **Timeout Handling**: Consider maximum submission time

## Known Limitations

1. **No Progress Indication**: No percentage or progress bar
2. **Static Message**: Same message for all submission types
3. **No Timeout Handling**: No built-in submission timeout
4. **No Cancellation**: No way to cancel ongoing submission
5. **Unused Prop**: submitAction prop not utilized in display

## Future Enhancements

1. **Dynamic Messages**: Different text based on submitAction prop
2. **Progress Indicators**: Show upload progress percentage
3. **Cancellation Support**: Allow users to cancel submissions
4. **Timeout Handling**: Automatic timeout and error handling
5. **Animation Improvements**: Entrance/exit animations
6. **Submission Queue**: Handle multiple simultaneous submissions
7. **Retry Mechanism**: Built-in retry functionality
8. **Network Status**: Show network connectivity information
9. **Offline Support**: Queue submissions when offline
10. **Analytics Integration**: Track submission performance metrics

## Testing Considerations

### Unit Testing
```javascript
// Test component rendering
test('renders loading overlay', () => {
  const wrapper = mount(Submitting, {
    props: { submitAction: 'add' }
  });
  
  expect(wrapper.find('.absolute').exists()).toBe(true);
  expect(wrapper.findComponent(Loading).exists()).toBe(true);
});

// Test prop passing
test('accepts submitAction prop', () => {
  const wrapper = mount(Submitting, {
    props: { submitAction: 'skip' }
  });
  
  expect(wrapper.props().submitAction).toBe('skip');
});
```

### Integration Testing
```javascript
// Test submission flow
test('shows submitting overlay during submission', async () => {
  const wrapper = mount(ParentComponent);
  
  // Trigger submission
  await wrapper.find('button').trigger('click');
  
  // Check submitting overlay appears
  expect(wrapper.findComponent(Submitting).exists()).toBe(true);
  
  // Wait for submission completion
  await flushPromises();
  
  // Check overlay disappears
  expect(wrapper.findComponent(Submitting).exists()).toBe(false);
});
```