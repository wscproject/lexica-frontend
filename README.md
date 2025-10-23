# Lexica Frontend

This repository contains the frontend code for Lexica, a tool designed to facilitate micro edits to Lexemes on Wikidata. Lexica allows users to link Wikidata Items to Lexemes, presented in an interactive and user-friendly card-based interface with comprehensive session types for various contribution workflows.

## Features

### Core Functionality
- **Interactive Card-based Interface**: Swipe and drag gestures with 3D flip animations
- **Multiple Session Types**: 
  - Connect sessions for linking lexemes to entities
  - Script writing contributions for missing scripts
  - Hyphenation pattern submissions for pronunciation guidance
- **Real-time Search**: Dynamic entity search with recommendation system
- **Progress Tracking**: Session progress with undo functionality and completion tracking
- **Multi-mode Views**: Front card, detailed views, entity exploration, and review modes

### User Experience
- **Touch & Gesture Support**: Drag, swipe, and touch interactions using Interact.js
- **Swipe-to-Skip**: Upward swipe gesture to skip cards with undo warnings
- **Success Animations**: Celebratory animations for successful contributions
- **Loading States**: Smooth loading transitions with branded animations
- **Error Handling**: Comprehensive error states with retry functionality

### Internationalization & Localization
- **Multi-language Support**: Vue i18n integration for interface localization
- **RTL/LTR Support**: Bidirectional text support for various languages
- **Language-specific Sessions**: Dynamic language selection for contributions
- **Unicode Support**: Full support for various scripts and writing systems

## Accessibility Features

- **Reduced Motion Support**: Respects user's motion preferences with fallback animations
- **Keyboard Navigation**: Complete keyboard navigation with dynamic tabindex management
- **Screen Reader Compatibility**: Proper ARIA labels and semantic HTML structure
- **Focus Management**: Intelligent focus handling across card modes and interactions
- **High Contrast Themes**: Support for high contrast and dark/light mode preferences
- **Touch Accessibility**: Optimized touch targets and gesture alternatives
- **Alternative Skip Methods**: Button alternatives to swipe gestures for accessibility

## Technology Stack

### Frontend Framework
- **Vue 3**: Modern reactive framework with Composition API
- **Vue Router**: Client-side routing for SPA navigation
- **Vuex**: State management for application data
- **Vite**: Fast build tool and development server

### UI & Styling
- **Vuetify**: Material Design component library
- **Tailwind CSS**: Utility-first CSS framework
- **Wikimedia Codex**: Wikimedia Design System components and tokens
- **SCSS/Less**: CSS preprocessing for advanced styling
- **PostCSS**: CSS post-processing with autoprefixer

### Interactions & Animations
- **Interact.js**: Touch and mouse gesture recognition
- **Vue Flip**: 3D card flip animations
- **Lottie Web Vue**: Complex animations and micro-interactions
- **CSS Transforms**: Hardware-accelerated 3D animations

### Data & API
- **Axios**: HTTP client for API communications
- **Vue Cookies**: Cookie management for session persistence
- **VueUse Core**: Composition utilities for enhanced functionality
- **Lodash Debounce**: Input debouncing for search optimization

### PWA & Performance
- **Vite PWA Plugin**: Progressive Web App capabilities
- **Workbox**: Service worker for caching and offline support
- **Vue Client Only**: Client-side only rendering for specific components

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm package manager

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/lexica-frontend.git
   cd lexica-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

### Development Setup

The application will be available at `http://localhost:5173` (or the next available port) when running in development mode.

For optimal development experience:
- Use a modern browser with developer tools
- Enable Vue.js devtools extension
- Configure your IDE with Vue 3 and TypeScript support
