# Global Theme Documentation

## Overview

File `src/assets/theme.css` provides reusable Telegram Web App theme styles, utilities, and components that can be used across all pages.

## Available Classes

### Page Layout

- `.tg-page` - Base page container with Telegram theme colors
- `.tg-container` - Standard 16px padding container
- `.tg-section` - Section with 24px bottom margin
- `.tg-centered` - Flex centered container

### Typography

- `.tg-title-large` - 28px bold title
- `.tg-title-medium` - 20px bold title
- `.tg-title-small` - 17px semibold title
- `.tg-body` - 15px body text
- `.tg-caption` - 14px hint text
- `.tg-link` - Telegram link color with hover

### List Components

- `.tg-list-group` - List container with rounded corners
- `.tg-list-item` - Clickable list item with hover effect
- `.tg-item-content` - List item content wrapper
- `.tg-item-title` - 17px list item title
- `.tg-item-subtitle` - 14px list item subtitle
- `.tg-item-arrow` - Arrow indicator for list items

### Search

- `.tg-search-bar` - Search bar container
- `.tg-search-icon` - Search icon wrapper
- `.tg-search-input` - Search input field

### Buttons

- `.tg-button` - Primary button
- `.tg-button-secondary` - Secondary button

### Avatar

- `.tg-avatar` - Base avatar class
- `.tg-avatar-small` - 40px avatar
- `.tg-avatar-medium` - 60px avatar
- `.tg-avatar-large` - 80px avatar

### Spacing Utilities

- `.tg-spacing-xs` to `.tg-spacing-xl` - Padding utilities (4px to 32px)
- `.tg-margin-bottom-sm` to `.tg-margin-bottom-lg` - Margin bottom (8px to 24px)

### Section Header

- `.tg-section-header` - 20px bold section header

## Usage Example

```vue
<template>
  <div class="tg-page">
    <div class="tg-container">
      <h1 class="tg-title-large">My Page</h1>

      <div class="tg-list-group">
        <div class="tg-list-item">
          <div class="tg-item-content">
            <div class="tg-item-title">Item Title</div>
            <div class="tg-item-subtitle">Item Subtitle</div>
          </div>
          <div class="tg-item-arrow">›</div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Telegram Theme Variables

All classes use Telegram CSS variables with fallbacks:

- `--tg-theme-bg-color` - Background color
- `--tg-theme-text-color` - Text color
- `--tg-theme-hint-color` - Hint/secondary text color
- `--tg-theme-link-color` - Link color
- `--tg-theme-button-color` - Button background
- `--tg-theme-button-text-color` - Button text
- `--tg-theme-secondary-bg-color` - Secondary background

## Page-Specific Styles

Keep page-specific layout styles in scoped `<style>` blocks. Use global classes for common components.
